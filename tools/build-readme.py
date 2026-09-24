#!/usr/bin/env python3
"""Собирает README.md и README.en.md из catalog.json — таблицы и галерея не расходятся с данными.
Запуск из корня репозитория: python3 tools/build-readme.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.load(open(os.path.join(ROOT, 'catalog.json')))
systems = cat['design_systems']
motion = cat['motion']
N_DS, N_M = len(systems), len(motion)
brands = [s for s in systems if s.get('kind') == 'brand']
styles = [s for s in systems if s.get('kind') != 'brand']

def fonts(slug):
    d = json.load(open(os.path.join(ROOT, 'design-systems', slug + '.json')))
    return ', '.join(dict.fromkeys(f['family'] for f in d.get('fonts', [])))

def gallery(lang):
    order = styles + brands
    rows = []
    for i in range(0, len(order), 4):
        cells = []
        for s in order[i:i + 4]:
            slug = s['slug']
            alt = (s['name'] + (' — стиль' if lang == 'ru' else ' — style')) if s.get('kind') != 'brand' else s['name']
            cells.append(
                f'<td width="25%" valign="top"><a href="design-systems/{slug}/DESIGN.md"><picture>'
                f'<source media="(prefers-color-scheme: dark)" srcset="assets/previews/{slug}-dark-card.webp">'
                f'<img src="assets/previews/{slug}-light-card.webp" alt="{alt}"></picture></a>'
                f'<br><sub><b>{s["name"]}</b></sub></td>')
        rows.append('<tr>' + ''.join(cells) + '</tr>')
    return '<table>\n' + '\n'.join(rows) + '\n</table>'

def h(t):
    """Текст для ячейки таблицы: «<details>» в названии GitHub рисовал настоящим тегом."""
    return str(t).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('|', '\\|')

REASON = {'remove': 'выключается', 'soften': 'смягчается до появления', 'keep': 'остаётся'}
REASON_EN = {'remove': 'removed', 'soften': 'softened to a fade', 'keep': 'kept'}

def ds_table():
    out = ['| Стиль | Для кого | Шрифты с кириллицей |', '|---|---|---|']
    for s in styles + brands:
        kind = '' if s.get('kind') == 'brand' else ' *(свой стиль)*'
        out.append(f"| [{h(s['name'])}](design-systems/{s['slug']}/DESIGN.md){kind} | {h(', '.join(s['best_for'][:3]))} | {h(fonts(s['slug']))} |")
    return '\n'.join(out)

def m_table():
    out = ['| Рецепт | Где на лендинге | «Меньше движения» |', '|---|---|---|']
    for m in motion:
        out.append(f"| [`{m['slug']}`](motion/{m['slug']}.json) — {h(m['name'])} | {h(', '.join(m.get('use_for', [])[:2]))} | {REASON.get(m.get('reduced_motion'), m.get('reduced_motion'))} |")
    return '\n'.join(out)

BADGES = (
    f'[![Версия](https://img.shields.io/badge/версия-1.0.0-6D28D9?style=flat-square)](CHANGELOG.md)\n'
    f'[![Лицензия](https://img.shields.io/badge/лицензия-MIT-8B5CF6?style=flat-square)](LICENSE)\n'
    f'[![Дизайн-систем](https://img.shields.io/badge/дизайн--систем-{N_DS}-A480EF?style=flat-square)](#галерея-один-лендинг--{N_DS}-стилей)\n'
    f'[![Анимаций](https://img.shields.io/badge/анимаций-{N_M}-A480EF?style=flat-square)](#анимации)\n'
    f'[![Claude Code](https://img.shields.io/badge/Claude_Code-плагин-2B8A3E?style=flat-square)](#подключение)\n'
    f'[![MCP](https://img.shields.io/badge/MCP-ChatGPT_·_Claude_·_Cursor-1E6FD9?style=flat-square)](https://lk.vibemarketolog.ru/connect)'
)

UTM = '?utm_source=github&utm_medium=readme&utm_campaign=vibe-landing-kit'

def intro(html, img, alt, w=170):
    """Вводный абзац раздела + стикер в две колонки: стикер «float: right» перед широкой
    таблицей оставлял пустую полосу — таблица на всю ширину не встаёт рядом с картинкой."""
    return f'<table><tr><td valign="middle">{html}</td><td width="{w}" align="center"><img src="{img}" width="{w - 20}" alt="{alt}"></td></tr></table>'


ru = f'''<div align="center">

<img src="assets/mascot-website.webp" alt="Кот-маскот Вайб-Маркетолога собирает сайт" width="260">

# Vibe Landing Kit

**Лендинг для A/B-теста рекламы — одной командой агенту.**
{N_DS} дизайн-систем в духе мировых брендов и собственных стилей — с кириллицей, тёмной темой и проверенным контрастом,
{N_M} анимаций, которые не ломают скорость и доступность, и семантика из Яндекс Вордстата.
Для Claude Code, ChatGPT, Claude и Cursor.

{BADGES}

**Русский** · [English](README.en.md)

</div>

---

## Одна команда

```text
/plugin marketplace add vibemarketologru/vibe-landing-kit
/plugin install vibe-landing@vibe-landing-kit
/landing Кухни на заказ в Казани. Гипотеза: «рассрочка 0%» против «монтаж за 21 день». Стиль как у Airbnb
```

Агент сам пройдёт весь путь и остановится перед каждым платным шагом, назвав цену:

```mermaid
flowchart LR
  A[Бриф] --> B[Стиль из каталога]
  B --> C[Семантика Вордстата]
  C --> D[Анимации]
  D --> E[Вариант А]
  E --> F[Вариант Б:<br/>одно отличие]
  F --> G[Проверка качества]
  G --> H[Отчёт и запуск теста]
```

> [!TIP]
> Каталог работает и без подключения: каждая система лежит в репозитории как JSON, готовый `theme.css` для обеих тем и `DESIGN.md`. Передайте файл любому агенту — он сверстает страницу в этом стиле.

## Галерея: один лендинг — {N_DS} стилей

Один и тот же лендинг, собранный из токенов каждой записи. Картинка следует теме GitHub: откройте в тёмной — увидите тёмный вариант.

{gallery('ru')}

## Что внутри

### Дизайн-системы

{intro('Каждая запись — это не описание «в общих словах», а всё, что нужно агенту, чтобы сверстать страницу без вопросов: токены обеих тем, шрифты, компоненты, раскладку лендинга, форму заявки и правила A/B-теста.', 'assets/mascot-vaib-agent.webp', 'Маскот-агент с папкой проектов')}

| | |
|---|---|
| **Токены** | цвета светлой и тёмной темы по ролям, типографика для десктопа и телефона, радиусы, отступы, тени, движение |
| **Контраст** | каждая пара «текст — фон» проверена по WCAG в обеих темах: текст ≥ 7, остальное ≥ 4.5 |
| **Шрифты** | только свободные OFL-шрифты с кириллицей из Fontsource — вместо фирменных, которые нельзя распространять |
| **Лендинг** | первый экран, порядок секций, форма заявки с согласием 152-ФЗ, мобильная раскладка |
| **A/B-тест** | что можно менять между вариантами и что обязано остаться неизменным |
| **Правила** | do / don't и готовая инструкция верстальщику |

{ds_table()}

### Анимации

{intro('Готовые рецепты: разметка, CSS и ванильный JS без внешних библиотек. Анимируются только <code>transform</code> и <code>opacity</code>, первый экран не ждёт скриптов, у каждого рецепта есть режим «меньше движения» (<code>prefers-reduced-motion</code>), у бесконечных — пауза.', 'assets/sticker-motion.webp', 'Кот дирижирует анимацией карточек')}

{m_table()}

## Семантика из Яндекс Вордстата

{intro('Инструмент <code>build_semantics</code> собирает запросы Вордстата и раскладывает их по блокам лендинга: что писать в заголовке, в ценах, в вопросах и в кнопке. Живой пример «кухни на заказ в Казани», быстрый уровень — 100 фраз за 20 секунд:', 'assets/sticker-semantics.webp', 'Кот с лупой разбирает ключевые запросы')}

| Блок | Группа | Показов в месяц | Примеры фраз |
|---|---|---|---|
| `hero` | Кухни на заказ в Казани | 1 101 | кухни на заказ казань, заказать кухонный гарнитур |
| `pricing` | Цены и недорогие кухни | 384 | кухня на заказ цена, кухни на заказ казань недорого |
| `proof` | Каталог, фото и отзывы | 228 | кухни на заказ казань каталог, от производителя |
| `faq` | Вопросы о кухнях на заказ | 55 | какие лучше, размеры |
| `lead_form` | Заявка и контакты | 35 | изготовление кухни на заказ |

Плюс минус-слова для рекламы (`доставка еды`, `пицца`, `авито`…), а на глубоком уровне — сезонность за 24 месяца и пары заголовков А/Б для каждой группы.

## A/B-тест, а не «просто лендинг»

{intro('Смысл лендинга под рекламу — проверить гипотезу. Поэтому у каждой системы есть оси A/B: агент делает вариант Б, отличающийся <b>ровно одним</b> фактором (заголовок, раскладка первого экрана, цвет главной кнопки, уровень анимации, место отзывов), а всё остальное оставляет как в варианте А. Так результат теста говорит о гипотезе, а не о случайности.', 'assets/sticker-ab.webp', 'Кот сравнивает две версии страницы')}

## Подключение

{intro('Один MCP-сервер для всех: в Claude Code — плагином или одной командой, в ChatGPT и Claude — коннектором по адресу, в Cursor — строкой в настройках. Каталог доступен и без входа, платные инструменты — после входа в кабинет.', 'assets/mascot-sdk.webp', 'Маскот-разработчик за кодом')}

| Где | Как |
|---|---|
| **Claude Code — плагин** | `/plugin marketplace add vibemarketologru/vibe-landing-kit` → `/plugin install vibe-landing@vibe-landing-kit` → `/mcp` → Authenticate |
| **Claude Code — только MCP** | `claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp` |
| **ChatGPT, Claude.ai** | коннектор `https://lk.vibemarketolog.ru/mcp` — [видео-инструкции]({'https://lk.vibemarketolog.ru/connect' + UTM}) |
| **Cursor, Windsurf, VS Code** | `mcp.json` с адресом сервера и ключом — [инструкция]({'https://lk.vibemarketolog.ru/connect' + UTM}#other) |
| **Свой код** | REST: `GET /api/agent/design-systems`, `GET /api/agent/motion`, `POST /api/agent/semantics` — [документация]({'https://lk.vibemarketolog.ru/docs/agent-api' + UTM}) |

Вход — через кабинет [Вайб-Маркетолога]({'https://vibemarketolog.ru' + UTM}): новым пользователям начисляется бонус на баланс.

## Сколько стоит

| Что | Цена |
|---|---|
| Каталог дизайн-систем и анимаций, подбор стиля, этот репозиторий | бесплатно |
| Семантика для сайта | 49 ₽ быстрая · 149 ₽ глубокая |
| Вордстат: популярные запросы / динамика / регионы | 35 / 35 / 99 ₽ |
| Картинки для лендинга | по прайсу модели, от нескольких рублей |
| Отчёт Метрики, анализ кампаний Директа | 19 ₽ / 29–99 ₽ |

Оплата — с рублёвого баланса, только за сделанное, без подписки. Перед каждым платным шагом агент называет цену; дневной лимит подключения по умолчанию 500 ₽ и меняется в кабинете.

## Для разработчиков

- `node tools/check.mjs .` — проверка каталога: контраст WCAG в обеих темах, кириллица и лицензия шрифтов через Fontsource, reduced-motion и свойства анимаций, согласованность ссылок.
- `node tools/preview.mjs .` — снимки галереи (нужен Playwright).
- `python3 tools/build-readme.py` — этот README из `catalog.json`.
- Схема записи — [SCHEMA.md](SCHEMA.md), правила для агентов — [AGENTS.md](AGENTS.md), [llms.txt](llms.txt).

## Лицензии и товарные знаки

Код и каталог — [MIT](LICENSE). Записи вида «Stripe», «Apple» описывают эстетику и не аффилированы с брендами: без логотипов и фирменных шрифтов — подробнее в [TRADEMARKS.md](TRADEMARKS.md). Источники и их лицензии — [NOTICE.md](NOTICE.md).

## Автор

**Владимир Дорецкий** — основатель [Вайб-Маркетолога]({'https://vibemarketolog.ru' + UTM}). Telegram: [@CentrMedia](https://telegram.me/CentrMedia).

Вопросы и идеи — в Issues: там ответ увидят и другие.
'''

en = f'''<div align="center">

<img src="assets/mascot-website.webp" alt="Vibe Marketolog cat mascot building a website" width="240">

# Vibe Landing Kit

**An A/B-test landing page for your ad campaign — in one command to your AI agent.**
{N_DS} design systems inspired by world brands plus original styles (Cyrillic-ready, dark theme, WCAG-checked contrast),
{N_M} motion recipes that respect performance and accessibility, and Yandex Wordstat keyword research.
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

## Gallery: one landing page, {N_DS} styles

{gallery('en')}

## What is inside

- **Design systems** (`design-systems/*.json`, `theme.css`, `DESIGN.md`): role-based color tokens for light and dark themes with contrast checked in both, mobile and desktop type scale, OFL fonts with Cyrillic instead of proprietary brand fonts, landing-page section order, a lead form with consent, A/B axes, do/don't rules and a ready prompt snippet.
- **Motion recipes** (`motion/*.json`): HTML + CSS + vanilla JS, `transform`/`opacity` only, `prefers-reduced-motion` mode ({', '.join(sorted(set(REASON_EN.values())))}), pause for infinite animations.
- **Claude Code plugin**: `/landing` command and skills `landing-ab`, `design-system`, `motion`, `semantics`, plus the MCP server.

## Connect

- Claude Code: `claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp`, then `/mcp` → Authenticate.
- ChatGPT / Claude.ai / Cursor: [step-by-step videos]({'https://lk.vibemarketolog.ru/connect' + UTM}).
- REST: `GET /api/agent/design-systems`, `GET /api/agent/motion`, `POST /api/agent/semantics` — [docs]({'https://lk.vibemarketolog.ru/docs/agent-api' + UTM}).

The catalog is free. Keyword research and images are paid from a ruble balance, per action, no subscription.

## License and trademarks

MIT. Brand-inspired entries describe an aesthetic and are not affiliated with the brands; no logos or proprietary fonts — see [TRADEMARKS.md](TRADEMARKS.md) and [NOTICE.md](NOTICE.md).

**Author:** Vladimir Doretskiy, founder of [Vibe Marketolog]({'https://vibemarketolog.ru' + UTM}) · Telegram [@CentrMedia](https://telegram.me/CentrMedia)
'''

open(os.path.join(ROOT, 'README.md'), 'w').write(ru)
open(os.path.join(ROOT, 'README.en.md'), 'w').write(en)
print('README.md', len(ru), 'README.en.md', len(en))
