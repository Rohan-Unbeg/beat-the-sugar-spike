import { Octokit } from '@octokit/rest';
import fs from 'fs';
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

    // Check if this is a PR (continuous QA loop) or a new Issue
    let isPR = false;
    let targetBranch = null;
    let issue;
    let contextInstructions = "";

    try {
        const { data: prData } = await octokit.rest.pulls.get({ owner, repo, pull_number: issueNumber });
        isPR = true;
        targetBranch = prData.head.ref;
        issue = { data: prData };
        
        // Fetch rejection comments
        const { data: reviews } = await octokit.rest.pulls.listReviews({ owner, repo, pull_number: issueNumber });
        const lastReview = reviews.length > 0 ? reviews[reviews.length - 1] : { body: "" };
        
        contextInstructions = `
        THIS IS A REJECTED PULL REQUEST. YOU MUST FIX THE CODEBASED ON THIS FEEDBACK:
        Reviewer Feedback: ${lastReview.body}
        `;
        console.log(`[Coder] Iterating on existing PR #${issueNumber}, Branch: ${targetBranch}`);
    } catch {
        issue = await octokit.rest.issues.get({ owner, repo, issue_number: issueNumber });
        contextInstructions = `
        Issue Title: ${issue.data.title}
        Issue Body: ${issue.data.body}
        `;
        
        // Let's also check if there's already an open PR for this issue so we don't duplicate it.
        const { data: openPRs } = await octokit.rest.pulls.list({ owner, repo, state: 'open' });
        const existingPR = openPRs.find(pr => pr.head.ref.startsWith(`fix/ai-issue-${issueNumber}-`));
        
        if (existingPR) {
            console.log(`[Coder] Found existing PR #${existingPR.number} for Issue #${issueNumber}. Switching to iterate on the PR.`);
            isPR = true;
            issueNumber = existingPR.number;
            targetBranch = existingPR.head.ref;
            issue = { data: existingPR };
            
            const { data: reviews } = await octokit.rest.pulls.listReviews({ owner, repo, pull_number: issueNumber });
            const lastReview = reviews.length > 0 ? reviews[reviews.length - 1] : { body: "Please improve the code." };
            
            contextInstructions = `
            THIS IS A REJECTED PULL REQUEST. YOU MUST FIX THE CODE BASED ON THIS FEEDBACK:
            Reviewer Feedback: ${lastReview.body}
            `;
        }
    }

    const contextMap = await generateContextMap();
    
    let targetFileContent = "";
    const targetFileMatch = issue.data.body.match(/Target File\s*\n\s*([a-zA-Z0-9_.\-\/]+)/i);
    if (targetFileMatch && targetFileMatch[1]) {
        const filePath = targetFileMatch[1].trim();
        if (fs.existsSync(filePath)) {
            targetFileContent = `\nExisting content of ${filePath}:\n\`\`\`\n${fs.readFileSync(filePath, 'utf8')}\n\`\`\`\n`;
        } else {
            targetFileContent = `\nTarget file ${filePath} does not exist yet. You will create it.\n`;
        }
    }

    const systemPrompt = `
    You are 'The 10x Senior Developer' AI.
    Your job is to read an issue (or PR feedback) and write the precise code string required to solve it.
    
    CRITICAL INSTRUCTIONS:
    1. You are developing a modern Next.js 14 App Router project (use 'next/navigation', NOT 'next/router').
    2. Use Tailwind CSS for all styling. Create premium, beautiful UI. 
    3. The project uses React 19, 'lucide-react' for icons, and 'framer-motion'.
    4. Write production-ready, flawless code avoiding obvious regressions.
    5. Look at the existing Codebase Map and Target File below to mimic the correct architecture.
    
    Return EXACTLY a JSON structure with an array of files to change/create:
    {
      "files": [
        {
          "path": "src/path/to/file.tsx",
          "content": "Full strictly-valid code string. Do NOT use markdown code blocks inside the string."
        }
      ]
    }`;

    const userPrompt = `
    ${contextInstructions}
    
    Codebase Map (Where things live):
    ${contextMap}
    ${targetFileContent}
    `;
    
    const response = await callAI(systemPrompt, userPrompt);
    console.log("Qwen3-32B Output:", JSON.stringify(response, null, 2));
    
    if (response && response.files && response.files.length > 0) {
        try {
            const branchName = isPR ? targetBranch : `fix/ai-issue-${issueNumber}-${Date.now().toString().slice(-4)}`;
            console.log(`[Coder] Pushing ${response.files.length} changes to branch ${branchName}...`);
            
            // 1. Get branch SHA (default branch if new issue, existing branch if PR)
            const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
            const defaultBranch = repoData.default_branch;
            const refToFetch = isPR ? `heads/${branchName}` : `heads/${defaultBranch}`;
            
            const { data: refData } = await octokit.rest.git.getRef({ owner, repo, ref: refToFetch });
            const baseSha = refData.object.sha;

            // 2. Create blobs and tree
            const treeItems = await Promise.all(response.files.map(async file => {
               const { data: blob } = await octokit.rest.git.createBlob({
                  owner, repo, content: file.content, encoding: 'utf-8'
               });
               return { path: file.path, mode: '100644', type: 'blob', sha: blob.sha };
            }));

            const { data: treeData } = await octokit.rest.git.createTree({
                owner, repo, base_tree: baseSha, tree: treeItems
            });

            // 3. Create Commit
            const commitMessage = isPR 
                ? `[AI] Iteration on PR #${issueNumber} based on Reviewer feedback`
                : `[AI] Resolves Issue #${issueNumber}: ${issue.data.title}`;
                
            const { data: commitData } = await octokit.rest.git.createCommit({
                owner, repo, message: commitMessage, tree: treeData.sha, parents: [baseSha]
            });

            // 4. Update or Create Branch
            if (isPR) {
                await octokit.rest.git.updateRef({
                    owner, repo, ref: `heads/${branchName}`, sha: commitData.sha
                });
                console.log(`✅ Senior Developer pushed new commit to PR #${issueNumber}`);
                
                // Remove ai-rejected label so actions can run fresh
                try {
                    await octokit.rest.issues.removeLabel({ owner, repo, issue_number: issueNumber, name: 'ai-rejected' });
                } catch { /* ignore if not present */ }
                
                 if (process.env.GITHUB_ENV) {
                    fs.appendFileSync(process.env.GITHUB_ENV, `AI_PR_NUMBER=${issueNumber}\n`);
                }
            } else {
                await octokit.rest.git.createRef({
                    owner, repo, ref: `refs/heads/${branchName}`, sha: commitData.sha
                });

                // 5. Create Pull Request
                const { data: prData } = await octokit.rest.pulls.create({
                    owner, repo, title: `[AI] Resolves Issue #${issueNumber}: ${issue.data.title}`, head: branchName, base: defaultBranch, body: `Resolves #${issueNumber}\n\n🤖 Autonomously generated by The Coder.`
                });
                console.log(`✅ Senior Developer opened PR successfully: ${prData.html_url}`);
                
                if (process.env.GITHUB_ENV) {
                    fs.appendFileSync(process.env.GITHUB_ENV, `AI_PR_NUMBER=${prData.number}\n`);
                }
            }
            
        } catch(e) {
            console.error("❌ Coder failed to push to GitHub", e);
        }
    } else {
        console.error("Senior Developer failed to write code geometry.");
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv[2]).catch(console.error);
}
