# Сниппеты к навыку hypothesis-lab

Всё — ванильный JavaScript без зависимостей: работает в Node (`node ab.mjs`) и в консоли браузера.
Проверено 24.09.2026: числа совпадают с таблицами `SKILL.md`, сплит — в Chromium (40 новых
посетителей, закрепление кукой после перезагрузки, `?v=b`, бот видит A без куки).

## 1. Калькулятор: выборка, z-тест, интервал, проверка сплита, бюджет

```js
// erfc с точностью ~1e-7 (Numerical Recipes)
function erfc(x) {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418
    + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587
    + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}

// Визитов на вариант: α = 5 % (двусторонний), мощность 80 %; не меньше 50 заявок в варианте A
function sampleSize(p1, p2, minLeads = 50) {
  const n = (1.96 + 0.84) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2)) / (p2 - p1) ** 2;
  return Math.ceil(Math.max(n, minLeads / p1));
}

// z-тест двух долей: va/la — визиты/заявки A, vb/lb — Б
function zTest(va, la, vb, lb) {
  const pa = la / va, pb = lb / vb, p = (la + lb) / (va + vb);
  const se = Math.sqrt(p * (1 - p) * (1 / va + 1 / vb));
  const z = (pb - pa) / se, pValue = erfc(Math.abs(z) / Math.SQRT2);
  const se2 = Math.sqrt(pa * (1 - pa) / va + pb * (1 - pb) / vb);   // для интервала — без объединения
  const ci = [(pb - pa) - 1.96 * se2, (pb - pa) + 1.96 * se2];
  let verdict;
  if (va < 50 || vb < 50 || la + lb < 5) verdict = 'рано судить';
  else if (pValue < 0.05) verdict = `победил ${pb > pa ? 'Б' : 'A'} (p < 0,05)`;
  else verdict = `лидирует ${pb > pa ? 'Б' : 'A'}, разница в пределах случайности`;
  return { pa, pb, z, pValue, ci, verdict };
}

// Сплит не сломан? Визиты A и Б при делении 50/50: |z| > 3 — ищите поломку
function srm(va, vb) { return (va - vb) / Math.sqrt(va + vb); }

// Бюджет трафика: визиты на вариант × 2 варианта × цена клика
function budget(nPerVariant, cpc) { return nPerVariant * 2 * cpc; }

const pct = x => (x * 100).toFixed(2) + ' %';
console.log('3→5 %:', sampleSize(0.03, 0.05), '5→7 %:', sampleSize(0.05, 0.07), '5→6 %:', sampleSize(0.05, 0.06));
const r = zTest(1800, 54, 1790, 84);
console.log('A', pct(r.pa), 'Б', pct(r.pb), 'z', r.z.toFixed(2), 'p', r.pValue.toFixed(4),
  'интервал', r.ci.map(pct).join(' … '), '—', r.verdict);
console.log('SRM z =', srm(1800, 1790).toFixed(2), '| бюджет 5→7 % при клике 35 ₽:', budget(sampleSize(0.05, 0.07), 35), '₽');
```

Вывод:

```
3→5 %: 1667 5→7 %: 2207 5→6 %: 8146
A 3.00 % Б 4.69 % z 2.64 p 0.0083 интервал 0.44 % … 2.95 % — победил Б (p < 0,05)
SRM z = 0.17 | бюджет 5→7 % при клике 35 ₽: 154490 ₽
```

`sampleSize(0.03, 0.05)` даёт 1 667, а не 1 500: сработал пол «50 заявок в A» (50 ÷ 0,03).
Вердикт `zTest` — только арифметика: «победил» до плановой выборки и даты — это подглядывание.

## 2. Сплит на своём хостинге: одна страница, два варианта одного элемента

Для теста одного элемента (заголовок, оффер, кнопка, форма) обе версии лежат в ОДНОМ файле, а
скрипт в `<head>` выбирает вариант до отрисовки — без редиректа и без мерцания. Для двух целиком
разных страниц нужен сплит на сервере или Вариокуб «Редирект».

Порядок в `<head>`: сначала код счётчика Метрики (он ставит вызовы `ym` в очередь, даже пока
счётчик грузится), потом этот скрипт, потом стили.

```html
<script>
(function () {
  var TEST = 'ab_offer_1';          // своё имя на каждый тест
  var YM_ID = 12345678;             // номер счётчика Метрики
  var DAYS = 30;
  var v = null;
  try {
    var m = document.cookie.match('(?:^|; )' + TEST + '=([ab])');
    var forced = (new URLSearchParams(location.search).get('v') || '').toLowerCase();
    var bot = /bot|crawl|spider|slurp|yandex|google|bing|headless|lighthouse|telegrambot|vkshare|whatsapp/i.test(navigator.userAgent);
    if (forced === 'a' || forced === 'b') v = forced;          // ?v=a / ?v=b — для проверки и для ссылок из объявлений
    else if (m) v = m[1];                                        // вернувшийся посетитель видит свой вариант
    else v = bot ? 'a' : (Math.random() < 0.5 ? 'a' : 'b');      // роботы и превью мессенджеров — всегда A
    if (!bot) document.cookie = TEST + '=' + v + '; max-age=' + DAYS * 86400 + '; path=/; SameSite=Lax';
  } catch (e) { v = 'a'; }
  document.documentElement.setAttribute('data-ab', v);
  window.AB = { test: TEST, variant: v, ym: YM_ID };
  if (typeof ym === 'function') { var p = {}; p[TEST] = v; ym(YM_ID, 'params', p); }   // параметр визита
})();
</script>
<style>
  html[data-ab="a"] .ab-b, html[data-ab="b"] .ab-a { display: none; }
</style>
```

Разметка варианта:

```html
<h1>
  <span class="ab-a">Кухни на заказ в Казани в рассрочку 0 %</span>
  <span class="ab-b">Кухни на заказ в Казани с монтажом за 21 день</span>
</h1>
```

Вариант в каждой заявке и цель в Метрике:

```html
<form data-lead-form>
  <input type="hidden" name="ab_variant">
  …
</form>
<script>
  document.querySelectorAll('input[name="ab_variant"]').forEach(function (i) { i.value = AB.variant; });
  // вызвать ПОСЛЕ ответа сервера «заявка принята», а не по клику на кнопку
  function onLeadSent() { var p = {}; p[AB.test] = AB.variant; ym(AB.ym, 'reachGoal', 'lead', p); }
</script>
```

Как считать итог:
- **заявки** — из своей базы по полю `ab_variant` (это правда; цель в Метрике — дубль для отчётов);
- **визиты** — Метрика, отчёт «Параметры визитов» с фильтром по `ab_offer_1`, или свой счётчик
  показов по вариантам;
- числа — в `zTest()` выше, раз в неделю и в плановую дату решения.

Ограничения самоделки, о которых надо помнить: нет автоматического p-value и защиты от
подглядывания; кука живёт в одном браузере (человек с телефона и с ноутбука может увидеть оба
варианта); смена имени `TEST` = новый тест с нуля.
