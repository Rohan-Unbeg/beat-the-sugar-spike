import Groq from "groq-sdk";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

/**
 * Core AI routing engine exclusively using Groq's Qwen 3 32B.
 * Provides blazing fast inference with generous rate limits (300K TPM) 
 * and phenomenal coding accuracy.
 * 
 * @param {string} systemPrompt The Persona and Instructions
 * @param {string} userPrompt The Data / Context
 * @returns {Promise<any>} Parsed JSON Object
 */
export async function callAI(systemPrompt, userPrompt) {
  console.log("🚀 Generating with Groq Qwen3-32B...");
  
  if (!process.env.GROQ_API_KEY) {
    console.error("❌ No GROQ_API_KEY found in environment!");
    return null;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "qwen/qwen3-32b",
      temperature: 0.2, // Low temp for structured logic
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned from Groq");

    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Groq Engine Failed. Terminal Error:", error.message);
    return null;
  }
}
