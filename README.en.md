<div align="center">

<img src="assets/mascot-website.webp" alt="Vibe Marketolog cat mascot building a website" width="240">

# Vibe Landing Kit

**An A/B-test landing page for your ad campaign — in one command to your AI agent.**
16 design systems inspired by world brands plus original styles (Cyrillic-ready, dark theme, WCAG-checked contrast),
16 motion recipes that respect performance and accessibility, and Yandex Wordstat keyword research.
For Claude Code, ChatGPT, Claude and Cursor.

[Русский](README.md) · **English**

</div>

---

## One command

```text
/plugin marketplace add vibemarketologru/vibe-landing-kit
/plugin install vibe-landing@vibe-landing-kit
/landing Custom kitchens in Kazan. Hypothesis: "0% installments" vs "installed in 21 days". Style like Airbnb
```

The agent picks a style, researches keywords, adds motion, builds variant A and a variant B that differs in exactly one factor, runs a quality checklist and reports — asking before every paid step.

## Gallery: one landing page, 16 styles

<table>
<tr><td width="25%" valign="top"><a href="design-systems/dark-premium/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/dark-premium-dark-card.webp"><img src="assets/previews/dark-premium-light-card.webp" alt="Тёмный премиум — style"></picture></a><br><sub><b>Тёмный премиум</b></sub></td><td width="25%" valign="top"><a href="design-systems/editorial/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/editorial-dark-card.webp"><img src="assets/previews/editorial-light-card.webp" alt="Журнал — style"></picture></a><br><sub><b>Журнал</b></sub></td><td width="25%" valign="top"><a href="design-systems/soft/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/soft-dark-card.webp"><img src="assets/previews/soft-light-card.webp" alt="Мягкий — style"></picture></a><br><sub><b>Мягкий</b></sub></td><td width="25%" valign="top"><a href="design-systems/swiss/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/swiss-dark-card.webp"><img src="assets/previews/swiss-light-card.webp" alt="Швейцарский — style"></picture></a><br><sub><b>Швейцарский</b></sub></td></tr>
<tr><td width="25%" valign="top"><a href="design-systems/airbnb/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/airbnb-dark-card.webp"><img src="assets/previews/airbnb-light-card.webp" alt="Airbnb"></picture></a><br><sub><b>Airbnb</b></sub></td><td width="25%" valign="top"><a href="design-systems/apple/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/apple-dark-card.webp"><img src="assets/previews/apple-light-card.webp" alt="Apple"></picture></a><br><sub><b>Apple</b></sub></td><td width="25%" valign="top"><a href="design-systems/bmw/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/bmw-dark-card.webp"><img src="assets/previews/bmw-light-card.webp" alt="BMW"></picture></a><br><sub><b>BMW</b></sub></td><td width="25%" valign="top"><a href="design-systems/cal/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/cal-dark-card.webp"><img src="assets/previews/cal-light-card.webp" alt="Cal.com"></picture></a><br><sub><b>Cal.com</b></sub></td></tr>
<tr><td width="25%" valign="top"><a href="design-systems/intercom/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/intercom-dark-card.webp"><img src="assets/previews/intercom-light-card.webp" alt="Intercom"></picture></a><br><sub><b>Intercom</b></sub></td><td width="25%" valign="top"><a href="design-systems/linear/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/linear-dark-card.webp"><img src="assets/previews/linear-light-card.webp" alt="Linear"></picture></a><br><sub><b>Linear</b></sub></td><td width="25%" valign="top"><a href="design-systems/nike/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/nike-dark-card.webp"><img src="assets/previews/nike-light-card.webp" alt="Nike"></picture></a><br><sub><b>Nike</b></sub></td><td width="25%" valign="top"><a href="design-systems/notion/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/notion-dark-card.webp"><img src="assets/previews/notion-light-card.webp" alt="Notion"></picture></a><br><sub><b>Notion</b></sub></td></tr>
<tr><td width="25%" valign="top"><a href="design-systems/revolut/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/revolut-dark-card.webp"><img src="assets/previews/revolut-light-card.webp" alt="Revolut"></picture></a><br><sub><b>Revolut</b></sub></td><td width="25%" valign="top"><a href="design-systems/shopify/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/shopify-dark-card.webp"><img src="assets/previews/shopify-light-card.webp" alt="Shopify"></picture></a><br><sub><b>Shopify</b></sub></td><td width="25%" valign="top"><a href="design-systems/stripe/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/stripe-dark-card.webp"><img src="assets/previews/stripe-light-card.webp" alt="Stripe"></picture></a><br><sub><b>Stripe</b></sub></td><td width="25%" valign="top"><a href="design-systems/wise/DESIGN.md"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/previews/wise-dark-card.webp"><img src="assets/previews/wise-light-card.webp" alt="Wise"></picture></a><br><sub><b>Wise</b></sub></td></tr>
</table>

## What is inside

- **Design systems** (`design-systems/*.json`, `theme.css`, `DESIGN.md`): role-based color tokens for light and dark themes with contrast checked in both, mobile and desktop type scale, OFL fonts with Cyrillic instead of proprietary brand fonts, landing-page section order, a lead form with consent, A/B axes, do/don't rules and a ready prompt snippet.
- **Motion recipes** (`motion/*.json`): HTML + CSS + vanilla JS, `transform`/`opacity` only, `prefers-reduced-motion` mode (kept, removed, softened to a fade), pause for infinite animations.
- **Claude Code plugin**: `/landing` command and skills `landing-ab`, `design-system`, `motion`, `semantics`, plus the MCP server.

## Connect

- Claude Code: `claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp`, then `/mcp` → Authenticate.
- ChatGPT / Claude.ai / Cursor: [step-by-step videos](https://lk.vibemarketolog.ru/connect?utm_source=github&utm_medium=readme&utm_campaign=vibe-landing-kit).
- REST: `GET /api/agent/design-systems`, `GET /api/agent/motion`, `POST /api/agent/semantics` — [docs](https://lk.vibemarketolog.ru/docs/agent-api?utm_source=github&utm_medium=readme&utm_campaign=vibe-landing-kit).

The catalog is free. Keyword research and images are paid from a ruble balance, per action, no subscription.

## License and trademarks

MIT. Brand-inspired entries describe an aesthetic and are not affiliated with the brands; no logos or proprietary fonts — see [TRADEMARKS.md](TRADEMARKS.md) and [NOTICE.md](NOTICE.md).

**Author:** Vladimir Doretskiy, founder of [Vibe Marketolog](https://vibemarketolog.ru?utm_source=github&utm_medium=readme&utm_campaign=vibe-landing-kit) · Telegram [@CentrMedia](https://telegram.me/CentrMedia)
