import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const committee = await prisma.committee.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: {
            member: {
              select: { id: true, name: true, phone: true, gender: true, family: { select: { houseName: true } } }
            }
          }
        }
      }
    })
    if (!committee) return NextResponse.json({ error: "Committee not found" }, { status: 404 })
    return NextResponse.json(committee)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const committee = await prisma.committee.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(committee)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.committee.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Committee deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
