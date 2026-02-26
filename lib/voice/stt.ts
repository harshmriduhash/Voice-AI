
import { createClient } from "@deepgram/sdk";


function getDeepgramClient() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        // During build time, this might be missing. 
        // We return a proxy or handle it gracefully in the functions.
        console.warn("⚠️ DEEPGRAM_API_KEY is missing. Deepgram client will not be initialized.");
    }
    return createClient(apiKey || "missing_key");
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    const deepgram = getDeepgramClient();
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: "nova-2",
                smart_format: true,
            }
        );

        if (error) {
            console.error("Deepgram STT Error:", error);
            throw new Error("Failed to transcribe audio");
        }

        return result.results.channels[0].alternatives[0].transcript;
    } catch (err) {
        console.error("Transcription exception:", err);
        throw new Error("Transcription failed");
    }
}
