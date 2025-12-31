const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No API Key found in .env.local");
        return;
    }

    console.log(`🔑 Checking models for key: ${apiKey.substring(0, 10)}...`);

    // Use the REST API directly to list models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("\n❌ API Error:", data.error.message);
            console.log("\n💡 Possible fixes:");
            console.log("1. Make sure 'Generative Language API' is enabled in Google Cloud Console");
            console.log("2. Create a new API key in a new project");
            return;
        }

        console.log("\n✅ AVAILABLE MODELS FOR YOU:");
        console.log("-----------------------------");

        const contentModels = data.models?.filter(m =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes("generateContent")
        );

        if (contentModels && contentModels.length > 0) {
            contentModels.forEach(m => {
                console.log(`Model Name: ${m.name.replace('models/', '')}`);
            });
            console.log("\n👇 I will update your code to use the first one on this list.");
        } else {
            console.log("No content generation models found.");
        }

    } catch (error) {
        console.error("Network error:", error);
    }
}

checkModels();
