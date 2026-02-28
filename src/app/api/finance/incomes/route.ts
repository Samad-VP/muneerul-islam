import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Optional URL param filtering
    const { searchParams } = new URL(req.url)
    const fundId = searchParams.get('fundId')
    
    const incomes = await prisma.income.findMany({
      where: fundId ? { fundId } : {},
      include: {
        fund: true,
        family: true,
        member: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(incomes)
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { amount, isMonthlyDue, month, year, status, notes, fundId, familyId, memberId } = body

    if (!amount || !fundId) {
      return NextResponse.json({ error: "Amount and Fund ID are required" }, { status: 400 })
    }

    const receiptNo = `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

    // We must use a transaction to create the income and update the fund balance ONLY if it's paid
    const transaction = await prisma.$transaction(async (tx) => {
      const newIncome = await tx.income.create({
        data: {
          receiptNo,
          amount: parseFloat(amount),
          isMonthlyDue: isMonthlyDue || false,
          month: month ? parseInt(month) : null,
          year: year ? parseInt(year) : null,
          status: status || 'PAID',
          notes,
          fundId,
          familyId: familyId || null,
          memberId: memberId || null,
          paidAt: status === 'PAID' ? new Date() : null,
        }
      })

      if (newIncome.status === 'PAID') {
        await tx.fund.update({
          where: { id: fundId },
          data: { balance: { increment: parseFloat(amount) } }
        })
      }

      if (session.user?.id) {
        await tx.auditLog.create({
          data: {
            action: "CREATE",
            entityType: "Income",
            entityId: newIncome.id,
            newData: JSON.stringify(newIncome),
            userId: session.user.id
          }
        })
      }
      
      return newIncome
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error recording income:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
