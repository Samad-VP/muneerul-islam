import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const funds = await prisma.fund.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(funds)
  } catch (error) {
    console.error("Error fetching funds:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Only let specific roles create funds, but middleware handles it mostly. We can double check.
    const body = await req.json()
    const { name, type, description, isDefault } = body

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const newFund = await prisma.fund.create({
      data: {
        name,
        type: type || 'special',
        description,
        isDefault: isDefault || false,
        balance: 0
      }
    })

    // Log the action
    if (session.user?.id) {
      await prisma.auditLog.create({
        data: {
          action: "CREATE",
          entityType: "Fund",
          entityId: newFund.id,
          newData: JSON.stringify(newFund),
          userId: session.user.id
        }
      })
    }

    return NextResponse.json(newFund, { status: 201 })
  } catch (error) {
    console.error("Error creating fund:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
