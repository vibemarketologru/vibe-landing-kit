# Готовые блоки медиа для лендинга

Ванильный HTML/CSS/JS без библиотек и CDN. Цвета — из переменных дизайн-системы (`theme.css`).
`vm-gen:ID` — номер вашей генерации; при запуске `landing_launch` он станет постоянной ссылкой.

## 1. Первый экран: кадр во всю ширину, отдельный кадр для телефона

```html
<header class="hero">
  <picture class="hero__media">
    <source media="(max-width: 700px)" srcset="vm-gen:40257">
    <img src="vm-gen:40256" alt="Новое окно в светлой квартире, за стеклом осенние берёзы" fetchpriority="high">
  </picture>
  <div class="hero__text">
    <h1>Пластиковые окна по цене из договора</h1>
    <p>Замер бесплатно, цена не меняется после монтажа.</p>
    <a class="btn" href="#form">Вызвать замерщика</a>
  </div>
</header>
<style>
.hero{position:relative;min-height:100svh;display:grid;align-items:end;isolation:isolate;color:#fff}
.hero__media,.hero__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
/* Затемнение держит контраст заголовка на любом кадре */
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.62))}
.hero__text{padding:clamp(20px,5vw,64px);max-width:44rem}
@media (min-width:701px){.hero{min-height:92vh}}
</style>
```

## 2. Фоновое видео первого экрана

```html
<header class="hero">
  <video class="hero__media" autoplay muted playsinline preload="auto"
         poster="vm-gen:40277" src="vm-gen:40286"></video>   <!-- люди в кадре: без loop, ролик замирает на последнем кадре -->
  …
</header>
<script>
  // Меньше движения — только постер.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  }
</script>
```

Тихая петля без шва (комната, свет, маскот) — ролик плюс он же задом наперёд, без звука:

```bash
ffmpeg -i hero.mp4 -filter_complex "[0:v]trim=0:9.9,setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart media/hero-loop.mp4
```

Файл кладётся рядом со страницей (`assets` при запуске), в разметке — `<video … loop src="media/hero-loop.mp4">`.
`-pix_fmt yuv420p` обязателен: без него браузеры не проигрывают ролик вовсе.

## 3. Ролик с речью: кнопка, звук, встроенные субтитры

```html
<figure class="talk">
  <video id="talk" playsinline preload="none" poster="vm-gen:40276" src="media/master-talk.mp4"></video>
  <div class="talk__cc" aria-live="polite"></div>
  <button class="talk__play" type="button" aria-label="Смотреть ролик, 8 секунд">
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>
    Смотреть · 0:08
  </button>
</figure>
<style>
.talk{position:relative;margin:0;border-radius:16px;overflow:hidden;aspect-ratio:16/9;background:#000}
.talk video{width:100%;height:100%;object-fit:cover}
.talk__play{position:absolute;left:16px;bottom:16px;display:inline-flex;gap:8px;align-items:center;padding:12px 18px;border:0;border-radius:999px;background:var(--c-primary,#111);color:var(--c-on-primary,#fff);font:inherit;cursor:pointer}
.talk__cc{position:absolute;left:5%;right:5%;bottom:14%;text-align:center;color:#fff;font-size:clamp(15px,2.2vw,20px);text-shadow:0 1px 3px #000,0 0 12px rgba(0,0,0,.8)}
.talk.is-playing .talk__play{display:none}
</style>
<script>
(() => {
  const box = document.querySelector('.talk'), v = box.querySelector('video'), cc = box.querySelector('.talk__cc');
  const cues = [[0.55, 3.5, 'Смотрю машину при вас и сразу называю цену.'], [3.9, 7.85, 'Она записана в договоре и после ремонта не вырастет ни на рубль.']];
  box.querySelector('.talk__play').addEventListener('click', () => { box.classList.add('is-playing'); v.controls = true; v.play(); });
  v.addEventListener('timeupdate', () => { const c = cues.find(([a, b]) => v.currentTime >= a && v.currentTime < b); cc.textContent = c ? c[2] : ''; });
  v.addEventListener('ended', () => { cc.textContent = ''; });
})();
</script>
```

Лишний хвост (модель повторила последние слова) — обрезать по паузе, а не перегенерировать:

```bash
ffmpeg -i talk.mp4 -af silencedetect=noise=-32dB:d=0.12 -f null - 2>&1 | grep silence_   # паузы между фразами
ffmpeg -i talk.mp4 -t 7.85 -af "afade=t=out:st=7.62:d=0.23" -c:v libx264 -pix_fmt yuv420p -crf 22 -c:a aac -movflags +faststart media/master-talk.mp4
```

Таймкоды субтитров берите из тех же пауз — тогда строка появляется вместе со словом.

## 4. Аудиоверсия страницы

```html
<button class="listen" type="button" aria-pressed="false">
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path class="i-play" d="M5 3l10 6-10 6z" fill="currentColor"/></svg>
  <span>Послушать за 41 секунду</span>
  <i class="listen__bar"><i></i></i>
</button>
<audio id="listen" preload="none" src="vm-gen:40290"></audio>
<style>
.listen{display:inline-flex;align-items:center;gap:10px;padding:10px 0;background:none;border:0;color:inherit;font:inherit;cursor:pointer}
.listen__bar{display:inline-block;width:72px;height:3px;border-radius:2px;background:currentColor;opacity:.3;position:relative;overflow:hidden}
.listen__bar i{position:absolute;inset:0;width:0;background:currentColor;opacity:1}
</style>
<script>
(() => {
  const b = document.querySelector('.listen'), a = document.getElementById('listen'), bar = b.querySelector('.listen__bar i');
  b.addEventListener('click', () => { if (a.paused) { a.play(); b.setAttribute('aria-pressed', 'true'); } else { a.pause(); b.setAttribute('aria-pressed', 'false'); } });
  a.addEventListener('timeupdate', () => { bar.style.width = (a.currentTime / (a.duration || 1) * 100) + '%'; });
  a.addEventListener('ended', () => b.setAttribute('aria-pressed', 'false'));
})();
</script>
```

## 5. Промпты, которые сработали (живые примеры галереи)

- Первый экран, окна: «Wide real-estate photograph of a bright living room in a renovated Moscow panel-block
  apartment: a large new white PVC tilt-and-turn window…, soft morning daylight…, shot on 24mm at eye level.
  The window is on the right two thirds of the frame; the left third is a calm light-grey wall — empty space
  for a headline. Documentary photograph…, no text, no logos, no CGI look.»
- Фон-петля, кабинет психолога: «Оживи этот кадр почти неподвижно, как тихий фон сайта: камера очень медленно
  наезжает на кресла, льняная штора едва колышется… Людей нет. Звук: тихий город за окном. В кадре НЕТ речи,
  НЕТ голоса за кадром и НЕТ музыки. Композиция как на исходном кадре; текста на экране нет.»
- Персонаж-мастер: портрет 3:4 → голос `orus` («мужской голос около 40 лет, спокойный, чуть с хрипотцой») →
  `gemini-omni-character` → ролик «Мастер стоит в мастерской рядом с седаном на подъёмнике… произносит по-русски
  РОВНО эту фразу…: «Смотрю машину при вас и сразу называю цену. Она записана в договоре и после ремонта не вырастет ни на рубль.»» —
  с третьей попытки: первые две модель испортила повтором, третью спас обрез хвоста по паузе.
