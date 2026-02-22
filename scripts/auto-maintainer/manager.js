import { generateContextMap, analyzeCodebase } from './brain.js';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import { callAI } from './ai.js';

dotenv.config({ path: '.env.local' });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'YOUR_ORG';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'YOUR_REPO';

async function main() {
    console.log('Agent: The Project Manager is reviewing the Architect\'s analysis...');
    const contextMap = await generateContextMap();
    console.log("Context acquired. Architect begins triage...");

    const proposal = await analyzeCodebase(contextMap);
    
    if (!proposal || !proposal.title) {
        console.log("The Architect found no high-priority action items today.");
        return;
    }

    console.log(`[Architect Proposal] ${proposal.type.toUpperCase()}: ${proposal.title}`);
    console.log(`[Architect Details] ${proposal.description}`);

    try {
        const issue = await octokit.rest.issues.create({
            owner,
            repo,
            title: `[AI ${proposal.type}] ${proposal.title}`,
            body: `### Description\n${proposal.description}\n\n### Target File\n\`${proposal.targetFile || "Unknown"}\`\n\n---\n🤖 *This issue was autonomously formulated by The Architect (Gemini 2.5) and filed by The Project Manager.*`,
            labels: [proposal.type, 'ai-generated']
        });
        console.log(`Issue created! View it here: ${issue.data.html_url}`);
        console.log(`Trigger Coder with Issue #${issue.data.number}`);
    } catch (e) {
        console.error("The Project Manager failed to file the issue. Are token permissions right?", e.message);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
