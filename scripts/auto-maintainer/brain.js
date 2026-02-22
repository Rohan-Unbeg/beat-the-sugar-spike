import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { callAI } from './ai.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function generateContextMap() {
    console.log('Generating structural codebase map...');
    const files = await glob('**/*.{js,ts,tsx,json}', {
        ignore: ['node_modules/**', '.next/**', 'out/**', 'dist/**', 'public/**', 'package-lock.json']
    });

    let contextMap = 'Codebase Structure:\n';
    files.forEach(file => {
        contextMap += `- ${file}\n`;
    });

    return contextMap;
}

export async function analyzeCodebase(contextMap) {
    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
        console.warn("No API Keys configured. AI Analysis aborted.");
        return null;
    }

    console.log('Agent: The Architect is proactively analyzing the codebase...');
    
    const systemPrompt = `
    You are 'The Architect', an autonomous AI Maintainer reading this repository's filesystem map.
    Your sole job is to proactively identify a single missing feature, structural flaw, or likely edge-case bug.
    Focus on Next.js/React standard conventions. Let's make an impact today.
    
    Output exactly ONE proposal in strict JSON format:
    {
      "type": "bug" | "feature",
      "title": "A short, actionable title for the GitHub Issue",
      "description": "Clear explanation of what's missing or wrong, and what the fix should look like.",
      "targetFile": "The most likely file path to edit (if you can guess from the map)"
    }`;

    // A real implementation would append a tiny snippet of key files here
    // based on the contextMap.
    const userPrompt = `Codebase Map:\n${contextMap}`;
    
    const proposal = await callAI(systemPrompt, userPrompt);
    return proposal;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const map = await generateContextMap();
        console.log(map);
        console.log("\n--- The Architect is Thinking ---");
        // const proposal = await analyzeCodebase(map);
        // console.log("Architect's Recommendation:", proposal);
    })();
}
