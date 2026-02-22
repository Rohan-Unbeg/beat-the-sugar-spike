import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Core AI routing engine exclusively using Gemini 2.5 Pro.
 * Implements an intelligent backoff and retry loop to seamlessly handle 
 * Google AI Studio free-tier rate limits (15 RPM).
 * 
 * @param {string} systemPrompt The Persona and Instructions
 * @param {string} userPrompt The Data / Context
 * @returns {Promise<any>} Parsed JSON Object
 */
export async function callAI(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) {
    console.error("❌ No GEMINI_API_KEY found in environment!");
    return null;
  }

  while (true) {
    console.log("🧠 Routing to Gemini 2.5 Pro...");
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
        if (response.status === 429) {
          console.warn("⚠️ Gemini Free-Tier Rate Limit Hit (429)! The bot is going to sleep for 60 seconds to wait for the limit to reset...");
          await new Promise(r => setTimeout(r, 60000));
          console.log("🔄 Waking up and retrying Gemini Developer Request...");
          continue; // Retry the loop
        }
        throw new Error(`Gemini Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        return JSON.parse(text);
      } else {
         throw new Error("No JSON content returned by Gemini");
      }
    } catch (e) {
      console.error("❌ Engine Failed. Terminal Error:", e.message);
      return null;
    }
  }
}
