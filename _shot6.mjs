import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const req = createRequire(new URL('./frontend/package.json', import.meta.url));
const pwMod = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = pwMod.chromium || pwMod.default?.chromium;
const b = await chromium.launch();
for (const slug of ['robotic-process-automation','quality-engineering-assurance','ai-cognitive-computing','genai-business-services']) {
 for (const w of [1280,1512]) {
  const p = await b.newPage({ viewport: { width: w, height: 950 } });
  await p.goto(`http://localhost:3000/services/${slug}`, { waitUntil: 'networkidle' });
  const worst = await p.evaluate(async () => {
    const lbl = [...document.querySelectorAll('p')].find((n) => /^Capability \d+\/\d+$/.test(n.textContent.trim()));
    if (!lbl) return 'no card';
    const holder = lbl.closest('div.absolute');
    const card = holder.parentElement;
    const bar = card.querySelector('div.absolute.bottom-6');
    const titleEl = holder.lastElementChild;
    const res = [];
    for (let i = 0; i < 14; i++) {
      await new Promise((r) => setTimeout(r, 260));
      const t = titleEl.getBoundingClientRect();
      res.push({ n: titleEl.textContent.slice(0, 30), over: Math.round(t.bottom - bar.getBoundingClientRect().top) });
    }
    return res.sort((a, b) => b.over - a.over)[0];
  });
  console.log(slug.padEnd(30), w, JSON.stringify(worst));
  await p.close();
 }
}
await b.close();
