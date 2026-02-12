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
export async function generatePersonalizedInsight(ctx: {
  age: number;
  bmi: number;
  steps: number;
  sleepHours: number;
  timeOfDay: number;
  sugarIntake: number;
  isMale: boolean;
}): Promise<any | null> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a high-performance bio-optimization coach. Generate a personalized health insight and one corrective action based on the user's current data.
          
          RULES:
          1. Use simple, direct, non-diagnostic language.
          2. Use Cause -> Effect format.
          3. Action MUST be doable immediately (under 15 mins).
          4. Adapt advice to the context:
             - If steps are low: Suggest movement.
             - If sleep is low: Explain insulin resistance.
             - If late night: Mention circadian rhythm.
          
          Return JSON:
          {
            "title": "Short catchy title",
            "message": "The personalized insight",
            "action": "One direct action string (e.g. '10-min walk')",
            "why": "Brief biological explanation",
            "priority": "low" | "medium" | "high"
          }`
        },
        {
          role: "user",
          content: `Context: Age ${ctx.age}, BMI ${ctx.bmi.toFixed(1)}, Steps today: ${ctx.steps}, Sleep last night: ${ctx.sleepHours}h, Current Hour: ${ctx.timeOfDay}, Sugar intake just now: ${ctx.sugarIntake}g, Gender: ${ctx.isMale ? 'Male' : 'Female'}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error: any) {
    // Gracefully handle Rate Limits (429) to prevent app crash/scary overlays
    if (error?.status === 429 || error?.code === 'rate_limit_exceeded' || error?.message?.includes?.('429')) {
      console.warn("⚠️ AI Rate Limit Reached. Falling back to offline ML engine.");
      return null; // Triggers fallback to generateMLInsight
    }
    
    console.error("Insight Generation Error:", error);
    return null;
  }
}
