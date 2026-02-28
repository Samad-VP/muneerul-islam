import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, content, priority, isActive } = body

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        title,
        content,
        priority: priority || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    })

    return NextResponse.json(announcement)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.announcement.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
