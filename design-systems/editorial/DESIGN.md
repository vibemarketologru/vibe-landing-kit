# Журнал

> Собственный стиль Вайб-Маркетолога.

Лендинг как разворот журнала: тёплая бумага и чернила, крупная контрастная антиква с одним-тремя словами курсивом, тонкие линейки и номера разделов, рубрики капсом, колонки текста с буквицей. Главный герой — живая фотография с подписью. Один акцент-киноварь, прямые углы, цены списком с отточием, как в меню.

**Подходит:** рестораны, кафе, бары и кофейни, пекарни и кондитерские, эксперты, консультанты и частные практики, онлайн-курсы, интенсивы и авторские школы, бренды одежды, шоурумы и ателье, дизайн интерьера и фотостудии, гостиницы, загородные базы и гастро-туры. **Цели:** бронь стола и запись, запись на консультацию, продажа курса и запись на поток, визит в шоурум и примерка, доверие к автору и бренду через историю. **Настроение:** журнальный, тёплый, дорогой без показной роскоши, спокойный, авторский, бумажный.

## Цвета

| Роль | Светлая | Тёмная |
|---|---|---|
| background | `#F5F0E7` | `#14110E` |
| surface | `#ECE4D6` | `#1E1A16` |
| text | `#1B1713` | `#F2EBDF` |
| text_muted | `#5C5247` | `#B9AE9F` |
| border | `#D8CDBC` | `#3A332B` |
| primary | `#1B1713` | `#F2EBDF` |
| on_primary | `#F8F4EC` | `#14110E` |
| accent | `#A3321F` | `#E2735B` |
| on_accent | `#FFFFFF` | `#14110E` |
| link | `#8E2B1B` | `#F0937D` |
| success | `#2E6A3A` | `#7FC08C` |
| error | `#B0281D` | `#F07F72` |
| raised | `#FCFAF5` | `#27221D` |
| rule | `#1B1713` | `#CFC6B8` |
| primary_hover | `#3A322A` | `#DCD2C2` |
| primary_active | `#000000` | `#FFFFFF` |
| accent_hover | `#86271A` | `#EC8A74` |
| link_hover | `#6E2014` | `#F6B09F` |
| focus_ring | `#A3321F` | `#E2735B` |
| border_input | `#8A7E6F` | `#8C8171` |
| highlight | `#EBD9B4` | `#3B301F` |
| tint | `#E6DCC8` | `#2A241D` |
| photo_placeholder | `#D9CDB9` | `#2E2821` |
| success_bg | `#E2EBDD` | `#1C2A1F` |
| error_bg | `#F6E1DA` | `#3A1E1A` |
| disabled_bg | `#E3DACB` | `#2A251F` |
| disabled_text | `#7D7266` | `#8A7F71` |
| on_photo | `#FFFFFF` | `#FFFFFF` |
| selection | `#EBD9B4` | `#3B301F` |

## Типографика

| Роль | Шрифт | Вес | Десктоп | Телефон |
|---|---|---|---|---|
| display | Playfair | 500 | 88px | 44px |
| h2 | Playfair | 500 | 56px | 34px |
| h3 | Playfair | 600 | 26px | 22px |
| h4 | Source Serif 4 | 600 | 20px | 19px |
| lead | Source Serif 4 | 400 | 23px | 19px |
| body | Source Serif 4 | 400 | 18px | 17px |
| body_sans | Golos Text | 400 | 17px | 16px |
| kicker | Golos Text | 600 | 13px | 12px |
| label | Golos Text | 500 | 15px | 15px |
| nav | Golos Text | 500 | 13px | 14px |
| button | Golos Text | 600 | 15px | 15px |
| caption | Golos Text | 400 | 13px | 13px |
| masthead | Playfair | 600 | 26px | 22px |
| stat | Playfair | 400 | 80px | 44px |
| index | Playfair | 400 | 30px | 26px |
| quote | Playfair | 400 | 40px | 28px |
| testimonial | Source Serif 4 | 400 | 21px | 18px |
| dropcap | Playfair | 600 | 4.9em | 4.9em |
| price | Source Serif 4 | 600 | 19px | 18px |

## Раскладка лендинга

Разворот журнала (hero_layout = split). Сверху строка выходных данных (адрес, часы, телефон) и шапка с названием антиквой. Ниже 12 колонок: слева (1–6) рубрика-kicker с линейкой, заголовок display в 2–3 строки (до 14ch), где 1–3 ключевых слова курсивом; лид Source Serif 23px до 44ch; чернильная кнопка + текстовая ссылка со стрелкой; строка доверия caption (рейтинг с числом отзывов, год основания — только проверяемое). Справа (7–12) вертикальное фото 4:5 высотой до 78svh без скругления и тени, fetchpriority="high", под ним подпись с автором. Верх заголовка и верх фото на одной линии. Под разворотом — полоса «Содержание» с курсивными номерами 01–05.

Порядок секций: issue_line → nav → hero → toc → press → features → story → gallery → numbers → offer → testimonials → faq → lead_form → footer

Одна колонка, поля 16px, разделы через 72px. Строка выходных данных скрыта; шапка 56px: название + кнопка «Бронь». Заголовок 44px (headline_scale = l — 38px), до 4 строк; курсив до 12 знаков включительно не переносится (white-space: nowrap у <em>), длиннее — nowrap не ставить. Цифры «Цифр» — в 2 колонки. Кнопка во всю ширину, 56px, под ней текстовая ссылка. Фото первого экрана — после кнопок, во всю ширину экрана без полей (margin-inline: -16px) 4:5, подпись с полями. «Содержание» — сетка 2×2. Текст в одну колонку, буквица на 3 строки, выноска 28px. Меню: цена под названием, если не помещается в строку. Тарифы друг под другом, выделенный первым. Форма после шагов, поля 56px. Липкая кнопка появляется после ухода кнопки первого экрана и прячется у формы. Горизонтальной прокрутки нет ни на одном экране — проверять document.documentElement.scrollWidth ≤ innerWidth на 360 и 390px.

## Форма заявки

Вкладка surface во всю ширину экрана, внутри 5/7. Слева: kicker «Бронь» или «Заявка», h2 с одним словом курсивом («Забронируйте стол <em>заранее</em>»), три шага «что будет после заявки» с курсивными номерами index accent, телефон ссылкой tel: для тех, кто хочет позвонить сам. Справа form_card: бумага raised, рамка 1px rule, сверху 3px rule, углы 0, отступ 40px (24px на телефоне), тень raised. Подписи Golos 500 15px над полями, поля 52px (56px на телефоне), рамка 1px border_input, промежуток 20px; дата и гости — в одну строку двумя колонками на десктопе. Чекбокс согласия. Кнопка во всю ширину карточки 56px — button_primary (или button_accent при cta_color_role = accent), текст — глагол результата. Под кнопкой caption: «Перезвоним в течение 15 минут в рабочее время» — только если правда. Поля: name, phone. Согласие 152-ФЗ: да.

## Делать

- Заголовки — Playfair из файлов opsz с font-optical-sizing: auto и размером через clamp (88px на компьютере, 44px на телефоне), 1–3 слова курсивом того же цвета: это голос стиля.
- Каждый раздел открывать линейкой 1px, рубрикой-kicker и номером раздела; отделять разделы воздухом 128/72px, а не плашками и тенями.
- Делать фотографию героем: живые кадры с естественным светом в пропорциях 4:5, 3:2, 1:1 и подпись под каждым снимком.
- Держать одну заливную кнопку на экран — чернильный прямоугольник (при cta_color_role = accent — киноварный) с глаголом результата; второе действие — текстовая ссылка со стрелкой.
- Подавать цены списком с отточием, как меню или прайс в журнале, в рублях и с тем, что входит.
- Набирать текст не шире 66ch; две колонки — только на ≥1024px и только если обе видны на одном экране.
- Раздавать шрифты со своего сервера (cyrillic + latin, swap) и предзагружать один файл заголовка.

## Не делать

- Не класть текст на фото без подложки photo_scrim и замера контраста и не ставить его на лица.
- Не скруглять кнопки, поля, фото и карточки и не давать карточкам тени — тень только у формы и липкой кнопки.
- Не набирать антиквой кнопки, поля, подписи и текст мельче 15px — это роль Golos Text.
- Не набирать заголовки капсом и не разряжать антикву; капс с разрядкой — только у Golos Text: рубрики, навигация, кнопки, служебные подписи.
- Не заливать киноварью фоны и большие площади: она для рубрик, номеров, буквицы, ссылок и — только при cta_color_role = accent — главных кнопок.
- Не брать стоковые улыбки в камеру и картинки с вшитым текстом; не выдавать сгенерированные кадры за блюда, зал, работы и людей клиента.
- Не придумывать «О нас писали», рейтинги, тиражи и «чаще всего выбирают» — только проверяемое.

## Анимации

`hero-text-reveal`, `image-reveal-clip`, `fade-up-stagger`, `scroll-progress-bar`, `parallax-soft`, `counter-up`, `accordion-smooth`, `form-success`, `sticky-cta-mobile` — рецепты: GET /api/agent/motion/{slug}

## A/B-тест

Менять: {"hero_layout":["split","cover"],"headline_scale":["xl","l"],"cta_color_role":["primary","accent"],"body_face":["serif","sans"],"button_case":["upper","sentence"],"motion_level":["none","subtle","rich"],"social_proof_position":["under_hero","before_form"]}. Не трогать: palette, color_preset, fonts_display, radius_none, rules_and_section_numbers, photo_captions, single_cta_color.

## Инструкция верстальщику

Build the landing as a magazine spread; expose tokens as CSS variables --color-<key>. Warm paper #F5F0E7, ink #1B1713, muted #5C5247, hairlines #D8CDBC, insert bands #ECE4D6; one cinnabar accent #A3321F for kickers, section numbers and the single drop cap; underlined links #8E2B1B. Self-host @fontsource-variable packages, cyrillic+latin, swap (families end in 'Variable'). Headlines: Playfair opsz files, font-optical-sizing:auto, 500, clamp(44px, …, 88px), line-height 1.02, max 14ch, one to three words in italics. Standfirst 23px and body 18px/1.65 in Source Serif 4, max 66ch; Golos Text for UI, uppercase tracked kickers, captions and buttons. Square corners, no card shadows; every section opens with a 1px ink rule, kicker and section number. Hero: 6/6 split, headline left, captioned 4:5 photo right, fetchpriority high, never animated; then a numbered contents strip. Prices as a dotted-leader menu. Lead form on raised paper: name, phone, unchecked consent. Dark: #14110E, text #F2EBDF, paper-coloured button, accent #E2735B.
