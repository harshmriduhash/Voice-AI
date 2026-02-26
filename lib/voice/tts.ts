import { createClient } from "@deepgram/sdk";


function getDeepgramClient() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ DEEPGRAM_API_KEY is missing. Deepgram client will not be initialized.");
    }
    return createClient(apiKey || "missing_key");
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
    const deepgram = getDeepgramClient();
    try {
        const response = await deepgram.speak.request(
            { text },
            {
                model: "aura-asteria-en",
                encoding: "mp3",
            }
        );

        // Get the audio stream from the response
        const stream = await response.getStream();

        if (!stream) {
            throw new Error("No audio stream returned from Deepgram");
        }

        // Convert stream to buffer
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
                chunks.push(value);
            }
        }

        const audioBuffer = Buffer.concat(chunks);

        if (audioBuffer.length === 0) {
            throw new Error("Empty audio buffer received");
        }

        console.log(`✅ TTS Success: Generated ${audioBuffer.length} bytes of audio`);
        return audioBuffer;

    } catch (err: any) {
        console.error("❌ TTS Error:", err.message);
        throw new Error(`Speech synthesis failed: ${err.message}`);
    }
}
