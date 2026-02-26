import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update User Profile with credits
        await db.user.update({
            where: { id: userId },
            data: {
                creditsRemaining: {
                    increment: 5000
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Payment Simulation Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
