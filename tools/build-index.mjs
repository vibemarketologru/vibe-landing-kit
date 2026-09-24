// Сборка catalog.json каталога: node tools/build-index.mjs <каталог>
// Сводка для выбора без чтения всех файлов. Руками catalog.json не правится — check.mjs сверяет его со свежей сборкой.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';

const KIND_ORDER = ['style', 'brand'];   // собственные стили первыми: их можно брать без оглядки на чужой бренд
const CAT_ORDER = ['entrance', 'text', 'scroll', 'hover', 'feedback', 'ambient', 'loading'];
const readDir = dir => (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => f.endsWith('.json')).sort()
  .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

export function buildIndex(root) {
  const version = '1.2.2';
  const design_systems = readDir(path.join(root, 'design-systems'))
    .sort((a, b) => (KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)) || a.slug.localeCompare(b.slug))
    .map(d => ({ slug: d.slug, name: d.name, kind: d.kind, summary: d.summary, best_for: d.best_for, goals: d.goals, mood: d.mood }));
  const motion = readDir(path.join(root, 'motion'))
    .sort((a, b) => (CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category)) || a.slug.localeCompare(b.slug))
    .map(m => ({ slug: m.slug, name: m.name, category: m.category, reduced_motion: m.reduced_motion, lcp_risk: m.lcp_risk, use_for: m.use_for }));
  return { version, design_systems, motion };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || '.');
  const index = buildIndex(root);
  fs.writeFileSync(path.join(root, 'catalog.json'), JSON.stringify(index, null, 2) + '\n');
  console.log(`catalog.json: ${index.design_systems.length} дизайн-систем, ${index.motion.length} анимаций`);
}
