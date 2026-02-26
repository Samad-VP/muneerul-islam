import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mahalluId = searchParams.get("mahalluId") || ""

    const where: any = {}
    if (mahalluId) where.mahalluId = mahalluId

    const committees = await prisma.committee.findMany({
      where,
      include: {
        members: {
          include: { member: { select: { id: true, name: true, phone: true, gender: true } } }
        },
        _count: { select: { members: true } }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(committees)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, type, mahalluId } = body

    if (!name || !type || !mahalluId) {
      return NextResponse.json({ error: "Name, type, and mahallu ID are required" }, { status: 400 })
    }

    const committee = await prisma.committee.create({
      data: { name, description, type, mahalluId }
    })

    return NextResponse.json(committee, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
