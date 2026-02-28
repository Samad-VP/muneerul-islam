import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Aggregations
    
    // 1. Funds Breakdown
    const funds = await prisma.fund.findMany({
      select: { id: true, name: true, type: true, balance: true }
    })
    
    let generalBalance = 0
    let specialBalance = 0
    for(const fund of funds) {
      if(fund.type === 'general') generalBalance += fund.balance
      else specialBalance += fund.balance
    }

    // 2. Pending Dues (Incomes with status PENDING)
    const pendingDuesAggr = await prisma.income.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true }
    })
    const pendingDues = pendingDuesAggr._sum.amount || 0

    // 3. Current Month Income vs Expense (Simple Stat)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0,0,0,0)

    const monthlyIncome = await prisma.income.aggregate({
      where: { status: 'PAID', paidAt: { gte: startOfMonth } },
      _sum: { amount: true }
    })

    const monthlyExpense = await prisma.expense.aggregate({
      where: { status: 'PAID', updatedAt: { gte: startOfMonth } },
      _sum: { amount: true }
    })

    const activeFamilies = await prisma.family.count({ where: { isActive: true }})
    const totalMembers = await prisma.member.count({ where: { isAlive: true }})

    return NextResponse.json({
      funds,
       tổngBalances: {
         general: generalBalance,
         special: specialBalance,
         total: generalBalance + specialBalance
      },
      pendingDues,
      currentMonth: {
        income: monthlyIncome._sum.amount || 0,
        expense: monthlyExpense._sum.amount || 0
      },
      demographics: {
         activeFamilies,
         totalMembers
      }
    })
  } catch (error) {
    console.error("Error generating reports:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
