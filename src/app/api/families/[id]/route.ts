import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const family = await prisma.family.findUnique({
      where: { id: params.id },
      include: {
        members: {
          orderBy: { createdAt: "asc" },
          include: {
            committeeMemberships: {
              include: { committee: true }
            }
          }
        },
        mahallu: true
      }
    })

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    return NextResponse.json(family)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { houseName, houseNumber, address, ward, phone, rationCardNo, annualIncome, notes, isActive } = body

    const family = await prisma.family.update({
      where: { id: params.id },
      data: { houseName, houseNumber, address, ward, phone, rationCardNo, annualIncome, notes, isActive },
      include: { members: true }
    })

    return NextResponse.json(family)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.family.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Family deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
