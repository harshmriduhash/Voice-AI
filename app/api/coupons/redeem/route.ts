import db from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
        }

        // 1. Fetch Coupon
        const coupon = await db.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
        }

        // 2. Validate Expiry
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
        }

        // 3. Validate Max Redemptions
        if (coupon.redemptionsCount >= coupon.maxRedemptions) {
            return NextResponse.json({ error: "Coupon fully redeemed" }, { status: 400 });
        }

        // 4. Check if already redeemed
        const existingRedemption = await db.userCoupon.findUnique({
            where: {
                userId_couponId: {
                    userId: userId,
                    couponId: coupon.id
                }
            }
        });

        if (existingRedemption) {
            return NextResponse.json({ error: "Coupon already redeemed" }, { status: 400 });
        }

        // 5. Apply Coupon (Prisma Transaction)
        await db.$transaction([
            // Increment redemption count
            db.coupon.update({
                where: { id: coupon.id },
                data: { redemptionsCount: { increment: 1 } }
            }),
            // Record redemption
            db.userCoupon.create({
                data: {
                    userId: userId,
                    couponId: coupon.id
                }
            }),
            // Update user credits and status
            db.user.update({
                where: { id: userId },
                data: {
                    creditsRemaining: { increment: coupon.bonusCredits },
                    subscriptionStatus: 'pro'
                }
            })
        ]);

        return NextResponse.json({ success: true, bonus_credits: coupon.bonusCredits });

    } catch (error) {
        console.error("Coupon Redemption Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
