---
name: motion
description: Use when adding animation or interaction effects to a web page — entrance reveals, scroll effects, counters, marquee, hover tilt, magnetic buttons, sticky CTA, form success states — or when the user asks for «анимации», «вау-эффект», «чтобы оживить страницу». Uses Vibe Landing Kit motion recipes (motion/*.json or MCP get_motion_recipe).
---

# Анимации без вреда конверсии

- Бери рецепт целиком: `html` + `css` + `js` из `get_motion_recipe` (или `motion/<slug>.json`). Код — ванильный, без CDN; GSAP только если он уже есть в проекте из npm (`gsap_alt`).
- Анимируются только `transform`, `opacity`, `clip-path`, `filter`. Никогда — ширина, высота, отступы, позиция: это сдвиги макета (CLS).
- Первый экран: заголовок и кнопка видны сразу, даже без JS. Эффект появления — только на том, что НЕ является самым крупным элементом первого экрана (иначе страдает LCP).
- Обязателен `@media (prefers-reduced-motion: reduce)`: по полю `reduced_motion` рецепта эффект убирается (`remove`), упрощается до плавного появления (`soften`) или остаётся (`keep`).
- Бесконечные анимации (лента логотипов, фон) — с паузой по наведению/фокусу и кнопкой паузы (WCAG 2.2.2). Без вспышек чаще 3 раз в секунду.
- Бюджет: не больше 3 одновременных анимаций на экране и один «вау-момент» на страницу. Лучше меньше, но точно.
