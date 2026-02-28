import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const committee = await prisma.committee.update({
      where: { id: params.id },
      data: body,
      include: { members: true }
    })
    return NextResponse.json(committee)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Delete committee memberships first if cascade delete isn't set
    await prisma.committeeMember.deleteMany({
      where: { committeeId: params.id }
    })
    await prisma.committee.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Committee deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
