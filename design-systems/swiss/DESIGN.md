# Швейцарский

> Собственный стиль Вайб-Маркетолога.

Интернациональный типографский стиль под рекламный лендинг: строгая 12-колоночная сетка, всё по левому краю, крупный гротеск против мелкого текста и много белого поля. Разделы открываются чёрной линейкой и моноширинным индексом 01, 02. Цвет один — сигнальный красный, и он появляется точечно: маркер, главная цифра, наведение на кнопку. Ноль скруглений, теней и градиентов.

**Подходит:** юридические услуги и адвокаты, консалтинг и аудит, бухгалтерия и налоги, B2B-услуги и производство, архитектурные и инженерные бюро, HR и подбор для компаний, IT-интеграторы и внедрение. **Цели:** запись на консультацию, запрос расчёта или коммерческого предложения, звонок, запись на встречу, доверие к экспертизе. **Настроение:** строгий, точный, уверенный, светлый, редакционный, спокойный.

## Цвета

| Роль | Светлая | Тёмная |
|---|---|---|
| background | `#FFFFFF` | `#0B0B0A` |
| surface | `#F3F3F1` | `#161615` |
| surface_2 | `#E9E9E6` | `#20201E` |
| text | `#0A0A0A` | `#F4F4F1` |
| text_muted | `#595955` | `#A1A19B` |
| text_disabled | `#8C8C87` | `#6B6B67` |
| border | `#DADAD6` | `#2F2F2C` |
| border_strong | `#0A0A0A` | `#F4F4F1` |
| border_input | `#0A0A0A` | `#8A8A85` |
| primary | `#0A0A0A` | `#F4F4F1` |
| primary_hover | `#DA291C` | `#DA291C` |
| on_primary | `#FFFFFF` | `#0B0B0A` |
| on_primary_hover | `#FFFFFF` | `#FFFFFF` |
| accent | `#DA291C` | `#DA291C` |
| accent_hover | `#B01E14` | `#B01E14` |
| on_accent | `#FFFFFF` | `#FFFFFF` |
| accent_text | `#C4221A` | `#FF5A4B` |
| link | `#0A0A0A` | `#F4F4F1` |
| link_hover_underline | `#DA291C` | `#FF5A4B` |
| focus_ring | `#0A0A0A` | `#F4F4F1` |
| selection_bg | `#DA291C` | `#DA291C` |
| selection_text | `#FFFFFF` | `#FFFFFF` |
| success | `#1B7A36` | `#4CC36E` |
| error | `#B3261E` | `#FF6B5E` |
| band_bg | `#0A0A0A` | `#161615` |
| band_text | `#F4F4F1` | `#F4F4F1` |
| band_muted | `#A1A19B` | `#A1A19B` |
| band_accent | `#FF5A4B` | `#FF5A4B` |
| band_border | `#2F2F2C` | `#2F2F2C` |
| overlay | `#0A0A0A` | `#000000` |

## Типографика

| Роль | Шрифт | Вес | Десктоп | Телефон |
|---|---|---|---|---|
| scale_note |  |  |  |  |
| display | Geist | 600 | 88px | 40px |
| h2 | Geist | 600 | 56px | 32px |
| h3 | Geist | 600 | 24px | 20px |
| lead | Geist | 400 | 22px | 18px |
| body | Geist | 400 | 18px | 16px |
| small | Geist | 400 | 15px | 15px |
| caption | Geist | 400 | 13px | 13px |
| eyebrow | Geist Mono | 500 | 12px | 12px |
| index | Geist Mono | 500 | 14px | 13px |
| stat | Geist | 600 | 80px | 52px |
| quote | Geist | 400 | 32px | 22px |
| button | Geist | 500 | 16px | 16px |
| price | Geist | 600 | 24px | 20px |

## Раскладка лендинга

Выравнивание по левому краю сетки 12 колонок, фона и картинок нет. Верхний ряд: колонки 1–6 — badge с красным квадратом («АРБИТРАЖ · МОСКВА»), колонки 9–12 — caption text_muted «С 2009 года · 340 дел в арбитраже». Отступ секции сверху 48px. Ниже верхнего ряда с отступом 32px — H1 display 88px в колонках 1–11, строго две строки, text-wrap: balance. Отступ 48px, линейка 1px border на всю ширину. Под ней с отступом 24px: колонки 1–5 — lead 22px text_muted до 48ch (две-три строки), под ним с отступом 32px button_primary и caption «Ответим за 30 минут в рабочее время»; колонки 7–12 — три коротких факта в ряд по 2 колонки: stat 40px и подпись small, первая цифра — accent_text. Кнопка обязана быть видна без прокрутки на 1366×657 (замер Playwright, Geist 600, шапка 72px, lead в три строки: две строки 88px — низ кнопки на 605px, две строки 96px — 621px, три строки 88px — 693px, то есть под сгибом). Поэтому заголовок держат в две строки по лимитам typography.display.length_limits.

Порядок секций: nav → hero → proof_bar → problem → services → how → numbers → cases → team → pricing → testimonials → faq → lead_form → footer

Поля 16px, горизонтальной прокрутки нет. H1 88 → 40px (или clamp из size_fluid), H2 56 → 32px, stat 80 → 52px, секции 144 → 80px. Сетка 4 колонки: все асимметричные пары становятся столбиком. Первый экран на телефоне идёт в порядке badge → caption «С 2009 года» → H1 → lead → кнопка → факты, и отступы в нём тесные, а не десктопные: сверху 24px, между badge и caption 8px, до H1 16px, от H1 до линейки 24px, от линейки до lead 16px, от lead до кнопки 24px. Замер (Playwright, Geist, шапка 56px, H1 40px в четыре строки, lead 18/28 в четыре строки): низ кнопки на 541px — над сгибом даже на iPhone SE в Safari (375×553); с десктопными отступами было бы 621px, то есть под сгибом. Lead на телефоне — до 110 знаков. Факты — строками с линейкой 1px, цифра 32px в колонке 96px слева, подпись справа; три факта в ряд на 358px ломают подписи по слогам. section_header — index и eyebrow в одну строку над H2. Кнопки на всю ширину, 56px. Таблица цен и кейсы превращаются в блоки без горизонтальной прокрутки. Шапка 56px: название, иконка телефона, кнопка «Заявка» (см. components.nav.mobile). После ухода кнопки первого экрана снизу появляется sticky_cta. Переносы — по правилу typography.scale_note (hyphenate-limit-chars), на кнопках переносов нет.

## Форма заявки

Раздел с section_header: index, eyebrow «ЗАЯВКА» и H2 «Разберём вашу ситуацию за 30 минут» в колонках 3–10 — других H2 в разделе нет. Ниже сетка 5/7: колонки 1–5 — три пронумерованные строки «что будет после заявки» (index 01 перезвоним, 02 зададим 3–4 вопроса, 03 назовём варианты и цену); колонки 7–12 — форма без панели прямо на фоне: поля input 56px с рамкой 1px border_input, промежуток 24px, метки над полями, чекбокс согласия, button_primary на всю ширину колонки со стрелкой «Получить консультацию», под кнопкой caption text_muted «Ответим за 30 минут · пн–пт 9:00–19:00 (МСК)». На телефоне — столбик: H2, сразу форма, пункты «что будет» после формы. Поля: name, phone, comment. Согласие 152-ФЗ: да.

## Делать

- Всё выравнивать по левому краю колонок 12-колоночной сетки: асимметрия 5/7 и 4/8, рваный правый край, пустые колонки оставлять пустыми; по правому краю — только цены и цифры в таблицах.
- Строить иерархию размером и весом одного гротеска: заголовок 88px против текста 18px, начертания только 400, 500, 600; Geist Mono — лишь для индексов и надзаголовков.
- Акцент — красный #DA291C (или один набор из accent_variants на всю страницу) — держать единственным цветом и ставить точечно: квадрат-маркер, одна главная цифра, полоса прогресса, наведение на кнопку — не больше трёх красных мест на экране; красный текст мельче 24px — только accent_text.
- Открывать каждый раздел одинаково: линейка 2px, индекс «02», надзаголовок и H2 — и разделять строки линейками 1px, а не карточками.
- Писать конкретно и проверяемо: срок ответа, цена «от» с составом, число дел с периодом, город.
- Фото брать монохромные и документальные, прямоугольные, с подписью под кадром.
- Держать кнопку первого экрана над сгибом: H1 в две строки на десктопе (до 40 знаков при 88px), на телефоне — тесные отступы первого экрана из layout.mobile_notes.

## Не делать

- Не скруглять кнопки, поля, фото и ячейки и не добавлять тени, стекло и градиенты-заливки (линии сетки через repeating-linear-gradient в варианте grid_lines — разрешённое исключение).
- Не вводить второй акцентный цвет и не заливать красным фон разделов и карточек; зелёный success и error — только для состояний формы.
- Не центрировать заголовки, абзацы и экран «Заявка принята» и не выравнивать текст по ширине.
- Не использовать швейцарский крест, флаг и надписи «Swiss made»: это стиль, а не страна происхождения, а крест защищён законом.
- Не сообщать об ошибке только красной рамкой: у ошибки всегда иконка и текст, потому что красный в стиле уже занят акцентом.
- Не ставить эмодзи, весы Фемиды, молоток судьи и стоковые рукопожатия.
- Не вставлять рецепты motion как есть: у accordion-smooth, form-success и sticky-cta-mobile по умолчанию скругления, тени, центрирование и перелёт значка — сначала переопределения из motion_map.

## Анимации

`hero-text-reveal`, `fade-up-stagger`, `counter-up`, `scroll-progress-bar`, `image-reveal-clip`, `accordion-smooth`, `form-success`, `sticky-cta-mobile` — рецепты: GET /api/agent/motion/{slug}

## A/B-тест

Менять: {"hero_layout":["type_only","split_photo","hero_side_form"],"cta_color_role":["primary","accent"],"headline_scale":["m","xl","l"],"motion_level":["none","subtle"],"social_proof_position":["under_hero","before_form"],"form_position":["bottom","hero_side"],"theme":["light","dark"],"grid_lines":["hidden","hero"]}. Не трогать: palette, fonts, radius_zero, single_accent, grid_12, flush_left, section_rules.

## Инструкция верстальщику

Build a light Swiss-style (International Typographic Style) ad landing page for a law firm, consultancy or B2B service. Strict 12-column grid: 1280px container, 48px margins, 24px gutters; everything flush left with a ragged right edge, asymmetric 5/7 and 4/8 splits, 144px between sections. One grotesque, self-hosted Geist Variable from npm with cyrillic and latin-ext subsets: headlines 600 at 88px (40px on phones), leading 1.0, tracking -0.035em; body 18/28 at 400; Geist Mono only for section indexes and uppercase eyebrows. Palette: white, ink #0A0A0A, muted #595955, hairlines #DADAD6 and one accent, signal red #DA291C, for square markers, one key figure and the button hover; small red text uses #C4221A. Zero radius, no shadows, no gradients, nothing centred. Every section opens with a 2px ink rule, a mono index and an H2. Black 56px buttons with a right arrow. Form: name, phone, optional note, unchecked 152-FZ consent.
