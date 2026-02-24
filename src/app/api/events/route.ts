import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mahalluId = searchParams.get("mahalluId") || ""

    const where: any = {}
    if (mahalluId) where.mahalluId = mahalluId

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" }
    })

    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, date, endDate, venue, type, mahalluId } = body

    if (!title || !date || !mahalluId) {
      return NextResponse.json({ error: "Title, date, and mahallu ID are required" }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title, description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        venue, type, mahalluId
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
