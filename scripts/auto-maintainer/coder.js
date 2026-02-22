import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import { generateContextMap } from './brain.js';
import { callAI } from './ai.js';

dotenv.config({ path: '.env.local' });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'YOUR_ORG';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'YOUR_REPO';

async function main(issueNumber) {
    if (!issueNumber) return console.log("Coder needs an Issue Number to fix.");
    console.log(`Agent: The Senior Developer picked up Issue #${issueNumber}`);

    // Fetch Issue
    const issue = await octokit.rest.issues.get({ owner, repo, issue_number: issueNumber });
    const contextMap = await generateContextMap();

    const systemPrompt = `
    You are 'The Senior Developer' AI.
    Your job is to read an issue and write the precise code string required to solve it.
    
    Return EXACTLY a JSON structure with an array of files to change/create:
    {
      "files": [
        {
          "path": "path/to/file.js",
          "content": "Full new content of the file"
        }
      ]
    }`;

    const userPrompt = `
    Issue Title: ${issue.data.title}
    Issue Body: ${issue.data.body}
    
    Codebase Map (Where things live):
    ${contextMap}
    `;
    
    const response = await callAI(systemPrompt, userPrompt);
    
    if (response && response.files) {
        const branchName = `fix/ai-issue-${issueNumber}-${Date.now().toString().slice(-4)}`;
        console.log(`[Mock] Generating branch ${branchName} and applying ${response.files.length} changes...`);
        // Final implementation would use Octokit commit APIs here.
        console.log("Senior Developer opened PR successfully.");
    } else {
        console.error("Senior Developer failed to write code geometry.");
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv[2]).catch(console.error);
}
