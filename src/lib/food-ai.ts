import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "dummy_key",
  dangerouslyAllowBrowser: true // Necessary for client-side hackathon prototype
});

export interface AIParsedFood {
  name: string;
  sugar: number;
  category: string;
  icon: string;
}

export async function parseFoodWithAI(query: string): Promise<AIParsedFood | null> {
  if (!query.trim()) return null;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert. Parse the user's food description into a JSON object. 
          Estimate the total sugar content in grams based on common serving sizes.
          Provide a single emoji icon related to the food.
          Categories: drink, sweet, food, dairy, fruit.
          
          Return ONLY valid JSON in this format:
          {
            "name": "Human-readable name",
            "sugar": number,
            "category": "category-name",
            "icon": "emoji"
          }
          
          Example Input: "Drinking a large bottle of sprite"
          Example Output: {"name": "Sprite (500ml)", "sugar": 54, "category": "drink", "icon": "🥤"}`
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
    if (!content) return null;

    return JSON.parse(content) as AIParsedFood;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    // Fallback logic if API key is missing or error occurs
    return null;
  }
}
