import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mahalluId = searchParams.get("mahalluId") || ""

    const where: any = { isActive: true }
    if (mahalluId) where.mahalluId = mahalluId

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(announcements)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, priority, mahalluId } = body

    if (!title || !content || !mahalluId) {
      return NextResponse.json({ error: "Title, content, and mahallu ID are required" }, { status: 400 })
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, priority: priority || "normal", mahalluId }
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
