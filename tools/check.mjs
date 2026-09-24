// Проверка каталога: node tools/check.mjs <каталог> [slug…]
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.argv[2] || '.'); const only = process.argv.slice(3);
const hex = h => { const m = /^#([0-9a-f]{6})$/i.exec(h || ''); if (!m) return null; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const A = hex(a), B = hex(b); if (!A || !B) return 0; const x = lum(A), y = lum(B); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const KEYS = ['background','surface','text','text_muted','border','primary','on_primary','accent','on_accent','link','success','error'];
const PAIRS = [['text','background',7],['text','surface',4.5],['text_muted','background',4.5],['on_primary','primary',4.5],['on_accent','accent',4.5],['link','background',4.5]];
const motionDir = path.join(root, 'motion'); const motionSlugs = fs.existsSync(motionDir) ? fs.readdirSync(motionDir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : [];
const fontCache = {};
async function font(id) { if (fontCache[id]) return fontCache[id]; try { const r = await fetch('https://api.fontsource.org/v1/fonts/' + id); fontCache[id] = r.ok ? await r.json() : null; } catch { fontCache[id] = null; } return fontCache[id]; }
const report = {}; let bad = 0; const used = new Set();
const dsDir = path.join(root, 'design-systems');
for (const f of (fs.existsSync(dsDir) ? fs.readdirSync(dsDir) : []).filter(f => f.endsWith('.json'))) {
  const slug = f.slice(0, -5); if (only.length && !only.includes(slug)) continue; const errs = []; let d;
  try { d = JSON.parse(fs.readFileSync(path.join(dsDir, f), 'utf8')); } catch (e) { report[slug] = ['JSON: ' + e.message]; bad++; continue; }
  for (const k of ['slug','name','kind','version','disclaimer','summary','summary_en','best_for','goals','tokens','fonts','components','layout','lead_form','motion_recipes','ab_axes','do','dont','prompt_snippet','source']) if (d[k] === undefined) errs.push('нет поля ' + k);
  if (d.slug !== slug) errs.push('slug не совпадает с именем файла');
  const contrast = {};
  for (const mode of ['light','dark']) { const c = d.tokens?.color?.[mode] || {};
    for (const k of KEYS) if (!hex(c[k])) errs.push(`${mode}.${k}: нет или не hex`);
    for (const [fg, bg, min] of PAIRS) { const r = ratio(c[fg], c[bg]); contrast[`${mode}:${fg}/${bg}`] = +r.toFixed(2); if (r < min) errs.push(`контраст ${mode} ${fg}/${bg} = ${r.toFixed(2)} < ${min}`); }
    // Дополнительные пары: on_X[_muted] на X и подпись кнопки в hover/active. Неактивные (disabled) WCAG 1.4.3 не требует.
    for (const k of Object.keys(c)) { if (!k.startsWith('on_') || /disabled/.test(k) || k === 'on_primary' || k === 'on_accent') continue;
      let base = k.slice(3); if (!(base in c)) base = base.replace(/_muted$/, ''); if (!(base in c)) base = base.replace(/_hover$/, '');
      if (hex(c[base]) && hex(c[k])) { const r = ratio(c[k], c[base]); if (r < 4.5) errs.push(`контраст ${mode} ${k}/${base} = ${r.toFixed(2)} < 4.5`); } }
    for (const st of ['hover', 'active']) { const bg = c['primary_' + st]; const fg = c['on_primary_' + st] || c.on_primary;
      if (hex(bg) && hex(fg)) { const r = ratio(fg, bg); if (r < 4.5) errs.push(`контраст ${mode} подпись кнопки на primary_${st} = ${r.toFixed(2)} < 4.5`); } } }
  for (const t of ['display','h2','h3','body','caption']) if (!d.tokens?.typography?.[t]?.family) errs.push('typography.' + t + ' без family');
  for (const fo of d.fonts || []) { const m = await font(fo.fontsource);
    if (!m) { errs.push(`шрифт ${fo.fontsource}: нет в Fontsource`); continue; }
    if (!m.subsets.includes('cyrillic')) errs.push(`шрифт ${fo.family}: НЕТ кириллицы`);
    if (!['OFL-1.1','Apache-2.0','OFL'].includes(m.license)) errs.push(`шрифт ${fo.family}: лицензия ${m.license}`);
    for (const w of fo.weights || []) if (!m.weights.includes(w)) errs.push(`шрифт ${fo.family}: нет начертания ${w}`); }
  const fams = new Set((d.fonts || []).map(x => x.family)); for (const t of Object.values(d.tokens?.typography || {})) if (t.family && !fams.has(t.family)) errs.push(`typography использует ${t.family}, которого нет в fonts`);
  for (const m of d.motion_recipes || []) { used.add(m); if (motionSlugs.length && !motionSlugs.includes(m)) errs.push('motion_recipes: нет рецепта ' + m); }
  const META = ['levels', 'speed', 'not_for_this_style'];
  if (!d.motion_map || typeof d.motion_map !== 'object' || Array.isArray(d.motion_map)) errs.push('нет motion_map');
  else { for (const m of d.motion_recipes || []) if (!d.motion_map[m]) errs.push('motion_map: нет записи для ' + m);
    for (const k of Object.keys(d.motion_map)) if (!META.includes(k) && !(d.motion_recipes || []).includes(k)) errs.push('motion_map: ключ ' + k + ' не из motion_recipes'); }
  const ab = d.ab_axes || {};
  for (const k of Object.keys(ab)) if (!['vary', 'fixed', 'default', 'legend', 'notes'].includes(k)) errs.push('ab_axes: лишний ключ ' + k + ' (пояснения — в legend/notes)');
  for (const [axis, vals] of Object.entries(ab.vary || {})) { if (!Array.isArray(vals) || vals.length < 2) errs.push('ab_axes.vary.' + axis + ': нужно ≥ 2 значения');
    if (!ab.default || !(axis in ab.default)) errs.push('ab_axes.default: нет оси ' + axis); else if (!vals.includes(ab.default[axis])) errs.push(`ab_axes.default.${axis} = ${ab.default[axis]}: нет в vary`); }
  for (const axis of Object.keys(ab.default || {})) if (!(axis in (ab.vary || {}))) errs.push('ab_axes.default: лишняя ось ' + axis);
  if (ab.legend !== undefined && (typeof ab.legend !== 'object' || Array.isArray(ab.legend))) errs.push('ab_axes.legend должен быть объектом');
  if (ab.notes !== undefined && typeof ab.notes !== 'string') errs.push('ab_axes.notes должен быть строкой');
  const MEDIA = ['hero', 'video_in_flow', 'imagery', 'character', 'audio', 'avoid'];
  if (!d.media || typeof d.media !== 'object') errs.push('нет media (как бренд ставит кадр первого экрана, видео, персонажа, аудио)');
  else { for (const k of MEDIA) if (!d.media[k] || (k === 'avoid' ? !Array.isArray(d.media[k]) || !d.media[k].length : typeof d.media[k] !== 'string')) errs.push('media.' + k + ': пусто или не того типа'); }
  // Необязательные поля 1.2.0: если есть — должны быть правильной формы.
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  if (d.media?.geometry !== undefined && !isObj(d.media.geometry)) errs.push('media.geometry должен быть объектом «место → пропорция»');
  if (d.states !== undefined) { if (!isObj(d.states?.button) || !isObj(d.states?.input)) errs.push('states: нужны объекты button и input');
    else { for (const s of ['hover', 'focus_visible', 'disabled']) if (!d.states.button[s]) errs.push('states.button.' + s + ': пусто');
      for (const s of ['focus', 'error']) if (!d.states.input[s]) errs.push('states.input.' + s + ': пусто'); } }
  if (d.signature !== undefined && (!Array.isArray(d.signature) || d.signature.length < 2 || d.signature.length > 4 || d.signature.some(x => typeof x !== 'string'))) errs.push('signature: 2–4 строки');
  if (d.voice !== undefined && !(typeof d.voice === 'string' ? d.voice.trim() : isObj(d.voice) && typeof d.voice.tone === 'string')) errs.push('voice: строка или объект с tone');
  if (d.type_features !== undefined && !isObj(d.type_features)) errs.push('type_features должен быть объектом');
  const words = (d.prompt_snippet || '').trim().split(/\s+/).filter(Boolean).length; if (words < 80 || words > 150) errs.push(`prompt_snippet: ${words} слов, нужно 80–150`);
  if ((d.summary || '').length > 400) errs.push('summary длиннее 400');
  for (const k of ['do','dont']) if (!Array.isArray(d[k]) || d[k].length < 4 || d[k].length > 7) errs.push(k + ': нужно 4–7 пунктов');
  report[slug] = errs.length ? errs : ['OK ' + JSON.stringify(contrast)]; if (errs.length) bad++;
}
for (const f of motionSlugs) { if (only.length && !only.includes(f)) continue; const errs = []; let d;
  try { d = JSON.parse(fs.readFileSync(path.join(motionDir, f + '.json'), 'utf8')); } catch (e) { report['motion/' + f] = ['JSON: ' + e.message]; bad++; continue; }
  for (const k of ['slug','name','category','purpose','use_for','reduced_motion','reduced_motion_note','lcp_risk','cls_safe','duration','easing','budget','html','css','js','a11y','perf','source']) if (d[k] === undefined) errs.push('нет поля ' + k);
  if (!/prefers-reduced-motion/.test(d.css || '')) errs.push('css без prefers-reduced-motion');
  if (/https?:\/\//.test((d.css || '') + (d.js || '') + (d.html || ''))) errs.push('внешние ссылки в коде');
  const anim = (d.css || '').match(/transition(-property)?\s*:[^;]+|@keyframes[^{]+\{[\s\S]*?\}\s*\}/g) || [];
  for (const a of anim) if (/\b(width|height|top|left|right|bottom|margin|padding)\b\s*[:,]/.test(a.replace(/transition[^:]*:/, ''))) errs.push('анимируется свойство раскладки: ' + a.slice(0, 60));
  if (/infinite/.test(d.css || '') && !/(animation-play-state|pause)/i.test((d.css || '') + (d.js || '') + (d.a11y || ''))) errs.push('бесконечная анимация без паузы (WCAG 2.2.2)');
  if (!only.length && !used.has(f)) errs.push('рецепт не использует ни одна дизайн-система');
  report['motion/' + f] = errs.length ? errs : ['OK']; if (errs.length) bad++; }
// catalog.json обязан совпадать со свежей сборкой (tools/build-index.mjs)
if (!only.length && fs.existsSync(path.join(root, 'tools', 'build-index.mjs'))) {
  const { buildIndex } = await import(new URL('./build-index.mjs', import.meta.url));
  const fresh = JSON.stringify(buildIndex(root)); const file = path.join(root, 'catalog.json');
  const cur = fs.existsSync(file) ? JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8'))) : null;
  report['catalog.json'] = cur === fresh ? ['OK'] : ['устарел или отсутствует: node tools/build-index.mjs .']; if (cur !== fresh) bad++;
}
console.log(JSON.stringify(report, null, 1)); process.exit(bad ? 1 : 0);
