#!/usr/bin/env node
// Офлайн-паспорт лендинга: можно ли пускать на страницу рекламный трафик.
//
//   node tools/passport.mjs index.html [b.html] [--json] [--static] [--all]
//                           [--allow=mc.yandex.ru,…] [--shots=папка] [--root=папка] [--chrome=путь]
//
// Те же проверки, что у серверного паспорта `landing_check` (разметка + настоящий браузер
// на 1280×900, 390×844, 360×740), плюс 320×640, ландшафт 844×390 и мобильные проверки:
// поля 16 px, зоны касания 44×44, масштаб не запрещён, фон корня, видео muted+playsinline+poster.
// Код выхода 1 — есть блокирующие проблемы, 2 — ошибка запуска.
//
// Нужен только Playwright: `npm i -D playwright && npx playwright install chromium`
// (или установленный Google Chrome — найдётся сам, либо --chrome=путь). Без браузера — `--static`.
// Страница открывается с локального сервера Node; в интернет она не ходит: все внешние
// запросы перехватываются и попадают в отчёт. Ссылки `vm-gen:ID` (медиа Вайб-Маркетолога)
// раскрываются только при запуске — здесь вместо них серая заглушка того же размера.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const HTML_MAX_BYTES = 1_500_000;
const MIN_RATIO = 2.6;        // ниже этого контраста текст нечитаем (как у серверного паспорта)
const TAP_MIN = 44;           // Apple HIG 44 pt; WCAG 2.5.8 — минимум 24
const WEIGHT_WARN = 5 * 1024 * 1024;
const VIEWS = [
  { key: 'desktop', w: 1280, h: 900, mobile: false },
  { key: 'mobile', w: 390, h: 844, mobile: true, os: 'ios' },
  { key: 'small', w: 360, h: 740, mobile: true, os: 'android' },
  { key: 'tiny', w: 320, h: 640, mobile: true, os: 'android' },
  { key: 'landscape', w: 844, h: 390, mobile: true, os: 'ios' },
];
const UA = {
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1',
  android: 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36',
};
const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.vtt': 'text/vtt', '.txt': 'text/plain; charset=utf-8',
};

// ---------- аргументы ----------
const argv = process.argv.slice(2);
const opt = { json: false, static: false, all: false, allow: [], shots: null, root: null, chrome: null };
const files = [];
for (const a of argv) {
  if (a === '--json') opt.json = true;
  else if (a === '--static') opt.static = true;
  else if (a === '--all') opt.all = true;
  else if (a.startsWith('--allow=')) opt.allow = a.slice(8).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  else if (a.startsWith('--shots=')) opt.shots = path.resolve(a.slice(8));
  else if (a.startsWith('--root=')) opt.root = path.resolve(a.slice(7));
  else if (a.startsWith('--chrome=')) opt.chrome = a.slice(9);
  else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
  else if (a.startsWith('--')) { console.error('Неизвестный ключ ' + a); usage(); process.exit(2); }
  else files.push(path.resolve(a));
}
if (!files.length || files.length > 2) { usage(); process.exit(2); }
for (const f of files) if (!fs.existsSync(f)) { console.error('Нет файла ' + f); process.exit(2); }
function usage() {
  console.error('Паспорт лендинга: node tools/passport.mjs путь/к/index.html [путь/к/b.html] [--json] [--static] [--all] [--allow=host,…] [--shots=папка] [--root=папка] [--chrome=путь]');
}

// ---------- разметка ----------
const plural = (n, one, few, many) => { const a = Math.abs(n) % 100, b = a % 10; return n + ' ' + (a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many); };
const hostOf = u => { const m = /^(?:https?:)?\/\/([^/:?#\s"']+)/i.exec(String(u).trim()); return m ? m[1].toLowerCase() : null; };
const allowed = h => !h || opt.allow.some(a => h === a || h.endsWith('.' + a));
// Хосты, которые разрешает серверный паспорт (страница живёт на площадке сервиса). Офлайн они
// не блокируют запуск, но попадают в предупреждения: на своём хостинге это ваша зависимость.
const SERVICE_HOSTS = ['lk.vibemarketolog.ru', 'vibemarketolog.ru', 'mc.yandex.ru', 'yastatic.net'];
const serviceHost = h => !!h && SERVICE_HOSTS.some(a => h === a || h.endsWith('.' + a));
const attr = (tag, name) => { const m = new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i').exec(tag); return m ? (m[1] ?? m[2] ?? m[3]) : null; };

// Внешние ссылки страницы: [вид, хост, адрес]. Вид — script|style|font|media|embed.
function externalRefs(html) {
  const refs = [];
  const push = (kind, u) => { const h = hostOf(u); if (h) refs.push([kind, h, u]); };
  for (const m of html.matchAll(/<script[^>]+src\s*=\s*["']?([^"'\s>]+)/gi)) push('script', m[1]);
  for (const m of html.matchAll(/<link[^>]+>/gi)) {
    const tag = m[0];
    if (/rel\s*=\s*["']?(?:stylesheet|preload|modulepreload)/i.test(tag)) { const href = attr(tag, 'href'); if (href) push(/font/i.test(tag) ? 'font' : 'style', href); }
  }
  for (const m of html.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s;]+)/gi)) push('style', m[1]);
  for (const face of html.match(/@font-face\s*\{[^}]*\}/gi) || []) for (const m of face.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) push('font', m[1]);
  for (const m of html.matchAll(/<(?:img|video|source|audio)[^>]+(?:src|poster)\s*=\s*["']?([^"'\s>]+)/gi)) push('media', m[1]);
  for (const m of html.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) for (const part of m[1].split(',')) push('media', part.trim().split(/\s+/)[0]);
  for (const m of html.matchAll(/<iframe[^>]+src\s*=\s*["']?([^"'\s>]+)/gi)) push('embed', m[1]);
  return refs;
}

// Свои CSS и JS рядом со страницей — для проверок по тексту (анимации, @font-face, safe-area).
function localAssetsText(html, dir) {
  let out = '';
  const read = u => {
    if (!u || hostOf(u) || /^(data|blob|javascript):/i.test(u)) return;
    const f = path.resolve(dir, decodeURIComponent(u.split(/[?#]/)[0]));
    try { if (fs.statSync(f).isFile()) out += '\n' + fs.readFileSync(f, 'utf8'); } catch { /* нет файла — не наша проверка */ }
  };
  for (const m of html.matchAll(/<link[^>]+>/gi)) if (/rel\s*=\s*["']?stylesheet/i.test(m[0])) read(attr(m[0], 'href'));
  for (const m of html.matchAll(/<script[^>]+src\s*=\s*["']?([^"'\s>]+)/gi)) read(m[1]);
  return out;
}

function staticChecks(html, extra) {
  const out = [];
  const add = (key, title, status, detail = '') => out.push({ key, title, status, detail });
  const lower = (html + extra).toLowerCase();

  const bytes = Buffer.byteLength(html);
  add('size', 'Размер страницы', bytes <= HTML_MAX_BYTES ? 'pass' : 'fail',
    Math.max(1, Math.round(bytes / 1024)) + ' КБ' + (bytes > HTML_MAX_BYTES ? ' — больше 1,5 МБ: картинки и шрифты выносите файлами, а не base64 в разметке' : ''));

  const danger = [];
  if (/<input[^>]+type\s*=\s*["']?password/i.test(html)) danger.push('поле пароля');
  if (/autocomplete\s*=\s*["']?cc-/i.test(html) || /<input[^>]+(?:name|id)\s*=\s*["'][^"']*(?:card.?num|cardnumber|cvv|cvc|card_?code|pan\b)/i.test(html)) danger.push('поле банковской карты');
  add('safety', 'Безопасность формы', danger.length ? 'fail' : 'pass',
    danger.length ? 'на странице есть ' + danger.join(' и ') + ' — рекламный лендинг не собирает пароли и карты. Оплату ведите через кассу, вход — на своём сайте' : 'нет полей пароля и карты');

  const vm = [...new Set([...html.matchAll(/vm-gen:(\d+)/g)].map(m => m[1]))];
  add('media_refs', 'Медиа сервиса', vm.length ? 'warn' : 'pass',
    vm.length ? 'vm-gen:' + vm.slice(0, 6).join(', vm-gen:') + (vm.length > 6 ? ` и ещё ${vm.length - 6}` : '') + ' — медиа Вайб-Маркетолога, раскроется в постоянную ссылку при запуске (landing_launch). В проверке раскладки вместо них серая заглушка того же размера; на своём хостинге замените на файлы' : 'нет нераскрытых vm-gen:ID');

  const vpTag = (html.match(/<meta[^>]+name\s*=\s*["']?viewport[^>]*>/i) || [null])[0];
  add('viewport', 'Мобильная вёрстка', vpTag ? 'pass' : 'fail',
    vpTag ? 'есть meta viewport' : 'нет <meta name="viewport" content="width=device-width, initial-scale=1"> — на телефоне страница будет крошечной');
  if (vpTag) {
    const c = (attr(vpTag, 'content') || '').toLowerCase().replace(/\s+/g, '');
    const probs = [];
    if (!/width=device-width/.test(c)) probs.push('нет width=device-width');
    if (!/initial-scale=1(\.0+)?(,|$)/.test(c)) probs.push('нет initial-scale=1 — при любом вылезающем блоке Chrome уменьшит всю страницу');
    if (/user-scalable=(no|0)/.test(c)) probs.push('user-scalable=no запрещает увеличивать страницу пальцами');
    const ms = /maximum-scale=([\d.]+)/.exec(c); if (ms && parseFloat(ms[1]) < 2) probs.push(`maximum-scale=${ms[1]} не даёт увеличить страницу (нужно ≥ 2, WCAG 1.4.4)`);
    if (/env\(\s*safe-area-inset/.test(lower) && !/viewport-fit=cover/.test(c)) probs.push('в стилях есть env(safe-area-inset-*), но без viewport-fit=cover на iPhone они равны нулю');
    add('viewport_mobile', 'Масштаб на телефоне', probs.length ? 'warn' : 'pass', probs.length ? probs.join('; ') : 'width=device-width, initial-scale=1, увеличение не запрещено');
  }

  add('lang', 'Язык страницы', /<html[^>]+lang\s*=/i.test(html) ? 'pass' : 'warn',
    /<html[^>]+lang\s*=/i.test(html) ? 'указан' : 'добавьте <html lang="ru"> — от этого зависят переносы и озвучка экранным диктором');
  const hasTitle = /<title>\s*[^<\s][^<]*<\/title>/i.test(html);
  add('title', 'Заголовок во вкладке', hasTitle ? 'pass' : 'warn', hasTitle ? 'есть <title>' : 'нет <title> — во вкладке и в поиске будет адрес вместо названия');
  const h1 = (html.match(/<h1\b/gi) || []).length;
  add('h1', 'Главный заголовок H1', h1 === 1 ? 'pass' : 'warn',
    h1 === 1 ? 'один H1' : h1 === 0 ? 'нет H1 — коммерческая фраза из семантики должна быть в нём' : plural(h1, 'заголовок', 'заголовка', 'заголовков') + ' H1 — оставьте один');

  let contactForm = false, consent = false, preChecked = false;
  for (const form of html.match(/<form\b[\s\S]*?<\/form>/gi) || []) {
    const hasContact = /<input[^>]+type\s*=\s*["']?(?:tel|email)/i.test(form)
      || /<input[^>]+name\s*=\s*["'][^"']*(?:phone|tel|email|mail|телефон|почта|contact|whatsapp)/iu.test(form);
    if (!hasContact) continue;
    contactForm = true;
    if (/type\s*=\s*["']?checkbox/i.test(form) && /(?:consent|agree|privacy|personal|152|согла|персональн|политик)/iu.test(form)) consent = true;
    for (const m of form.matchAll(/<input[^>]*type\s*=\s*["']?checkbox[^>]*>/gi)) if (/\schecked\b/i.test(m[0]) && /(?:consent|agree|privacy|personal|согла)/iu.test(m[0])) preChecked = true;
  }
  add('lead_form', 'Форма заявки', contactForm ? 'pass' : 'fail',
    contactForm ? 'есть поле телефона или почты' : 'нет формы с телефоном или почтой: лендинг без заявок не проверяет гипотезу');
  if (contactForm) {
    add('consent', 'Согласие на обработку данных (152-ФЗ)', consent ? 'pass' : 'fail',
      consent ? 'в форме есть галочка согласия' : 'добавьте в форму <label><input type="checkbox" name="consent" required> Согласен на обработку персональных данных</label>; галочку не ставить заранее');
    if (preChecked) add('consent_prechecked', 'Галочка согласия', 'warn', 'отмечена заранее — согласие должно быть действием человека (152-ФЗ, ст. 9: «конкретным, информированным, сознательным»), уберите checked');
  }
  const privacy = /<a[^>]+href[^>]*>[^<]*(?:политик|конфиденциальн|персональн)/iu.test(html);
  add('privacy', 'Политика конфиденциальности', privacy ? 'pass' : 'warn',
    privacy ? 'ссылка есть' : 'нет ссылки на политику обработки данных рядом с формой — Директ и ВК Реклама могут отклонить объявление');

  const refs = externalRefs(html);
  const bad = {}, svc = {};
  const kindRu = k => (k === 'font' ? 'шрифт' : k === 'style' ? 'стили' : 'скрипт');
  for (const [kind, h] of refs) if (kind !== 'media' && kind !== 'embed' && !allowed(h)) (serviceHost(h) ? svc : bad)[h] = kind;
  add('no_cdn', 'Без внешних CDN', Object.keys(bad).length ? 'fail' : 'pass',
    Object.keys(bad).length ? 'подключено с чужих серверов: ' + Object.entries(bad).map(([h, k]) => `${h} (${kindRu(k)})`).join(', ') + '. В мобильных сетях РФ и под защитой страницы они не загрузятся — положите файлы рядом со страницей. Свой счётчик разрешите явно: --allow=mc.yandex.ru' : 'скрипты, стили и шрифты свои');
  if (Object.keys(svc).length) add('service_scripts', 'Скрипты сервиса', 'warn',
    Object.entries(svc).map(([h, k]) => `${h} (${kindRu(k)})`).join(', ') + ' — на площадке Вайб-Маркетолога (landing_launch) это разрешено: виджет чат-бота, Метрика. На своём хостинге это внешняя зависимость: оставьте, если так задумано (--allow=' + Object.keys(svc)[0] + ' уберёт предупреждение)');
  const media = {};
  let temp = false;
  for (const [kind, h, u] of refs) if ((kind === 'media' || kind === 'embed') && !allowed(h)) { media[h] = true; if (/[?&](expires|signature|x-amz-expires)=/i.test(u)) temp = true; }
  add('own_media', 'Медиа на своих адресах', Object.keys(media).length ? 'warn' : 'pass',
    Object.keys(media).length ? 'картинки, видео или встраивания с чужих серверов (' + Object.keys(media).slice(0, 4).join(', ') + ')' + (temp ? ' — среди них временные подписанные ссылки, они перестанут открываться' : ' — ссылка может умереть, а на мобильном это лишнее соединение') + '; положите файлы рядом со страницей' : 'картинки и видео свои');

  const animated = lower.includes('@keyframes') || /(?:animation|transition)\s*:/.test(lower) || lower.includes('animate(');
  if (animated) {
    const rm = lower.includes('prefers-reduced-motion');
    add('reduced_motion', 'Анимации и prefers-reduced-motion', rm ? 'pass' : 'warn',
      rm ? 'учтён режим «меньше движения»' : 'анимации есть, а режима @media (prefers-reduced-motion: reduce) нет — людям с вестибулярными нарушениями станет плохо');
  }

  // Мобильные проверки по тексту разметки
  const phoneProbs = [];
  for (const m of html.matchAll(/<input\b[^>]*>/gi)) {
    const tag = m[0], type = (attr(tag, 'type') || 'text').toLowerCase(), name = (attr(tag, 'name') || attr(tag, 'id') || '').toLowerCase();
    const isPhone = type === 'tel' || /phone|tel|телефон/.test(name);
    if (!isPhone) continue;
    if (type === 'number') phoneProbs.push(`«${name}»: type="number" съедает +, пробелы и скобки — нужен type="tel"`);
    else if (type !== 'tel' && !/inputmode\s*=\s*["']?tel/i.test(tag)) phoneProbs.push(`«${name}»: нет type="tel" — на телефоне откроется буквенная клавиатура`);
    if (!/autocomplete\s*=\s*["']?tel/i.test(tag)) phoneProbs.push(`«${name || type}»: нет autocomplete="tel" — браузер не подставит номер одним касанием`);
    const id = attr(tag, 'id');
    const labelled = attr(tag, 'aria-label') || attr(tag, 'aria-labelledby') || (id && new RegExp('<label[^>]+for\\s*=\\s*["\']?' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'\\s>]', 'i').test(html))
      || new RegExp('<label\\b(?:(?!</label>)[\\s\\S])*' + tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(html);
    if (!labelled) phoneProbs.push(`«${name || type}»: нет подписи <label> — плейсхолдер исчезает при вводе, экранный диктор поле не назовёт`);
  }
  if (phoneProbs.length) add('phone_field', 'Поле телефона', 'warn', phoneProbs.join('; '));
  else if (/<input[^>]+type\s*=\s*["']?tel/i.test(html)) add('phone_field', 'Поле телефона', 'pass', 'type="tel", autocomplete="tel", есть подпись');

  const tme = [...new Set([...html.matchAll(/https?:\/\/t\.me\/[^"'\s<>]+/gi)].map(m => m[0]))];
  if (tme.length) add('telegram_links', 'Ссылки на Telegram', 'warn', tme.slice(0, 3).join(', ') + ' — короткий адрес t.me у части российских операторов бывает недоступен; используйте https://telegram.me/…');

  const faces = (html + extra).match(/@font-face\s*\{[^}]*\}/gi) || [];
  // @font-face только с local() — запасной шрифт с поправкой метрик, font-display ему не нужен
  const noDisplay = faces.filter(f => !/font-display\s*:/i.test(f) && /url\(/i.test(f)).length;
  if (faces.length) add('font_display', 'Шрифты: font-display', noDisplay ? 'warn' : 'pass',
    noDisplay ? `${noDisplay} из ${faces.length} @font-face без font-display — на медленной сети текст невидим до загрузки шрифта; добавьте font-display: swap` : 'у всех @font-face есть font-display');
  if (/text-size-adjust\s*:\s*none/i.test(html + extra)) add('text_size_adjust', 'text-size-adjust', 'warn', '-webkit-text-size-adjust: none мешает людям увеличивать текст; ставьте 100%');

  return out;
}

// ---------- локальный сервер ----------
function startServer(root, files) {
  const bytesBy = {};
  const rewriteVm = text => text
    .replace(/<[a-z][^>]*vm-gen:\d+[^>]*>/gi, tag => {
      const w = attr(tag, 'width'), h = attr(tag, 'height');
      return tag.replace(/vm-gen:(\d+)/g, (_, id) => `/__vm-gen/${id}${/^\d+$/.test(w || '') && /^\d+$/.test(h || '') ? `.${w}x${h}` : ''}.svg`);
    })
    .replace(/vm-gen:(\d+)/g, '/__vm-gen/$1.svg');
  const server = http.createServer((req, res) => {
    const view = req.headers['x-passport-view'] || 'other';
    const count = n => { bytesBy[view] = (bytesBy[view] || 0) + n; };
    let url;
    try { url = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
    const vm = /^\/__vm-gen\/(\d+)(?:\.(\d+)x(\d+))?\.svg$/.exec(url);
    if (vm) {
      const dest = req.headers['sec-fetch-dest'];
      if (dest === 'video' || dest === 'audio' || dest === 'track') { res.writeHead(404); return res.end(); }
      const w = +vm[2] || 1600, h = +vm[3] || 900;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b7280"/><stop offset="1" stop-color="#374151"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="#e5e7eb" font-family="sans-serif" font-size="${Math.round(Math.min(w, h) / 12)}" text-anchor="middle" dominant-baseline="middle">vm-gen:${vm[1]}</text></svg>`;
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' });
      return res.end(svg);
    }
    const file = path.join(root, url);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    let st;
    try { st = fs.statSync(file); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    const ext = path.extname(file).toLowerCase(), type = MIME[ext] || 'application/octet-stream';
    if (ext === '.html' || ext === '.htm' || ext === '.css') {
      const body = Buffer.from(rewriteVm(fs.readFileSync(file, 'utf8')));
      count(body.length);
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : body);
    }
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m && st.size) {
      const s = m[1] ? +m[1] : Math.max(0, st.size - +m[2]), e = m[1] && m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
      if (s > e || s >= st.size) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
      count(e - s + 1);
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${s}-${e}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': e - s + 1 });
      return req.method === 'HEAD' ? res.end() : fs.createReadStream(file, { start: s, end: e }).pipe(res);
    }
    count(st.size);
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}`, bytesBy }));
  });
}

// ---------- браузер ----------
async function loadPlaywright() {
  const names = [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core', '@playwright/test'].filter(Boolean);
  const req = createRequire(path.join(process.cwd(), 'passport.cjs'));
  for (const name of names) {
    for (const load of [() => import(name), () => import(pathToFileURL(req.resolve(name)).href)]) {
      try { const m = await load(); const pw = m.chromium ? m : m.default; if (pw && pw.chromium) return pw; } catch { /* следующий способ */ }
    }
  }
  return null;
}
async function launchBrowser(pw) {
  const errs = [];
  const exe = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'].filter(p => fs.existsSync(p));
  const tries = [opt.chrome && { executablePath: opt.chrome }, {}, { channel: 'chrome' }, ...exe.map(p => ({ executablePath: p }))].filter(Boolean);
  for (const t of tries) {
    try { return await pw.chromium.launch({ ...t, args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'] }); } catch (e) { errs.push(String(e.message).split('\n')[0]); }
  }
  throw new Error(errs[0] || 'браузер не запустился');
}

// Замер первого экрана — в странице (логика серверного паспорта + мобильные признаки)
function probeTop() {
  const de = document.documentElement, W = de.clientWidth, H = innerHeight, out = {};
  out.clientWidth = W; out.scale = window.visualViewport ? visualViewport.scale : 1;
  out.hscroll = Math.max(0, Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0) - W);
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  if (out.hscroll > 1) {
    const clipped = el => { for (let n = el.parentElement; n && n !== document.body && n !== de; n = n.parentElement) { const s = getComputedStyle(n); if (s.overflowX !== 'visible') return true; } return false; };
    const wide = [];
    document.body.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.width > 0 && r.right > W + 1 && !clipped(el)) wide.push([el, r.right]); });
    // виновник — самый внешний из вылезающих: его потомки вылезают вместе с ним
    const roots = wide.filter(([el]) => !wide.some(([o]) => o !== el && o.contains(el)));
    out.wide = roots.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([el, r]) => desc(el) + ' (до ' + Math.round(r) + ' px)');
  }
  const vis = el => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.1) return null; const r = el.getBoundingClientRect(); if (r.width < 40 || r.height < 28) return null; if (r.top >= H - 10 || r.bottom <= 0 || r.left >= W || r.right <= 0) return null; return r; };
  let cta = null;
  Array.prototype.some.call(document.querySelectorAll('button,input[type=submit],a[href]'), el => {
    const r = vis(el); if (!r) return false; const s = getComputedStyle(el), tag = el.tagName;
    const t = (el.innerText || el.value || '').trim(); if (!t || t.length > 60) return false;
    const bg = (s.backgroundColor || '').match(/rgba?\(([^)]+)\)/), alpha = bg ? (bg[1].split(',')[3] === undefined ? 1 : parseFloat(bg[1].split(',')[3])) : 0;
    const looks = tag === 'BUTTON' || tag === 'INPUT' || alpha > 0.5 || (parseFloat(s.borderTopWidth) >= 1 && parseFloat(s.paddingLeft) >= 10);
    if (!looks) return false; if (el.closest('nav') && tag === 'A' && alpha <= 0.5) return false; cta = t; return true;
  });
  out.cta = cta;
  let hero = null;
  document.querySelectorAll('img,video,picture,section,header,div,figure').forEach(el => {
    if (hero) return; const r = el.getBoundingClientRect(); if (r.top > H * 0.35 || r.bottom < H * 0.5) return; if (r.width < W * 0.9 || r.height < H * 0.5) return;
    const s = getComputedStyle(el), tag = el.tagName;
    if (tag === 'IMG' && el.naturalWidth > 0) hero = 'картинка ' + Math.round(r.width) + '×' + Math.round(r.height) + ' на первом экране';
    else if (tag === 'VIDEO') hero = 'видео ' + Math.round(r.width) + '×' + Math.round(r.height) + ' на первом экране';
    else if (s.backgroundImage && /url\(/.test(s.backgroundImage)) hero = 'фон-картинка ' + Math.round(r.width) + '×' + Math.round(r.height) + ' на первом экране';
  });
  out.hero = hero;
  const bgOf = el => getComputedStyle(el).backgroundColor;
  out.rootBg = [bgOf(de), document.body ? bgOf(document.body) : ''];
  // iOS 26 красит панели Safari по fixed/sticky-слоям у края, в том числе невидимым
  out.ghostEdge = [];
  document.querySelectorAll('body *').forEach(el => {
    const s = getComputedStyle(el); if (s.position !== 'fixed' && s.position !== 'sticky') return; if (s.display === 'none') return;
    const r = el.getBoundingClientRect(); if (r.width < W * 0.5 || r.height < 1) return;
    const edge = (r.top <= 4 && r.bottom > 0) || (r.bottom >= H - 4 && r.top < H); if (!edge) return;
    let op = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity);
    if (op < 0.05 || s.visibility === 'hidden') out.ghostEdge.push(desc(el));
  });
  // самая крупная картинка первого экрана (кандидат на LCP)
  let big = null, area = 0;
  document.querySelectorAll('img').forEach(img => { const r = img.getBoundingClientRect(); const vis2 = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)); if (vis2 > area) { area = vis2; big = img; } });
  out.lcpLazy = big && area > W * H * 0.15 && big.loading === 'lazy' ? (big.getAttribute('src') || '').slice(0, 80) : null;
  out.fixedBottom = [...document.querySelectorAll('body *')].some(el => { const s = getComputedStyle(el); if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.bottom >= H - 4 && r.top < H && r.width > W * 0.5; });
  return out;
}

// Прогон страницы до конца (для ленивых блоков), потом проверки всей страницы
async function scrollThrough() {
  const step = Math.max(200, innerHeight * 0.8), total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)); }
  window.scrollTo({ top: 0, behavior: 'instant' });
  await new Promise(r => setTimeout(r, 250));
}

function probeFull(isMobile) {
  const de = document.documentElement, W = de.clientWidth, out = {};
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const shown = el => { if (el.closest('[hidden]')) return false; const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden'; };
  let tiny = 0;
  document.querySelectorAll('p,li').forEach(el => { const r = el.getBoundingClientRect(); if (r.width < 1 || (el.innerText || '').trim().length < 30) return; if (parseFloat(getComputedStyle(el).fontSize) < 14) tiny++; });
  out.tiny = tiny;
  // поля мельче 16 px — iOS увеличивает страницу при фокусе
  out.smallInputs = [];
  document.querySelectorAll('input,select,textarea').forEach(el => {
    if (/^(hidden|checkbox|radio|submit|button|reset|image|range|color|file)$/i.test(el.type || '') || !shown(el)) return;
    const r = el.getBoundingClientRect(); if (r.width < 1) return;
    const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 16) out.smallInputs.push((el.name || el.id || el.type) + ' ' + fs + ' px');
  });
  // зоны касания (ссылки внутри текста не считаем — исключение WCAG 2.5.8 «в строке текста»)
  const small = [];
  document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button]').forEach(el => {
    if (!shown(el) || el.disabled || (el.getAttribute('tabindex') === '-1' && el.getAttribute('aria-hidden') === 'true')) return;
    const s = getComputedStyle(el); let r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
    if (s.display === 'inline') { const p = el.parentElement; const pt = (p && p.textContent || '').replace(/\s+/g, ' ').trim(), own = (el.textContent || '').replace(/\s+/g, ' ').trim(); if (pt.length > own.length + 3) return; }
    if (/^(checkbox|radio)$/i.test(el.type || '') && el.labels && el.labels[0]) { const l = el.labels[0].getBoundingClientRect(); r = { width: Math.max(r.right, l.right) - Math.min(r.left, l.left), height: Math.max(r.bottom, l.bottom) - Math.min(r.top, l.top) }; }
    if (r.width < 44 || r.height < 44) small.push({ d: (el.innerText || el.getAttribute('aria-label') || (el.name ? 'поле ' + el.name : '') || el.value || desc(el)).trim().replace(/\s+/g, ' ').slice(0, 28), w: Math.round(r.width), h: Math.round(r.height) });
  });
  out.smallTaps = small;
  // картинки без размеров — страница прыгает при загрузке
  out.noDims = [];
  document.querySelectorAll('img').forEach(img => {
    if (img.hasAttribute('width') && img.hasAttribute('height')) return; const s = getComputedStyle(img);
    if (s.position === 'absolute' || s.position === 'fixed' || s.display === 'none') return; if (s.aspectRatio && s.aspectRatio !== 'auto') return;
    out.noDims.push((img.getAttribute('src') || '').split('/').pop().slice(0, 40));
  });
  // видео: автозапуск на iOS только с muted + playsinline; постер — смысл до загрузки и при энергосбережении
  out.video = [];
  document.querySelectorAll('video').forEach(v => {
    const auto = v.hasAttribute('autoplay') || !v.paused; const p = [];
    if (auto && !(v.muted || v.hasAttribute('muted'))) p.push('нет muted');
    if (auto && !v.hasAttribute('playsinline')) p.push('нет playsinline');
    if (!v.getAttribute('poster')) p.push('нет poster');
    if (p.length) out.video.push(desc(v) + ': ' + p.join(', '));
  });
  // контраст: текст поверх картинки, видео или градиента не оцениваем (фон там — кадр)
  const rgb = s => { const m = (s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const a = [c.r, c.g, c.b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const bgOf = el => { const stack = []; let n = el; while (n && n !== de) { const s = getComputedStyle(n); if (s.backgroundImage && s.backgroundImage !== 'none') return null; const c = rgb(s.backgroundColor); if (c && c.a > 0.01) { stack.push(c); if (c.a >= 0.999) break; } n = n.parentElement; }
    let b = rgb(getComputedStyle(de).backgroundColor); if (!b || b.a < 0.999) b = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) { const t = stack[i], a = t.a; b = { r: t.r * a + b.r * (1 - a), g: t.g * a + b.g * (1 - a), b: t.b * a + b.b * (1 - a), a: 1 }; } return b; };
  const pathOf = el => { const parts = []; while (el && el.nodeType === 1 && el.tagName !== 'HTML') { if (el.id) { parts.unshift('#' + CSS.escape(el.id)); break; } let i = 1, s = el; while (s.previousElementSibling) { s = s.previousElementSibling; i++; } parts.unshift(el.tagName.toLowerCase() + ':nth-child(' + i + ')'); el = el.parentElement; } return parts.join('>'); };
  const media = [];
  document.querySelectorAll('body *').forEach(n => { const t = n.tagName, s = getComputedStyle(n); let bi = s.backgroundImage && s.backgroundImage !== 'none';
    if (!bi) { const pb = getComputedStyle(n, '::before').backgroundImage, pa = getComputedStyle(n, '::after').backgroundImage; bi = (pb && pb !== 'none') || (pa && pa !== 'none'); }
    if (t === 'IMG' || t === 'VIDEO' || t === 'CANVAS' || t === 'PICTURE' || t === 'IFRAME' || t === 'SVG' || bi) { const r = n.getBoundingClientRect(); if (r.width > 20 && r.height > 20) media.push({ n, x1: r.left + scrollX, y1: r.top + scrollY, x2: r.right + scrollX, y2: r.bottom + scrollY }); } });
  const overMedia = el => { const r = el.getBoundingClientRect(), cx = r.left + r.width / 2 + scrollX, cy = r.top + r.height / 2 + scrollY; return media.some(m => m.n !== el && !el.contains(m.n) && cx >= m.x1 && cx <= m.x2 && cy >= m.y1 && cy <= m.y2); };
  const con = [], seen = {}; let skipped = 0;
  document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,button,td,th,div,label').forEach(el => {
    const txt = (el.textContent || '').trim(); if (!txt || txt.length < 3 || txt.length > 400) return;
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2)) return;
    const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) < 0.1) return;
    const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) return;
    if (overMedia(el)) { skipped++; return; }
    const fg = rgb(st.color), bg = bgOf(el); if (!bg) { skipped++; return; } if (!fg || fg.a < 0.4) return; const k = ratio(fg, bg); if (k >= 2.6) return;
    const p = pathOf(el); try { if (document.querySelectorAll(p).length !== 1) return; } catch { return; } if (seen[p]) return; seen[p] = 1;
    con.push({ selector: p, text: txt.slice(0, 60), ratio: Math.round(k * 100) / 100 });
  });
  out.contrast = con.slice(0, 60); out.overMedia = skipped;
  out.isMobile = isMobile; out.W = W;
  return out;
}

// Липкий слой не должен закрывать поле, когда оно внизу экрана и в фокусе (клавиатура)
async function probeFocus() {
  // Скрытые поля и tabindex=-1 (ловушка для ботов) не берём; поле первого экрана к нижней кромке
  // не подвести — берём первое, которое можно (как серверный паспорт, 28-09-26).
  const fields = [...document.querySelectorAll('form input, form textarea')].filter(el => {
    if (!(el.tagName === 'TEXTAREA' || /^(text|tel|email|search)$/i.test(el.type || ''))) return false;
    if (el.tabIndex < 0 || el.disabled || el.readOnly) return false;
    const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) < 0.1) return false;
    const r = el.getBoundingClientRect(); return r.width >= 20 && r.height >= 16;
  });
  const field = fields.find(el => scrollY + el.getBoundingClientRect().bottom >= innerHeight - 6) || fields[0];
  if (!field) return null;
  window.scrollTo({ top: Math.max(0, scrollY + field.getBoundingClientRect().bottom - (innerHeight - 6)), left: 0, behavior: 'instant' });
  await new Promise(r => setTimeout(r, 350));
  field.focus({ preventScroll: true });
  await new Promise(r => setTimeout(r, 200));
  const r = field.getBoundingClientRect(), y = r.top + r.height / 2;
  const label = field.labels && field.labels[0] ? (field.labels[0].innerText || '').replace(/\s+/g, ' ').trim() : '';
  const name = (label || field.getAttribute('placeholder') || field.getAttribute('aria-label') || field.name || field.id || field.type || '').slice(0, 40);
  // Поле так и не у кромки (страница короче) — судить не о чем: ни «закрыто», ни «чисто».
  if (r.bottom > innerHeight + 2 || r.top < 0) { field.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); return null; }
  let res = null;
  for (const x of [r.left + Math.min(r.width / 2, 40), r.left + r.width / 2, r.right - Math.min(r.width / 2, 40)]) {
    const hit = document.elementFromPoint(x, y);
    if (!hit || hit === field || field.contains(hit) || (hit.tagName === 'LABEL' && hit.control === field)) continue;
    if (hit.closest && hit.closest('[id^="lqd-ext-chatbot"]')) continue;
    for (let n = hit; n && n.nodeType === 1; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') { res = n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); break; } }
    if (res) break;
  }
  field.blur(); window.scrollTo({ top: 0, behavior: 'instant' });
  return { field: name, covered: res };
}

function probeReduce() {
  const out = { infinite: [], video: [] };
  const desc = el => el ? el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '') : '?';
  if (document.getAnimations) for (const a of document.getAnimations()) {
    try { if (a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity) out.infinite.push(desc(a.effect.target) + (a.animationName ? ' (' + a.animationName + ')' : '')); } catch { /* пропуск */ }
  }
  document.querySelectorAll('video').forEach(v => { if (!v.paused && v.getBoundingClientRect().width > innerWidth * 0.5) out.video.push(desc(v)); });
  out.infinite = [...new Set(out.infinite)];
  return out;
}

async function renderChecks(pw, browser, file, root) {
  const { server, base, bytesBy } = await startServer(root, [file]);
  const rel = '/' + path.relative(root, file).split(path.sep).map(encodeURIComponent).join('/');
  const external = [];
  const runs = {};
  const setup = async (view, extra = {}) => {
    const ctx = await browser.newContext({
      viewport: { width: view.w, height: view.h }, isMobile: !!view.mobile, hasTouch: !!view.mobile,
      deviceScaleFactor: view.mobile ? 3 : 1, userAgent: view.mobile ? UA[view.os] : undefined,
      locale: 'ru-RU', extraHTTPHeaders: { 'x-passport-view': view.key + (extra.reducedMotion ? '-reduce' : '') }, ...extra,
    });
    await ctx.route('**/*', route => {
      const u = route.request().url();
      if (u.startsWith(base) || /^(data|blob):/i.test(u)) return route.continue();
      const h = hostOf(u.replace(/^[a-z]+:/i, '')) || u.slice(0, 40);
      external.push({ host: h, type: route.request().resourceType(), url: u.slice(0, 120) });
      return route.abort('blockedbyclient');
    });
    const page = await ctx.newPage();
    page.on('dialog', d => d.dismiss().catch(() => {}));
    try { await page.goto(base + rel, { waitUntil: 'load', timeout: 20000 }); } catch { /* долгая загрузка — меряем, что успело */ }
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page };
  };
  try {
    await Promise.all(VIEWS.map(async view => {
      const { ctx, page } = await setup(view);
      const top = await page.evaluate(probeTop);
      if (opt.shots) { fs.mkdirSync(opt.shots, { recursive: true }); await page.screenshot({ path: path.join(opt.shots, `${path.basename(file, path.extname(file))}-${view.w}x${view.h}.png`) }).catch(() => {}); }
      let full = null, focus = null;
      if (view.key === 'desktop' || view.key === 'mobile') {
        await page.evaluate(scrollThrough);
        full = await page.evaluate(probeFull, view.mobile);
        if (view.key === 'mobile') focus = await page.evaluate(probeFocus).catch(() => null);
      }
      runs[view.key] = { top, full, focus };
      await ctx.close();
    }));
    const { ctx, page } = await setup(VIEWS[1], { reducedMotion: 'reduce' });
    runs.reduce = await page.evaluate(probeReduce);
    await ctx.close();
  } finally {
    server.close();
  }
  runs.bytes = bytesBy;
  runs.external = external;
  return runs;
}

function browserChecks(runs, staticList) {
  const out = [];
  const add = (key, title, status, detail = '') => out.push({ key, title, status, detail });
  const T = k => runs[k] && runs[k].top;
  const hsText = (k, w) => { const t = T(k); return `${w} px (шире на ${Math.round(t.hscroll)} px${t.wide && t.wide.length ? ', виноват ' + t.wide.join(', ') : ''})`; };

  const hs = [['mobile', 390], ['small', 360]].filter(([k]) => T(k) && T(k).hscroll > 1).map(([k, w]) => hsText(k, w));
  add('no_hscroll', 'Нет горизонтальной прокрутки на телефоне', hs.length ? 'fail' : 'pass',
    hs.length ? 'страница вылезает за экран на ' + hs.join(' и ') + '. Частая причина — блок с фиксированной шириной, отрицательный отступ или анимация «въезд сбоку»; лечится max-width:100% или overflow-x:clip на секции' : 'на 360 и 390 px страница помещается в экран');
  const hs2 = [['tiny', '320×640'], ['landscape', '844×390 (телефон боком)']].filter(([k]) => T(k) && T(k).hscroll > 1).map(([k, w]) => hsText(k, w));
  add('hscroll_extra', 'Нет горизонтальной прокрутки на узком экране и боком', hs2.length ? 'warn' : 'pass',
    hs2.length ? 'вылезает на ' + hs2.join(' и ') : 'на 320×640 и 844×390 помещается');
  if (T('desktop') && T('desktop').hscroll > 1) add('desktop_hscroll', 'Нет горизонтальной прокрутки на компьютере', 'warn', hsText('desktop', 1280));
  const scaled = ['mobile', 'small', 'tiny'].filter(k => T(k) && (T(k).scale < 0.99 || T(k).clientWidth > VIEWS.find(v => v.key === k).w));
  if (scaled.length) add('page_scaled', 'Страница в масштабе 1:1', 'warn', 'браузер телефона уменьшил страницу, чтобы она влезла (' + scaled.map(k => `${VIEWS.find(v => v.key === k).w} px: масштаб ${T(k).scale.toFixed(2)}`).join(', ') + ') — проверьте meta viewport и вылезающие блоки');

  const cta = T('mobile') && T('mobile').cta;
  add('cta_first_screen', 'Кнопка заявки на первом экране телефона', cta ? 'pass' : 'fail',
    cta ? '«' + String(cta).slice(0, 40) + '» видна без прокрутки' : 'на экране 390×844 без прокрутки нет ни одной кнопки — половина посетителей рекламы до неё не долистает');
  const noCta = [['small', '360×740'], ['tiny', '320×640'], ['landscape', '844×390']].filter(([k]) => T(k) && !T(k).cta).map(([, w]) => w);
  add('cta_small_screens', 'Кнопка на первом экране: маленький экран и боком', noCta.length ? 'warn' : 'pass',
    noCta.length ? 'кнопки нет без прокрутки на ' + noCta.join(', ') + ' — уменьшите заголовок или отступы первого экрана (для ландшафта — @media (orientation:landscape) and (max-height:500px))' : 'видна на 360×740, 320×640 и 844×390');

  const hero = T('desktop') && T('desktop').hero;
  add('hero_media', 'Медиа на весь первый экран', hero ? 'pass' : 'warn',
    hero || 'на первом экране нет картинки или видео во всю ширину. Атмосферу продаёт кадр: поставьте его фоном первого экрана');
  const heroM = T('mobile') && T('mobile').hero;
  if (hero && !heroM) add('hero_media_mobile', 'Медиа на первом экране телефона', 'warn', 'на компьютере кадр есть, а на 390×844 первый экран без медиа во всю ширину — дайте телефону свой вертикальный кадр');

  const bg = T('mobile') && T('mobile').rootBg;
  const transparent = c => !c || /^transparent$|rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(c);
  if (bg) add('root_bg', 'Фон html и body', transparent(bg[0]) && transparent(bg[1]) ? 'warn' : 'pass',
    transparent(bg[0]) && transparent(bg[1]) ? 'у html и body нет цвета фона — в iOS 26 Safari красит панели по фону корня, прозрачный даёт белые полосы сверху и снизу; задайте html,body{background-color:…}' : 'задан (' + (transparent(bg[0]) ? bg[1] : bg[0]) + ')');
  const ghost = [...new Set(['mobile', 'small'].flatMap(k => (T(k) && T(k).ghostEdge) || []))];
  if (ghost.length) add('ghost_fixed', 'Невидимые слои у края экрана', 'warn', ghost.slice(0, 3).join(', ') + ' — fixed/sticky-слой у края скрыт прозрачностью; iOS 26 всё равно берёт из него цвет панели. Прячьте через display:none, атрибут hidden или <dialog>');

  const full = runs.desktop && runs.desktop.full, fm = runs.mobile && runs.mobile.full;
  if (full || fm) {
    const all = new Map();
    for (const f of [full, fm]) for (const c of (f && f.contrast) || []) if (c.ratio < MIN_RATIO && !all.has(c.selector)) all.set(c.selector, c);
    const bad = [...all.values()];
    add('contrast', 'Текст читается', bad.length ? 'warn' : 'pass',
      bad.length ? `текст сливается с фоном: ${plural(bad.length, 'место', 'места', 'мест')} (например «${bad[0].text.slice(0, 40)}», контраст ${bad[0].ratio}; селектор ${bad[0].selector.slice(0, 80)})` : 'нет текста, сливающегося с фоном');
    const skipped = Math.max(full ? full.overMedia : 0, fm ? fm.overMedia : 0);
    if (skipped) add('contrast_over_media', 'Текст поверх медиа', 'info', `на картинке, видео или градиенте лежит ${plural(skipped, 'текстовый блок', 'текстовых блока', 'текстовых блоков')} — по цвету их не оценить, посмотрите глазами на настоящем кадре (с заглушками vm-gen — после запуска)`);
  }
  if (fm) {
    if (fm.tiny > 0) add('font_size', 'Размер текста на телефоне', 'warn', plural(fm.tiny, 'абзац', 'абзаца', 'абзацев') + ' мельче 14 px — на телефоне их будут увеличивать пальцами');
    add('input_font', 'Поля формы от 16 px', fm.smallInputs.length ? 'warn' : 'pass',
      fm.smallInputs.length ? fm.smallInputs.slice(0, 4).join(', ') + ' — при фокусе на поле мельче 16 px iOS увеличивает страницу, и человек теряет форму из виду. font-size: max(16px, 1rem)' : 'все поля 16 px и крупнее');
    const tiny24 = fm.smallTaps.filter(t => t.w < 24 || t.h < 24).length;
    add('tap_targets', 'Зоны касания от 44×44', fm.smallTaps.length ? 'warn' : 'pass',
      fm.smallTaps.length ? `меньше 44×44 px: ${plural(fm.smallTaps.length, 'кнопка или ссылка', 'кнопки и ссылки', 'кнопок и ссылок')}${tiny24 ? ` (из них ${tiny24} меньше 24 px — ниже минимума WCAG 2.5.8)` : ''}: ` + fm.smallTaps.slice(0, 5).map(t => `«${t.d}» ${t.w}×${t.h}`).join(', ') + '. Увеличьте min-height/padding; ссылки внутри текста не считаются' : 'все кнопки и ссылки вне текста не меньше 44×44 px');
    if (fm.video.length) add('video_attrs', 'Видео на телефоне', 'warn', fm.video.slice(0, 3).join('; ') + ' — на iOS автозапуск без касания только с muted и playsinline; постер — это первый кадр до загрузки и единственный кадр в режиме энергосбережения');
    else if (/<video\b/i.test(runs.html || '')) add('video_attrs', 'Видео на телефоне', 'pass', 'muted, playsinline и poster на месте');
    if (fm.noDims.length) add('img_dims', 'Размеры картинок', 'warn', `без width/height и aspect-ratio: ${plural(fm.noDims.length, 'картинка', 'картинки', 'картинок')} (${fm.noDims.slice(0, 3).join(', ')}) — место не резервируется, и страница прыгает при загрузке`);
  }
  const lazy = (T('mobile') && T('mobile').lcpLazy) || (T('desktop') && T('desktop').lcpLazy);
  if (lazy) add('lcp_lazy', 'Главная картинка первого экрана', 'warn', `${lazy} помечена loading="lazy" — самая заметная картинка загрузится последней. Уберите lazy и поставьте fetchpriority="high"`);

  const foc = runs.mobile && runs.mobile.focus;
  if (foc && foc.covered) add('sticky_over_input', 'Липкий слой и клавиатура', 'warn', `${foc.covered} закрывает поле «${foc.field}», когда оно внизу экрана и в фокусе — прячьте слой при фокусе: body:has(:is(input,textarea,select):focus) .ваш-слой{display:none}`);
  else if (foc) add('sticky_over_input', 'Липкий слой и клавиатура', 'pass', `поле «${foc.field}» у нижнего края в фокусе ничем не закрыто`);

  const red = runs.reduce;
  if (red && (red.infinite.length || red.video.length)) add('reduce_runtime', 'Режим «меньше движения» на деле', 'warn',
    (red.infinite.length ? 'крутятся бесконечные анимации: ' + red.infinite.slice(0, 4).join(', ') : '') + (red.video.length ? (red.infinite.length ? '; ' : '') + 'играет фоновое видео ' + red.video.join(', ') : '') + ' — выключите их в @media (prefers-reduced-motion: reduce)');

  const bytes = (runs.bytes && runs.bytes.mobile) || 0;
  add('weight', 'Вес загрузки на телефоне', bytes > WEIGHT_WARN ? 'warn' : 'pass',
    (bytes >= 1048576 ? (bytes / 1048576).toFixed(1).replace('.', ',') + ' МБ' : Math.max(1, Math.round(bytes / 1024)) + ' КБ') + ' своих файлов при открытии (без медиа сервиса)' + (bytes > WEIGHT_WARN ? ' — больше 5 МБ: на 4G первый экран будет ждать; сожмите кадры в AVIF/WebP, видео до 2–3 МБ, остальное — loading="lazy"' : ''));

  const staticHosts = new Set(externalRefs(runs.html || '').map(r => r[1]));
  const ext = runs.external.filter(e => !allowed(e.host) && !staticHosts.has(e.host) && !serviceHost(e.host));
  const hard = [...new Set(ext.filter(e => e.type === 'font' || e.type === 'stylesheet').map(e => `${e.host} (${e.type === 'font' ? 'шрифт' : 'стили'})`))];
  const soft = [...new Set(ext.filter(e => !(e.type === 'font' || e.type === 'stylesheet')).map(e => `${e.host} (${e.type})`))];
  if (hard.length) add('runtime_cdn', 'Шрифты и стили наружу при загрузке', 'fail', hard.join(', ') + ' — подтягиваются из CSS или скриптом; в мобильных сетях РФ такой запрос может висеть и держать текст невидимым. Положите файлы рядом');
  if (soft.length) add('runtime_external', 'Запросы наружу при загрузке', 'warn', soft.slice(0, 5).join(', ') + ' — страница ходит на чужие серверы из скриптов или стилей. Счётчик аналитики разрешите явно: --allow=mc.yandex.ru');
  return out;
}

// ---------- проверка файла ----------
async function passport(file, pwState) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const root = opt.root || dir;
  const extra = localAssetsText(html, dir);
  const checks = staticChecks(html, extra);
  let rendered = false;
  if (!opt.static && Buffer.byteLength(html) <= HTML_MAX_BYTES) {
    if (!pwState.pw) checks.push({ key: 'render', title: 'Проверка в браузере', status: 'fail', detail: 'не найден Playwright — без браузера не проверены телефон и первый экран. Установите: npm i -D playwright && npx playwright install chromium (или запустите с --static, чтобы проверить только разметку)' });
    else if (!pwState.browser) checks.push({ key: 'render', title: 'Проверка в браузере', status: 'fail', detail: 'браузер не запустился: ' + pwState.error + '. Выполните npx playwright install chromium или укажите --chrome=путь/к/chrome' });
    else {
      try {
        const runs = await renderChecks(pwState.pw, pwState.browser, file, root);
        runs.html = html;
        checks.push(...browserChecks(runs, checks));
        rendered = true;
      } catch (e) {
        checks.push({ key: 'render', title: 'Проверка в браузере', status: 'fail', detail: 'страница не открылась в браузере: ' + String(e.message).split('\n')[0] });
      }
    }
  } else if (opt.static) checks.push({ key: 'render', title: 'Проверка в браузере', status: 'warn', detail: 'пропущена ключом --static: не проверены телефон, первый экран, контраст и зоны касания' });
  const blocking = checks.filter(c => c.status === 'fail'), warnings = checks.filter(c => c.status === 'warn');
  const scored = checks.filter(c => c.status !== 'info');
  return {
    file, ok: blocking.length === 0, rendered,
    score: `${scored.filter(c => c.status === 'pass').length} из ${scored.length}`,
    blocking: blocking.map(c => c.title + ': ' + c.detail), warnings: warnings.map(c => c.title + ': ' + c.detail),
    notes: checks.filter(c => c.status === 'info').map(c => c.title + ': ' + c.detail), checks,
  };
}

function print(r, label) {
  const rel = path.relative(process.cwd(), r.file).startsWith('..') ? r.file : path.relative(process.cwd(), r.file);
  console.log(`\nПаспорт лендинга${label ? ' · ' + label : ''} · ${rel}`);
  const block = (name, list) => { if (!list.length) return; console.log(`  ${name} (${list.length}):`); for (const s of list) console.log('    - ' + s); };
  block('Блокирует запуск', r.blocking);
  block('Предупреждения', r.warnings);
  block('Заметки', r.notes);
  if (opt.all) block('Пройдено', r.checks.filter(c => c.status === 'pass').map(c => c.title + ': ' + c.detail));
  console.log(`  Итог: пройдено ${r.score}${r.rendered ? '' : ' (без браузера)'} · ${r.ok ? (r.warnings.length ? 'можно запускать, но предупреждения стоит закрыть' : 'можно запускать') : 'НЕЛЬЗЯ запускать: ' + r.blocking.length + ' блокирующ' + (r.blocking.length === 1 ? 'ая' : 'их')}`);
}

// ---------- запуск ----------
const pwState = { pw: null, browser: null, error: '' };
if (!opt.static) {
  pwState.pw = await loadPlaywright();
  if (pwState.pw) { try { pwState.browser = await launchBrowser(pwState.pw); } catch (e) { pwState.error = String(e.message).split('\n')[0]; } }
}
const results = [];
try {
  for (const f of files) results.push(await passport(f, pwState));
} finally {
  if (pwState.browser) await pwState.browser.close().catch(() => {});
}
if (opt.json) console.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 1));
else {
  results.forEach((r, i) => print(r, results.length > 1 ? (i ? 'вариант Б' : 'вариант A') : ''));
  if (results.length === 2) {
    const st = r => Object.fromEntries(r.checks.map(c => [c.key, c.status]));
    const a = st(results[0]), b = st(results[1]);
    const diff = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]);
    console.log('\nA и Б: ' + (diff.length ? 'проверки разошлись — ' + diff.map(k => `${k}: A ${a[k] || '—'}, Б ${b[k] || '—'}`).join('; ') + '. Варианты должны отличаться только осью теста' : 'результаты проверок совпадают'));
  }
}
process.exit(results.some(r => !r.ok) ? 1 : 0);
