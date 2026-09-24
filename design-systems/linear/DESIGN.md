# Linear

> Описание эстетики по открытым материалам. Проект не аффилирован с Linear; товарные знаки принадлежат их владельцам. Логотипы и фирменные шрифты не используются.

Почти чёрный холст с лёгкой синевой, светло-серый текст и один цветной акцент — лавандово-синий. Иерархию держат не тени, а лесенка графитовых поверхностей с рамками в 1px. Крупные заголовки с плотным отрицательным трекингом, компактные кнопки с углом 8px, а главный герой каждого экрана — панель с интерфейсом продукта.

**Подходит:** SaaS и IT-продукты, B2B-сервисы, разработка и внедрение, ИИ-сервисы и автоматизация, агентства с инженерной подачей, IT-обучение и курсы для команд. **Цели:** запись на демо, запись на консультацию, запись на пилот, доверие к технологии. **Настроение:** тёмный, точный, технологичный, сдержанно-премиальный, спокойный.

## Цвета

| Роль | Светлая | Тёмная |
|---|---|---|
| background | `#ffffff` | `#010102` |
| surface | `#f5f6f6` | `#0f1011` |
| surface_2 | `#eeeff1` | `#141516` |
| surface_3 | `#e8e9ec` | `#18191a` |
| text | `#111215` | `#f7f8f8` |
| text_muted | `#62666d` | `#8a8f98` |
| text_secondary | `#3c4149` | `#d0d6e0` |
| text_disabled | `#8a8f98` | `#62666d` |
| border | `#e2e4e8` | `#23252a` |
| border_strong | `#d0d3d9` | `#34343a` |
| border_tertiary | `#c4c8cf` | `#3e3e44` |
| border_input | `#868b94` | `#62666d` |
| primary | `#5e6ad2` | `#5e6ad2` |
| primary_pressed | `#505cc4` | `#505cc4` |
| primary_ring | `#9aa2ec` | `#828fff` |
| on_primary | `#ffffff` | `#ffffff` |
| accent | `#111215` | `#ffffff` |
| accent_hover | `#25262b` | `#e6e7e9` |
| on_accent | `#f7f8f8` | `#010102` |
| link | `#4e5ac2` | `#828fff` |
| focus_ring | `#5e6ad2` | `#828fff` |
| success | `#1a7f35` | `#27a644` |
| error | `#c93636` | `#eb5757` |
| overlay | `#111215` | `#000000` |

## Типографика

| Роль | Шрифт | Вес | Десктоп | Телефон |
|---|---|---|---|---|
| display | Inter | 600 | 64px | 38px |
| h2 | Inter | 600 | 44px | 30px |
| h3 | Inter | 500 | 22px | 19px |
| lead | Inter | 400 | 19px | 17px |
| body | Inter | 400 | 16px | 16px |
| body_sm | Inter | 400 | 15px | 15px |
| caption | Inter | 400 | 13px | 13px |
| eyebrow | Inter | 500 | 13px | 13px |
| button | Inter | 500 | 15px | 16px |
| mono | JetBrains Mono | 400 | 13px | 12px |

## Раскладка лендинга

Выравнивание по левому краю контейнера. Сверху бейдж-статус с точкой («Запуск за 7 дней»). Ниже H1 в 1–2 строки: ширина до 20ch, сам заголовок до 45 знаков (русские слова длиннее английских, при 18ch он ломается на три строки). Под ним лид 19px цветом text_muted до 56ch. Пара кнопок: button_primary «Оставить заявку» (якорь #lead) и button_ghost «Как это работает». Под кнопками строка доверия caption: срок ответа и «без спама». Ниже с отступом 64px — product_panel на всю ширину контейнера с макетом интерфейса результата; низ панели растворяется в фоне маской. Никаких фоновых фото, пятен и свечений.

Порядок секций: nav → hero → logos → problem → features → how → proof → pricing → faq → lead_form → footer

Поля страницы 16px, горизонтальной прокрутки нет. H1 64 → 38px, H2 44 → 30px, секции 96 → 64px. У html стоит lang=ru, у заголовков hyphens: auto и overflow-wrap: break-word: одно слово в 17+ букв («персонализированный») при 38px шире экрана 375px — в H1 такие слова не ставить. Кнопки hero на всю ширину, высота 48px, друг под другом. Панель продукта масштабируется целиком, не обрезается. Меню — бургер ниже 768px. После прокрутки hero снизу появляется липкая полоса surface с рамкой сверху и button_primary «Оставить заявку». Форма в одну колонку, поля 48px.

## Форма заявки

Панель surface с рамкой border, радиус lg, отступ 32px (на телефоне 20px). Метки над полями 13px text_muted, поля input высотой 44px. Галочки согласия — компонент checkbox. Главная кнопка на всю ширину формы, высота 48px, текст «Оставить заявку». Под кнопкой caption text_muted: «Ответим за 15 минут в рабочее время». Поля: name, phone, comment. Согласие 152-ФЗ: да.

## Делать

- Держать тёмный холст #010102 основой, а иерархию строить лесенкой поверхностей и рамками 1px, а не тенями.
- Лавандовый #5e6ad2 ставить только на главную кнопку, отмеченную галочку, фокус и ссылки; на экране — не больше одной лавандовой кнопки (кнопка в шапке серая).
- Заголовки набирать Inter 600 с плотным отрицательным трекингом (−0.032em на 64px), текст — 400; жирнее 600 не брать.
- В ключевых разделах показывать результат в интерфейсе: панель с макетом продукта, статус-точками и моноширинными номерами.
- Держать радиусы по ролям: кнопки и поля 8px, карточки 12px, панели продукта 16px, пилюля — только у бейджей и переключателей.
- Писать сроки и цифры конкретно («ответим за 15 минут», «запуск за 7 дней»): стиль держится на точности.

## Не делать

- Не заливать лавандой фон секций и карточек и не добавлять второй яркий цвет.
- Не использовать атмосферные градиенты, свечения, «прожекторы» и стоковые фото — вместо них панель интерфейса.
- Не скруглять главную кнопку в пилюлю — в том числе в липкой полосе и в форме, где рецепты анимаций по умолчанию ставят 999px.
- Не брать чистый #000000 для фона страницы (он только под модальным окном) и чистый #ffffff для основного текста в тёмной теме.
- Не осветлять фон главной кнопки на наведении до #828fff: белый текст перестаёт читаться, вместо этого — кольцо.
- Не ставить эмодзи, кричащие бейджи и мигающую анимацию на кнопку.

## Анимации

`hero-text-reveal`, `fade-up-stagger`, `image-reveal-clip`, `marquee-logos`, `counter-up`, `accordion-smooth`, `form-success`, `sticky-cta-mobile` — рецепты: GET /api/agent/motion/{slug}

## A/B-тест

Менять: {"hero_layout":["left_panel_below","split_panel_right"],"cta_color_role":["primary","accent"],"headline_scale":["xl","l"],"motion_level":["none","subtle"],"social_proof_position":["under_hero","before_form"],"form_position":["bottom","hero_side"],"theme":["dark","light"]}. Не трогать: palette, fonts, radius, surface_ladder, single_accent.

## Инструкция верстальщику

Build a dark-first ad landing page in a Linear-inspired style; dark is the default, never switched by prefers-color-scheme. Near-black canvas #010102; hierarchy comes from a surface ladder (#0f1011, #141516, #18191a) and 1px hairline borders (#23252a), not shadows. Text #f7f8f8, muted #8a8f98. One chromatic accent: lavender #5e6ad2 with white text, only on the single primary CTA per viewport and checked checkboxes; focus rings 2px solid #828fff. Self-host @fontsource-variable/inter/opsz.css and declare font-family 'Inter Variable'; H1 weight 600, 64px (38px mobile), tracking -0.032em, line-height 1.08; body 16px/1.55; JetBrains Mono only for IDs. Radii: buttons and inputs 8px, cards 12px, product panels 16px. Input borders #62666d for 3:1 contrast. Hero: left-aligned status badge, headline, muted lead, two CTAs, then a full-width product-UI panel fading into the canvas. No gradients, glows, stock photos, pill CTAs or emoji. Lead form: name, phone, unchecked 152-FZ consent.
