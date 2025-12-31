
import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
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
