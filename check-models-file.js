const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No API Key found");
        return;
    }

    console.log("Checking models...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            fs.writeFileSync('models.txt', `ERROR: ${data.error.message}`);
            return;
        }

        const modelNames = data.models
            ?.filter(m => m.supportedGenerationMethods?.includes("generateContent"))
            .map(m => m.name.replace('models/', ''))
            .join('\n');

        fs.writeFileSync('models.txt', modelNames || "No models found");
        console.log("✅ Model list saved to models.txt");

    } catch (error) {
        fs.writeFileSync('models.txt', `NETWORK ERROR: ${error.message}`);
    }
}

checkModels();
