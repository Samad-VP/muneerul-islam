import { prisma } from "@/lib/prisma"
import { CommitteeUI } from "./CommitteeUI"

export const dynamic = "force-dynamic"

export default async function CommitteePage() {
  // Fetch Mahallu info for leadership fallbacks
  const mahallu = await prisma.mahallu.findFirst()

  // Fetch the primary active committee, ideally the 'Mahallu Committee'
  const committee = await prisma.committee.findFirst({
    where: { 
      isActive: true,
      OR: [
        { name: { contains: "Mahallu", mode: "insensitive" } },
        { type: { equals: "General", mode: "insensitive" } }
      ]
    },
    include: {
      members: {
        where: { isActive: true },
        include: {
          member: true,
        },
        orderBy: {
          joinedAt: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Start with members from the committee record
  const membersList = committee?.members || []

  // Pre-sort roles to put President, Secretary, Treasurer at the top
  const rolePriority: Record<string, number> = {
    "president": 1,
    "secretary": 2,
    "treasurer": 3,
    "vice president": 4,
    "joint secretary": 5,
  }

  const sortedMembers = [...membersList].sort((a, b) => {
    const roleA = rolePriority[a.role.toLowerCase()] || 99
    const roleB = rolePriority[b.role.toLowerCase()] || 99
    if (roleA !== roleB) return roleA - roleB
    return a.joinedAt.getTime() - b.joinedAt.getTime()
  })

  // Format existing members
  const formattedMembers = sortedMembers.map(cm => ({
    name: cm.member.name,
    role: cm.role.charAt(0).toUpperCase() + cm.role.slice(1),
    phone: cm.member.phone || "",
    email: cm.member.email || "",
    image: cm.member.photo || (
       cm.role.toLowerCase() === "president" ? "/images/committee/president.jpg" :
       cm.role.toLowerCase() === "secretary" ? "/images/committee/secretary.jpg" :
       cm.role.toLowerCase() === "treasurer" ? "/images/committee/treasurer.jpg" : null
    )
  }))

  // If specific roles are missing in the committee, but exist in Mahallu settings, inject them
  const rolesToCheck = ["president", "secretary", "treasurer"] as const
  
  rolesToCheck.forEach(role => {
    const exists = formattedMembers.some(m => m.role.toLowerCase() === role)
    const nameFromMahallu = mahallu?.[role]
    
    if (!exists && nameFromMahallu) {
      formattedMembers.unshift({
        name: nameFromMahallu,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        phone: mahallu.phone || "",
        email: mahallu.email || "",
        image: `/images/committee/${role}.jpg`
      })
    }
  })

  // Sort one last time to ensure injected members are at the top if they weren't unshifted correctly
  formattedMembers.sort((a, b) => {
    const roleA = rolePriority[a.role.toLowerCase()] || 99
    const roleB = rolePriority[b.role.toLowerCase()] || 99
    return roleA - roleB
  })

  return <CommitteeUI members={formattedMembers} />
}
