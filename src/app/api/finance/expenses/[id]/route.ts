import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = params
    const body = await req.json()
    const { status, remarks } = body // PENDING_APPROVAL, APPROVED, REJECTED, PAID, REVERSED

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Checking if user has permission to approve
    const approverRoles = ["admin", "super_admin", "president", "treasurer"]
    if (["APPROVED", "REJECTED"].includes(status) && !approverRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: "You do not have permission to approve/reject expenses" }, { status: 403 })
    }

    // Get the current expense
    const currentExpense = await prisma.expense.findUnique({
      where: { id }
    })

    if (!currentExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    // Transaction to update expense and deduct from fund if approved/paid
    const transaction = await prisma.$transaction(async (tx) => {
      const updatedExpense = await tx.expense.update({
        where: { id },
        data: {
          status,
          approvedById: ["APPROVED", "REJECTED"].includes(status) ? session.user.id : currentExpense.approvedById,
          // note: normally you'd handle paidAt logic too if moving from APPROVED -> PAID
        }
      })

      // If status changed from not APPROVED/PAID to APPROVED/PAID, deduct from fund
      if ((status === "APPROVED" || status === "PAID") && (currentExpense.status !== "APPROVED" && currentExpense.status !== "PAID")) {
        await tx.fund.update({
          where: { id: updatedExpense.fundId },
          data: {
            balance: { decrement: updatedExpense.amount }
          }
        })
      }

      // If status changed to REVERSED from APPROVED/PAID, increment fund (refund)
      if (status === "REVERSED" && (currentExpense.status === "APPROVED" || currentExpense.status === "PAID")) {
        await tx.fund.update({
          where: { id: updatedExpense.fundId },
          data: {
            balance: { increment: updatedExpense.amount }
          }
        })
      }

      // Log the change
      await tx.auditLog.create({
        data: {
          action: "UPDATE_STATUS",
          entityType: "Expense",
          entityId: updatedExpense.id,
          oldData: JSON.stringify({ status: currentExpense.status }),
          newData: JSON.stringify({ status, remarks }),
          userId: session.user.id
        }
      })

      return updatedExpense
    })

    return NextResponse.json(transaction, { status: 200 })
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
