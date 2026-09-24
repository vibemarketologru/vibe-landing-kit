---
name: design-system
description: Use when applying a visual style or a brand-inspired design system to a page or component — choosing palette, fonts, radii, shadows, dark theme, or when the user says «в стиле …», «как у Stripe/Apple/Linear», «сделай красиво», «тёмная тема». Uses the Vibe Landing Kit catalog (design-systems/*.json or MCP get_design_system).
---

# Применить дизайн-систему

1. Найди запись: MCP `design_systems` (с `brief`) → `get_design_system` (`format: css` и `json`); без MCP — `design-systems/<slug>.json` и `design-systems/<slug>/theme.css` в этом репозитории.
2. Вставь CSS-переменные как есть: светлая тема в `:root`, тёмная — по `prefers-color-scheme` и `[data-theme="dark"]`. Цвета бери только по ролям (`--color-primary`, `--color-on-primary`, `--color-text-muted`…): пары контраста проверены именно в таких сочетаниях. Новый цвет «на глаз» ломает проверку.
3. Типографика: роли `display`, `h2`, `h3`, `body`, `caption`; на телефоне размер берётся из `size_mobile` (в theme.css это делает медиазапрос). Шрифты — OFL с кириллицей из `fonts[]`, раздавай со своего домена (`@fontsource-variable/<id>`), никогда с Google Fonts.
4. Компоненты — из `components`: кнопки, карточки, поля, бейджи, навигация. Hover и фокус обязательны; фокус виден с клавиатуры.
5. Раскладка — `layout.hero_pattern`, `section_order`, `mobile_notes`. Правила `do` / `dont` — жёсткие.
6. Бренд: запись описывает ЭСТЕТИКУ. Не используй логотип, фирменные иллюстрации и фирменные шрифты бренда, не пиши, что сайт сделан брендом.
