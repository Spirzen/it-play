# IT Play

**Интерактивные демо для [Вселенной IT](https://spirzen.ru/)**

| | |
|---|---|
| Публичный сайт | [play.spirzen.ru](https://play.spirzen.ru/) |
| Энциклопедия | [spirzen.ru](https://spirzen.ru/) |
| Код (листинги) | [code.spirzen.ru](https://code.spirzen.ru/) |
| Репозиторий энциклопедии | [it-knowledge-base](https://github.com/spirzen/it-knowledge-base) |

Тяжёлые React-симуляторы, конструкторы и визуализации живут здесь; в статьях — текст и встроенный блок через iframe. Отдельный репозиторий не раздувает JS-бандл Docusaurus (~4000 файлов) и даёт третий лимит GitHub Pages.

---

## Трёхуровневая архитектура

| Сервис | Стек | Роль |
|--------|------|------|
| **spirzen.ru** | Docusaurus + React | Текст, навигация, SEO, лёгкие inline-виджеты |
| **code.spirzen.ru** | Astro + Shiki | Длинные листинги, мультифайловые практикумы |
| **play.spirzen.ru** | Astro + React | Интерактивные демо, симуляторы, визуализации |

**Правило для новых статей:** текст → `it-knowledge-base`, код → `it-code-examples`, интерактив → `it-play`.

---

## Возможности

- **Каталог** с поиском и фильтром по категориям
- **Embed** для iframe в энциклопедии (`ExternalPlayEmbed`)
- **Светлая / тёмная тема** — синхрон с Docusaurus (`postMessage`)
- **Авто-высота iframe** — `ResizeObserver` + `postMessage`

Подробности для агентов — в [AGENTS.md](AGENTS.md).

---

## Стек

| Область | Технология |
|---------|------------|
| Сборка | [Astro 5](https://astro.build/) + [@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/) |
| Интерактив | React 19 (islands, `client:load` на embed-страницах) |
| Node.js | ≥ 20 |
| Деплой | GitHub Actions → GitHub Pages (`play.spirzen.ru`) |

---

## Быстрый старт

**Windows:** `start.bat` — проверит Node.js, при необходимости `npm install`, запустит dev на порту **4322**.

```bash
git clone https://github.com/spirzen/it-play.git
cd it-play
npm install
npm run dev
```

Откройте [http://localhost:4322/](http://localhost:4322/).

```bash
npm run build    # dist/
npm run preview  # проверка сборки
```

---

## Структура репозитория

```
it-play/
├── plays/                       # метаданные демо
│   └── <category>/
│       └── <slug>/
│           └── meta.json
├── src/
│   ├── components/demos/        # React-компоненты
│   ├── lib/
│   │   ├── plays.ts             # сканер каталога
│   │   └── demoRegistry.tsx     # slug → компонент
│   ├── layouts/
│   └── pages/
│       ├── index.astro          # каталог
│       ├── p/[...slug].astro    # полная страница
│       └── p/embed/[...slug].astro
├── public/
│   ├── scripts/                 # theme, embed-resize, catalog-search
│   └── styles/                  # global, embed, demo
└── .github/workflows/deploy.yml
```

---

## URL и пути

Канонический **`BASE=/`** на custom domain `play.spirzen.ru`.

| Тип | Путь |
|-----|------|
| Главная | `/` |
| Демо | `/p/<category>/<slug>/` |
| Embed | `/p/embed/<category>/<slug>/` |

Прод-сборка:

```bash
IT_PLAY_SITE=https://play.spirzen.ru
IT_PLAY_BASE=/
```

---

## Добавление нового демо

1. Создайте `plays/<category>/<slug>/meta.json`
2. Реализуйте React-компонент в `src/components/demos/`
3. Зарегистрируйте в `src/lib/demoRegistry.tsx`
4. В статье энциклопедии:

```jsx
import ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';

<ExternalPlayEmbed example="code-basics/block-builder" title="Конструктор блоков" />
```

---

## iframe-контракт

| Сообщение | Направление | Payload |
|-----------|-------------|---------|
| `it-play-embed-height` | iframe → parent | `{ height: number }` |
| `it-play-theme` | parent → iframe | `{ theme: 'light' \| 'dark' }` |

CSP `frame-ancestors`: `spirzen.ru`, `localhost:3000`.

---

## Лицензия

MIT
