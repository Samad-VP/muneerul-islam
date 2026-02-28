import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, date, endDate, venue, type } = body

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        venue,
        type,
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
