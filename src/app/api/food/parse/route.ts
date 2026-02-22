import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

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

async function parseFoodWithOpenFoodFacts(query: string) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const p = data.products[0];
            const sugarPer100 = p.nutriments?.sugars_100g || p.nutriments?.sugars_value || 0;
            const approximateServing = 100; // grams
            const sugarTotal = Math.round((sugarPer100 * approximateServing) / 100);

            return {
                name: p.product_name || query,
                sugar: sugarTotal,
                category: "food",
                icon: "🥣" 
            };
        }
    } catch (e) {
        console.error("OpenFoodFacts Failed:", e);
    }
    return null;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 🛡️ DEMO MODE / MOCK DATA
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes("apple")) {
       return NextResponse.json({ name: "Apple (Medium)", sugar: 19, category: "fruit", icon: "🍎" });
    }
    if (lowerQ.includes("coffee") || lowerQ.includes("latte")) {
       return NextResponse.json({ name: "Latte (No Sugar)", sugar: 12, category: "drink", icon: "☕" });
    }
    if (lowerQ.includes("coke") || lowerQ.includes("cola")) {
       return NextResponse.json({ name: "Coca-Cola (Can)", sugar: 39, category: "drink", icon: "🥤" });
    }
    if (lowerQ.includes("sprite")) {
       return NextResponse.json({ name: "Sprite (500ml)", sugar: 54, category: "drink", icon: "🥤" });
    }
    if (lowerQ.includes("cheese")) {
       return NextResponse.json({ name: "Grilled Cheese", sugar: 4, category: "food", icon: "🥪" });
    }

    // 1. Try Gemini
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
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json(parsed);
      }
    } catch (e) {
      console.warn("Gemini Parsing Failed, trying Groq...", e);
    }

    // 2. Try Groq
    if (groq) {
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
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        }
      } catch (error: any) {
        console.warn("⚠️ Groq AI Failed. Switching to OpenFoodFacts...", error);
      }
    }

    // 3. Fallback: OpenFoodFacts
    const offData = await parseFoodWithOpenFoodFacts(query);
    if (offData) return NextResponse.json(offData);

    return NextResponse.json({ error: "Failed to parse food" }, { status: 500 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
