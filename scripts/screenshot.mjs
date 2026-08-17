import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/private/tmp/claude-501/-Users-vibhumaggarwal/7b0afd08-88ef-43c6-9381-44007823f6ec/scratchpad";
const url = process.argv[2];
const tag = process.argv[3];
const widths = [1440, 1024, 390];

const browser = await chromium.launch();

for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w === 390 ? 844 : w === 1024 ? 768 : 900 },
    deviceScaleFactor: 2,
    isMobile: w === 390,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${tag}-${w}.png`, fullPage: false });
  console.log(`shot ${tag}-${w}.png`);

  if (w === 1440) {
    // Pull real computed styles for every text node that renders, so type scale
    // is measured rather than guessed.
    const styles = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      document.querySelectorAll("body *").forEach((el) => {
        const text = (el.textContent || "").trim();
        if (!text || text.length > 90) return;
        if (el.children.length > 0) return;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const key = `${text}|${cs.fontSize}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
          text: text.slice(0, 60),
          tag: el.tagName.toLowerCase(),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily.split(",")[0],
          transform: cs.textTransform,
          tracking: cs.letterSpacing,
          lineHeight: cs.lineHeight,
          color: cs.color,
          top: Math.round(r.top),
          left: Math.round(r.left),
        });
      });
      return out.sort((a, b) => a.top - b.top || a.left - b.left);
    });
    fs.writeFileSync(`${OUT}/${tag}-styles.json`, JSON.stringify(styles, null, 2));

    const page_bg = await page.evaluate(() => ({
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyFont: getComputedStyle(document.body).fontFamily,
      scrollH: document.documentElement.scrollHeight,
      viewH: window.innerHeight,
    }));
    console.log(JSON.stringify(page_bg));
  }
  await ctx.close();
}

await browser.close();
