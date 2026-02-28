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
    const entityType = searchParams.get('entityType')
    const limitParams = searchParams.get('limit')
    const limit = limitParams ? parseInt(limitParams) : 100
    
    const where: any = {}
    if (entityType) where.entityType = entityType

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
