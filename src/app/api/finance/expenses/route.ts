import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const fundId = searchParams.get('fundId')
    const status = searchParams.get('status')
    
    // Build query filters
    const where: any = {}
    if (fundId) where.fundId = fundId
    if (status) where.status = status

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        fund: true,
        requestedBy: { select: { name: true, role: true } },
        approvedBy: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, description, amount, fundId } = body

    if (!title || !amount || !fundId) {
      return NextResponse.json({ error: "Title, Amount, and Fund ID are required" }, { status: 400 })
    }

    // Auto-generate voucher number
    const voucherNo = `VOU-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

    // Create the expense as request (PENDING_APPROVAL by default)
    const newExpense = await prisma.expense.create({
      data: {
        voucherNo,
        title,
        description,
        amount: parseFloat(amount),
        fundId,
        requestedById: session.user.id,
        status: "PENDING_APPROVAL"
      }
    })

    // Log the request
    await prisma.auditLog.create({
      data: {
        action: "CREATE_REQUEST",
        entityType: "Expense",
        entityId: newExpense.id,
        newData: JSON.stringify(newExpense),
        userId: session.user.id
      }
    })

    return NextResponse.json(newExpense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
