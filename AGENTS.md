# AGENTS.md — Vibe Landing Kit

Инструкция для любого ИИ-агента (Cursor, Codex, Windsurf, Claude Code, ChatGPT), который собирает рекламный лендинг в этом репозитории или по нему.

- Маршрут, чек-лист качества и правила денег — `skills/landing-ab/SKILL.md`. Следуй ему; остальные навыки он вызывает по шагам.
- Гипотеза, выборка и вердикт — `skills/hypothesis-lab/` (калькулятор и скрипт сплита — `snippets.md`). До конца выборки победителя не объявлять.
- Бриф до вёрстки и ревью после — `skills/landing-brief/` (шаблоны — `templates.md`). Цифры, отзывы, логотипы и телефоны — только из брифа.
- Медиа (кадр первого экрана, персонаж на все ролики, видео Gemini Omni, аудиоверсия) — `skills/landing-media/`, готовые блоки — `snippets.md`.
- Телефон (iOS 26/27, Android, встроенные браузеры ВК и Telegram) — `skills/landing-mobile/`, куски кода — `snippets.md`, рабочий пример — `example/`.
- Закон РФ (152-ФЗ, реклама, модерация) — `skills/landing-law-ru/`, форма и политика — `templates.md`. Не юридическая консультация.
- Чат-бот с ИИ на странице — `skills/landing-chatbot/`. Код виджета — одинаково в A и Б.
- Реклама под варианты — `skills/ad-match/`. Свой стиль из брендбука — `skills/brand-to-system/`.
- Стили: `design-systems/<slug>.json` (+ `design-systems/<slug>/theme.css`, `DESIGN.md`). Блок `media` — как бренд ставит медиа, `states` / `signature` / `voice` — состояния, приёмы и голос. Список и подбор — `catalog.json` или MCP `design_systems`.
- Анимации: `motion/<slug>.json` — html + css + js, reduced-motion обязателен; как выбрать движение — `skills/motion/SKILL.md`, GSAP и Lottie — `skills/motion/gsap-lottie.md` (лицензия GSAP запрещает no-code конструкторы анимаций).
- Паспорт у себя: `node tools/passport.mjs index.html b.html` (Playwright). На сервере — `landing_check`.
- Через MCP-сервер `https://lk.vibemarketolog.ru/mcp` (платно, с рублёвого баланса; называй цену до вызова): семантика из Вордстата, картинки и видео, чат-боты (`chatbot_*`), паспорт (`landing_check`, бесплатно), запуск гипотезы (`landing_launch`, 990 ₽), итоги (`landing_status`), Про-версия (`landing_pro`, 4 500 ₽). Те же навыки сервер отдаёт как MCP prompts.
- Нельзя: внешние CDN и Google Fonts, логотипы и фирменные шрифты брендов, анимация свойств раскладки, форма без реальной отправки и без согласия 152-ФЗ, заранее отмеченная галочка, ролик со звуком на автозапуске, выдуманные цифры и отзывы.
