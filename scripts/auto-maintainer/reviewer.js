import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import { generateContextMap } from './brain.js';
import { callAI } from './ai.js';

dotenv.config({ path: '.env.local' });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'YOUR_ORG';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'YOUR_REPO';

async function main(prNumber) {
    if (!prNumber) return console.log("Reviewer needs a PR Number to check.");
    console.log(`Agent: The QA Lead is reviewing PR #${prNumber}`);

    // Fetch PR diff
    const { data: diff } = await octokit.rest.pulls.get({
        owner, repo, pull_number: prNumber, mediaType: { format: "diff" }
    });

    const contextMap = await generateContextMap();
    
    const systemPrompt = `
    You are 'The QA Lead' AI persona.
    Your job is to read a PR diff against the repository context map and determine if the code safely and accurately targets a problem without causing regressions.

    CRITICAL RULES: You MUST REJECT (approved: false) if you see:
    1. 'next/router' used instead of 'next/navigation' (This is an App Router project!)
    2. Missing Tailwind CSS classes where styling is visibly needed.
    3. Syntax errors, markdown inside code strings, or hallucinated imports.
    
    Respond strictly with JSON: 
    { 
      "approved": true | false, 
      "comment": "Concise technical feedback. If rejecting, state exactly what must be fixed." 
    }`;
    
    const userPrompt = `
    Codebase Map:
    ${contextMap}
    
    PR Diff:
    ${diff}
    `;

    const review = await callAI(systemPrompt, userPrompt);
    
    if (review && review.approved !== undefined) {
        console.log(`AI QA Decision: ${review.approved ? 'APPROVE' : 'REQUEST_CHANGES'}`);

        // GitHub blocks a bot from approving its own PR. We must use COMMENT and rely on labels/auto-merge
        const bodyPrefix = review.approved 
            ? "✅ **Quality Assurance Passed.**\n\n" 
            : "❌ **Quality Assurance Failed.**\n\n";

        await octokit.rest.pulls.createReview({
            owner, repo, pull_number: prNumber,
            event: 'COMMENT',
            body: bodyPrefix + `${review.comment}\n\n🤖 *Review performed autonomously by AI Planner.*`
        });
        
        // If rejected, add a label so the Actions workflow can pick it up and trigger the coder again
        if (!review.approved) {
           await octokit.rest.issues.addLabels({
               owner, repo, issue_number: prNumber, labels: ['ai-rejected']
           });
        }

        // If approved, add a label to signal it's ready for merge
        if (review.approved) {
           await octokit.rest.issues.addLabels({
               owner, repo, issue_number: prNumber, labels: ['ai-approved']
           });
        }
        
        console.log(`Review for PR #${prNumber} submitted.`);
    } else {
        console.error("QA Lead failed to produce a valid review payload.");
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv[2]).catch(console.error);
}
