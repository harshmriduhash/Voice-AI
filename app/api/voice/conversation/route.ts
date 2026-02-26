import db from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // 1. Check Auth
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Check Credits
        const profile = await db.user.findUnique({
            where: { id: userId },
            select: { creditsRemaining: true }
        });

        if (!profile || profile.creditsRemaining <= 0) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        // 3. Get Audio File
        const formData = await req.formData();
        const file = formData.get("audio") as File;
        const conversationId = formData.get("conversationId") as string; // Optional: continue existing

        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        // 4. STT
        const transcript = await transcribeAudio(audioBuffer);
        console.log("Transcript:", transcript);

        if (!transcript) {
            return NextResponse.json({ error: "No speech detected" }, { status: 400 });
        }

        // 5. AI Logic
        const aiResponseText = await generateAIResponse(transcript);
        console.log("AI Response:", aiResponseText);

        // 6. TTS
        const audioResponse = await synthesizeSpeech(aiResponseText);

        // 7. DB Operations (History & Credits)
        let activeConversationId = conversationId;

        if (!activeConversationId) {
            // Check if there's already a conversation for TODAY
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const existingDailyConv = await db.conversation.findFirst({
                where: {
                    userId: userId,
                    createdAt: { gte: todayStart }
                },
                orderBy: { createdAt: 'desc' }
            });

            if (existingDailyConv) {
                activeConversationId = existingDailyConv.id;
            } else {
                // Create new conversation for today
                const newConv = await db.conversation.create({
                    data: { userId: userId }
                });
                activeConversationId = newConv.id;
            }
        }

        if (activeConversationId) {
            // Save Messages in a transaction or sequential (Prisma batching)
            await db.message.createMany({
                data: [
                    {
                        conversationId: activeConversationId,
                        role: "user",
                        text: transcript,
                    },
                    {
                        conversationId: activeConversationId,
                        role: "assistant",
                        text: aiResponseText,
                    }
                ]
            });
        }

        // Deduct Credits (Simple cost model: 10 credits per turn)
        const COST_PER_TURN = 10;
        const updatedProfile = await db.user.update({
            where: { id: userId },
            data: {
                creditsRemaining: {
                    decrement: COST_PER_TURN
                }
            }
        });

        // Ensure credits don't go below 0 (Prisma decrement doesn't guard this automatically in all DBs, but 402 check handled it)
        const resultingCredits = Math.max(0, updatedProfile.creditsRemaining);
        if (updatedProfile.creditsRemaining < 0) {
            await db.user.update({
                where: { id: userId },
                data: { creditsRemaining: 0 }
            });
        }


        // 8. Return Audio
        return new NextResponse(new Blob([new Uint8Array(audioResponse)]), {
            headers: {
                "Content-Type": "audio/mpeg",
                "X-Transcript": encodeURIComponent(transcript),
                "X-AI-Response": encodeURIComponent(aiResponseText),
                "X-Conversation-Id": activeConversationId || "",
                "X-Credits-Remaining": resultingCredits.toString(),
            },
        });

    } catch (error) {
        console.error("Conversation API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
