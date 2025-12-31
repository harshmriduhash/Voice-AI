
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
        }

        // 1. Fetch Coupon
        const { data: coupon, error: couponError } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", code)
            .single();

        if (couponError || !coupon) {
            return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
        }

        // 2. Validate Expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
        }

        // 3. Validate Max Redemptions
        if (coupon.redemptions_count >= coupon.max_redemptions) {
            return NextResponse.json({ error: "Coupon fully redeemed" }, { status: 400 });
        }

        // 4. Check if already redeemed
        const { data: existingRedemption } = await supabase
            .from("user_coupons")
            .select("*")
            .eq("user_id", user.id)
            .eq("coupon_id", coupon.id)
            .single();

        if (existingRedemption) {
            return NextResponse.json({ error: "Coupon already redeemed" }, { status: 400 });
        }

        // 5. Apply Coupon (Transaction-like)
        // Increment redemption count
        await supabase
            .from("coupons")
            .update({ redemptions_count: coupon.redemptions_count + 1 })
            .eq("id", coupon.id);

        // Record redemption
        await supabase.from("user_coupons").insert({
            user_id: user.id,
            coupon_id: coupon.id,
        });

        // Add credits to profile
        // First get current credits
        const { data: profile } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .single();

        const currentCredits = profile?.credits_remaining || 0;

        await supabase
            .from("profiles")
            .update({
                credits_remaining: currentCredits + coupon.bonus_credits,
                subscription_status: 'pro' // Grant Pro status on coupon redemption
            })
            .eq("id", user.id);

        return NextResponse.json({ success: true, bonus_credits: coupon.bonus_credits });

    } catch (error) {
        console.error("Coupon Redemption Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
