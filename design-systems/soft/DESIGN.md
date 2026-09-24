# Мягкий

> Собственный стиль Вайб-Маркетолога.

Тёплый льняной фон, тёпло-белые карточки со скруглением 24 px и пастельные полосы (пудра, шалфей, абрикос), на которых текст всегда тёмный. Заголовки — мягкая антиква Lora с одним словом курсивом, текст — округлый Nunito. Одна насыщенная кнопка-пилюля, фото специалиста в арке, цены «от» сразу на странице. Спокойно, бережно, без давления.

**Подходит:** медицинские клиники и стоматология, косметология и салоны красоты, детские центры, кружки и сады, психологи и психотерапевты, массаж, реабилитация, йога, ветеринарные клиники, семейные и женские услуги. **Цели:** запись на приём, заявка на первую консультацию, звонок администратору, запись на пробное занятие, доверие к специалисту. **Настроение:** мягкий, тёплый, бережный, спокойный, светлый, заботливый.

## Цвета

| Роль | Светлая | Тёмная |
|---|---|---|
| background | `#FAF6F1` | `#1B1715` |
| surface | `#FFFDFA` | `#25201D` |
| text | `#2E2622` | `#F4EDE7` |
| text_muted | `#6B5F58` | `#B3A69D` |
| border | `#E7DDD3` | `#3E3531` |
| primary | `#A6475F` | `#F2A7B8` |
| on_primary | `#FFFFFF` | `#3A1522` |
| accent | `#F7D5BF` | `#F4C9A9` |
| on_accent | `#4A2B1C` | `#3B2112` |
| link | `#94405A` | `#F4B3C2` |
| success | `#2F6A4C` | `#8FD1A9` |
| error | `#B03A2E` | `#FF9C8F` |
| primary_hover | `#8F3B51` | `#F7C2CE` |
| accent_hover | `#F2C6AE` | `#F8D7BF` |
| focus | `#A6475F` | `#F2A7B8` |
| border_strong | `#8F8177` | `#8A7C72` |
| surface_raised | `#FFFFFF` | `#2F2925` |
| sand | `#F3ECE4` | `#211C19` |
| tint_blush | `#F7E3DE` | `#3A2A2B` |
| tint_apricot | `#FBE7D6` | `#3A2D24` |
| tint_butter | `#F8EFD3` | `#37321F` |
| tint_sage | `#E2EEE5` | `#243229` |
| tint_sky | `#DEEBF3` | `#212E36` |
| tint_lavender | `#EAE5F3` | `#2C2838` |
| on_tint | `#2E2622` | `#F4EDE7` |
| on_tint_muted | `#6B5F58` | `#B3A69D` |
| success_bg | `#E2EEE5` | `#243229` |
| error_bg | `#FBE4E0` | `#3B2320` |

## Типографика

| Роль | Шрифт | Вес | Десктоп | Телефон |
|---|---|---|---|---|
| display | Lora | 500 | 60px | 36px |
| display_rounded | Nunito | 800 | 58px | 36px |
| h2 | Lora | 500 | 42px | 28px |
| h2_rounded | Nunito | 800 | 40px | 28px |
| h3 | Nunito | 700 | 22px | 19px |
| lead | Nunito | 400 | 20px | 18px |
| body | Nunito | 400 | 18px | 16px |
| label | Nunito | 600 | 15px | 15px |
| button | Nunito | 700 | 17px | 17px |
| caption | Nunito | 400 | 14px | 13px |
| stat | Lora | 500 | 56px | 34px |
| quote | Lora | 400 | 22px | 19px |

## Раскладка лендинга

Полоса background с дымкой gradient.hero. Раскладка 6/6: слева бейдж (услуга + район/метро), заголовок display в 2–3 строки с одним словом курсивом, лид 20px цвета text_muted, строка цены «Первичная консультация — от 1 500 ₽», кнопки button_primary + button_secondary, под ними trust_row. Справа photo_arch специалиста или пространства на пастельном круге с карточкой-подписью поверх нижнего края. Без фото (и при form_position=hero) справа — большая card (surface, радиус xl, тень raised) с формой заявки: поля на белой карточке, а не на пастели.

Порядок секций: nav → hero → trust_bar → benefits → services_prices → specialists → how → proof → faq → lead_form → footer

Одна колонка, поля 16px, полосы 72px. Первый экран: бейдж → заголовок 36px → лид → цена → кнопка 56px во всю ширину → trust_row в две строки → фото в арке шириной 80% по центру. Прайс остаётся списком без горизонтальной прокрутки, цена переносится под название при нехватке места. Специалисты — горизонтальная лента с маской-затуханием правого края и подсказкой листать. После ухода кнопки первого экрана — липкая кнопка записи (sticky-cta-mobile), которая прячется, когда форма в кадре. Телефон в шапке кликабельный.

## Форма заявки

Большая card (радиус 32px, отступы 40/24px, тень raised) на полосе основной пастели пресета. Слева заголовок h2 «Запишитесь — подберём удобное время» и три строки «что будет дальше»; справа поля 56px с подписями над ними, между полями 16px, slot_chips «Утро / День / Вечер» вместо поля времени, кнопка button_primary 56px во всю ширину карточки, под ней caption: «Администратор перезвонит в течение 15 минут, с 9:00 до 21:00» и ссылка на политику. На телефоне — одна колонка, заголовок над карточкой. Поля: name, phone. Согласие 152-ФЗ: да.

## Делать

- Один насыщенный цвет действия — primary выбранного пресета; пастели только для фонов полос, карточек, бейджей и подложек фото, текст на них всегда тёмный (on_tint).
- Заголовки display и h2, цифры и цитаты — Lora (одно слово заголовка курсивом цвета primary); h3, текст и интерфейс — Nunito 400/600/700, тело 18 px. Для детских услуг — округлый голос: display_rounded и h2_rounded.
- Скругляйте всё: карточки 24 px, поля 16 px, кнопки-пилюли, фото — арка или 32 px.
- Показывайте живых людей: фото специалиста, имя, стаж, образование — это главный источник доверия в этих нишах.
- Цены «от» и длительность — на первом экране или в прайсе сразу под ним.
- Для медицинских услуг: лицензия и строка о противопоказаниях видимым текстом рядом с ценами и в подвале.
- Движение только спокойное: проявление со сдвигом 12 px за 280–560 ms, счёт цифр не дольше 0,9 с и один раз, без пружин, отскоков и перелёта.

## Не делать

- Не писать текст пастельным цветом на светлой теме и не ставить белый текст на пастель (1.1–1.9:1).
- Не ставить больше трёх разных пастелей на один экран и две пастельные полосы подряд.
- Не использовать в медицине и косметологии отзывы-благодарности, истории излечения и фото «до и после».
- Не спрашивать в форме диагноз, жалобы и данные ребёнка — это специальные персональные данные.
- Не давить: без таймеров, «осталось 2 места», мигания, тряски кнопок и всплывающих окон на входе.
- Не заменять фон страницы и карточек холодным белым #FFFFFF и серыми тенями — стиль теряет тепло и выглядит как больничный бланк.

## Анимации

`fade-up-stagger`, `image-reveal-clip`, `gradient-drift`, `counter-up`, `before-after-slider`, `accordion-smooth`, `form-success`, `sticky-cta-mobile` — рецепты: GET /api/agent/motion/{slug}

## A/B-тест

Менять: {"hero_layout":["split_arch","centered"],"hero_media":["specialist","space"],"cta_color_role":["primary","accent"],"headline_voice":["serif","rounded"],"headline_scale":["xl","l"],"price_visibility":["in_hero","section"],"form_position":["hero","bottom"],"social_proof_position":["under_hero","before_form"],"motion_level":["none","subtle"]}. Не трогать: palette_preset, fonts, radius, warm_shadows, single_cta_color, legal_notices.

## Инструкция верстальщику

Build a 'Soft'-style landing; expose tokens as --color-<key> variables, underscores as hyphens (--color-on-primary). Warm linen page #FAF6F1, cards #FFFDFA with 24px radius, a 1px #E7DDD3 hairline and diffuse warm-brown shadow. Pastel bands (powder #F7E3DE, sage #E2EEE5, apricot #FBE7D6) always carry dark text #2E2622, never two in a row. Headlines: Lora 500, 60px desktop / 36px mobile, one word in Lora Italic tinted primary. Body and UI: Nunito, 18px. One action color: berry-rose #A6475F pill buttons, 56px tall, white text; pick the niche preset (medicine sage #3D6B5C, psychology lavender #6B4F96, kids coral #B2492E). Hero split 6/6: badge, headline, lead, 'from' price and CTA left; specialist photo in an arch right. Medical pages: license and contraindication notice, no testimonials or before/after. Lead form: name, phone, unchecked 152-FZ consent; success replaces it in place. Gentle fades only, no bounce. Dark theme: cocoa #1B1715, cards #25201D, text #F4EDE7, CTA #F2A7B8 with #3A1522 text.
