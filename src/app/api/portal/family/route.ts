import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.familyId) {
      return NextResponse.json({ error: "Unauthorized: Not linked to a family" }, { status: 401 })
    }

    const family = await prisma.family.findUnique({
      where: { id: session.user.familyId },
      include: {
        members: true,
      }
    })

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 })
    }

    return NextResponse.json(family)
  } catch (error) {
    console.error("Error fetching portal family:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
