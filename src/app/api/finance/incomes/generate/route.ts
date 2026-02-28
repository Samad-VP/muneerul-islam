import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { month, year, fundId } = body

    if (!month || !year || !fundId) {
      return NextResponse.json({ error: "Month, Year, and Fund ID are required" }, { status: 400 })
    }

    // 1. Get all active families
    const activeFamilies = await prisma.family.findMany({
      where: { isActive: true }
    })

    let createdCount = 0

    // 2. We don't want to create duplicates. Loop and check if already generated.
    // Doing this in a simple loop since it's an admin action triggered occasionally.
    for (const family of activeFamilies) {
      if (family.monthlyDueAmount <= 0) continue // Skip families without set dues

      const existingDue = await prisma.income.findFirst({
        where: {
          familyId: family.id,
          month: parseInt(month),
          year: parseInt(year),
          isMonthlyDue: true
        }
      })

      if (!existingDue) {
         // Create Pending Due
         await prisma.income.create({
           data: {
             receiptNo: `DUE-${family.familyNumber}-${month}${year}`,
             amount: family.monthlyDueAmount,
             isMonthlyDue: true,
             month: parseInt(month),
             year: parseInt(year),
             status: 'PENDING',
             fundId: fundId,
             familyId: family.id,
           }
         })
         createdCount++
      }
    }

    // Log the generation action
    if (session.user?.id && createdCount > 0) {
      await prisma.auditLog.create({
        data: {
          action: "CREATE",
          entityType: "Income",
          entityId: "BATCH_GENERATION",
          newData: JSON.stringify({ count: createdCount, month, year }),
          userId: session.user.id
        }
      })
    }

    return NextResponse.json({ message: `Successfully generated ${createdCount} monthly dues.`, count: createdCount }, { status: 201 })
  } catch (error) {
    console.error("Error generating monthly dues:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
