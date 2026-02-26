"use server"

import { currentUser } from "@clerk/nextjs/server"
import { ADMIN_CONFIG } from "./config"
import db from "@/lib/db"

async function checkAdminAccess() {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress

    if (!user || !email || !ADMIN_CONFIG.allowedEmails.includes(email)) {
        throw new Error("Unauthorized: Admin access only")
    }
    return user
}

export async function getAdminStats() {
    await checkAdminAccess()

    const [userCount, conversationCount, messageCount] = await Promise.all([
        db.user.count(),
        db.conversation.count(),
        db.message.count()
    ])

    // Get recent users
    const recentUsers = await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            email: true,
            createdAt: true,
            subscriptionStatus: true,
            creditsRemaining: true
        }
    })

    return {
        userCount,
        conversationCount,
        messageCount,
        recentUsers
    }
}

export async function createCoupon(code: string, bonusCredits: number, maxRedemptions: number) {
    await checkAdminAccess()

    const coupon = await db.coupon.create({
        data: {
            code: code.toUpperCase(),
            bonusCredits: bonusCredits,
            maxRedemptions: maxRedemptions,
            redemptionsCount: 0
        }
    })

    return { success: true, coupon }
}

export async function deleteUser(userId: string) {
    await checkAdminAccess()

    // Prisma handles cascading deletes based on the schema mapping
    await db.user.delete({
        where: { id: userId }
    })

    return { success: true }
}
