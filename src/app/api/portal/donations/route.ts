import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.familyId) {
      return NextResponse.json({ error: "Unauthorized: Not linked to a family" }, { status: 401 })
    }

    const donations = await prisma.income.findMany({
      where: { familyId: session.user.familyId },
      include: {
        fund: { select: { name: true, type: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Group them for front-end convenience
    const monthlyDues = donations.filter(d => d.isMonthlyDue)
    const specialContributions = donations.filter(d => !d.isMonthlyDue)

    return NextResponse.json({
       monthlyDues,
       specialContributions,
       totalPaid: donations.filter(d => d.status === 'PAID').reduce((sum, curr) => sum + curr.amount, 0),
       totalPending: monthlyDues.filter(d => d.status === 'PENDING').reduce((sum, curr) => sum + curr.amount, 0)
    })
  } catch (error) {
    console.error("Error fetching portal donations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
