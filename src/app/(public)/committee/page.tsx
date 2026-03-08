import { prisma } from "@/lib/prisma"
import { CommitteeUI } from "./CommitteeUI"

export const dynamic = "force-dynamic"

export default async function CommitteePage() {
  // Fetch the primary active committee, ideally the 'Mahallu Committee'
  // Or the first active general committee. Adjust filtering as needed based on your real data
  const committee = await prisma.committee.findFirst({
    where: { 
      isActive: true,
      // Favor the core Mahallu committee if available
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
          // A rough ordering to ensure top roles appear first, depending on creation/assignment
          joinedAt: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Provide an ultimate fallback if no committee records exist in the DB yet
  if (!committee) {
    return <CommitteeUI members={[]} />
  }

  // Pre-sort roles to put President, Secretary, Treasurer at the top
  const rolePriority: Record<string, number> = {
    "president": 1,
    "secretary": 2,
    "treasurer": 3,
    "vice president": 4,
    "joint secretary": 5,
  }

  const sortedMembers = [...committee.members].sort((a, b) => {
    const roleA = rolePriority[a.role.toLowerCase()] || 99
    const roleB = rolePriority[b.role.toLowerCase()] || 99
    if (roleA !== roleB) return roleA - roleB
    return a.joinedAt.getTime() - b.joinedAt.getTime()
  })

  // Format the raw Prisma data to match our UI Requirements
  const formattedMembers = sortedMembers.map(cm => ({
    name: cm.member.name,
    role: cm.role.charAt(0).toUpperCase() + cm.role.slice(1),
    phone: cm.member.phone || "",
    email: cm.member.email || "",
    // Fallback logic to map our previously fixed static images to the top 3 roles if they match
    image: cm.member.photo || (
       cm.role.toLowerCase() === "president" ? "/images/committee/president.jpg" :
       cm.role.toLowerCase() === "secretary" ? "/images/committee/secretary.jpg" :
       cm.role.toLowerCase() === "treasurer" ? "/images/committee/treasurer.jpg" : null
    )
  }))

  return <CommitteeUI members={formattedMembers} />
}
