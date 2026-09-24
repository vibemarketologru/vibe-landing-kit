# Готовые куски мобильной вёрстки лендинга

Ванильный HTML/CSS/JS без библиотек и CDN. Все куски собраны в одну рабочую страницу
[`example/index.html`](example/index.html): откройте её на телефоне или прогоните паспортом
`node tools/passport.mjs skills/landing-mobile/example/index.html`.

**Как проверено (24-09-2026).** Страница прогнана в Chromium 145 (Playwright 1.58) с профилями
iPhone 15 (393×659, ×3), Pixel 7 (412×839), 320×640, ландшафт 844×390 и десктоп 1280×900; видео — в
Google Chrome 150 (у Chromium нет H.264). 81 замер из 81 прошёл. Это эмуляция: WebKit на стенде не
запустился (нет системных библиотек), поэтому то, что зависит от настоящего Safari — окраска панелей,
плавающая панель вкладок, клавиатура, энергосбережение, — помечено «руками» и проверяется на iPhone.

Цвета — переменные из `theme.css` вашей дизайн-системы; ниже они заданы явно, чтобы кусок работал сам.

| № | Кусок | Что закрывает |
|---|-------|---------------|
| 1 | Шапка документа | масштаб, вырез, телефоны-ссылки, цвет панелей Android |
| 2 | Фон корня | белые полосы и неверный цвет панелей в iOS 26 |
| 3 | Первый экран 100svh | кнопка под панелями браузера, прыжки высоты |
| 4 | Липкая кнопка | полоса жестов, индикатор Home, клавиатура, форма |
| 5 | Поля формы | автозум iOS, клавиатура, автозаполнение, отказ словами |
| 6 | Звонок и мессенджеры | tel:, format-detection, telegram.me |
| 7 | Картинки | AVIF/WebP, приоритет первого кадра, `sizes="auto"` |
| 8 | Фоновое видео | энергосбережение iOS, экономия трафика, «меньше движения», пауза |
| 9 | Ландшафт | телефон боком, высота ~390 px |
| 10 | Стекло | Liquid Glass-подобная шапка с запасным сплошным фоном |

## 1. Шапка документа

```html
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<!-- Масштаб 1:1 и страница под вырезом и полосой жестов. БЕЗ maximum-scale=1 и user-scalable=no -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- iOS не превращает цены, годы и артикулы в синие телефонные ссылки -->
<meta name="format-detection" content="telephone=no">
<!-- Цвет панелей Chrome на Android. Safari в iOS 26+ это поле не использует (см. кусок 2) -->
<meta name="theme-color" content="#f6f3ee" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121316" media="(prefers-color-scheme: dark)">
<title>Остекление балконов в Казани — замер бесплатно</title>
```

- `initial-scale=1` обязателен: без него Chrome на телефоне при любом вылезающем блоке уменьшает всю
  страницу, чтобы она влезла (замер: масштаб 0,74 при блоке шире экрана на 138 px).
- `viewport-fit=cover` включает `env(safe-area-inset-*)` на iPhone. Без него эти значения нули, и
  куски 3, 4 просто работают без отступов под вырез — вреда нет.
- `interactive-widget=resizes-content` (только Chrome на Android, с версии 108; Safari не знает) не
  ставьте по умолчанию: с ним клавиатура сжимает макет, и липкая панель выезжает над клавиатурой
  поверх поля. Нужен, только если у вас чат или форма, прижатая к низу экрана.
- Шрифты — свои файлы woff2 рядом со страницей, `font-display: swap` в каждом `@font-face`, главный
  файл в `<link rel="preload" as="font" type="font/woff2" crossorigin>`.

**Проверено:** ширина окна равна ширине устройства и масштаб 1 на 320/393/412/844 px.

## 2. Фон корня и невидимые слои

```css
:root{
  color-scheme:light dark;               /* одна тема — пишите её явно: color-scheme:light */
  --bg:#f6f3ee; --fg:#17181b; --muted:#565a61; --line:#d9d2c6; --field:#fff; --field-line:#8a8478;
  --accent:#1f5f4a; --on-accent:#fff; --glass:rgb(246 243 238 / .72);
}
@media (prefers-color-scheme: dark){
  :root{--bg:#121316; --fg:#eeebe6; --muted:#a9acb2; --line:#2c2e33; --field:#1b1d21; --field-line:#6c7078;
    --accent:#7fd0b0; --on-accent:#0b1512; --glass:rgb(18 19 22 / .7)}
}
html,body{background-color:var(--bg);color:var(--fg)}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}   /* НЕ none: none мешает увеличивать текст */
[hidden]{display:none !important}   /* скрытый fixed-слой — только display:none, не opacity:0 */
```

- В iOS 26 Safari красит панели не по `theme-color`, а по фону `html`/`body` и по fixed/sticky-слоям
  у верхнего и нижнего края; прозрачный корень даёт белую полосу, а невидимый (`opacity:0`) баннер у
  края всё равно отдаёт свой цвет. Поэтому фон корня всегда сплошной, а тост, модалка, баннер cookie
  прячутся атрибутом `hidden` или `<dialog>`.
- `color-scheme` перекрашивает полосы прокрутки, поля и `<select>` под тему. Нет тёмной темы — не
  объявляйте `dark`, иначе системные поля станут тёмными на светлой странице.

**Проверено:** фон `html` и `body` сплошной в обеих темах (светлая `rgb(246,243,238)`, тёмная
`rgb(18,19,22)`). **Руками:** цвет верхней и нижней панели Safari на iPhone с iOS 26/27 — эмулятор
его не показывает.

## 3. Первый экран 100svh

```html
<header class="hero">
  <picture class="hero__media">…кусок 7…</picture>
  <video class="hero__video" …кусок 8…></video>
  <div class="hero__text">
    <h1>Остекление балконов с ценой в договоре</h1>
    <p class="hero__lead">Замер бесплатно, монтаж за один день. Цена после монтажа не меняется.</p>
    <a class="btn" href="#lead" data-hero-cta>Вызвать замерщика</a>
  </div>
</header>
```

```css
.hero{position:relative;isolation:isolate;min-height:100vh;min-height:100svh;box-sizing:border-box;display:grid;align-content:end;
  padding:max(24px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 32px max(16px,env(safe-area-inset-left));color:#fff}
.hero__media,.hero__media img,.hero__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
/* затемнение держит контраст заголовка на любом кадре */
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgb(0 0 0 / 0) 25%,rgb(0 0 0 / .68))}
.hero h1{margin:0 0 12px;font-size:clamp(32px,8.4vw,64px);line-height:1.06;text-wrap:balance;max-width:14em}
.hero__lead{margin:0 0 20px;font-size:clamp(17px,2.4vw,21px);max-width:34rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 22px;box-sizing:border-box;
  border:0;border-radius:12px;background:var(--accent);color:var(--on-accent);font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
@media (min-width:768px){ .hero{min-height:88vh;min-height:88svh;padding-inline:max(48px,env(safe-area-inset-left))} }
```

- `svh` — высота окна при ПОКАЗАННЫХ панелях браузера: кнопка внизу первого экрана не уезжает под
  панель. `dvh` меняется при прокрутке и дёргает страницу, `lvh` прячет низ под панелью. Строка
  `100vh` перед `100svh` — запасная для старых браузеров (svh: Safari 15.4+, Chrome 108+).
- Кнопка первого экрана — в потоке текста, не абсолютом у нижнего края: так её не накроет панель.

**Проверено:** высота первого экрана равна высоте окна на 320×640, 393×659, 412×839; кнопка целиком
в окне на всех пяти размерах, включая ландшафт. **Руками:** iPhone с компактной панелью вкладок
(iOS 26 по умолчанию) — кнопка не под стеклянной панелью.

## 4. Липкая кнопка с safe-area

```html
<div class="cta-bar" data-cta-bar hidden>
  <a class="btn btn--block" href="#lead">Вызвать замерщика</a>
  <a class="btn btn--ghost btn--icon" href="tel:+79000000000" aria-label="Позвонить: +7 900 000-00-00">
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.6 2.5 4 3.2c-.7.2-1.2 1-1 1.8 1.3 5.5 5.5 9.7 11 11 .8.2 1.6-.3 1.8-1l.7-2.6-3.6-1.6-1.6 1.6a9.5 9.5 0 0 1-4.1-4.1l1.6-1.6z" fill="currentColor"/></svg>
  </a>
</div>
```

```css
:root{--bar-h:64px;--sa-max:env(safe-area-max-inset-bottom, 36px)}
.btn--block{width:100%}
.btn--ghost{background:transparent;color:var(--fg);border:1px solid var(--field-line)}
.btn--icon{flex:none;width:48px;padding:0}
.cta-bar{position:fixed;left:0;right:0;z-index:30;display:flex;gap:8px;align-items:center;
  box-sizing:content-box;height:var(--bar-h);
  padding:0 max(16px,env(safe-area-inset-right)) var(--sa-max) max(16px,env(safe-area-inset-left));
  bottom:calc(env(safe-area-inset-bottom, 0px) - var(--sa-max));
  background:var(--bg);border-top:1px solid var(--line)}
/* открыта клавиатура — панель не висит над полем */
body:has(:is(input,textarea,select):focus) .cta-bar{display:none}
@media (max-width:767px){ body{padding-bottom:calc(var(--bar-h) + var(--sa-max))} }
@media (min-width:768px){ .cta-bar{display:none} }
```

```js
/* Панель появляется, когда кнопка первого экрана ушла вверх, и прячется,
   когда форма поднялась выше нижней трети экрана */
(() => {
  const bar = document.querySelector('[data-cta-bar]');
  if (!bar || !('IntersectionObserver' in window)) return;
  const inView = new Set();
  const track = e => { e.isIntersecting ? inView.add(e.target) : inView.delete(e.target); bar.hidden = inView.size > 0; };
  const heroCta = document.querySelector('[data-hero-cta]'), form = document.getElementById('lead');
  if (heroCta) new IntersectionObserver(es => es.forEach(track)).observe(heroCta);
  if (form) new IntersectionObserver(es => es.forEach(track), { rootMargin: '0px 0px -35% 0px' }).observe(form);
})();
```

- Отступ снизу — по образцу Chrome для Android edge-to-edge (Chrome 135+): `bottom` через
  `calc(env(safe-area-inset-bottom) − max-inset)` и постоянный `padding`. Прямой
  `padding-bottom: env(safe-area-inset-bottom)` на fixed-слое Chrome называет причиной перерасчёта
  раскладки и при таком шаблоне перестаёт убирать «подбородок» при прокрутке.
- В Safari `safe-area-max-inset-bottom` нет, срабатывает запасные 36 px: на iPhone с полосой Home
  (`inset` ≈ 34 px) кнопка стоит на 42 px выше края, фон панели доходит до края; на iPhone SE с
  кнопкой — 8 px от края (замер подстановкой значений).
- Панель скрыта атрибутом `hidden`, а не прозрачностью: в iOS 26 невидимый fixed-слой у нижнего края
  всё равно красит панель Safari.
- Без JS панель не появится — это безопасно, кнопка первого экрана остаётся.
- Нижний отступ `body` не даёт панели накрыть подвал и политику конфиденциальности.

**Проверено:** на первом экране панель скрыта; в середине страницы видна, прижата к низу, кнопка
принимает касание (`elementFromPoint`); у формы скрыта; при фокусе в поле `display:none`; на 768 px и
шире её нет. **Руками:** iOS 26 — поведение fixed-слоёв у нижнего края менялось внутри 26.x (26.1
убрала зазор под fixed-контейнерами на весь экран, 26.2 — пропадание sticky при rubber-band);
Safari 27 исправил мерцание fixed при rubber-band. Проверьте на свежей версии: прокрутка вниз до
упора и отскок, открытие клавиатуры.

## 5. Поля формы

```html
<form class="lead" id="lead" method="post">          <!-- без action: отправку делает ваш приёмник заявок -->
  <div class="field">
    <label for="f-name">Как к вам обращаться</label>
    <input id="f-name" name="name" type="text" autocomplete="name" autocapitalize="words" enterkeyhint="next" required>
  </div>
  <div class="field">
    <label for="f-phone">Телефон</label>
    <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" enterkeyhint="send"
           placeholder="+7 900 000-00-00" aria-describedby="f-phone-hint" required>
    <p class="field__hint" id="f-phone-hint">Можно с 8, с +7, со скобками и пробелами</p>
  </div>
  <label class="consent">
    <input type="checkbox" name="consent" required>
    <span>Согласен на обработку персональных данных по <a href="privacy.html">политике конфиденциальности</a></span>
  </label>
  <button class="btn btn--block" type="submit">Жду звонка замерщика</button>
  <p class="lead__status" role="status" aria-live="polite"></p>
</form>
```

```css
.lead{display:grid;gap:16px;max-width:30rem}
.field{display:grid;gap:6px}
.field label{font-weight:600}
.field input,.field textarea,.field select{box-sizing:border-box;width:100%;min-height:48px;padding:12px 14px;
  font:inherit;font-size:max(16px,1rem);            /* меньше 16 px — iOS увеличит страницу при фокусе */
  color:var(--fg);background:var(--field);border:1px solid var(--field-line);border-radius:12px;
  scroll-margin-block:96px}
.field input:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
.field__hint{margin:0;font-size:15px;color:var(--muted)}
.consent{display:flex;gap:12px;align-items:flex-start;min-height:44px;padding-block:8px;box-sizing:border-box;cursor:pointer}
.consent input{flex:none;width:22px;height:22px;margin:2px 0 0;accent-color:var(--accent)}
.lead__status{margin:0;min-height:1.5em;font-weight:600}
.lead__status[data-state=error]{color:#b3261e}
@media (prefers-color-scheme: dark){ .lead__status[data-state=error]{color:#ffb4ab} }
```

```js
/* Телефон: не мешаем вводу и вставке, приводим к виду +7 900 000-00-00 при уходе с поля.
   Отказ всегда пишем словами на том же экране. */
(() => {
  const form = document.getElementById('lead');
  if (!form) return;
  const phone = form.elements.phone, status = form.querySelector('.lead__status');
  const digits = v => v.replace(/\D/g, '');
  const pretty = v => {
    let d = digits(v);
    if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
    return d.length === 10 ? `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}` : v.trim();
  };
  const checkPhone = () => phone.setCustomValidity(phone.value && digits(phone.value).length < 10 ? 'Нужно 10 цифр после +7' : '');
  phone.addEventListener('input', checkPhone);
  phone.addEventListener('blur', () => { phone.value = pretty(phone.value); checkPhone(); });
  const say = {
    name: 'Напишите, как к вам обращаться',
    phone: 'Проверьте телефон: нужно 10 цифр после +7',
    consent: 'Отметьте согласие на обработку данных — без него мы не вправе перезвонить',
  };
  let first = null;
  form.addEventListener('invalid', e => {
    if (first) return;
    first = e.target;
    status.dataset.state = 'error';
    status.textContent = say[e.target.name] || 'Проверьте поле «' + (e.target.labels?.[0]?.textContent.trim() || e.target.name) + '»';
    requestAnimationFrame(() => { first = null; });
  }, true);
  form.addEventListener('submit', () => { status.dataset.state = ''; status.textContent = 'Отправляем…'; });
})();
```

- Телефон — `type="tel"`, никогда `type="number"`: числовое поле съедает `+`, пробелы и скобки и
  крутит значение колесом мыши. Маска «по буквам» ломает вставку и автозаполнение — вместо неё
  приводим номер к виду при уходе с поля.
- `autocomplete="name"` и `"tel"` — браузер подставляет имя и номер одним касанием.
  `enterkeyhint` меняет подпись клавиши ввода: «Далее» на имени, «Отправить» на телефоне.
- Подпись над полем видимая (не только `placeholder`), одна колонка, кнопка на всю ширину.
- Галочка согласия не отмечена заранее; вся строка — `<label>`, поэтому зона касания 44 px,
  хотя сам квадрат 22 px.
- Проверка на клиенте только подсказывает: отказ — словами в `.lead__status`, а приёмник заявок
  обязан принять заявку с именем и контактом, даже если что-то не так с остальным.
- `scroll-margin-block` держит 96 px над полем при переходе по якорю и `scrollIntoView` — поле не
  прячется под липкой шапкой.

**Проверено:** поля 16 px на всех размерах; пустая форма → «Напишите, как к вам обращаться»;
`8 (900) 123-45-67` → `+7 900 123-45-67`; вставка `+7 900 1234567` принята и приведена; короткий номер
и снятая галочка → видимый текст; полная заявка вызывает `submit` с `phone=+7 900 123-45-67`;
над полем после `scrollIntoView` ровно 96 px. **Руками:** настоящая клавиатура iPhone и Android —
видно ли поле над ней, подставляет ли автозаполнение номер, как ведёт себя ввод при открытой форме.

## 6. Звонок и мессенджеры

```html
<p class="contacts">
  <a class="btn btn--ghost" href="tel:+79000000000">Позвонить</a>
  <a class="btn btn--ghost" href="https://telegram.me/yasnyi_vid">Telegram</a>
  <a class="btn btn--ghost" href="https://vk.me/yasnyi_vid">ВКонтакте</a>
</p>
<style>.contacts{display:flex;flex-wrap:wrap;gap:8px;margin:0}</style>
```

- `tel:` — в международном виде без пробелов; видимый текст может быть с пробелами.
- `format-detection` из куска 1 гасит автоссылки только на числа в тексте; ваши `tel:`-ссылки
  работают как обычно.
- Telegram — `telegram.me`, не `t.me`: короткий адрес у части российских операторов бывает недоступен.
  ВКонтакте — `vk.me/<сообщество>` открывает диалог сразу.

**Проверено:** `href="tel:+79000000000"`, мета-тег на месте, кнопки 48 px в высоту.

## 7. Картинки: AVIF/WebP, приоритет первого кадра, `sizes="auto"`

```html
<!-- Первый экран: отдельный вертикальный кадр для телефона, AVIF → WebP → JPEG -->
<picture class="hero__media">
  <source media="(max-width: 700px)" type="image/avif" srcset="media/hero-m.avif">
  <source media="(max-width: 700px)" type="image/webp" srcset="media/hero-m.webp">
  <source type="image/avif" srcset="media/hero-1600.avif">
  <source type="image/webp" srcset="media/hero-1600.webp">
  <img src="media/hero-1600.jpg" width="1600" height="900" fetchpriority="high"
       alt="Тёплый вечерний свет за стеклом нового балкона">
</picture>

<!-- Ниже первого экрана: lazy + размер по фактической ширине -->
<picture>
  <source type="image/avif" srcset="media/room-800.avif 800w, media/room-1600.avif 1600w" sizes="auto, (max-width: 700px) 100vw, 64rem">
  <img src="media/room-800.jpg" srcset="media/room-800.webp 800w, media/room-1600.webp 1600w"
       sizes="auto, (max-width: 700px) 100vw, 64rem" width="1600" height="1200" loading="lazy" decoding="async"
       alt="Остеклённый балкон в тёплых вечерних тонах">
</picture>
```

- Кадр первого экрана — никогда не `loading="lazy"`; `fetchpriority="high"` ставит его в очередь
  первым (Safari 17.2+, Chrome 101+).
- `width`/`height` у каждой картинки — место резервируется до загрузки, страница не прыгает (CLS).
- `sizes="auto"` работает только вместе с `loading="lazy"`: браузер берёт кандидата по фактической
  ширине картинки. Поддержка: Chrome 126+, Safari 27 (по заметкам Apple; сводные таблицы caniuse и
  MDN на 24-09-2026 это ещё не отразили). Старые браузеры читают список после `auto`.
- `<source media>` идут раньше источников без `media`, внутри группы — AVIF раньше WebP.
- Сжатие: `ffmpeg -i hero.png -c:v libaom-av1 -still-picture 1 -crf 32 hero.avif`,
  `cwebp -q 78 hero.png -o hero.webp`.

**Проверено:** на телефоне выбран `hero-m.avif`, на ландшафте и десктопе `hero-1600.avif`;
у кадра `fetchpriority=high`, не lazy; нижняя картинка: iPhone ×3 (ширина 361 px) → `room-1600.avif`,
экран 360 px ×1 → `room-800.avif`.

## 8. Фоновое видео с постером и запасным путём

```html
<video class="hero__video" muted playsinline loop preload="none" poster="media/hero-poster.jpg"
       data-src="media/hero-loop.mp4" disableremoteplayback aria-hidden="true" tabindex="-1"></video>
<button class="hero__pause" type="button" aria-label="Остановить фоновое видео" aria-pressed="false" hidden>
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 3h3v12H4zM11 3h3v12h-3z" fill="currentColor"/></svg>
</button>
```

```css
.hero__pause{position:absolute;top:max(12px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right));width:44px;height:44px;
  border:0;border-radius:50%;background:rgb(0 0 0 / .45);color:#fff;display:grid;place-items:center;cursor:pointer}
.hero.is-still .hero__video,.hero.is-still .hero__pause{display:none}
```

```js
/* Без движения при «меньше движения» и экономии трафика; если автозапуск запрещён
   (энергосбережение iOS) — остаётся кадр первого экрана */
(() => {
  const hero = document.querySelector('.hero'), v = hero && hero.querySelector('.hero__video');
  if (!v) return;
  const btn = hero.querySelector('.hero__pause');
  const still = () => { v.pause(); v.removeAttribute('src'); v.load(); hero.classList.add('is-still'); };
  const saveData = navigator.connection && navigator.connection.saveData;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || saveData) { hero.classList.add('is-still'); return; }
  v.src = v.dataset.src;
  const p = v.play();
  if (p && p.catch) p.then(() => { btn.hidden = false; }, still);
  btn.addEventListener('click', () => {
    const paused = btn.getAttribute('aria-pressed') === 'true';
    paused ? v.play() : v.pause();
    btn.setAttribute('aria-pressed', String(!paused));
    btn.setAttribute('aria-label', paused ? 'Остановить фоновое видео' : 'Включить фоновое видео');
  });
})();
```

- Адрес ролика ставит скрипт: при «меньше движения» и экономии трафика ролик не скачивается вовсе.
  Без JS остаётся кадр `<picture>` под видео — он и есть смысл первого экрана.
- `muted` + `playsinline` — условие автозапуска без касания на iOS. В режиме энергосбережения iOS
  автозапуск выключен намеренно, «чтобы беречь батарею» (WebKit bug 219889, WONTFIX): у видео с
  атрибутом `autoplay` Safari рисует поверх ролика кнопку «play». Здесь атрибута нет: скрипт зовёт
  `play()`, при отказе прячет видео и оставляет кадр. Поэтому кадр обязан сам продавать.
- `navigator.connection.saveData` есть только в Chromium; `prefers-reduced-data` не поддерживает ни
  один браузер без флага.
- Кнопка паузы обязательна для движения дольше 5 секунд (WCAG 2.2.2).
- Файл: H.264, `-pix_fmt yuv420p`, 720p, без звука, 2–3 МБ (рецепт петли — `landing-media/snippets.md`).

**Проверено в Google Chrome 150:** обычный режим — ролик играет, пауза работает; `play()` отклонён
(как при энергосбережении) — видео скрыто, виден кадр; `saveData` и «меньше движения» — видео скрыто,
запроса к `.mp4` нет. **Руками:** iPhone в режиме энергосбережения и в «Экономии данных».

## 9. Ландшафт

```css
@media (orientation:landscape) and (max-height:500px){
  .hero{min-height:auto;padding-block:max(20px,env(safe-area-inset-top)) 20px}
  .hero h1{font-size:clamp(26px,5vw,36px)}
  .hero__lead{margin-bottom:12px}
  :root{--bar-h:52px}
}
```

Телефон боком — это 390 px высоты, из которых часть съедают панели: первый экран на `100svh` с
крупным заголовком выталкивает кнопку за край. Здесь первый экран по содержимому, заголовок мельче.

**Проверено на 844×390:** первый экран 251 px, кнопка целиком в окне, горизонтального скролла нет.
**Руками:** iPhone боком — вырез слева или справа (`env(safe-area-inset-left/right)` в отступах).

## 10. Стекло с запасным сплошным фоном

```css
.glass{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:12px;
  padding:8px max(16px,env(safe-area-inset-right)) 8px max(16px,env(safe-area-inset-left));
  background:var(--bg);border-bottom:1px solid var(--line)}                         /* запасной путь */
@supports ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){
  .glass{background:var(--glass);-webkit-backdrop-filter:saturate(1.4) blur(16px);backdrop-filter:saturate(1.4) blur(16px)}
}
@media (prefers-reduced-transparency:reduce){
  .glass{background:var(--bg);-webkit-backdrop-filter:none;backdrop-filter:none}
}
```

- Сначала сплошной фон, стекло — только там, где размытие поддерживается: иначе текст шапки ляжет
  прямо на картинку. Префикс `-webkit-` нужен Safari до 18.
- `prefers-reduced-transparency` пока понимает только Chrome (118+); в Safari запрос просто не
  срабатывает, вреда нет.
- Непрозрачность стекла не ниже 0,7: текст на нём проверяйте по контрасту как на сплошном фоне.
- Стекло у самого верхнего края в iOS 26 участвует в окраске панели Safari (кусок 2): цвет его
  фона станет цветом строки состояния.

**Проверено:** размытие и фон с прозрачностью 0,72; при эмуляции «меньше прозрачности» и при
неподдержанном `backdrop-filter` — сплошной фон `rgb(246,243,238)`.
