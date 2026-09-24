// Превью дизайн-систем: один демо-лендинг из токенов каждой записи, светлая и тёмная тема.
// node tools/preview.mjs <каталог> [slug…]   → previews/<slug>-{light,dark}.png и <slug>.html
// Нужен Playwright: npm i -D playwright && npx playwright install chromium, затем node tools/preview.mjs .
// ВНИМАНИЕ: только для приёмки глазами: шрифты здесь тянутся с jsdelivr, потому что пакетов @fontsource локально нет.
//   previews/*.html — не образец кода для агентов; в лендингах шрифты только свои (woff2 в сборке), без CDN.
//   Согласие 152-ФЗ в демо-форме не отмечено заранее — как требует каталог.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const only = process.argv.slice(3);
const outDir = path.join(root, 'previews');
fs.mkdirSync(outDir, { recursive: true });

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const vars = c => Object.entries(c || {}).map(([k, v]) => `--c-${k.replace(/_/g, '-')}:${v};`).join('');

function page(d, mode) {
  const t = d.tokens || {}; const ty = t.typography || {}; const r = t.radius || {}; const sp = t.spacing || {}; const sh = t.shadow || {};
  const fonts = (d.fonts || []).map(f => `@import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/${f.fontsource}/index.css');@import url('https://cdn.jsdelivr.net/npm/@fontsource/${f.fontsource}/cyrillic-${(f.weights || [400])[0]}.css');`).join('');
  const f = k => `'${ty[k]?.family || 'system-ui'}', ${ty[k]?.fallback || 'system-ui, sans-serif'}`;
  const typo = k => `font-family:${f(k)};font-weight:${ty[k]?.weight || 400};font-size:${ty[k]?.size_desktop || '16px'};line-height:${ty[k]?.line_height || 1.4};letter-spacing:${ty[k]?.letter_spacing || 'normal'};`;
  const typoM = k => `font-size:${ty[k]?.size_mobile || ty[k]?.size_desktop || '16px'};`;
  const heroGrad = (mode === 'dark' && t.gradient?.hero_dark) || t.gradient?.hero;   // у тёмной темы бывает своя дымка (stripe: hero_dark)
  const grad = heroGrad ? `background:${heroGrad};` : '';
  const btnR = r[d.components?.button_primary?.radius] || r.pill || r.md || '12px';
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fonts}
:root{${vars(t.color?.[mode])}}
*{box-sizing:border-box}body{margin:0;background:var(--c-background);color:var(--c-text);${typo('body')}}
.wrap{max-width:${sp.container || '1200px'};margin:0 auto;padding:0 32px}
nav{display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid var(--c-border)}
nav b{${typo('h3')}}nav span{color:var(--c-text-muted);margin-left:24px}
.hero{padding:${sp.section_desktop || '96px'} 0 72px;${grad}}
.badge{display:inline-block;padding:6px 12px;border-radius:${r.pill || '999px'};background:var(--c-surface);border:1px solid var(--c-border);color:var(--c-text-muted);${typo('caption')}}
h1{${typo('display')};margin:18px 0 18px;max-width:14ch}
.lead{max-width:56ch;color:var(--c-text-muted);margin:0 0 30px}
.btn{display:inline-block;padding:${d.components?.button_primary?.padding || '14px 24px'};border-radius:${btnR};background:var(--c-primary);color:var(--c-on-primary);font-weight:${d.components?.button_primary?.weight || 600};text-decoration:none;margin-right:12px}
.btn2{display:inline-block;padding:${d.components?.button_primary?.padding || '14px 24px'};border-radius:${btnR};border:1.5px solid var(--c-border);color:var(--c-text);text-decoration:none}
section.b{padding:72px 0;border-top:1px solid var(--c-border)}
h2{${typo('h2')};margin:0 0 28px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:var(--c-surface);border:1px solid var(--c-border);border-radius:${r.lg || r.md || '16px'};padding:26px;box-shadow:${sh.card || 'none'}}
.card h3{${typo('h3')};margin:0 0 8px}.card p{margin:0;color:var(--c-text-muted)}
.num{${typo('display')};font-size:${ty.h2?.size_desktop || '40px'};color:var(--c-text)}
.split{display:grid;grid-template-columns:1.1fr 1fr;gap:28px;align-items:start}
form{background:var(--c-surface);border:1px solid var(--c-border);border-radius:${r.lg || '16px'};padding:28px;display:grid;gap:12px}
input{font:inherit;padding:14px 16px;border-radius:${r.md || '10px'};border:1px solid var(--c-border);background:var(--c-background);color:var(--c-text)}
label{color:var(--c-text-muted);${typo('caption')}}
a.link{color:var(--c-link)}
@media (max-width:700px){.wrap{padding:0 16px}.hero{padding:${sp.section_mobile || '56px'} 0 48px}h1{${typoM('display')}}h2{${typoM('h2')}}.cards,.split{grid-template-columns:1fr}nav span{display:none}.btn,.btn2{display:block;text-align:center;margin:0 0 10px}}
</style></head><body>
<div class="wrap"><nav><b>Мастерская кухонь</b><div><span>Проекты</span><span>Цены</span><span>Отзывы</span></div></nav>
<div class="hero"><span class="badge">Проект бесплатно · Казань</span><h1>Кухни на заказ за 21 день</h1>
<p class="lead">Замер, дизайн-проект и сборка под ключ. Фиксируем цену в договоре — без доплат после монтажа.</p>
<a class="btn" href="#">Получить расчёт</a><a class="btn2" href="#">Смотреть проекты</a></div></div>
<section class="b"><div class="wrap"><h2>Почему выбирают нас</h2><div class="cards">
<div class="card"><div class="num">21</div><h3>день до монтажа</h3><p>Собственное производство, без очередей у подрядчиков.</p></div>
<div class="card"><div class="num">5</div><h3>лет гарантии</h3><p>На фурнитуру и корпус — в договоре, а не на словах.</p></div>
<div class="card"><div class="num">0 ₽</div><h3>за дизайн-проект</h3><p>3D-визуализация до оплаты, правки без ограничений.</p></div>
</div></div></section>
<section class="b"><div class="wrap split"><div><h2>Рассчитаем стоимость за 15 минут</h2><p class="lead">Оставьте телефон — дизайнер перезвонит и назовёт цену по вашим размерам. <a class="link" href="#">Политика конфиденциальности</a></p></div>
<form><label>Ваше имя</label><input value="Анна"><label>Телефон</label><input value="+7 900 000-00-00"><label><input type="checkbox"> Согласен на обработку персональных данных</label><a class="btn" href="#" style="text-align:center">Получить расчёт</a></form></div></section>
<div class="wrap" style="padding:32px;color:var(--c-text-muted)">${esc(d.name)} · Vibe Landing Kit</div>
</body></html>`;
}

const b = await chromium.launch();
const files = fs.readdirSync(path.join(root, 'design-systems')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).filter(s => !only.length || only.includes(s));
const report = [];
for (const slug of files) {
  const d = JSON.parse(fs.readFileSync(path.join(root, 'design-systems', slug + '.json'), 'utf8'));
  for (const mode of ['light', 'dark']) {
    const html = page(d, mode);
    fs.writeFileSync(path.join(outDir, `${slug}-${mode}.html`), html);
    for (const [vw, tag] of [[1280, ''], [390, '-m']]) {
      const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: vw < 500 ? 2 : 1 });
      const p = await ctx.newPage();
      await p.setContent(html, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      const hs = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      await p.screenshot({ path: path.join(outDir, `${slug}-${mode}${tag}.png`), fullPage: tag === '-m' ? false : true });
      if (hs) report.push(`${slug} ${mode}${tag}: горизонтальный скролл`);
      await ctx.close();
    }
  }
}
await b.close();
console.log(report.length ? report.join('\n') : `ok: ${files.length} систем`);
