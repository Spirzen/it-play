# IT Play

**Интерактивные демо для [Вселенной IT](https://spirzen.ru/) — ~500 симуляторов**

| | |
|---|---|
| Публичный сайт | [play.spirzen.ru](https://play.spirzen.ru/) |
| Энциклопедия | [spirzen.ru](https://spirzen.ru/) |
| Код (листинги) | [code.spirzen.ru](https://code.spirzen.ru/) |
| Панель разработчика | [it-management](../it-management/) → `:8787` |

Тяжёлые React-симуляторы, конструкторы и визуализации живут здесь; в статьях — текст и встроенный блок через iframe. Отдельный репозиторий не раздувает JS-бандл Docusaurus и даёт третий лимит GitHub Pages.

---

## Место в экосистеме

| Сервис | Репозиторий | Стек | Роль |
|--------|-------------|------|------|
| **spirzen.ru** | `it-knowledge-base` | Docusaurus + React | Текст, SEO, DocSearch, лёгкие inline-виджеты |
| **code.spirzen.ru** | `it-code-examples` | Astro + Shiki | ~2312 листингов |
| **play.spirzen.ru** | `it-play` (этот) | Astro + React 19 | ~500 интерактивных демо |

**Правило:** тяжёлый React-интерактив → здесь; текст → `it-knowledge-base`; длинный код → `it-code-examples`.

Интеграция: [`it-knowledge-base/info/ECOSYSTEM.md`](../it-knowledge-base/info/ECOSYSTEM.md).

---

## Возможности

- **Каталог** с `catalog-search` и фильтром по категориям
- **Embed** для энциклопедии (`ExternalPlayEmbed`)
- **Светлая / тёмная тема** — `postMessage` `it-play-theme`
- **Авто-высота iframe** — `ResizeObserver` + `it-play-embed-height`
- **Fullscreen** — `it-play-fullscreen` / `it-play-fullscreen-close`
- **Данные из статьи** — `it-play-embed-data` (экзамены, каталоги игр)
- **Konva** — диаграммы и canvas-симуляторы

Подробности для агентов — [AGENTS.md](AGENTS.md).

---

## Стек

| Область | Технология |
|---------|------------|
| Сборка | [Astro 5](https://astro.build/) + [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) |
| Интерактив | React 19 (islands, `client:load` на embed) |
| Графика | `konva`, `react-konva` |
| Утилиты | `html2canvas`, `jspdf`, `qrcode`, `uuid` |
| Node.js | ≥ 20 |
| Деплой | GitHub Actions → GitHub Pages (`play.spirzen.ru`) |

---

## Быстрый старт

**Windows:** `start.bat` — dev на порту **4322**.

```bash
git clone https://github.com/spirzen/it-play.git
cd it-play
npm install
npm run dev      # http://localhost:4322/
npm run build    # dist/
npm run preview
```

---

## Структура репозитория

```
it-play/
├── plays/                       # ~500 демо
│   └── <category>/<slug>/meta.json
├── src/
│   ├── components/demos/        # React-компоненты
│   ├── lib/demoRegistry.tsx     # slug → компонент (import.meta.glob)
│   └── pages/p/embed/[...slug].astro
├── public/scripts/
│   ├── embed-resize.js          # it-play-embed-height
│   ├── theme.js                 # it-play-theme
│   └── catalog-search.js
└── AGENTS.md
```

---

## URL

Канонический **`BASE=/`** на `play.spirzen.ru`.

| Тип | Путь |
|-----|------|
| Каталог | `/` |
| Демо | `/p/<category>/<slug>/` |
| Embed | `/p/embed/<category>/<slug>/` |

Prod: `IT_PLAY_SITE=https://play.spirzen.ru`, `IT_PLAY_BASE=/`.

---

## Добавление демо

1. `plays/<category>/<slug>/meta.json`
2. React в `src/components/demos/`
3. Авторегистрация через `demoRegistry.tsx`
4. В статье:

```jsx
import ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';
<ExternalPlayEmbed example="code-basics/block-builder" title="Конструктор блоков" />
```

---

## Контракт iframe

| Сообщение | Направление | Payload |
|-----------|-------------|---------|
| `it-play-embed-height` | iframe → parent | `{ height: number }` |
| `it-play-theme` | parent → iframe | `{ theme: 'light' \| 'dark' }` |
| `it-play-embed-data` | parent → iframe | `{ payload: Record<string, unknown> }` |
| `it-play-fullscreen` | iframe → parent | `{ active: boolean }` |
| `it-play-fullscreen-close` | parent → iframe | `{}` |

CSP `frame-ancestors`: `spirzen.ru`, `localhost:3000`.

---

## Лицензия

MIT
