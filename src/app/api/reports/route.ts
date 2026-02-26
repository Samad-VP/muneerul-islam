import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [
      totalFamilies,
      totalMembers,
      totalCommittees,
      maleCount,
      femaleCount,
      abroadCount,
      voterCount,
    ] = await Promise.all([
      prisma.family.count(),
      prisma.member.count({ where: { isAlive: true } }),
      prisma.committee.count(),
      prisma.member.count({ where: { gender: "Male", isAlive: true } }),
      prisma.member.count({ where: { gender: "Female", isAlive: true } }),
      prisma.member.count({ where: { abroad: true, isAlive: true } }),
      prisma.member.count({ where: { isVoter: true, isAlive: true } }),
    ])

    // Education distribution
    const members = await prisma.member.findMany({
      where: { isAlive: true },
      select: { education: true, occupation: true, bloodGroup: true, dob: true, gender: true }
    })

    const educationDist: Record<string, number> = {}
    const occupationDist: Record<string, number> = {}
    const bloodGroupDist: Record<string, number> = {}
    const ageGroupDist: Record<string, number> = {
      "0-5": 0, "6-15": 0, "16-25": 0, "26-40": 0, "41-60": 0, "60+": 0
    }

    const now = new Date()
    members.forEach(m => {
      if (m.education) educationDist[m.education] = (educationDist[m.education] || 0) + 1
      if (m.occupation) occupationDist[m.occupation] = (occupationDist[m.occupation] || 0) + 1
      if (m.bloodGroup) bloodGroupDist[m.bloodGroup] = (bloodGroupDist[m.bloodGroup] || 0) + 1
      if (m.dob) {
        const age = Math.floor((now.getTime() - new Date(m.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        if (age <= 5) ageGroupDist["0-5"]++
        else if (age <= 15) ageGroupDist["6-15"]++
        else if (age <= 25) ageGroupDist["16-25"]++
        else if (age <= 40) ageGroupDist["26-40"]++
        else if (age <= 60) ageGroupDist["41-60"]++
        else ageGroupDist["60+"]++
      }
    })

    // Recent families
    const recentFamilies = await prisma.family.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } }
    })

    return NextResponse.json({
      overview: {
        totalFamilies,
        totalMembers,
        totalCommittees,
        maleCount,
        femaleCount,
        abroadCount,
        voterCount,
      },
      charts: {
        genderDistribution: [
          { name: "Male", value: maleCount },
          { name: "Female", value: femaleCount }
        ],
        educationDistribution: Object.entries(educationDist).map(([name, value]) => ({ name, value })),
        occupationDistribution: Object.entries(occupationDist).map(([name, value]) => ({ name, value })).slice(0, 10),
        bloodGroupDistribution: Object.entries(bloodGroupDist).map(([name, value]) => ({ name, value })),
        ageGroupDistribution: Object.entries(ageGroupDist).map(([name, value]) => ({ name, value })),
      },
      recentFamilies,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
