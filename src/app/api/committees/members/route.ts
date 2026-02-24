import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Assign a member to a committee
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memberId, committeeId, role } = body

    if (!memberId || !committeeId) {
      return NextResponse.json({ error: "Member ID and Committee ID are required" }, { status: 400 })
    }

    const existing = await prisma.committeeMember.findUnique({
      where: { memberId_committeeId: { memberId, committeeId } }
    })
    if (existing) {
      return NextResponse.json({ error: "Member is already in this committee" }, { status: 400 })
    }

    const assignment = await prisma.committeeMember.create({
      data: { memberId, committeeId, role: role || "member" },
      include: { member: true, committee: true }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Remove a member from a committee
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")
    const committeeId = searchParams.get("committeeId")

    if (!memberId || !committeeId) {
      return NextResponse.json({ error: "Member ID and Committee ID are required" }, { status: 400 })
    }

    await prisma.committeeMember.delete({
      where: { memberId_committeeId: { memberId, committeeId } }
    })

    return NextResponse.json({ message: "Member removed from committee" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
