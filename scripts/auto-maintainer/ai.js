import Groq from "groq-sdk";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Core AI routing engine. Attempts Gemini 2.5 Flash first, 
 * falls back to Groq Llama 3.3 70b on failure or rate limit.
 * 
 * @param {string} systemPrompt The Persona and Instructions
 * @param {string} userPrompt The Data / Context
 * @returns {Promise<any>} Parsed JSON Object
 */
export async function callAI(systemPrompt, userPrompt) {
  console.log("🧠 Routing to Gemini 2.5 Flash...");
  
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt + "\n\nUserInput: " + userPrompt }]
          }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        return JSON.parse(text);
      }
    } catch (e) {
      console.warn("⚠️ Gemini Failed (Rate Limit or Error). Falling back to Groq...", e.message);
    }
  } else {
      console.warn("⚠️ No GEMINI_API_KEY found. Directing straight to Groq...");
  }

  // Fallback to Groq
  console.log("🦙 Generating with Groq Llama 3.3 70b...");
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Low temp for code generation
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No Groq content returned");

    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Both AI Engines Failed. Terminal Error:", error.message);
    return null;
  }
}
