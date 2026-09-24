---
name: semantics
description: Use when writing landing-page or ad copy for the Russian market, choosing headlines, H1, FAQ, keywords or negative keywords, or when the user mentions «Вордстат», «семантика», «ключевые слова», «минус-слова», «частотность», «что ищут люди». Uses the vibemarketolog MCP build_semantics / keywords_suggest / wordstat_* tools (paid, ask before calling).
---

# Семантика → тексты лендинга

1. `build_semantics` с `topic` (что и где) и 1–3 `seeds` по 2–4 слова без города; город — через `region_ids` (213 Москва, 2 Санкт-Петербург, 43 Казань, 54 Екатеринбург). Цена: quick 49 ₽, deep 149 ₽ — назови до вызова. `dry_run: true` — смета.
2. Кластеры по `block`:
   - `hero` — самые частотные коммерческие фразы → H1 и подзаголовок первого экрана;
   - `pricing` — «цена», «стоимость», «недорого» → блок цен и оффер;
   - `faq` / `how` — вопросы («как», «сколько», «что лучше») → блок вопросов и шагов;
   - `proof` — «отзывы», «фото», «каталог» → кейсы и галерея;
   - `lead_form` — «заказать», «заявка», «рассчитать» → текст кнопки и формы;
   - `not_for_landing` — не используй на странице; отдельные фразы бывают полезны как минус-слова.
3. `headline_a` / `headline_b` (deep или `ab_headlines: true`) — готовая пара для A/B-теста заголовка.
4. `negative_suggestions` — отдай пользователю для рекламной кампании (Директ).
5. Частотность — показы в месяц по Вордстату. Не выдумывай цифры и не называй их «заявками» или «продажами».
