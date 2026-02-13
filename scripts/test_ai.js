require('dotenv').config({ path: '.env.local' });
const Groq = require('groq-sdk');

async function testGroq() {
  console.log("🔑 API Key present:", !!process.env.NEXT_PUBLIC_GROQ_API_KEY);
  console.log("🔑 Key start:", process.env.NEXT_PUBLIC_GROQ_API_KEY ? process.env.NEXT_PUBLIC_GROQ_API_KEY.substring(0, 5) + "..." : "NONE");

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  });

  const query = "Apple";
  console.log(`🤖 Testing AI Analysis for: "${query}"...`);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert. Parse the user's food description into a JSON object. 
          Return ONLY valid JSON in this format:
          {
            "name": "Human-readable name",
            "sugar": number,
            "category": "category-name",
            "icon": "emoji"
          }`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    console.log("✅ Success! Response:");
    console.log(content);
  } catch (error) {
    console.error("❌ API Error:", error);
  }
}

testGroq();
