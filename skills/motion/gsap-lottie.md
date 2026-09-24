# GSAP и Lottie на лендинге под строгим CSP

Рецепты каталога ванильные и весят 1–2 КБ. Библиотека нужна редко; этот файл — когда она нужна и как её подключить так, чтобы страница прошла строгую политику безопасности (CSP): только свои файлы и встроенные скрипты, без CDN, без `eval`.

> Раздел о лицензиях — пересказ открытых текстов своими словами. Это не юридическое заключение: перед коммерческим запуском читайте первоисточник.

## GSAP

### Когда он действительно нужен

| Задача | Почему без GSAP тяжело | Что взять |
|---|---|---|
| Многошаговая сцена с закреплением: одна шкала ведёт несколько элементов (открылось → первое утверждение → крупный план → кнопка) | `sticky` + CSS-шкалы не дают одну общую шкалу с метками и притягиванием к шагам | ScrollTrigger (`pin`, `scrub`, `snap: 'labels'`) |
| Построчное раскрытие длинного адаптивного заголовка с масками | строки знает только браузер после загрузки шрифта и пересчитывает при смене ширины | SplitText (`type: 'lines'`, `mask: 'lines'`, `autoSplit`) |
| Элемент меняет место, размер или родителя: вкладки разной ширины, фильтр карточек, карточка раскрывается в окно | ручной FLIP — десятки строк замеров | Flip |

Не нужен для того, что уже есть в каталоге: появление по прокрутке, счётчики, лента, рисованная линия, маркер, полоса прогресса, вкладки одной ширины, параллакс, стопка карточек. Для одной страницы с одним эффектом GSAP — лишние десятки килобайт.

### Вес (GSAP 3.15.0, замер gzip -9)

| Файл | Сжато | Без сжатия |
|---|---|---|
| `gsap.min.js` (ядро) | 28,3 КБ | 72,9 КБ |
| `ScrollTrigger.min.js` | 18,0 КБ | 44,6 КБ |
| `SplitText.min.js` | 3,7 КБ | 7,7 КБ |
| `Flip.min.js` | 9,7 КБ | 25,5 КБ |
| `DrawSVGPlugin.min.js` | 2,2 КБ | 4,4 КБ |

Типичный набор «ядро + ScrollTrigger + SplitText» — около 50 КБ сжатого JS против 1–2 КБ у рецепта. `eval` и `new Function` в этих файлах нет — `'unsafe-eval'` в CSP не нужен.

### Лицензия своими словами

Первоисточник: https://gsap.com/standard-license (действует с 30.04.2025, © Webflow).

- GSAP со всеми плагинами (ScrollTrigger, SplitText, Flip, MorphSVG, DrawSVG…) бесплатен, в том числе в коммерческих проектах: на любом сайте, в веб-приложении, в лендинге под заказ клиента.
- ИИ-инструментам можно генерировать код на GSAP — это прямо сказано в FAQ лицензии. Агент, который пишет лендинг, в рамках разрешённого.
- Запрещено без письменного согласия Webflow: встраивать GSAP в визуальные no-code конструкторы анимаций, которые конкурируют с конструктором Webflow. Если вы делаете конструктор, где человек мышкой настраивает анимации на GSAP, — сначала согласование.
- Нельзя удалять или менять уведомления об авторстве и лицензии в файлах GSAP — отсюда правило «заголовок лицензии сохранять».
- Лицензия GSAP — не MIT. Код рецептов каталога (MIT) и GSAP живут по разным правилам; рядом с файлами GSAP в проекте ничего дополнительно класть не нужно, кроме их собственного заголовка.
- На странице лицензии в коде остался закомментированный старый абзац о плате с конечных пользователей — в действующий текст он не входит.

### Подключение под строгий CSP

1. **Не с CDN.** Проекту со сборкой — `npm i gsap` и импорт по подпутям (`import { ScrollTrigger } from 'gsap/ScrollTrigger'`), сборщик кладёт код в ваш бандл. Баннер лицензии при минификации сохранять (`/*! … */` — большинство минификаторов сохраняет такие комментарии; проверьте в итоговом файле).
2. **Опубликованный лендинг без сборки** — свои копии UMD-файлов из пакета (`node_modules/gsap/dist/gsap.min.js` и нужные плагины) рядом со страницей, заголовок `/*! GSAP 3.x … @license … Subject to the terms at https://gsap.com/standard-license */` не трогать.
3. **Обычный `<script defer>`, не `type="module"`.** Страница, опубликованная в песочнице (`CSP: sandbox`), живёт с origin `null`: модульный скрипт браузер загружает через CORS и без заголовка `Access-Control-Allow-Origin` не выполнит. Классический скрипт CORS не требует. Порядок: ядро, плагины, ваш код — все с `defer`.
4. **`gsap.matchMedia` с обоими условиями в одном вызове.** Если описать только `(prefers-reduced-motion: no-preference)`, при уменьшении движения код молча не выполнится — а всё, что вы спрятали заранее, останется спрятанным.

```html
<!-- в конце <body>: свои файлы, классические скрипты, заголовки лицензии внутри файлов сохранены -->
<script src="js/gsap.min.js" defer></script>
<script src="js/ScrollTrigger.min.js" defer></script>
<script src="js/story.js" defer></script>
```

```js
// js/story.js — UMD-сборки кладут gsap и ScrollTrigger в window
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)', phone: '(max-width: 767px)' }, ({ conditions }) => {
  if (conditions.reduce || conditions.phone) return; // конечное состояние — то, что свёрстано в HTML/CSS; сцена с закреплением на телефоне заменяется стопкой
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.story', start: 'top top', end: '+=2400', pin: true, scrub: true } })
    .from('.story__claim-1', { opacity: 0, y: 20 })
    .to('.story__shot', { scale: 1.15 });
}); // при смене настройки matchMedia сам откатывает созданные анимации
```

Правила: в `scrub` — только `ease: 'none'` (кривая спорит с прокруткой); 600–1000px прокрутки на шаг сцены; прятать элементы до старта через `gsap.set` внутри `mm.add`, а не в CSS, либо свёрстанное в CSS состояние должно быть конечным; в `from`-анимациях помнить `immediateRender` — элемент прячется сразу, поэтому не на первом экране.

## Lottie

### Почему не dotLottie

Плеер `@lottiefiles/dotlottie-web` (0.80) рисует через WebAssembly: файл `dotlottie-player.wasm` весит 1,24 МБ (496 КБ сжатым) и по умолчанию грузится с `cdn.jsdelivr.net`. Для строгого CSP это три отказа сразу: внешний адрес, `WebAssembly` требует `'wasm-unsafe-eval'` в `script-src`, а рендер в воркере создаётся из `blob:`. Даже со своим адресом wasm (`setWasmUrl`) половина мегабайта на лендинге — несоразмерная цена за одну анимацию.

### Что брать: `lottie_light` и данные внутри страницы

- Плеер `lottie-web` 5.13.0, файл `build/player/lottie_light.min.js`: только SVG-рендер, без выражений After Effects и без `eval`, UMD, 46,4 КБ сжатым (168,4 КБ без сжатия). Полный `lottie.min.js` и `lottie_svg.min.js` содержат `eval` — строгий CSP их не пропустит.
- Анимацию передавать объектом `animationData` во встроенном скрипте, а не адресом `path`: без `fetch` к чужому или своему серверу и без проблем с CORS у страницы с origin `null`.
- JSON анимации — до 60–80 КБ, только векторы: растровые картинки внутри Lottie (base64) раздувают файл в разы и мылятся на ретине.
- Запуск — когда блок в кадре (IntersectionObserver), вне кадра — пауза. Цикл — только с паузой по кнопке (WCAG 2.2.2) и не дольше нескольких повторов.
- Рамка с `aspect-ratio` под пропорцию анимации и SVG-заглушкой первого кадра: место занято до загрузки, сдвига макета нет.
- Никогда не LCP: не главный элемент первого экрана. Маскот сбоку от заголовка — да; анимация вместо заголовка — нет.
- `prefers-reduced-motion: reduce` — не запускать, а показать последний кадр: `goToAndStop(последний, true)`.
- Уместно: готовая анимация из After Effects — маскот сбоку первого экрана, «успех» после отправки формы, 3–4 иконки преимуществ. Для галочки, линии, счётчика Lottie не нужен — есть рецепты `form-success`, `svg-line-draw`, `counter-up`.

```html
<figure class="lottie-box" aria-hidden="true">
  <!-- заглушка: первый кадр анимации как обычный SVG, 1–3 КБ; плеер заменит её -->
  <svg viewBox="0 0 400 300"><!-- … --></svg>
</figure>
<script src="js/lottie_light.min.js" defer></script>
<script>
  // animationData — содержимое JSON-файла анимации (до 60–80 КБ), вставленное прямо сюда
  window.__lottieData = { "v": "5.7.4", "fr": 30, "ip": 0, "op": 60, "w": 400, "h": 300, "layers": [] };
</script>
<script src="js/lottie-start.js" defer></script>
```

```css
.lottie-box { margin: 0; aspect-ratio: 400 / 300; max-width: 400px; } /* пропорция = w / h анимации */
.lottie-box svg { display: block; width: 100%; height: 100%; }
```

```js
// js/lottie-start.js
(() => {
  const box = document.querySelector('.lottie-box');
  if (!box || !window.lottie || !window.__lottieData) return; // остаётся заглушка
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  box.replaceChildren(); // убрать заглушку
  const anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: window.__lottieData });
  anim.addEventListener('DOMLoaded', () => {
    if (reduce.matches) { anim.goToAndStop(anim.totalFrames - 1, true); return; } // последний кадр, без движения
    new IntersectionObserver((es) => { es[es.length - 1].isIntersecting ? anim.play() : anim.pause(); }, { threshold: 0.3 }).observe(box);
  });
})();
```

Если анимация несёт смысл (не декор), снимите `aria-hidden` у рамки и дайте ей `role="img"` с `aria-label`, пересказывающим, что на ней.
