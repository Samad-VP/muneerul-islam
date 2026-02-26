import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: params.id },
      include: {
        family: true,
        committeeMemberships: {
          include: { committee: true }
        }
      }
    })
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const member = await prisma.member.update({
      where: { id: params.id },
      data: {
        ...body,
        dob: body.dob ? new Date(body.dob) : undefined,
        age: body.age ? parseInt(body.age) : undefined,
      },
      include: { family: true }
    })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.member.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Member deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
