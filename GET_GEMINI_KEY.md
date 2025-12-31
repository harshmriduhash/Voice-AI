# Get Your FREE Gemini API Key

## Step 1: Go to Google AI Studio
Visit: **https://aistudio.google.com/app/apikey**

## Step 2: Sign in with Google
Use your Google account to sign in

## Step 3: Create API Key
1. Click **"Get API key"** or **"Create API key"**
2. Select **"Create API key in new project"**
3. Copy the API key (starts with `AIza...`)

## Step 4: Add to .env.local
Open your `.env.local` file and add:

```bash
GEMINI_API_KEY=AIzaSy...your-key-here
```

Your `.env.local` should now look like:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
DEEPGRAM_API_KEY=your-deepgram-key
GEMINI_API_KEY=AIzaSy...your-key-here
```

## Step 5: Restart Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Step 6: Test!
1. Go to http://localhost:3000/app
2. Click the orb
3. Ask: "What is the capital of France?"
4. The AI should now give you a REAL answer instead of just repeating!

---

## Why Gemini?
- ✅ **FREE** - Generous free tier
- ✅ **Fast** - Gemini 1.5 Flash is super quick
- ✅ **Smart** - Powered by Google's latest AI
- ✅ **Perfect for voice** - Great at conversational responses

---

## Example Conversations:
- "What's the weather like?" → Real answer
- "Tell me a joke" → Actual joke
- "What is 25 times 4?" → Correct math
- "Explain quantum physics simply" → Clear explanation

Enjoy your real AI voice agent! 🎉
