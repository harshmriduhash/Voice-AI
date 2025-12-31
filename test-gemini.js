const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    console.log("1. Checking API Key...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY not found in .env.local");
        return;
    }

    console.log("✅ API Key found:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4));

    console.log("\n2. Initializing Gemini Client...");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("3. Sending test prompt...");
        const result = await model.generateContent("Hello! Are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("\n🎉 SUCCESS! Gemini responded:");
        console.log("---------------------------------------------------");
        console.log(text);
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("\n❌ CONNECTION FAILED!");
        console.error("Error details:", error.message);

        if (error.message.includes("API key not valid")) {
            console.log("\n💡 Tip: Your API key might be copied incorrectly. Check for extra spaces.");
        } else if (error.message.includes("User location is not supported")) {
            console.log("\n💡 Tip: Gemini API might not be available in your country yet.");
        } else if (error.message.includes("Generative Language API has not been used")) {
            console.log("\n💡 Tip: You might need to wait a few minutes after enabling the API.");
        }
    }
}

testGemini();
