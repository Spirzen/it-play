import React, {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {loadDocSearchIndex} from '@/components/shared/kb/docSearchEngine';
import styles from '@/components/demos/InterestNavigatorGameV2Play.module.css';

const STORAGE_KEY = 'it-universe-interest-ratings-v2';

const SPHERES = [
  {
    id: 'engineering',
    label: 'Инженерия',
    keywords: ['инженер', 'архитектор', 'engineering', 'проектирование', 'проект', 'конструкция', 'инженерная'],
  },
  {
    id: 'network',
    label: 'Сеть и интернет',
    keywords: ['сеть', 'интернет', 'dns', 'tcp', 'udp', 'ip', 'порт', 'маршру', 'http', 'cookie', 'cors', 'dns', 'ssh'],
  },
  {
    id: 'office',
    label: 'Офис и документы',
    keywords: ['word', 'excel', 'xlsx', 'офис', 'документ', 'презентац', 'маркетинг', 'резюме', 'портфолио'],
  },
  {
    id: 'programming',
    label: 'Программирование',
    keywords: ['код', 'программа', 'алгоритм', 'ооп', 'функци', 'цикл', 'git', 'разработка', 'синтаксис', 'отлад'],
  },
  {
    id: 'web',
    label: 'Веб-разработка',
    keywords: ['веб', 'сайт', 'браузер', 'html', 'css', 'javascript', 'js', 'dom', 'frontend', 'веб-прилож'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    keywords: ['фронтенд', 'ui', 'ux', 'интерфейс', 'dom', 'react', 'компонент', 'рендер'],
  },
  {
    id: 'backend',
    label: 'Backend',
    keywords: ['бэкенд', 'сервер', 'api', 'rest', 'graphql', 'rpc', 'orm', 'микросервис', 'http', 'ws', 'websocket'],
  },
  {
    id: 'systemProgramming',
    label: 'Системное программирование',
    keywords: ['ядро', 'процесс', 'память', 'поток', 'unix', 'linux', 'ос', 'операционн', 'процессор', 'драйвер'],
  },
  {
    id: 'databases',
    label: 'Базы данных',
    keywords: ['sql', 'join', 'select', 'insert', 'subd', 'рсубд', 'postgres', 'mysql', 'sqlite', 'redis', 'носql', 'nosql', 'таблиц'],
  },
  {
    id: 'integrations',
    label: 'Интеграции и API',
    keywords: ['интеграц', 'api', 'веб-серв', 'webhook', 'kafka', 'rabbitmq', 'message', 'sso', 'oauth', 'oauth2', 'запрос-ответ'],
  },
  {
    id: 'architecture',
    label: 'Архитектура',
    keywords: ['архитектура', 'паттерн', 'mvc', 'ddd', 'c4', 'проектирован', 'design pattern', 'жизненн', 'модель', 'требован'],
  },
  {
    id: 'systemsAnalysis',
    label: 'Системный анализ',
    keywords: ['системный анализ', 'анализ', 'модель', 'требования', 'контекст', 'bpmn', 'сценарий', 'карта', 'метрики'],
  },
  {
    id: 'businessAnalysis',
    label: 'Бизнес-анализ',
    keywords: ['бизнес', 'экономик', 'финтех', 'рынок', 'kpi', 'воронк', 'эконом', 'стратег', 'цел'],
  },
  {
    id: 'mobileDev',
    label: 'Мобильная разработка',
    keywords: ['мобильн', 'kotlin', 'swift', 'ios', 'android', 'flutter', 'react native'],
  },
  {
    id: 'dataAnalytics',
    label: 'Аналитика данных',
    keywords: ['анализ данных', 'pandas', 'csv', 'datа', 'data warehouse', 'метрики', 'visualiz', 'matplotlib', 'big data'],
  },
  {
    id: 'ai',
    label: 'AI / Машинное обучение',
    keywords: ['искусственный интеллект', 'и и', 'ИИ', 'машинн', 'нейрос', 'ml', 'модель', 'сети', 'transformer'],
  },
  {
    id: 'testing',
    label: 'Тестирование',
    keywords: ['тестирование', 'qa', 'tdd', 'unit', 'pytest', 'jest', 'coverage', 'mock'],
  },
  {
    id: 'infoSec',
    label: 'Информационная безопасность',
    keywords: ['информационной безопасности', 'ИБ', 'аутентификация', 'авторизац', 'шифрован', 'owasp', 'cert', 'ssl', 'tls', 'вирус', 'уязвим'],
  },
  {
    id: 'cyberSec',
    label: 'Кибербезопасность',
    keywords: ['кибербезопас', 'пентест', 'взлом', 'ransomware', 'ddos', 'xss', 'sql-инъекц', 'mitm', 'ddos'],
  },
  {
    id: 'devops',
    label: 'DevOps и CI/CD',
    keywords: ['devops', 'ci', 'cd', 'terraform', 'kubernetes', 'docker', 'оркестрац', 'github actions', 'jenkins', 'ansible'],
  },
  {
    id: 'sysAdmin',
    label: 'Системное администрирование',
    keywords: ['администрирован', 'системное администрирование', 'nginx', 'apache', 'windows', 'linux', 'сервер', 'резервное копирован'],
  },
  {
    id: 'communication',
    label: 'Коммуникация и техписьмо',
    keywords: ['коммуникац', 'общение', 'техническое письмо', 'документац', 'readme', 'письмо', 'согласован', 'команд'],
  },
  {
    id: 'gameDev',
    label: 'Разработка игр',
    keywords: ['разработка игр', 'игровая индустрия', 'unity', 'godot', 'game dev', 'game', 'игр'],
  },
];

const SPHERE_DEFS = SPHERES.map((s) => ({
  ...s,
  normalizedKeywords: s.keywords.map((k) => normalizeText(k)),
}));

function normalizeText(text) {
  return (text ?? '').toLocaleLowerCase('ru').replace(/\s+/g, ' ').trim();
}

function hasKeyword(haystack, keywords) {
  // Ожидаем, что keywords уже в lower-case.
  for (const kw of keywords) {
    if (!kw) continue;
    if (haystack.includes(kw)) return true;
  }
  return false;
}

function sphereHitsForDoc(doc) {
  const hay = normalizeText([doc.t, doc.d, doc.s, doc.a, doc.h, doc.u].filter(Boolean).join(' '));
  /** @type {Record<string, number>} */
  const hits = {};
  for (const s of SPHERE_DEFS) {
    const hit = hasKeyword(hay, s.normalizedKeywords);
    if (hit) hits[s.id] = 1;
  }
  return hits;
}

function StarRating({value, onChange}) {
  const [hovered, setHovered] = useState(0);
  const activeValue = hovered || value;
  return (
    <div className={styles.starRating} style={{display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap'}}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= activeValue;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(0)}
            title={`Оценка ${n}`}
            className={styles.starButton}
            style={{
              border: '1px solid var(--ifm-color-emphasis-300)',
              borderRadius: 8,
              minWidth: 40,
              height: 34,
              padding: 0,
              background: filled ? '#ffd166' : 'transparent',
              cursor: 'pointer',
              lineHeight: '32px',
              fontWeight: 600,
              fontSize: '1rem',
              touchAction: 'manipulation',
            }}
            aria-label={`Оценка ${n}`}
            aria-pressed={filled}
          >
            <span className={styles.starGlyph}>{filled ? '★' : '☆'}</span>
          </button>
        );
      })}
    </div>
  );
}

function ProgressBar({percent}) {
  return (
    <div
      style={{
        height: 10,
        borderRadius: 999,
        background: 'rgba(123, 104, 238, 0.12)',
        border: '1px solid rgba(123, 104, 238, 0.2)',
        overflow: 'hidden',
      }}
      aria-hidden
    >
      <div
        style={{
          height: '100%',
          width: `${Math.max(0, Math.min(100, percent))}%`,
          background: 'linear-gradient(90deg, rgba(123,104,238,0.35), rgba(123,104,238,0.95))',
          borderRadius: 999,
        }}
      />
    </div>
  );
}

function RadarChart({values, labels}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const steps = values.length;
  const axes = Array.from({length: steps}, (_, i) => {
    const angle = (-Math.PI / 2) + (2 * Math.PI * i) / steps;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return {x, y, angle};
  });

  const points = values
    .map((v, i) => {
      const angle = axes[i].angle;
      const rr = r * Math.max(0, Math.min(1, v));
      const x = cx + rr * Math.cos(angle);
      const y = cy + rr * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Карта профиля"
        style={{fontFamily: 'var(--ifm-font-family-base)'}}
      >
        <polygon points={axes.map((a) => `${a.x},${a.y}`).join(' ')} fill="rgba(123,104,238,0.06)" stroke="rgba(123,104,238,0.25)" />
        <polygon points={points} fill="rgba(123,104,238,0.25)" stroke="rgba(123,104,238,0.9)" strokeWidth="2" />
        {axes.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={a.x}
            y2={a.y}
            stroke="rgba(123,104,238,0.25)"
          />
        ))}
        {axes.map((a, i) => (
          <text
            key={i}
            x={cx + (r + 18) * Math.cos(a.angle)}
            y={cy + (r + 18) * Math.sin(a.angle)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="currentColor"
            style={{fill: 'var(--ifm-color-content-secondary)'}}
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Recommendation({topSpheres}) {
  const ids = new Set(topSpheres.map((s) => s.id));
  if (ids.has('ai')) {
    return 'Вектор: AI. Дальше пройдите блоки по ИИ, затем закрепите небольшой проект и тестирование качества данных/модели.';
  }
  if (ids.has('cyberSec') || ids.has('infoSec')) {
    return 'Вектор: безопасность. Идите в ИБ/кибербез, затем попробуйте этичное тестирование и защищенную разработку.';
  }
  if (ids.has('devops') || ids.has('sysAdmin')) {
    return 'Вектор: инфраструктура. Начните с системного администрирования/DevOps, затем CI/CD и контейнеризация.';
  }
  if (ids.has('web') || ids.has('frontend') || ids.has('backend')) {
    return 'Вектор: веб. HTML/CSS → JavaScript → API/сервер → проект с UI и интеграциями.';
  }
  if (ids.has('databases') || ids.has('dataAnalytics') || ids.has('systemsAnalysis')) {
    return 'Вектор: данные и анализ. SQL + работа с данными → аналитические задачи → тестирование корректности.';
  }
  if (ids.has('programming') || ids.has('architecture')) {
    return 'Вектор: инженерная разработка. Углубляйтесь в код и архитектуру, делайте пет-проекты и развивайте техническое письмо.';
  }
  if (ids.has('communication') || ids.has('testing')) {
    return 'Вектор: системность и качество. Дальше — тестирование, техписьмо и работа с требованиями/аналитикой.';
  }
  return 'Профиль пока не яркий: попробуйте пройти несколько разных веток (AI, тестирование, веб) и повторите оценку.';
}

function InterestNavigatorGameV2Inner() {
  const [index, setIndex] = useState(null);
  const [mode, setMode] = useState('order'); // 'order' | 'choose'
  const [sectionFilter, setSectionFilter] = useState('all');
  const [navTab, setNavTab] = useState('flow'); // 'flow' | 'sections'
  const [search, setSearch] = useState('');
  const [currentU, setCurrentU] = useState('');
  const [ratings, setRatings] = useState({});
  const [chooseLimit, setChooseLimit] = useState(80);

  const clearProgress = () => {
    const ok = window.confirm('Очистить весь прогресс навигатора? Все оценки будут удалены.');
    if (!ok) return;
    setRatings({});
    setSearch('');
    setSectionFilter('all');
    setMode('order');
    setChooseLimit(80);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    const first = corpus[0];
    if (first) setCurrentU(first.u);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRatings(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadDocSearchIndex('');
      if (cancelled) return;
      setIndex(data);
    })().catch((e) => {
      console.error(e);
      if (!cancelled) setIndex({v: 0, docs: []});
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const corpus = useMemo(() => {
    if (!index) return [];
    /** @type {typeof index.docs} */
    const docs = index.docs.filter((doc) => {
      if (!doc?.u?.startsWith('/encyclopedia/')) return false;
      if (doc.u.includes('/_category_')) return false;
      // Фильтр "для новичков": в frontmatter часто есть tag 'beginner'/'required'.
      const tagStr = doc.a ?? '';
      const forBeginner = /\bbeginner\b/i.test(tagStr) || /\brequired\b/i.test(tagStr);
      return forBeginner;
    });

    // Упорядочим по URL (обычно содержит префиксы 1-01, 2-03 и т.п.)
    docs.sort((a, b) => a.u.localeCompare(b.u, 'ru'));
    return docs;
  }, [index]);

  const ratedCount = useMemo(() => {
    return corpus.reduce((acc, doc) => {
      const v = ratings[doc.u];
      if (typeof v === 'number') return acc + 1;
      return acc;
    }, 0);
  }, [corpus, ratings]);

  const unratedCount = useMemo(() => corpus.length - ratedCount, [corpus.length, ratedCount]);

  const docHits = useMemo(() => {
    const map = new Map();
    for (const doc of corpus) {
      map.set(doc.u, sphereHitsForDoc(doc));
    }
    return map;
  }, [corpus]);

  const sphereScores = useMemo(() => {
    /** @type {Record<string, number>} */
    const totals = Object.fromEntries(SPHERES.map((s) => [s.id, 0]));
    for (const doc of corpus) {
      const rating = ratings[doc.u];
      if (typeof rating !== 'number') continue;
      if (rating <= 0) continue; // skip
      const hits = docHits.get(doc.u) ?? {};
      for (const [sphereId, hit] of Object.entries(hits)) {
        totals[sphereId] += rating * (hit ?? 0);
      }
    }
    return totals;
  }, [corpus, ratings, docHits]);

  const sphereMax = useMemo(() => {
    const totals = Object.fromEntries(SPHERES.map((s) => [s.id, 0]));
    for (const doc of corpus) {
      const hits = docHits.get(doc.u) ?? {};
      for (const [sphereId, hit] of Object.entries(hits)) {
        totals[sphereId] += 5 * (hit ?? 0);
      }
    }
    return totals;
  }, [corpus, docHits]);

  const topSpheres = useMemo(() => {
    const rows = SPHERES.map((s) => ({
      id: s.id,
      label: s.label,
      score: sphereScores[s.id] ?? 0,
      max: sphereMax[s.id] ?? 0,
    }));
    rows.sort((a, b) => (b.score - a.score) || a.label.localeCompare(b.label, 'ru'));
    return rows;
  }, [sphereScores, sphereMax]);

  const progressRows = useMemo(() => {
    return topSpheres
      .map((r) => ({
        ...r,
        percent: r.max > 0 ? (r.score / r.max) * 100 : 0,
      }))
      .filter((r) => r.max > 0)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 8);
  }, [topSpheres]);

  const radar = useMemo(() => {
    const rows = topSpheres
      .map((r) => ({
        ...r,
        percent: r.max > 0 ? r.score / r.max : 0,
      }))
      .filter((r) => r.max > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    return {
      labels: rows.map((r) => r.label.split(' ').slice(0, 2).join(' ')),
      values: rows.map((r) => Math.max(0, Math.min(1, r.percent))),
    };
  }, [topSpheres]);

  const filteredCorpus = useMemo(() => {
    const bySection = sectionFilter === 'all'
      ? corpus
      : corpus.filter((doc) => (doc.s || 'Без раздела') === sectionFilter);

    const q = normalizeText(search);
    if (!q) return bySection;
    return bySection.filter((doc) => normalizeText(doc.t).includes(q) || normalizeText(doc.d).includes(q));
  }, [corpus, sectionFilter, search]);

  const chapterNames = useMemo(
    () => ({
      '1-basics': '1. Основы',
      '2-system-network': '2. Система и сеть',
      '3-data-markup': '3. Данные и разметка',
      '4-code-dev': '4. Код и разработка',
      '5-languages': '5. Языки',
      '6-ai': '6. ИИ',
      '7-project': '7. Проект',
      '8-infra-security': '8. Инфраструктура и безопасность',
      '9-spinoff': '9. Спин-офф',
    }),
    [],
  );

  const sectionTree = useMemo(() => {
    /** @type {Record<string, {id: string, label: string, count: number, sections: {name: string, count: number}[]}>} */
    const bucket = {};

    for (const doc of corpus) {
      const match = /^\/encyclopedia\/([^/]+)\//.exec(doc.u);
      const chapterId = match?.[1] ?? 'other';
      const chapterLabel = chapterNames[chapterId] ?? chapterId;
      if (!bucket[chapterId]) {
        bucket[chapterId] = {
          id: chapterId,
          label: chapterLabel,
          count: 0,
          sections: [],
        };
      }
      bucket[chapterId].count += 1;
      const sectionName = doc.s || 'Без раздела';
      const existing = bucket[chapterId].sections.find((s) => s.name === sectionName);
      if (existing) existing.count += 1;
      else bucket[chapterId].sections.push({name: sectionName, count: 1});
    }

    return Object.values(bucket)
      .map((chapter) => ({
        ...chapter,
        sections: chapter.sections.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru')),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'ru'));
  }, [chapterNames, corpus]);

  useEffect(() => {
    if (!corpus.length) return;
    if (currentU) return;
    // Инициализируем текущую карточку: первое место, где рейтинг не задан.
    const next = corpus.find((d) => typeof ratings[d.u] !== 'number');
    setCurrentU(next?.u ?? corpus[0].u);
  }, [corpus, ratings, currentU]);

  const currentDoc = useMemo(() => corpus.find((d) => d.u === currentU) ?? null, [corpus, currentU]);

  const goToNextUnrated = () => {
    const pool = filteredCorpus.length ? filteredCorpus : corpus;
    const i = pool.findIndex((d) => d.u === currentU);
    const start = i >= 0 ? i + 1 : 0;
    const next = pool.slice(start).find((d) => typeof ratings[d.u] !== 'number')
      ?? pool.find((d) => typeof ratings[d.u] !== 'number')
      ?? pool[0];
    if (next) setCurrentU(next.u);
  };

  const setRatingForDoc = (u, value) => {
    setRatings((prev) => ({...prev, [u]: value}));
  };

  const currentHits = useMemo(() => {
    if (!currentDoc) return {};
    return docHits.get(currentDoc.u) ?? {};
  }, [currentDoc, docHits]);

  const visibleList = useMemo(() => {
    if (mode === 'order') return [];
    return filteredCorpus.slice(0, chooseLimit);
  }, [mode, filteredCorpus, search]);

  if (!index) {
    return (
      <DemoShell>
        <DemoCard title="Навигатор новичка v2" subtitle="Готовим список статей и индексы…">
          <div style={{padding: '1rem 0', color: 'var(--ifm-color-content-secondary)'}}>Загрузка данных…</div>
        </DemoCard>
      </DemoShell>
    );
  }

  const isDone = unratedCount === 0;
  const nextUnrated = corpus.find((d) => typeof ratings[d.u] !== 'number');

  return (
    <DemoShell>
      <DemoCard
        title="Навигатор новичка v2"
        subtitle="Оцените интерес к статьям (1–5), игра посчитает профиль в реальном времени."
      >
        <div
          className={styles.root}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
            fontFamily: 'var(--ifm-font-family-base)',
          }}
        >
          <div className={styles.panel} style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 14, padding: '0.85rem'}}>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem'}}>
              <button
                type="button"
                onClick={() => setNavTab('flow')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 999,
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  background: navTab === 'flow' ? 'rgba(123,104,238,0.12)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Поток
              </button>
              <button
                type="button"
                onClick={() => setNavTab('sections')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 999,
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  background: navTab === 'sections' ? 'rgba(123,104,238,0.12)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Разделы (дерево)
              </button>
            </div>

            {navTab === 'flow' && (
              <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{color: 'var(--ifm-color-content-secondary)', fontWeight: 700}}>
                  Текущий фильтр: <span style={{color: 'var(--ifm-color-content)'}}>{sectionFilter === 'all' ? 'Все' : sectionFilter}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSectionFilter('all');
                    const next = corpus.find((d) => typeof ratings[d.u] !== 'number') ?? corpus[0];
                    if (next) setCurrentU(next.u);
                  }}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 999,
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Сбросить фильтр
                </button>
              </div>
            )}

            {navTab === 'sections' && (
              <div style={{display: 'grid', gap: '0.45rem'}}>
                <button
                  type="button"
                  onClick={() => {
                    setSectionFilter('all');
                    const next = corpus.find((d) => typeof ratings[d.u] !== 'number') ?? corpus[0];
                    if (next) setCurrentU(next.u);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 8,
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    background: sectionFilter === 'all' ? 'rgba(123,104,238,0.12)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Все разделы ({corpus.length})
                </button>
                {sectionTree.map((chapter) => (
                  <details key={chapter.id}>
                    <summary style={{cursor: 'pointer', fontWeight: 700}}>
                      {chapter.label} ({chapter.count})
                    </summary>
                    <div style={{marginTop: '0.35rem', marginLeft: '0.5rem', display: 'grid', gap: '0.3rem'}}>
                      {chapter.sections.map((section) => (
                        <button
                          key={`${chapter.id}:${section.name}`}
                          type="button"
                          onClick={() => {
                            setSectionFilter(section.name);
                            const inSection = corpus.filter((d) => (d.s || 'Без раздела') === section.name);
                            const next = inSection.find((d) => typeof ratings[d.u] !== 'number') ?? inSection[0];
                            if (next) setCurrentU(next.u);
                          }}
                          style={{
                            textAlign: 'left',
                            padding: '0.3rem 0.55rem',
                            borderRadius: 8,
                            border: '1px solid var(--ifm-color-emphasis-300)',
                            background: sectionFilter === section.name ? 'rgba(123,104,238,0.12)' : 'transparent',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                          }}
                          title={section.name}
                        >
                          {section.name} ({section.count})
                        </button>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>

          <div className={styles.toolbar} style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <button
              type="button"
              onClick={() => setMode('order')}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 8,
                border: '1px solid var(--ifm-color-emphasis-300)',
                background: mode === 'order' ? 'rgba(123,104,238,0.12)' : 'transparent',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Порядок (по одной статье)
            </button>
            <button
              type="button"
              onClick={() => setMode('choose')}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 8,
                border: '1px solid var(--ifm-color-emphasis-300)',
                background: mode === 'choose' ? 'rgba(123,104,238,0.12)' : 'transparent',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Выбор (список)
            </button>

            <div style={{marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center'}}>
              <div style={{color: 'var(--ifm-color-content-secondary)', fontWeight: 700}}>
                Пройдено: <span style={{color: 'var(--ifm-color-content)'}}>{ratedCount}</span> / {corpus.length}
              </div>
              <div style={{color: isDone ? '#16a34a' : 'var(--ifm-color-content-secondary)', fontWeight: 600}}>
                Осталось: {unratedCount}
              </div>
              <button
                type="button"
                onClick={clearProgress}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid rgba(220, 38, 38, 0.35)',
                  background: 'rgba(220, 38, 38, 0.08)',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Очистить прогресс
              </button>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
            <div className={styles.panel} style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 14, padding: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'}}>
                <div>
                  <div style={{fontWeight: 700, color: 'var(--ifm-color-content)', marginBottom: '0.25rem'}}>
                    Сейчас: {currentDoc ? currentDoc.t : '—'}
                  </div>
                  {currentDoc && (
                    <div style={{color: 'var(--ifm-color-content-secondary)', fontSize: '0.9rem', marginBottom: '0.6rem'}}>
                      Раздел: <b>{currentDoc.s || '—'}</b>
                    </div>
                  )}
                </div>
                {currentDoc && (
                  <a
                    href={currentDoc.u}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.openArticleLink}
                    style={{
                      padding: '0.55rem 0.9rem',
                      borderRadius: 10,
                      border: '1px solid rgba(123,104,238,0.35)',
                      background: 'rgba(123,104,238,0.08)',
                      fontWeight: 600,
                      color: 'var(--ifm-link-color)',
                      textDecoration: 'none',
                    }}
                  >
                    Открыть статью
                  </a>
                )}
              </div>

              {currentDoc && (
                <div style={{color: 'var(--ifm-color-content-secondary)', marginBottom: '0.75rem', lineHeight: 1.5}}>
                  {currentDoc.d}
                </div>
              )}

              {currentDoc && (
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 700, marginBottom: '0.35rem'}}>Оценка интереса</div>
                    <StarRating
                      value={typeof ratings[currentDoc.u] === 'number' ? ratings[currentDoc.u] : 0}
                      onChange={(v) => {
                        setRatingForDoc(currentDoc.u, v);
                        if (mode === 'order') goToNextUnrated();
                      }}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                    <button
                      type="button"
                      onClick={() => {
                        setRatingForDoc(currentDoc.u, 0);
                        if (mode === 'order') goToNextUnrated();
                      }}
                      style={{
                        padding: '0.55rem 0.9rem',
                        borderRadius: 10,
                        border: '1px solid rgba(123,104,238,0.35)',
                        background: 'transparent',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Пропустить
                    </button>
                    {mode === 'order' && (
                      <button
                        type="button"
                        disabled={!nextUnrated || isDone}
                        onClick={() => goToNextUnrated()}
                        style={{
                          padding: '0.55rem 0.9rem',
                          borderRadius: 10,
                          border: '1px solid rgba(123,104,238,0.35)',
                          background: 'rgba(123,104,238,0.08)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          opacity: isDone ? 0.5 : 1,
                        }}
                      >
                        Следующая
                      </button>
                    )}
                  </div>
                </div>
              )}

              {currentDoc && (
                <div style={{marginTop: '0.9rem'}}>
                  <div className="it-demo__label">Сферы, куда этот материал сигналит</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                    {Object.keys(currentHits).length ? (
                      Object.entries(currentHits).map(([sphereId]) => {
                        const s = SPHERES.find((x) => x.id === sphereId);
                        if (!s) return null;
                        return (
                          <span
                            key={sphereId}
                            className={styles.signalChip}
                            style={{
                              padding: '0.25rem 0.6rem',
                              border: '1px solid rgba(123,104,238,0.25)',
                              borderRadius: 999,
                              background: 'rgba(123,104,238,0.06)',
                              fontWeight: 600,
                              color: 'var(--ifm-color-content)',
                            }}
                          >
                            {s.label}
                          </span>
                        );
                      })
                    ) : (
                      <span style={{color: 'var(--ifm-color-content-secondary)'}}>Нет совпадений по ключевым словам</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.panel} style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 14, padding: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                <div>
                  <div style={{fontWeight: 700, marginBottom: '0.25rem'}}>Прогресс по сферам</div>
                  <div style={{color: 'var(--ifm-color-content-secondary)', lineHeight: 1.5}}>
                    Показатели обновляются при каждой оценке. Доля = (набрано очков) / (теоретический максимум).
                  </div>
                </div>
              </div>
              <div style={{marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem'}}>
                {progressRows.map((r) => (
                  <div key={r.id}>
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
                      <div style={{fontWeight: 700}}>{r.label}</div>
                      <div style={{color: 'var(--ifm-color-content-secondary)', fontWeight: 700}}>
                        {r.score} / {r.max}
                        {'  '}
                        ({Math.round(r.percent)}%)
                      </div>
                    </div>
                    <ProgressBar percent={r.percent} />
                  </div>
                ))}
              </div>

              <div style={{marginTop: '1rem'}}>
                <div className="it-demo__label">Карта профиля</div>
                {radar.values.length ? (
                  <div style={{marginTop: '0.75rem'}}>
                    <RadarChart values={radar.values} labels={radar.labels} />
                  </div>
                ) : (
                  <div style={{color: 'var(--ifm-color-content-secondary)', marginTop: '0.75rem'}}>Пока нечего рисовать: поставьте хотя бы одну оценку.</div>
                )}
              </div>

              <div style={{marginTop: '1rem'}}>
                <div className="it-demo__label">Рекомендация следующего шага</div>
                <div style={{marginTop: '0.5rem', color: 'var(--ifm-color-content)', fontWeight: 600, lineHeight: 1.5}}>
                  <Recommendation topSpheres={topSpheres.slice(0, 5)} />
                </div>
              </div>
            </div>
          </div>

          {mode === 'choose' && (
            <div className={styles.panel} style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 14, padding: '1rem'}}>
              <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap'}}>
                <div style={{fontWeight: 700}}>Выбор статей</div>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setChooseLimit(80);
                  }}
                  placeholder="Поиск по заголовку/описанию…"
                  style={{
                    flex: '1 1 260px',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 10,
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{marginTop: '1rem', color: 'var(--ifm-color-content-secondary)'}}>
                Показано: <b>{Math.min(filteredCorpus.length, chooseLimit)}</b> / {filteredCorpus.length}
                <div style={{fontSize: '0.85rem', lineHeight: 1.4}}>
                  Вы можете листать и выбирать статьи. Если их много — нажмите “Показать ещё”.
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  maxHeight: 420,
                  overflow: 'auto',
                  paddingRight: '0.35rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {visibleList.map((doc) => {
                  const value = ratings[doc.u];
                  const valueNum = typeof value === 'number' ? value : undefined;
                  const active = doc.u === currentU;
                  return (
                    <div
                      className={clsx(styles.choiceCard, active && styles.choiceCardActive)}
                      key={doc.u}
                      style={{
                        border: `1px solid ${active ? 'rgba(123,104,238,0.65)' : 'var(--ifm-color-emphasis-300)'}`,
                        borderRadius: 12,
                        padding: '0.75rem',
                        background: active ? 'rgba(123,104,238,0.06)' : 'transparent',
                      }}
                    >
                      <div style={{fontWeight: 700, color: 'var(--ifm-color-content)', lineHeight: 1.3}}>
                        <button
                          type="button"
                          onClick={() => setCurrentU(doc.u)}
                          style={{background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700, color: 'inherit', textAlign: 'left'}}
                          title="Открыть карточку"
                        >
                          {doc.t}
                        </button>
                      </div>

                      <div style={{marginTop: '0.35rem', color: 'var(--ifm-color-content-secondary)', fontSize: '0.85rem'}}>
                        Раздел: {doc.s || '—'}
                      </div>

                      <div style={{marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center'}}>
                        <a
                          href={doc.u}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: 'none',
                            fontWeight: 700,
                            color: 'var(--ifm-link-color)',
                            fontSize: '0.9rem',
                          }}
                        >
                          Ссылка
                        </a>
                        {typeof valueNum === 'number' ? (
                          <span style={{fontWeight: 700, color: valueNum > 0 ? '#16a34a' : 'var(--ifm-color-content-secondary)'}}>
                            {valueNum > 0 ? `Оценка: ${valueNum}` : 'Пропущено'}
                          </span>
                        ) : (
                          <span style={{fontWeight: 700, color: 'var(--ifm-color-content-secondary)'}}>Без оценки</span>
                        )}
                      </div>

                      <div style={{marginTop: '0.6rem'}}>
                        <StarRating
                          value={typeof valueNum === 'number' ? valueNum : 0}
                          onChange={(v) => {
                            setRatingForDoc(doc.u, v);
                            setCurrentU(doc.u);
                          }}
                        />
                        <div style={{marginTop: '0.4rem'}}>
                          <button
                            type="button"
                            onClick={() => setRatingForDoc(doc.u, 0)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: 10,
                              border: '1px solid rgba(123,104,238,0.25)',
                              background: 'transparent',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                          >
                            Пропустить
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{marginTop: '0.75rem', color: 'var(--ifm-color-content-secondary)', lineHeight: 1.5}}>
                Совет: поставьте 5–10 оценок, затем смотрите “Карту профиля”. После этого можно идти в конкретные разделы и завершить игру “до конца”.
              </div>

              {filteredCorpus.length > chooseLimit && (
                <div style={{marginTop: '0.9rem'}}>
                  <button
                    type="button"
                    onClick={() => setChooseLimit((v) => Math.min(filteredCorpus.length, v + 80))}
                    style={{
                      padding: '0.6rem 0.95rem',
                      borderRadius: 10,
                      border: '1px solid rgba(123,104,238,0.35)',
                      background: 'rgba(123,104,238,0.08)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Показать ещё
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default InterestNavigatorGameV2Inner;
