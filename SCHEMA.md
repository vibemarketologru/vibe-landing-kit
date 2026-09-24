# Схема каталога Vibe Landing Kit (v1)

Каталог — данные для агентов: по записи агент собирает лендинг без уточняющих вопросов.
Все тексты — по-русски (поля *_en — по-английски). Никаких логотипов, фирменных изображений,
проприетарных шрифтов. Цвета — hex #RRGGBB.

## design-systems/<slug>.json

```json
{
  "slug": "stripe",                      // латиница, kebab-case
  "name": "Stripe",                      // бренд — как есть; стиль — русское имя
  "kind": "brand",                       // brand | style
  "version": "1.0.0",
  "disclaimer": "Описание эстетики по открытым материалам. Проект не аффилирован с Stripe; товарные знаки принадлежат их владельцам. Логотипы и фирменные шрифты не используются.",
  "summary": "2–3 предложения: из чего складывается узнаваемый вид",
  "summary_en": "the same in English",
  "best_for": ["финтех", "SaaS", "B2B-сервисы"],          // ниши по-русски
  "goals": ["заявки", "доверие", "запись на демо"],        // для каких целей рекламы
  "mood": ["строгий", "технологичный", "светлый"],
  "tokens": {
    "color": {
      "light": { "background": "#…", "surface": "#…", "text": "#…", "text_muted": "#…", "border": "#…",
                 "primary": "#…", "on_primary": "#…", "accent": "#…", "on_accent": "#…", "link": "#…",
                 "success": "#…", "error": "#…" },
      "dark":  { …те же ключи… }
    },
    "gradient": { "hero": "linear-gradient(…)" },          // опционально, только если это часть стиля
    "typography": {
      "display": { "family": "Onest", "fallback": "system-ui, sans-serif", "weight": 600, "size_desktop": "64px", "size_mobile": "38px", "line_height": 1.05, "letter_spacing": "-0.03em" },
      "h2":      { …то же… },
      "h3":      { … },
      "body":    { … "size_desktop": "18px", "size_mobile": "16px", "line_height": 1.6 },
      "caption": { … }
    },
    "radius":  { "sm": "6px", "md": "12px", "lg": "20px", "pill": "999px" },
    "spacing": { "unit": 8, "section_desktop": "112px", "section_mobile": "64px", "container": "1200px", "gutter_mobile": "16px" },
    "shadow":  { "card": "…", "raised": "…" },
    "motion":  { "fast": "150ms", "base": "240ms", "slow": "480ms", "ease_standard": "cubic-bezier(.2,0,0,1)", "ease_emphasized": "cubic-bezier(.3,0,0,1)" }
  },
  "fonts": [
    { "family": "Onest", "fontsource": "onest", "role": "display+body", "weights": [400, 600], "replaces": "Söhne (проприетарный)" }
  ],
  "components": {
    "button_primary":   { "bg": "primary", "color": "on_primary", "radius": "pill", "padding": "14px 24px", "weight": 600, "hover": "описание" },
    "button_secondary": { … },
    "card":             { … },
    "input":            { … },
    "badge":            { … },
    "nav":              { … }
  },
  "layout": {
    "hero_pattern": "как устроен первый экран (текстом)",
    "section_order": ["hero", "logos", "benefits", "how", "proof", "pricing", "faq", "lead_form"],
    "grid": "12 колонок, контейнер 1200px",
    "mobile_notes": "что меняется на телефоне"
  },
  "lead_form": { "fields": ["name", "phone"], "consent_152fz": true, "style": "как выглядит форма и кнопка", "success_state": "что видит человек после отправки" },
  "motion_recipes": ["fade-up-stagger", "marquee-logos"],   // слаги из motion/
  "motion_map": {                                            // где и с какими настройками стоит каждый рецепт из motion_recipes
    "levels": { "none": "…", "subtle": "по умолчанию: …", "rich": "…" },   // необязательно: состав уровней motion_level
    "fade-up-stagger": "карточки преимуществ и шаги; --reveal-dist 16px",
    "marquee-logos": "полоса клиентов под первым экраном"
    // служебные ключи рядом со слагами: levels, speed, not_for_this_style
  },
  "media": {                                                 // как бренд ставит медиа (с 1.1.0); навык landing-media
    "hero": "что на первом экране: кадр, петля, интерфейс продукта — и как",
    "video_in_flow": "где видео ниже первого экрана и как оно запускается",
    "imagery": "какие кадры и иллюстрации",
    "character": "уместен ли персонаж или маскот и как он повторяется",
    "audio": "уместна ли аудиоверсия страницы и где кнопка",
    "avoid": ["чего не ставить"]
  },
  "ab_axes": {
    "vary": { "hero_layout": ["split", "centered"], "cta_color_role": ["primary", "accent"], "headline_scale": ["xl", "l"], "motion_level": ["none", "subtle", "rich"], "social_proof_position": ["under_hero", "before_form"] },
    "fixed": ["palette", "fonts", "radius"],
    "default": { "hero_layout": "split", "cta_color_role": "primary", "headline_scale": "xl", "motion_level": "subtle", "social_proof_position": "under_hero" },  // вариант А; порядок в vary НЕ означает умолчание
    "legend": { "split": "что это значит на странице" },     // необязательно: пояснение значений (объект)
    "notes": "Вариант А — ab_axes.default; вариант Б меняет ровно одну ось, остальное как в А. …"   // строка
  },
  "do": ["4–7 правил"],
  "dont": ["4–7 запретов"],
  "prompt_snippet": "Готовый абзац-инструкция для модели на английском: как сверстать страницу в этом стиле (80–150 слов)",
  "source": { "inspired_by": "VoltAgent/awesome-design-md (MIT), design-md/stripe/DESIGN.md", "notes": "что изменено: OFL-шрифты с кириллицей, тёмная тема, контраст" }
}
```

Жёсткие требования (проверяет tools/check.mjs):
- primary и accent — ЗАЛИВКИ под on_primary / on_accent, а не цвет текста: по фону страницы они бывают 1.2–3:1 (лайм, пастель, алоэ). Текст и цифры по background/surface — только text, text_muted или link; цвет-исключение, если он нужен, файл объявляет отдельным ключом с замером контраста;
- все ключи цветов в обеих темах; контраст WCAG: text/background ≥ 7, text/surface ≥ 4.5, text_muted/background ≥ 4.5, on_primary/primary ≥ 4.5, on_accent/accent ≥ 4.5, link/background ≥ 4.5 — в light И dark;
- каждый шрифт существует в Fontsource, имеет subset `cyrillic`, лицензию OFL-1.1 (или Apache-2.0), перечисленные weights доступны;
- motion_recipes ссылаются на существующие slug в motion/;
- motion_map описывает каждый рецепт из motion_recipes и не называет чужих (кроме служебных levels/speed/not_for_this_style);
- ab_axes.default задан для каждой оси из vary, и его значение есть в списке этой оси; пояснения — только в legend (объект) и notes (строка);
- каждый рецепт из motion/ используется хотя бы одной дизайн-системой (при проверке всего каталога);
- media: непустые строки hero, video_in_flow, imagery, character, audio и непустой список avoid;
- summary ≤ 400 символов, do/dont по 4–7 пунктов, prompt_snippet 80–150 слов;
- дополнительные пары цветов: любой ключ `on_X` (и `on_X_muted`) читается по заливке `X` не ниже 4.5; подпись кнопки на `primary_hover` / `primary_active` (или свой `on_primary_hover`) — тоже 4.5. Неактивные состояния (`*_disabled`) WCAG 1.4.3 от контраста освобождает.

### Необязательные поля (с 1.2.0)

Старые записи их не имеют; если поле есть — `check.mjs` проверяет его форму.

```json
{
  "media": { "geometry": { "hero_desktop": "16:9", "hero_mobile": "9:16", "card": "4:5", "portrait": "3:4", "gallery": "3:2", "logo_strip": "монохромные, высота 24px" } },
  "states": {
    "button": { "hover": "…", "focus_visible": "…", "active": "…", "disabled": "…", "loading": "…" },   // hover, focus_visible, disabled — обязательны
    "input":  { "focus": "…", "error": "…", "disabled": "…" }                                           // focus, error — обязательны
  },
  "signature": ["2–4 приёма, по которым стиль узнают, — словами, без логотипов и того, что из них выросло"],
  "voice": "голос текста: тон, длина фраз, чего не писать",   // строка ИЛИ объект { "tone": "…", "headline_formula": "…", … }
  "type_features": { "prices": "font-variant-numeric: tabular-nums" },
  "color_presets": { "amber": { "light": { "primary": "#…", "on_primary": "#…" }, "dark": { … } } },   // сдвиг основного цвета для совпадающей ниши (135-ФЗ ст. 14.6); проще — пара primary_alt / on_primary_alt в цветах обеих тем
  "fonts": [ { "family": "Alegreya", "styles": ["normal", "italic"] } ],   // курсив нужен — подключайте его файл
  "tokens": {
    "stroke":  { "width": "3px" },                          // рамки неоэкспрессии
    "glass":   { "bg": "rgba(…)", "blur": "16px" },          // значения rgba и градиенты, не hex
    "overlay": { "hero": "linear-gradient(…)" }             // затемнение под белым текстом на кадре
  }
}
```

Дополнительные ключи цветов (`band`, `on_band`, `card_*`, `tile_*`, `sticky_*`, `primary_alt`…) допустимы в обеих темах; сборщик `theme.css` выводит каждый в переменную `--color-<ключ>`.

Число рецептов анимации: у новых записей 2–4 «характерных» рецепта. Служебные (`form-success`, `accordion-smooth`, `sticky-cta-mobile`) можно добавлять сверх этого — это поведение формы и навигации, а не характер стиля.

Сводка для выбора — `catalog.json` в корне каталога (слаг, имя, вид, summary, best_for, goals, mood; у анимаций — категория, reduced_motion, lcp_risk, use_for). Пересобирается из файлов, руками не правится.

## motion/<slug>.json

```json
{
  "slug": "fade-up-stagger",
  "name": "Появление снизу по очереди",
  "category": "entrance",              // entrance | scroll | hover | feedback | ambient | text | loading
  "purpose": "зачем на рекламном лендинге (конверсия/внимание)",
  "use_for": ["карточки преимуществ", "шаги"],
  "reduced_motion": "soften",          // remove | soften | keep  (+ что именно происходит)
  "reduced_motion_note": "…",
  "lcp_risk": "none",                  // none | low | high — трогает ли первый экран
  "cls_safe": true,
  "duration": "480ms", "easing": "cubic-bezier(.2,0,0,1)",
  "budget": "не более N одновременно / только transform и opacity",
  "html": "минимальная разметка",
  "css": "полный CSS, включая @media (prefers-reduced-motion: reduce)",
  "js": "ванильный JS ≤ 40 строк (IntersectionObserver/WAAPI) или пусто",
  "gsap_alt": "необязательно: как сделать то же на GSAP из npm (без CDN)",
  "a11y": "фокус, пауза для бесконечных (WCAG 2.2.2), без вспышек (2.3.1)",
  "perf": "что не делать",
  "source": { "inspired_by": "…(MIT)", "notes": "…" }
}
```
Требования: css содержит `prefers-reduced-motion`; анимируются только transform/opacity/filter/clip-path (исключение — `stroke-dashoffset` тонкой SVG-линии, с пометкой в `perf`); анимации по прокрутке (`animation-timeline`) — только внутри `@supports` и с запасным путём в `js`; `gsap_alt` может быть текстом, если на GSAP делать нечего;
бесконечные анимации имеют паузу (hover/focus/кнопка) — WCAG 2.2.2; js без внешних зависимостей.
