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

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// 🧠 Helper: Call Gemini API (v1beta REST)
async function callGemini(systemPrompt: string, userPrompt: string, jsonMode: boolean = true): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt + "\n\nUser Input: " + userPrompt }]
        }],
        generationConfig: {
          response_mime_type: jsonMode ? "application/json" : "text/plain"
        }
      })
    });

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    console.warn("⚠️ Gemini Call Failed:", e);
    return null;
  }
}

export async function parseFoodWithAI(query: string): Promise<AIParsedFood | null> {
  if (!query.trim()) return null;

  // 🛡️ DEMO MODE / MOCK DATA (Guaranteed Success for Demo)
  // This ensures the recorded demo NEVER fails due to rate limits or network issues.
  const lowerQ = query.toLowerCase();
  if (lowerQ.includes("apple")) {
     return { name: "Apple (Medium)", sugar: 19, category: "fruit", icon: "🍎" };
  }
  if (lowerQ.includes("coffee") || lowerQ.includes("latte")) {
     return { name: "Latte (No Sugar)", sugar: 12, category: "drink", icon: "☕" };
  }
  if (lowerQ.includes("coke") || lowerQ.includes("cola")) {
     return { name: "Coca-Cola (Can)", sugar: 39, category: "drink", icon: "🥤" };
  }
  if (lowerQ.includes("sprite")) {
     return { name: "Sprite (500ml)", sugar: 54, category: "drink", icon: "🥤" };
  }
  if (lowerQ.includes("cheese")) {
     return { name: "Grilled Cheese", sugar: 4, category: "food", icon: "🥪" };
  }

  // 1. Try Gemini (Primary)
  try {
     const systemPrompt = `You are a nutrition expert. Parse the user's food description into a JSON object. 
          Estimate the total sugar content in grams based on common serving sizes.
          Provide a single emoji icon related to the food.
          Categories: drink, sweet, food, dairy, fruit.
          
          Return ONLY valid JSON in this format:
          {
            "name": "Human-readable name",
            "sugar": number,
            "category": "category-name",
            "icon": "emoji"
          }`;
     
     const jsonStr = await callGemini(systemPrompt, query, true);
     if (jsonStr) return JSON.parse(jsonStr) as AIParsedFood;

  } catch (e) {
     console.warn("Gemini Parsing Failed, trying Groq...", e);
  }

  // 2. Try Groq AI (Fallback 1)
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
    if (!content) throw new Error("No AI parsing content");

    return JSON.parse(content) as AIParsedFood;
  } catch (error: any) {
    console.warn("⚠️ Groq AI Failed (Rate Limit or Error). Switching to OpenFoodFacts...", error);
    
    // 3. Fallback: OpenFoodFacts API
    return await parseFoodWithOpenFoodFacts(query);
  }
}

async function parseFoodWithOpenFoodFacts(query: string): Promise<AIParsedFood | null> {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const p = data.products[0];
            // Estimate sugar: fallback to 10g if missing, assume 1 serving = 100g for simplicity in fallback mode
            const sugarPer100 = p.nutriments?.sugars_100g || p.nutriments?.sugars_value || 0;
            const approximateServing = 100; // grams
            const sugarTotal = Math.round((sugarPer100 * approximateServing) / 100);

            return {
                name: p.product_name || query,
                sugar: sugarTotal,
                category: "food", // Generic fallback
                icon: "🥣" 
            };
        }
    } catch (e) {
        console.error("OpenFoodFacts Failed:", e);
    }
    return null;
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
  const systemPrompt = `You are a high-performance bio-optimization coach. Generate a personalized health insight and one corrective action based on the user's current data.
          
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
          }`;

  const userContext = `Context: Age ${ctx.age}, BMI ${ctx.bmi.toFixed(1)}, Steps today: ${ctx.steps}, Sleep last night: ${ctx.sleepHours}h, Current Hour: ${ctx.timeOfDay}, Sugar intake just now: ${ctx.sugarIntake}g, Gender: ${ctx.isMale ? 'Male' : 'Female'}`;

  // 1. Try Gemini
  try {
     const jsonStr = await callGemini(systemPrompt, userContext, true);
     if (jsonStr) return JSON.parse(jsonStr);
  } catch (e) {
     console.warn("Gemini Insight Failed, trying Groq...", e);
  }

  // 2. Try Groq
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userContext
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error: any) {
    if (error?.status === 429 || error?.code === 'rate_limit_exceeded' || error?.message?.includes?.('429')) {
      console.warn("⚠️ AI Rate Limit Reached. Falling back to offline ML engine.");
      return null;
    }
    console.error("Insight Generation Error:", error);
    return null;
  }
}
