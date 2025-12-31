import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIResponse(input: string): Promise<string> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key, fall back to mock
        if (!apiKey) {
            console.warn("⚠️ No GEMINI_API_KEY found in environment variables");
            return `I heard you say: "${input}".Please add your Gemini API key to use real AI.`;
        }

        console.log(`🤖 Initializing Gemini with key: ${apiKey.substring(0, 5)}...`);

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use Gemini 2.0 Flash (Available in your list)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a helpful, friendly AI voice assistant.Keep your responses concise(1 - 2 sentences max) and conversational, as they will be spoken aloud.User said: "${input}"`;

        console.log("🤖 Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(`🤖 AI Response: ${text} `);
        return text;

    } catch (error: any) {
        console.error("❌ AI Error Details:", JSON.stringify(error, null, 2));
        console.error("❌ AI Error Message:", error.message);

        if (error.message?.includes("API key not valid")) {
            return "It looks like there's an issue with the API key. Please check your configuration.";
        }

        // Fallback response
        return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
    }
}
