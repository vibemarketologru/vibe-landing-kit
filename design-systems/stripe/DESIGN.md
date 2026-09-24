# Stripe

> Описание эстетики по открытым материалам. Проект не аффилирован с Stripe; товарные знаки принадлежат их владельцам. Логотипы и фирменные шрифты не используются.

Белый холст, над которым в верхней трети первого экрана разлита сетчатая дымка из кремового, персикового, лавандового, индиго и рубинового. Тонкие заголовки весом 300 со сжатым трекингом, тёмно-синий текст вместо чёрного, одна индиго-пилюля на секцию, табличные цифры в деньгах и макеты интерфейса в карточках с мягкой синеватой тенью.

**Подходит:** финтех и платежи, SaaS и B2B-сервисы, эквайринг, онлайн-кассы, бухгалтерия, IT-интеграторы и разработка, сервисы для малого бизнеса, маркетплейсы и платформы. **Цели:** заявки на подключение, запись на демо, расчёт стоимости, доверие к сложному продукту. **Настроение:** технологичный, светлый, спокойный, дорогой, точный.

## Цвета

| Роль | Светлая | Тёмная |
|---|---|---|
| background | `#ffffff` | `#0a1c30` |
| surface | `#f6f9fc` | `#10263f` |
| text | `#0d253d` | `#f6f9fc` |
| text_muted | `#61718a` | `#a3b4c8` |
| border | `#e3e8ee` | `#22405e` |
| primary | `#533afd` | `#665efd` |
| on_primary | `#ffffff` | `#ffffff` |
| accent | `#1c1e54` | `#b9b9f9` |
| on_accent | `#ffffff` | `#1c1e54` |
| link | `#533afd` | `#a9a4ff` |
| success | `#0e7a44` | `#3dd68c` |
| error | `#df1b41` | `#ff6b8b` |
| text_secondary | `#273951` | `#d3dce7` |
| primary_hover | `#4434d4` | `#533afd` |
| primary_press | `#2e2b8c` | `#4434d4` |
| border_input | `#7690ad` | `#5b7ea3` |
| focus_ring | `#533afd` | `#b9b9f9` |
| badge_bg | `#b9b9f9` | `#262a6b` |
| badge_text | `#2e2b8c` | `#c9c7ff` |
| surface_warm | `#f5e9d4` | `#2b2418` |
| text_on_warm | `#0d253d` | `#f5e9d4` |
| text_muted_on_warm | `#4e5d73` | `#cdbd9f` |
| surface_featured | `#1c1e54` | `#1c1e54` |
| text_on_featured | `#ffffff` | `#ffffff` |
| text_muted_on_featured | `#b9b9f9` | `#b9b9f9` |
| mesh_cream | `#f5e9d4` | `#f5e9d4` |
| mesh_peach | `#ffb37a` | `#ffb37a` |
| mesh_lavender | `#b9b9f9` | `#b9b9f9` |
| mesh_indigo | `#533afd` | `#533afd` |
| mesh_ruby | `#ea2261` | `#ea2261` |
| mesh_magenta | `#f96bee` | `#f96bee` |
| accent_hover | `#2e2b8c` | `#cfcffb` |
| border_on_featured | `#3a3f8a` | `#3a3f8a` |

## Типографика

| Роль | Шрифт | Вес | Десктоп | Телефон |
|---|---|---|---|---|
| display | Inter Tight | 300 | 56px | 36px |
| h2 | Inter Tight | 300 | 48px | 30px |
| h3 | Inter Tight | 300 | 26px | 22px |
| lead | Inter | 300 | 20px | 18px |
| body | Inter | 300 | 18px | 16px |
| caption | Inter | 400 | 13px | 13px |
| eyebrow | Inter | 400 | 15px | 14px |
| button | Inter | 400 | 16px | 16px |
| stat | Inter Tight | 300 | 56px | 40px |
| tabular | Inter | 400 | 14px | 14px |

## Раскладка лендинга

Сетчатая дымка (gradient.hero) лежит отдельным слоем в верхних ~60% экрана и растворяется книзу. Раскладка 6/6: слева — eyebrow цветом text, заголовок display в 2–3 строки (до 60 знаков), lead в 1–2 предложения цветом text_secondary, ряд из button_primary и link_arrow, под ними строка доверия caption с цифрой tnum («Подключили 1 240 компаний»). Справа — mockup, частично заходящий на индиго-рубиновую часть дымки и на 40px за нижний край дымки: белые карточки с тенью «парят» над цветом. Заголовок стоит на светлой левой части дымки (крем, персик, лаванда) в пределах 55% ширины. Высота первого экрана — по содержимому, не 100vh.

Порядок секций: nav → hero → logos → benefits → product_mockup → how → numbers → proof → pricing → faq → lead_form → footer

Одна колонка, боковые поля 16px. Шапка 56px на той же полупрозрачной подложке, бургер 44×44. Дымка превращается в полосу 180–220px над заголовком (тот же градиент, mesh_mask), заголовок уже на белом. Заголовок 36px, h2 30px. Макет первого экрана упрощается до одной карточки с цифрами и уходит под кнопки. Кнопки на всю ширину, высота 48px. Тарифы — вертикальный список, «Лучший выбор» первым. Линия цифр — сетка 2×2. Лента логотипов — горизонтальная прокрутка или marquee. Внизу — липкая кнопка «Оставить заявку», которая скрывается, когда форма на экране.

## Форма заявки

Белая карточка (тёмная — surface) на фоне gradient.soft: радиус lg, рамка 1px border, тень raised, внутренний отступ 32px (телефон 24px), ширина до 560px. Над полями h3 «Оставьте заявку — перезвоним за 15 минут» и строка caption о рабочем времени tnum. Поля input друг под другом, промежуток 16px. Кнопка button_primary на всю ширину карточки, 48px, текст «Отправить заявку» с шевроном. Под кнопкой caption text_muted: «Не передаём данные третьим лицам». Маску телефона не навязывать до ввода — принимать любые цифры и +. Поля: name, phone, company. Согласие 152-ФЗ: да.

## Делать

- Одна залитая индиго-пилюля на секцию; остальные действия — контурные кнопки и ссылки со сдвигающимся шевроном.
- Заголовки только весом 300 со сжатым трекингом: -0.025em на 56px, -0.02em на 48px, -0.01em на 26px; иерархию строить размером, а не жирностью.
- Сетчатую дымку ставить на первый экран и мягкой версией за форму заявки; индиго, рубин и пурпур — правее 55% ширины за макетом, поверх дымки текст только цветами text и text_secondary.
- Все суммы, проценты, сроки и телефоны набирать с font-variant-numeric: tabular-nums и подключать подмножество latin-ext — знак ₽ живёт только в нём.
- Первый экран и блок product_mockup подкреплять макетом интерфейса из HTML/SVG с цифрами клиента, а не стоковым фото; в карточках преимуществ — линейные SVG-иконки.
- Текст — тёмно-синий #0d253d (в тёмной теме #f6f9fc); полосы чередовать background и surface, на страницу одна тёплая полоса surface_warm и одна тёмно-синяя полоса цифр surface_featured.
- Согласие на обработку данных — отдельный неотмеченный чекбокс, ошибка отправки — видимым текстом у кнопки.

## Не делать

- Не поднимать вес заголовков выше 300 и не набирать заголовки и ярлыки капсом.
- Не заливать кнопки рубиновым, пурпурным или персиковым: эти цвета живут только в дымке и в точках-статусах макета.
- Не набирать основной текст цветом primary и не ставить тёмный или индиго-текст на цветную часть дымки.
- Не делать шапку полностью прозрачной над дымкой: телефон и ссылки справа попадают на индиго (2.8).
- Не заменять пилюли прямоугольными кнопками и не делать кнопки ниже 40px (на телефоне ниже 48px).
- Не делать дымку двухцветным линейным градиентом и не размывать её filter: blur на всю секцию.
- Не использовать логотипы, иллюстрации и скриншоты Stripe или других чужих продуктов.

## Анимации

`gradient-drift`, `fade-up-stagger`, `counter-up`, `tilt-card`, `marquee-logos`, `parallax-soft`, `accordion-smooth`, `form-success`, `sticky-cta-mobile` — рецепты: GET /api/agent/motion/{slug}

## A/B-тест

Менять: {"hero_layout":["split_mockup","split_form","centered"],"cta_color_role":["primary","accent"],"headline_scale":["l","xl"],"mesh_intensity":["full","soft"],"motion_level":["none","subtle","rich"],"social_proof_position":["under_hero","before_form"],"cta_label":["Оставить заявку","Получить расчёт"]}. Не трогать: palette, fonts, radius, вес заголовков 300, кнопки-пилюли, табличные цифры, форма и согласие 152-ФЗ.

## Инструкция верстальщику

Build a Russian-language lead-generation landing page in a Stripe-inspired style. Canvas #ffffff, alternating #f6f9fc bands, one warm #f5e9d4 testimonial band and one deep-navy #1c1e54 stats band; text navy #0d253d, never black. Hero: layered radial-gradient mesh (cream, peach #ffb37a, lavender #b9b9f9, indigo #533afd, ruby #ea2261) over the top 60% of the viewport, masked to fade into white; saturated stops stay right of 55% behind a floating HTML/SVG dashboard mockup (white 16px-radius card). Only navy text over the mesh; nav on a blurred 72% page-color backdrop. Type: 'Inter Tight Variable' 300 for headings (56px, 36px mobile, tracking -0.025em), 'Inter Variable' 300/400 for text, tabular-nums for every number, latin-ext subset for ₽. One filled indigo pill CTA per section with a sliding chevron. Lead form in a white card over a softer mesh: name, phone, optional company, unchecked 152-FZ consent, visible error text. Full dark theme, self-hosted fonts, reduced motion respected.
