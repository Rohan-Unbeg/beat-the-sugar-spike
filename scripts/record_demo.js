const puppeteer = require('puppeteer');

// 🎨 High Contrast Red Cursor
const cursorStyle = `
  <style>
    .puppeteer-mouse-pointer {
      pointer-events: none;
      position: fixed; 
      top: 0;
      z-index: 999999999; 
      left: 0;
      width: 32px;
      height: 32px;
      background: rgba(255, 30, 30, 0.75); 
      border: 3px solid #fff;
      border-radius: 50%;
      margin: -16px 0 0 -16px; 
      transition: background .15s, transform .1s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .puppeteer-mouse-pointer.button-hover {
      background: rgba(255, 204, 0, 0.9);
      border-color: #FFCC00;
      transform: scale(0.9);
    }
  </style>
`;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    // Add extra args to ensure rendering
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--enable-gpu']
  });

  const page = await browser.newPage();

  // 📝 Capture Console Logs
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning' || msg.text().includes('AI') || msg.text().includes('Groq')) {
        console.log(`[Browser ${type.toUpperCase()}] ${msg.text()}`);
    }
  });

  // 🖱️ Safe Cursor Injection
  const injectCursor = async () => {
    try {
      await page.evaluate((css) => {
        if (!document.head || !document.body) return; // Prevent crash on blank/loading pages

        // Remove old
        const existing = document.querySelector('.puppeteer-mouse-pointer');
        if (existing) existing.remove();
        
        // Inject style
        const style = document.createElement('div');
        style.innerHTML = css;
        document.head.appendChild(style.firstElementChild);

        // Inject cursor
        const box = document.createElement('div');
        box.classList.add('puppeteer-mouse-pointer');
        document.body.appendChild(box);

        // Track movement
        document.addEventListener('mousemove', event => {
          box.style.left = event.clientX + 'px';
          box.style.top = event.clientY + 'px';
          
          const el = document.elementFromPoint(event.clientX, event.clientY);
          if (el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button') || el.closest('a'))) {
            box.classList.add('button-hover');
          } else {
            box.classList.remove('button-hover');
          }
        }, true);
      }, cursorStyle);
    } catch (e) {
      console.log("⚠️ Cursor injection skipped (page loading?)");
    }
  };

  // Re-inject safely
  page.on('load', injectCursor); 

  // Helper: Reliable Wait & Move
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // Helper: Human-like Move & Click
  const moveAndClick = async (selectorOrElement, description) => {
    let retries = 3;
    while (retries > 0) {
        try {
            let element;
            if (typeof selectorOrElement === 'string') {
              try { element = await page.$(selectorOrElement); } catch(e) {}
            } else {
              element = selectorOrElement;
            }

            if (!element) {
              console.log(`⚠️ Skip click: ${description} (Not found)`);
              return false;
            }

            // Skip scroll for navigation buttons as they are fixed
            if (!description.includes("Tab")) {
                try {
                    await element.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                } catch (e) {
                    console.log(`⚠️ Could not scroll to ${description}`);
                }
                await wait(500);
            }

            const box = await element.boundingBox();
            if (!box) {
                console.log(`⚠️ Element hidden: ${description}. Retrying...`);
                retries--;
                await wait(1000);
                continue;
            }

            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
            await wait(400); 
            
            await page.mouse.down();
            await wait(100);
            await page.mouse.up();
            
            console.log(`✅ Clicked: ${description}`);
            return true;
        } catch (e) {
            console.log(`❌ Failed to click ${description}: ${e.message}`);
            return false;
        }
    }
    console.log(`❌ Failed to click ${description} after retries.`);
    return false;
  };

  const findByText = async (text, tag = 'button') => {
    return page.evaluateHandle((txt, t) => {
      const els = [...document.querySelectorAll(t)];
      return els.find(e => e.innerText && (e.innerText.includes(txt) || e.innerText.trim() === txt));
    }, text, tag);
  };

  try {
    console.log("🎬 Starting Final Demo...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await injectCursor(); 

    // 1. Start Journey
    await wait(2000); 
    let startBtn = await findByText('Start free', 'button');
    if (!startBtn.asElement()) startBtn = await findByText('Start free', 'a');
    await moveAndClick(startBtn, "Start Journey");

    // 2. Identity
    try { await page.waitForFunction(() => document.body.innerText.includes('Identity'), {timeout: 8000}); } catch(e){}
    await wait(1000);
    const maleBtn = await findByText('Male', 'button');
    await moveAndClick(maleBtn, "Gender: Male");

    // 3. Age
    try { await page.waitForFunction(() => document.body.innerText.includes('Age.'), {timeout: 5000}); } catch(e){}
    const nextBtn1 = await findByText('Next', 'button');
    await moveAndClick(nextBtn1, "Next (Age)");

    // 4. Height
    try { await page.waitForFunction(() => document.body.innerText.includes('How tall?'), {timeout: 5000}); } catch(e){}
    await wait(500);
    const nextBtn2 = await findByText('Next', 'button');
    await moveAndClick(nextBtn2, "Next (Height)");

    // 5. Weight
    try { await page.waitForFunction(() => document.body.innerText.includes('Current Weight'), {timeout: 5000}); } catch(e){}
    await wait(500);
    const nextBtn3 = await findByText('Next', 'button');
    await moveAndClick(nextBtn3, "Next (Weight)");

    // 6. Goal
    try { await page.waitForFunction(() => document.body.innerText.includes('Your Mission?'), {timeout: 5000}); } catch(e){}
    await wait(500);
    const maintainBtn = await findByText('Maintain', 'button');
    await moveAndClick(maintainBtn, "Goal: Maintain");

    // 7. Pledge
    try { await page.waitForFunction(() => document.body.innerText.includes('One Last Thing.'), {timeout: 5000}); } catch(e){}
    await wait(1000);
    const pledgeBtn = await findByText('I PLEDGE', 'button');
    await moveAndClick(pledgeBtn, "Pledge");

    // 8. Dashboard Arrival
    console.log("📍 Dashboard loading...");
    await page.waitForSelector('.lucide-flame', { timeout: 15000 });
    await wait(2000);

    // 9. Quick Log Coffee
    console.log("☕ Log Coffee...");
    const coffeeBtn = await findByText('Coffee', 'button');
    await moveAndClick(coffeeBtn, "Preset: Coffee");
    await wait(2500);

    // 10. AI Search
    const searchBtn = await findByText('Search Food', 'button');
    await moveAndClick(searchBtn, "Open Search");
    
    try {
       await page.waitForSelector('input[placeholder*="e.g."]', {timeout: 5000});
    } catch(e) {
       console.log("⚠️ Search Modal did not open properly!");
    }
    await wait(1000);

    console.log("✍️ Typing...");
    // Use 'Apple' to trigger Demo Mock (Instant Success)
    const input = await page.$('input[placeholder*="e.g."]');
    if (input) {
      await input.type('Apple', { delay: 100 });
      await wait(1000);

      const analyzeBtn = await page.$('div.relative.group button.bg-coral'); 
      await moveAndClick(analyzeBtn, "Analyze Arrow");

      console.log("🤖 AI Analyzing 'Apple'...");
      try {
        await page.waitForFunction(
            () => document.body.innerText.includes('Log This Item'), 
            { timeout: 60000 }
        );
        console.log("✅ AI Result Found!");
        
        const logBtn = await findByText('Log This Item', 'button');
        await moveAndClick(logBtn, "Log Item");

      } catch (e) {
        console.log("❌ AI TIMED OUT.");
      }
    }
    await wait(2000);

    // 11. Navigate to Stats
    console.log("📊 Navigating to Stats...");
    let navButtons = await page.$$('nav button'); 
    if (navButtons.length >= 2) {
       await moveAndClick(navButtons[1], "Stats Tab");
       await wait(3000); // Give time for stats page mount
    }
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await wait(1500);

    // 12. Navigate to Rewards
    console.log("🏆 Navigating to Rewards...");
    navButtons = await page.$$('nav button');
    if (navButtons.length >= 3) {
       await moveAndClick(navButtons[2], "Rewards Tab");
       await wait(3000);
    }
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await wait(1500);

    // 13. Navigate to Profile
    console.log("👤 Navigating to Profile...");
    navButtons = await page.$$('nav button');
    if (navButtons.length >= 4) {
       await moveAndClick(navButtons[3], "Profile Tab");
       await wait(3000);
    }
    await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
    await wait(1000);

    // 14. Return Home
    console.log("🏠 Return Home...");
    navButtons = await page.$$('nav button');
    if (navButtons.length >= 1) {
       await moveAndClick(navButtons[0], "Home Tab");
       await wait(2000);
    }

    console.log("🔥 Final Streak Hover...");
    const streakEl = await page.$('.lucide-flame'); 
    if (streakEl) {
        try {
            const box = await streakEl.boundingBox();
            if (box) {
                await page.mouse.move(box.x + box.width/2, box.y + box.height/2, { steps: 10 });
                await wait(2000);
            }
        } catch(e){}
    }

    console.log("🏁 Full Walkthrough Complete!");

  } catch (e) {
    console.error("❌ Fatal:", e);
    await page.screenshot({ path: 'fatal_error.png' });
  }
})();
