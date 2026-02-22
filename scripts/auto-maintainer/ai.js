import OpenAI from "openai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Initialize OpenRouter matching OpenAI schema
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy_key",
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/Rohan-Unbeg/beat-the-sugar-spike", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": "Auto-Maintainer", // Optional. Shows in rankings on openrouter.ai.
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Core AI routing engine. Attempts Gemini 2.5 Flash first, 
 * falls back to OpenRouter Qwen 2.5 Coder 32B on failure or rate limit.
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
      console.warn("⚠️ Gemini Failed (Rate Limit or Error). Falling back to OpenRouter...", e.message);
    }
  } else {
      console.warn("⚠️ No GEMINI_API_KEY found. Directing straight to OpenRouter...");
  }

  // Fallback to OpenRouter (Qwen 2.5 Coder 32B)
  console.log("🚀 Generating with OpenRouter Qwen 2.5 Coder 32B...");
  try {
    const chatCompletion = await openrouter.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "qwen/qwen-2.5-coder-32b-instruct",
      temperature: 0.2, // Low temp for code generation
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices?.[0]?.message?.content;
    if (!content) throw new Error("No OpenRouter content returned");

    // 1. Try to extract from Markdown code blocks first
    const codeBlockMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
       try { return JSON.parse(codeBlockMatch[1].trim()); } catch (e) {}
    }

    // 2. Fallback: Find the first { and last } to extract the outermost object
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const potentialJson = content.substring(startIdx, endIdx + 1);
        try { return JSON.parse(potentialJson); } catch (e) {}
    }
    
    // 3. Fallback: Find the first [ and last ] to extract the outermost array
    const altStartIdx = content.indexOf('[');
    const altEndIdx = content.lastIndexOf(']');
    
    if (altStartIdx !== -1 && altEndIdx !== -1 && altEndIdx > altStartIdx) {
        const potentialArray = content.substring(altStartIdx, altEndIdx + 1);
        try { return JSON.parse(potentialArray); } catch (e) {}
    }

    console.error("Failed to find valid JSON in OpenRouter response");
    return null;
  } catch (error) {
    console.error("❌ Both AI Engines Failed. Terminal Error:", error.message);
    return null;
  }
}
