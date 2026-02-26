import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const gender = searchParams.get("gender") || ""
    const bloodGroup = searchParams.get("bloodGroup") || ""
    const education = searchParams.get("education") || ""
    const abroad = searchParams.get("abroad")

    const where: any = { isAlive: true }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    if (gender) where.gender = gender
    if (bloodGroup) where.bloodGroup = bloodGroup
    if (education) where.education = education
    if (abroad === "true") where.abroad = true

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          family: { select: { familyNumber: true, houseName: true } }
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.member.count({ where })
    ])

    return NextResponse.json({ members, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { familyId, name, arabicName, relationToHead, gender, dob, age, maritalStatus, phone, email, bloodGroup, education, educationDetail, occupation, occupationDetail, monthlyIncome, abroad, abroadCountry, healthIssues, disabilities, isVoter, voterIdNo, aadhaarNo, remarks } = body

    if (!familyId || !name || !relationToHead || !gender) {
      return NextResponse.json({ error: "Family ID, name, relation, and gender are required" }, { status: 400 })
    }

    const member = await prisma.member.create({
      data: {
        familyId, name, arabicName, relationToHead, gender,
        dob: dob ? new Date(dob) : null,
        age: age ? parseInt(age) : null,
        maritalStatus, phone, email, bloodGroup, education, educationDetail,
        occupation, occupationDetail, monthlyIncome,
        abroad: abroad || false, abroadCountry,
        healthIssues, disabilities,
        isVoter: isVoter || false, voterIdNo, aadhaarNo, remarks
      },
      include: { family: true }
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
