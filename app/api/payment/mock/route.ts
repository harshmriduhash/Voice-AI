
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

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get current credits first
        const { data: profile } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .single();

        const currentCredits = profile?.credits_remaining || 0;

        // Update Profile (Add Credits ONLY, do NOT grant Pro status)
        const { error } = await supabase
            .from("profiles")
            .update({
                // subscription_status: "pro", // REMOVED: Only coupons grant Pro now
                credits_remaining: currentCredits + 5000, // Add 5000 credits
            })
            .eq("id", user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Payment Simulation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
