import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/voice/stt";
import { synthesizeSpeech } from "@/lib/voice/tts";
import { generateAIResponse } from "@/lib/ai/agent";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        // 1. Check Auth
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Check Credits
        const { data: profile } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .single();

        if (!profile || profile.credits_remaining <= 0) {
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
        // Determine Conversation ID (Group by Day)
        let activeConversationId = conversationId;

        if (!activeConversationId) {
            // Check if there's already a conversation for TODAY
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const { data: existingDailyConv } = await supabase
                .from("conversations")
                .select("id")
                .eq("user_id", user.id)
                .gte("created_at", todayStart.toISOString())
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (existingDailyConv) {
                activeConversationId = existingDailyConv.id;
            } else {
                // Create new conversation for today
                const { data: newConv } = await supabase
                    .from("conversations")
                    .insert({ user_id: user.id })
                    .select()
                    .single();
                if (newConv) activeConversationId = newConv.id;
            }
        }

        if (activeConversationId) {
            // Save User Message
            await supabase.from("messages").insert({
                conversation_id: activeConversationId,
                role: "user",
                text: transcript,
            });

            // Save AI Message
            await supabase.from("messages").insert({
                conversation_id: activeConversationId,
                role: "assistant",
                text: aiResponseText,
            });
        }

        // Deduct Credits (Simple cost model: 10 credits per turn)
        const COST_PER_TURN = 10;
        await supabase
            .from("profiles")
            .update({ credits_remaining: Math.max(0, profile.credits_remaining - COST_PER_TURN) })
            .eq("id", user.id);


        // 8. Return Audio
        return new NextResponse(new Blob([new Uint8Array(audioResponse)]), {
            headers: {
                "Content-Type": "audio/mpeg",
                "X-Transcript": encodeURIComponent(transcript),
                "X-AI-Response": encodeURIComponent(aiResponseText),
                "X-Conversation-Id": activeConversationId || "",
                "X-Credits-Remaining": (profile.credits_remaining - COST_PER_TURN).toString(),
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
