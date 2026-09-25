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
SHOW_PATH = os.path.join(ROOT, 'showcase.json')
show = json.load(open(SHOW_PATH)) if os.path.exists(SHOW_PATH) else []
VER = cat.get('version', '1.1.0')
styles = [s for s in systems if s.get('kind') != 'brand']

def fonts(slug):
    d = json.load(open(os.path.join(ROOT, 'design-systems', slug + '.json')))
    return ', '.join(dict.fromkeys(f['family'] for f in d.get('fonts', [])))

def gallery(lang):
    """Живые лендинги: снимок первого экрана (десктоп + телефон), ниша, спрос, стиль, гипотеза, медиа, ссылки A и Б."""
    rows = []
    for x in show:
        t = x['en'] if lang == 'en' else x['ru']
        a, b = x['url'] + '?v=a', x['url'] + '?v=b'
        pic = (f'<a href="{x["url"]}"><img src="{x["shot_desktop"]}" width="560" alt="{h(t["alt"])}"></a>'
               f'<a href="{x["url"]}"><img src="{x["shot_mobile"]}" width="130" alt="{h(t["alt_m"])}"></a>')
        demand = (f'{x["freq"]:,}'.replace(',', '\u202f') + (' показов/мес' if lang == 'ru' else ' searches/mo')) if x.get('freq') else ''
        style = f'<a href="design-systems/{x["style"]}/DESIGN.md">{h(x["style_name"])}</a>'
        if lang == 'ru':
            info = (f'<b><a href="{x["url"]}">{h(t["title"])}</a></b><br><sub>{h(t["niche"])}'
                    + (f' · «{h(x["query"])}» — {demand}' if demand else '') + f' · стиль {style}</sub><br><br>'
                    f'<b>Гипотеза.</b> {h(t["hypothesis"])}<br><b>Медиа.</b> {h(t["media"])}<br><br>'
                    f'<a href="{a}">Вариант A</a> · <a href="{b}">Вариант Б</a>')
        else:
            info = (f'<b><a href="{x["url"]}">{h(t["title"])}</a></b><br><sub>{h(t["niche"])}'
                    + (f' · "{h(x["query"])}" — {demand}' if demand else '') + f' · style {style}</sub><br><br>'
                    f'<b>Hypothesis.</b> {h(t["hypothesis"])}<br><b>Media.</b> {h(t["media"])}<br><br>'
                    f'<a href="{a}">Variant A</a> · <a href="{b}">Variant B</a>')
        rows.append(f'<tr><td width="58%" valign="top">{pic}</td><td valign="top">{info}</td></tr>')
    return '<table>\n' + '\n'.join(rows) + '\n</table>'

def h(t):
    """Текст для ячейки таблицы: «<details>» в названии GitHub рисовал настоящим тегом."""
    return str(t).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('|', '\\|')

SKILLS = [  # порядок = порядок работы; описание — что даёт, а не как устроено
    ('landing-ab', 'Главный маршрут: от гипотезы до запущенного теста', 'Main route: from hypothesis to a running test'),
    ('hypothesis-lab', 'Гипотеза «если — то — потому что», ICE/PIE, выборка и бюджет, A/A-тест, вердикт без подглядывания', 'Hypothesis template, ICE/PIE, sample size and budget, A/A test, verdict without peeking'),
    ('landing-brief', 'Бриф A–G до вёрстки, «зерно дизайна» против шаблонности, 21 раскладка секций, ревью по 14 пунктам', 'A–G brief, a design seed against template look, 21 section layouts, a 14-point review'),
    ('design-system', 'Стиль из каталога: токены обеих тем, шрифты с кириллицей, компоненты', 'Catalog style: tokens for both themes, Cyrillic fonts, components'),
    ('brand-to-system', 'Свой стиль из брендбука клиента в формате каталога, с проверкой контраста', "The client's brand book turned into a catalog entry with contrast checks"),
    ('semantics', 'Заголовки, FAQ и минус-слова из Яндекс Вордстата', 'Headlines, FAQ and negative keywords from Yandex Wordstat'),
    ('landing-media', 'Кадр первого экрана, персонаж на все ролики, видео с русской речью, аудиоверсия', 'First-screen still, one character across videos, Russian speech, audio version'),
    ('motion', 'Анимации с режимом «меньше движения»', 'Motion recipes with reduced-motion'),
    ('landing-mobile', 'Телефон: чек-лист из 30 пунктов, iOS 26/27, Android, встроенные браузеры ВК и Telegram', 'Phones: a 30-point checklist, iOS 26/27, Android, VK and Telegram in-app browsers'),
    ('landing-law-ru', '152-ФЗ, закон о рекламе, модерация Директа и ВК — шаблоны согласия и политики', '152-FZ, advertising law, ad moderation — consent and policy templates'),
    ('landing-chatbot', 'Чат-бот с ИИ на странице: обучение по FAQ и сайту, виджет в цвет стиля', 'AI chatbot on the page: trained on the FAQ and site, widget in the style colors'),
    ('ad-match', 'Реклама под варианты: объявление обещает то же, что первый экран; автостоп', 'Ads for the variants: the ad promises what the first screen shows; auto-stop rules'),
]
N_SK = len(SKILLS)

def sk_table(lang):
    if lang == 'ru':
        out = ['| Навык | Что даёт |', '|---|---|']
        for slug, ru_, en_ in SKILLS:
            out.append(f'| [`{slug}`](skills/{slug}/SKILL.md) | {h(ru_)} |')
    else:
        out = ['| Skill | What it gives |', '|---|---|']
        for slug, ru_, en_ in SKILLS:
            out.append(f'| [`{slug}`](skills/{slug}/SKILL.md) | {h(en_)} |')
    return '\n'.join(out)

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
    f'[![Версия](https://img.shields.io/badge/версия-{VER}-6D28D9?style=flat-square)](CHANGELOG.md)\n'
    f'[![Лицензия](https://img.shields.io/badge/лицензия-MIT-8B5CF6?style=flat-square)](LICENSE)\n'
    f'[![Живых лендингов](https://img.shields.io/badge/живых_лендингов-{len(show)}-A480EF?style=flat-square)](#живые-лендинги)\n'
    f'[![Дизайн-систем](https://img.shields.io/badge/дизайн--систем-{N_DS}-A480EF?style=flat-square)](#дизайн-системы)\n'
    f'[![Навыков](https://img.shields.io/badge/навыков-{N_SK}-A480EF?style=flat-square)](#библиотека-навыков)\n'
    f'[![Claude Code](https://img.shields.io/badge/Claude_Code-плагин-2B8A3E?style=flat-square)](#подключение)\n'
    f'[![MCP](https://img.shields.io/badge/MCP-ChatGPT_·_Claude_·_Cursor-1E6FD9?style=flat-square)](https://lk.vibemarketolog.ru/connect)'
)

UTM = '?utm_source=github&utm_medium=readme&utm_campaign=vibe-landing-kit'
N_NICHE = len([x for x in show if x.get('freq') and not x.get('product')])

def intro(html, img, alt, w=170):
    '''Вводный абзац раздела + стикер в две колонки: стикер «float: right» перед широкой
    таблицей оставлял пустую полосу — таблица на всю ширину не встаёт рядом с картинкой.'''
    return f'<table><tr><td valign="middle">{html}</td><td width="{w}" align="center"><img src="{img}" width="{w - 20}" alt="{alt}"></td></tr></table>'


ru = f'''<div align="center">

<img src="assets/mascot-website.webp" alt="Кот-маскот Вайб-Маркетолога собирает сайт" width="260">

# Vibe Landing Kit

**Лендинг для A/B-теста рекламы — от брифа до работающей гипотезы одной командой агенту.**
Атмосферный первый экран с картинкой или видео на всю ширину, персонаж с русской речью, заявки в Telegram,
A/B-тест на одном адресе, паспорт качества и чат-бот с ИИ. {N_DS} дизайн-систем в духе мировых брендов, {N_M} анимаций, {N_SK} навыков, семантика Вордстата.
Для Claude Code, ChatGPT, Claude и Cursor.

{BADGES}

**Русский** · [English](README.en.md)

</div>

---

## Одна команда

```text
/plugin marketplace add vibemarketologru/vibe-landing-kit
/plugin install vibe-landing@vibe-landing-kit
/landing Пластиковые окна в Москве. Гипотеза: «цена из договора» против «от 9 900 ₽». Стиль швейцарский
```

Агент пройдёт весь путь сам и остановится перед каждым платным шагом, назвав цену:

```mermaid
flowchart LR
  Z[Гипотеза<br/>и выборка] --> A[Бриф]
  A --> B[Стиль из каталога]
  B --> C[Семантика Вордстата]
  C --> D[Медиа: кадр, персонаж, видео]
  D --> E[Вариант А:<br/>телефон, закон, чат-бот]
  E --> F[Вариант Б:<br/>одно отличие]
  F --> G[Паспорт качества]
  G --> H[Запуск: адрес, заявки,<br/>A/B-тест]
  H --> R[Реклама<br/>под варианты]
  R --> I[Итоги теста]
```

> [!TIP]
> Каталог работает и без подключения: каждая система лежит в репозитории как JSON, готовый `theme.css` для обеих тем и `DESIGN.md`. Передайте файл любому агенту — он сверстает страницу в этом стиле.

## Живые лендинги

{N_NICHE} самых частотных ниш по Яндекс Вордстату и наш собственный продукт. Каждый собран этим маршрутом: стиль из каталога, медиа на весь первый экран, два варианта с одним отличием, паспорт, запуск. Страницы работают: откройте вариант A и вариант Б, отправьте заявку — она придёт в кабинет (компании в примерах вымышленные, это отмечено на странице).

{gallery('ru')}

## Медиа на первом экране

{intro('Атмосферу продаёт первый кадр, а не абзац текста. Навык <code>landing-media</code> ведёт агента по конвейеру: сначала выверенный кадр <b>gpt-image-2.5</b> (с отдельным вертикальным для телефона), потом его оживление в <b>Gemini Omni</b> — постер и первый кадр ролика совпадают, вспышки при загрузке нет. Персонаж или маскот заводится один раз и говорит одним голосом по-русски во всех роликах лендинга. Для долгих решений — аудиоверсия страницы тем же голосом.', 'assets/sticker-motion.webp', 'Кот дирижирует анимацией карточек')}

| Что | Как | Цена |
|---|---|---|
| Кадр первого экрана и секций | `gpt-image-2.5-flare`, язык документальной съёмки, место под заголовок задаётся композицией | 16 ₽ |
| Логотип или маскот в кадре | `gpt-image-2.5-flare-edit` с вашим файлом — логотип не перерисовывается | 22 ₽ |
| Персонаж на все ролики | голос-пресет `gemini-omni-audio` → персонаж `gemini-omni-character` по портрету | 39 + 49 ₽ |
| Видео | `gemini-omni-video` 720p, до 10 с: фон-петля из кадра или обращение персонажа с точной репликой | 149 ₽ |
| Аудиоверсия страницы | `gemini-flash-tts` тем же голосом, что у персонажа | 13 ₽ за 1000 знаков |

Где ставить видео, решает стиль: блок `media` каждой дизайн-системы повторяет приём бренда — у Apple фильм по кнопке и липкие секции, у BMW разделённые экраны «кадр + факт», у Airbnb ролик хозяина в его блоке, у журнального стиля фото-эссе. Тихие петли собираются «вперёд и назад» без шва, люди в кадре играют один раз и замирают, ролик со звуком — только по кнопке и с субтитрами.

> [!IMPORTANT]
> Против нейрослопа: каждый кадр смотрят глазами до оживления, речь в каждом ролике проверяют распознаванием. В примерах выше две реплики из трёх модель испортила повтором — их поймал этот шаг, и на страницы они не попали. Приёмы и готовые блоки — [skills/landing-media](skills/landing-media/SKILL.md).

## Гипотеза под ключ

{intro('Лендинг, собранный агентом у вас на компьютере, становится работающей гипотезой одной командой <code>landing_launch</code>: адрес на <code>lk.vibemarketolog.ru/w/…</code>, форма сама отправляет заявки в кабинет, Telegram и на почту, трафик делится 50/50 между вариантами на одном адресе, статистика и вердикт по значимости считаются у нас, а сразу после запуска уходит проверочная заявка — видно, что доставка работает.', 'assets/sticker-ab.webp', 'Кот сравнивает две версии страницы')}

| Шаг | Инструмент | Цена |
|---|---|---|
| Паспорт: настоящий браузер на 1280/390/360/320 px и боком — скролл на телефоне, кнопка на первом экране, форма с согласием 152-ФЗ, CDN, медиа, читаемость; **снимки первого экрана A и Б до оплаты**; черновик на сервере — дальше только правки | `landing_check` | бесплатно |
| Файл, приложенный в чат: одноразовая ссылка загрузки для человека | `upload_link` | бесплатно |
| Проверка речи в ролике и петля видео на сервере | `media_check`, `video_loop` | бесплатно |
| Запуск: адрес, заявки, A/B-тест, проверочная заявка. Паспорт не пройден — деньги не списываются | `landing_launch` | 990 ₽ |
| Правки варианта A или Б | `landing_update` | бесплатно |
| Итоги: визиты, заявки, конверсия, вердикт, сколько ещё нужно | `landing_status` | бесплатно |
| Про-версия победителя: полный сайт по выигравшему варианту | `landing_pro` | до 4 500 ₽ |

## Библиотека навыков

{intro(f'{N_SK} навыков ведут агента по всей работе — от формулировки гипотезы до рекламы под варианты. В Claude Code они ставятся плагином, в ChatGPT, Claude.ai и Cursor приходят с MCP-сервера готовыми сценариями. Всё авторское проверено на живых страницах: формулы выборки пересчитаны и сверены симуляцией, шаблоны формы и сплита открыты в браузере, законы сверены с первоисточниками.', 'assets/mascot-sdk.webp', 'Маскот-разработчик за кодом')}

{sk_table('ru')}

## Телефон: iOS 26/27 и Android

Из рекламы на лендинг приходят с телефона — 70–85 % визитов. Навык [`landing-mobile`](skills/landing-mobile/SKILL.md) собирает то, что реально меняется на экране, и помечает, что подтверждено Apple и WebKit, что — сообществом, а что — слухи:

| Что | Почему |
|---|---|
| `html, body` с цветом фона | iOS 26 больше не красит панели по `theme-color`: цвет берётся из фона страницы и прижатых к краю слоёв; прозрачный корень даёт белые полосы |
| Первый экран `100svh`, кнопка видна на 360×740, 320×640 и боком 844×390 | половина посетителей рекламы до кнопки не долистает |
| Поля от 16 px, `type="tel"`, `autocomplete="tel"` | мельче 16 px iOS увеличивает страницу при фокусе; номер подставляется одним касанием |
| Липкая кнопка прячется у формы и при открытой клавиатуре | иначе она закрывает поле, в которое человек пишет |
| Видео `muted playsinline` и постер со смыслом | в режиме энергосбережения автозапуска нет вовсе — остаётся только постер |
| Safari 27: `sizes="auto"`, привязка прокрутки | картинки нужного размера и страница без прыжков при догрузке |

Отдельной «адаптации под iOS 27» в CSS не существует: достаточно пережить Liquid Glass из Safari 26 и взять новые возможности Safari 27. Паспорт проверяет это автоматически — на сервере (`landing_check`) и у вас на компьютере: `node tools/passport.mjs index.html b.html` (Playwright, 36 проверок, без сети и денег). Что видно только на живом телефоне — в конце навыка протокол на 10 минут.

## Чат-бот с ИИ на лендинге

{intro('Часть посетителей рекламы не готова оставить телефон, но готова спросить. Консультант с ИИ отвечает по базе знаний страницы, зовёт живого оператора и забирает контакт. Агент создаёт бота, учит его вопросам и ценам со страницы, красит виджет в цвет главной кнопки стиля и ставит одну строку кода одинаково в A и Б. Уведомления о вопросах — в кабинет и Telegram.', 'assets/sticker-ab.webp', 'Кот сравнивает две версии страницы')}

| Шаг | Инструмент | Цена |
|---|---|---|
| Создать бота для сайта | `chatbot_create_site` | бесплатно |
| Научить: пункт FAQ или текст · страница сайта · весь сайт | `chatbot_learn`, `chatbot_learn_site` | 5 ₽ · 10 ₽ · 4 ₽ за страницу (до 30) |
| Вид и код виджета | `chatbot_widget` | бесплатно |
| Ответ посетителю | — | от 2 ₽ за ответ, без абонплаты |
| Диалоги, ответ от имени оператора | `chatbot_conversations`, `chatbot_status` | бесплатно |

## Что внутри

### Дизайн-системы

{intro('Каждая запись — всё, что нужно агенту, чтобы сверстать страницу без вопросов: токены обеих тем, шрифты, компоненты, раскладку лендинга, форму заявки, правила A/B-теста и правила медиа бренда.', 'assets/mascot-vaib-agent.webp', 'Маскот-агент с папкой проектов')}

| | |
|---|---|
| **Токены** | цвета светлой и тёмной темы по ролям, типографика для десктопа и телефона, радиусы, отступы, тени, движение |
| **Контраст** | каждая пара «текст — фон» проверена по WCAG в обеих темах: текст ≥ 7, остальное ≥ 4.5 |
| **Шрифты** | только свободные OFL-шрифты с кириллицей из Fontsource — вместо фирменных, которые нельзя распространять |
| **Лендинг** | первый экран, порядок секций, форма заявки с согласием 152-ФЗ, мобильная раскладка |
| **Медиа** | что бренд ставит на первый экран, где видео ниже, уместен ли персонаж и аудиоверсия, чего избегать |
| **A/B-тест** | что можно менять между вариантами и что обязано остаться неизменным |
| **Правила** | do / don't и готовая инструкция верстальщику |

{ds_table()}

### Анимации

{intro('Готовые рецепты: разметка, CSS и ванильный JS без внешних библиотек. Анимируются только <code>transform</code> и <code>opacity</code>, первый экран не ждёт скриптов, у каждого рецепта есть режим «меньше движения» (<code>prefers-reduced-motion</code>), у бесконечных — пауза.', 'assets/sticker-semantics.webp', 'Кот с лупой разбирает ключевые запросы')}

{m_table()}

## Семантика из Яндекс Вордстата

Инструмент `build_semantics` собирает запросы Вордстата и раскладывает их по блокам лендинга: что писать в заголовке, в ценах, в вопросах и в кнопке. Живой пример «кухни на заказ в Казани», быстрый уровень — 100 фраз за 20 секунд:

| Блок | Группа | Показов в месяц | Примеры фраз |
|---|---|---|---|
| `hero` | Кухни на заказ в Казани | 1 101 | кухни на заказ казань, заказать кухонный гарнитур |
| `pricing` | Цены и недорогие кухни | 384 | кухня на заказ цена, кухни на заказ казань недорого |
| `proof` | Каталог, фото и отзывы | 228 | кухни на заказ казань каталог, от производителя |
| `faq` | Вопросы о кухнях на заказ | 55 | какие лучше, размеры |
| `lead_form` | Заявка и контакты | 35 | изготовление кухни на заказ |

Плюс минус-слова для рекламы (`доставка еды`, `пицца`, `авито`…), а на глубоком уровне — сезонность за 24 месяца и пары заголовков А/Б для каждой группы.

## Подключение

{intro('Один MCP-сервер для всех: в Claude Code — плагином или одной командой, в ChatGPT и Claude — коннектором по адресу, в Cursor — строкой в настройках. Маршрут лендинга приходит и в ChatGPT с Claude.ai: сервер отдаёт все навыки библиотеки как готовые сценарии (MCP prompts).', 'assets/mascot-sdk.webp', 'Маскот-разработчик за кодом')}

| Где | Как |
|---|---|
| **Claude Code — плагин** | `/plugin marketplace add vibemarketologru/vibe-landing-kit` → `/plugin install vibe-landing@vibe-landing-kit` → `/mcp` → Authenticate |
| **Claude Code — только MCP** | `claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp` |
| **ChatGPT, Claude.ai** | коннектор `https://lk.vibemarketolog.ru/mcp` — [видео-инструкции]({'https://lk.vibemarketolog.ru/connect' + UTM}) |
| **Cursor, Windsurf, VS Code** | `mcp.json` с адресом сервера и ключом — [инструкция]({'https://lk.vibemarketolog.ru/connect' + UTM}#other) |
| **Свой код** | REST: `/api/agent/design-systems`, `/motion`, `/semantics`, `/landings`, `/landings/check`, `/chatbots`, `/uploads/image`, `/uploads/links`, `/media/check`, `/media/loop` — [документация]({'https://lk.vibemarketolog.ru/docs/agent-api' + UTM}) |

Вход — через кабинет [Вайб-Маркетолога]({'https://vibemarketolog.ru' + UTM}): новым пользователям начисляется бонус на баланс.

## Сколько стоит

| Что | Цена |
|---|---|
| Каталог дизайн-систем и анимаций, подбор стиля, паспорт лендинга, правки и итоги теста, этот репозиторий | бесплатно |
| Семантика для сайта | 49 ₽ быстрая · 149 ₽ глубокая |
| Вордстат: популярные запросы / динамика / регионы | 49 / 49 / 99 ₽ |
| Кадр gpt-image-2.5 · с логотипом по образцу | 16 ₽ · 22 ₽ |
| Видео Gemini Omni 720p · персонаж с голосом · аудиоверсия | 149 ₽ · 88 ₽ · 13 ₽ за 1000 знаков |
| Чат-бот с ИИ: обучение · ответ посетителю | от 5 ₽ · от 2 ₽ |
| Запуск гипотезы: адрес, заявки, A/B-тест | 990 ₽ |
| Про-версия победителя | до 4 500 ₽ |
| Отчёт Метрики, анализ кампаний Директа | 19 ₽ / 29–99 ₽ |

Оплата — с рублёвого баланса, только за сделанное, без подписки. Перед каждым платным шагом агент называет цену; дневной лимит подключения по умолчанию 500 ₽ и меняется в кабинете. Типичный лендинг из галереи: медиа 60–600 ₽ и 990 ₽ за запуск.

## Партнёрская программа

{intro('Собираете лендинги клиентам — зарабатывайте на их работе в платформе. Пригласите клиента по своей ссылке: вы получаете <b>10 % с каждого его пополнения</b>, а по мере роста оборота приведённых ставка поднимается до <b>30 %</b>. Деньги копятся на отдельном партнёрском балансе: перевод на баланс кабинета — мгновенно, вывод деньгами — по заявке.', 'assets/mascot-vaib-agent.webp', 'Маскот-агент с папкой проектов')}

| Оборот приведённых | Ставка |
|---|---|
| старт | 10 % |
| от 10 000 ₽ | 15 % |
| от 50 000 ₽ | 20 % |
| от 150 000 ₽ | 25 % |
| от 300 000 ₽ | 30 % |

Ссылка и статистика — в кабинете: [lk.vibemarketolog.ru/partner]({'https://lk.vibemarketolog.ru/partner' + UTM}). Ссылка работает на любой странице (`?ref=ваш-код`), человек закрепляется за вами на 30 дней. Начисление приходит после 14 дней удержания, возврат платежа его отменяет.

## Для разработчиков

- `node tools/check.mjs .` — проверка каталога: контраст WCAG в обеих темах, кириллица и лицензия шрифтов через Fontsource, reduced-motion и свойства анимаций, блок `media`, согласованность ссылок.
- `node tools/passport.mjs index.html b.html` — паспорт лендинга у вас на компьютере: те же блокирующие проверки, что у `landing_check`, плюс мобильные (Playwright, код выхода 1 — есть блокирующие).
- `python3 tools/build-readme.py` — этот README из `catalog.json` и `showcase.json`.
- Схема записи — [SCHEMA.md](SCHEMA.md), правила для агентов — [AGENTS.md](AGENTS.md), [llms.txt](llms.txt).

## Лицензии и товарные знаки

Код и каталог — [MIT](LICENSE). Записи вида «Stripe», «Apple» описывают эстетику и не аффилированы с брендами: без логотипов и фирменных шрифтов — подробнее в [TRADEMARKS.md](TRADEMARKS.md). Источники и их лицензии — [NOTICE.md](NOTICE.md). Компании в демо-лендингах вымышлены, медиа сгенерированы для примеров.

## Автор

**Владимир Дорецкий** — основатель [Вайб-Маркетолога]({'https://vibemarketolog.ru' + UTM}). Telegram: [@CentrMedia](https://telegram.me/CentrMedia).

Вопросы и идеи — в Issues: там ответ увидят и другие.
'''

en = f'''<div align="center">

<img src="assets/mascot-website.webp" alt="Vibe Marketolog cat mascot building a website" width="240">

# Vibe Landing Kit

**An A/B-test landing page for your ad campaign — from brief to a live hypothesis in one command to your AI agent.**
A full-bleed first screen with an image or video, a recurring character speaking Russian, leads delivered to Telegram,
an A/B test on one URL, a quality passport and an AI chatbot. {N_DS} brand-inspired design systems, {N_M} motion recipes, {N_SK} skills, Yandex Wordstat keywords.
For Claude Code, ChatGPT, Claude and Cursor.

[Русский](README.md) · **English**

</div>

---

## One command

```text
/plugin marketplace add vibemarketologru/vibe-landing-kit
/plugin install vibe-landing@vibe-landing-kit
/landing PVC windows in Moscow. Hypothesis: "price fixed in the contract" vs "from 9,900 ₽". Swiss style
```

The agent picks a style, researches keywords, makes the media, builds variant A and a variant B that differs in exactly one factor, passes the quality passport and launches the hypothesis — asking before every paid step.

## Live landing pages

The {N_NICHE} most-searched niches on Yandex Wordstat plus our own product, each built with this workflow. The pages are live: open variant A and variant B (the companies in the demos are fictional, which is stated on the page).

{gallery('en')}

## Media on the first screen

The `landing-media` skill: a composed still by **gpt-image-2.5** (plus a vertical one for phones) → animated by **Gemini Omni** (poster = first frame, no flash) → one character or mascot speaking one Russian voice across all videos → an optional audio version of the page in the same voice. Each design system's `media` block repeats how the brand places media. Every still is reviewed by eye and every spoken line is checked by speech recognition before publishing.

## Hypothesis launch

`landing_check` (free passport in a real browser) → `landing_launch` (990 ₽: URL, lead delivery to cabinet/Telegram/email, 50/50 A/B test with a significance verdict, a test lead) → `landing_update` (free) → `landing_status` (free) → `landing_pro` (4,500 ₽, full site from the winning variant).

## Skills library

{sk_table('en')}

## Phones: iOS 26/27 and Android

70–85% of ad traffic lands on a phone. `landing-mobile` covers what actually changes: iOS 26 no longer tints the browser bars from `theme-color` (it samples the page and edge-pinned layers, so set a background on `html` and `body`), `100svh` first screens, 16px+ inputs, sticky CTA hidden near the form and while the keyboard is open, `muted playsinline` video with a meaningful poster (Low Power Mode never autoplays), Safari 27 `sizes="auto"` and scroll anchoring. Run the passport locally: `node tools/passport.mjs index.html b.html`.

## AI chatbot on the landing page

`chatbot_create_site` (free) → `chatbot_learn` / `chatbot_learn_site` (5 ₽ per FAQ item, 10 ₽ per page, 4 ₽ per crawled page up to 30) → `chatbot_widget` (free; one `<script>` line, placed identically in A and B) → answers from 2 ₽, no subscription → `chatbot_conversations` for dialogs and operator replies.

## What is inside

- **Design systems** (`design-systems/*.json`, `theme.css`, `DESIGN.md`): role-based color tokens for light and dark themes with contrast checked in both, mobile and desktop type scale, OFL fonts with Cyrillic instead of proprietary brand fonts, landing-page section order, a lead form with consent, A/B axes, brand media rules, do/don't and a ready prompt snippet.
- **Motion recipes** (`motion/*.json`): HTML + CSS + vanilla JS, `transform`/`opacity` only, `prefers-reduced-motion` mode ({', '.join(sorted(set(REASON_EN.values())))}), pause for infinite animations.
- **Claude Code plugin**: `/landing` command, {N_SK} skills and the MCP server. ChatGPT and Claude.ai get the same skills as MCP prompts.

## Connect

- Claude Code: `claude mcp add --transport http vibemarketolog https://lk.vibemarketolog.ru/mcp`, then `/mcp` → Authenticate.
- ChatGPT / Claude.ai / Cursor: [step-by-step videos]({'https://lk.vibemarketolog.ru/connect' + UTM}).
- REST: `/api/agent/design-systems`, `/motion`, `/semantics`, `/landings`, `/landings/check`, `/chatbots`, `/uploads/image`, `/uploads/links`, `/media/check`, `/media/loop` — [docs]({'https://lk.vibemarketolog.ru/docs/agent-api' + UTM}).

The catalog, the passport, edits and test results are free. Keywords, media and the launch are paid from a ruble balance, per action, no subscription.

## Partner program

Invite your clients with your link and earn 10% of their top-ups, rising to 30% with the referred turnover — [lk.vibemarketolog.ru/partner]({'https://lk.vibemarketolog.ru/partner' + UTM}).

## License and trademarks

MIT. Brand-inspired entries describe an aesthetic and are not affiliated with the brands; no logos or proprietary fonts — see [TRADEMARKS.md](TRADEMARKS.md) and [NOTICE.md](NOTICE.md). Demo companies are fictional; media was generated for the examples.

**Author:** Vladimir Doretskiy, founder of [Vibe Marketolog]({'https://vibemarketolog.ru' + UTM}) · Telegram [@CentrMedia](https://telegram.me/CentrMedia)
'''

open(os.path.join(ROOT, 'README.md'), 'w').write(ru)
open(os.path.join(ROOT, 'README.en.md'), 'w').write(en)
print('README.md', len(ru), 'README.en.md', len(en))
