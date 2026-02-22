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

export async function POST(req: Request) {
  try {
    const ctx = await req.json();

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

    const userContext = `Context: Age ${ctx.age}, BMI ${Number(ctx.bmi).toFixed(1)}, Steps today: ${ctx.steps}, Sleep last night: ${ctx.sleepHours}h, Current Hour: ${ctx.timeOfDay}, Sugar intake just now: ${ctx.sugarIntake}g, Gender: ${ctx.isMale ? 'Male' : 'Female'}`;

    // 1. Try Gemini
    try {
       const jsonStr = await callGemini(systemPrompt, userContext, true);
       if (jsonStr) {
         const parsed = JSON.parse(jsonStr);
         return NextResponse.json(parsed);
       }
    } catch (e) {
       console.warn("Gemini Insight Failed, trying Groq...", e);
    }

    // 2. Try Groq
    if (groq) {
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
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json(parsed);
        }
      } catch (error: any) {
        console.error("Insight Generation Error:", error);
      }
    }

    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
