import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './searchPlays.module.css';

const TASKS = [
  {
    id: 'daily',
    icon: '🌐',
    title: 'Повседневный поиск',
    desc: 'Широкий охват, персонализация, виджеты',
    engines: [
      {
        name: 'Google',
        color: '#4285f4',
        why: 'Глобальный индекс, SGE, Lens, экосистема сервисов.',
        traits: ['PageRank', 'персонализация', 'ИИ-ответы'],
      },
      {
        name: 'Яндекс',
        color: '#fc3f1d',
        why: 'Морфология русского, локальные госресурсы, Карты, Алиса.',
        traits: ['Рунет', 'гео', 'сервисы РФ'],
      },
      {
        name: 'Bing',
        color: '#00809d',
        why: 'Встроен в Windows/Edge, Copilot, визуальный поиск.',
        traits: ['Microsoft 365', 'GPT в поиске'],
      },
    ],
  },
  {
    id: 'privacy',
    icon: '🛡️',
    title: 'Приватность',
    desc: 'Минимум трекинга и профилей',
    engines: [
      {
        name: 'DuckDuckGo',
        color: '#de5833',
        why: 'Нет долгоживущих ID; выдача через Bing без пузыря фильтров.',
        traits: ['без истории', 'блокировка UTM'],
      },
      {
        name: 'StartPage',
        color: '#65778d',
        why: 'Прокси к Google: полнота индекса + постобработка анонимности.',
        traits: ['ISO 27001', 'анонимный просмотр'],
      },
      {
        name: 'Swisscows',
        color: '#b7094c',
        why: 'Швейцарская юрисдикция, нулевые логи, семантика + этический фильтр.',
        traits: ['FADP', 'семантика'],
      },
    ],
  },
  {
    id: 'dev',
    icon: '💻',
    title: 'Разработка',
    desc: 'Ошибки, документация, код',
    engines: [
      {
        name: 'Google + site:',
        color: '#4285f4',
        why: 'Точные фразы ошибок, site:stackoverflow.com, site:github.com/issues.',
        traits: ['операторы', 'англ. корпус'],
      },
      {
        name: 'Phind',
        color: '#10a37f',
        why: 'Индекс для dev: MDN, SO, RFC; ответ с цитатами кода.',
        traits: ['CodeBERT', 'версии стека'],
      },
      {
        name: 'GitHub Search',
        color: '#24292f',
        why: 'Поиск по репозиториям: language:, path:, extension:.',
        traits: ['код', 'issues'],
      },
    ],
  },
  {
    id: 'science',
    icon: '📚',
    title: 'Наука и факты',
    desc: 'Статьи, формулы, проверяемые данные',
    engines: [
      {
        name: 'Google Scholar',
        color: '#4285f4',
        why: 'Цитирования, авторы, препринты; cited by для новых работ.',
        traits: ['peer-review', 'патенты'],
      },
      {
        name: 'Semantic Scholar',
        color: '#1857b6',
        why: 'ИИ-аннотации методов и влиятельных цитат в CS/медицине.',
        traits: ['семантика', 'граф цитат'],
      },
      {
        name: 'Wolfram Alpha',
        color: '#d11a2a',
        why: 'Не ссылки, а вычисление: интегралы, константы, демография.',
        traits: ['CAS', 'детерминизм'],
      },
    ],
  },
  {
    id: 'media',
    icon: '🖼️',
    title: 'Медиа',
    desc: 'Изображения, звук, обратный поиск',
    engines: [
      {
        name: 'TinEye',
        color: '#0066cc',
        why: 'Обратный поиск по отпечатку изображения, дата первого появления.',
        traits: ['CBIR', 'авторство'],
      },
      {
        name: 'Google Lens',
        color: '#ea4335',
        why: 'Поиск по фото, тексту на снимке, похожим товарам.',
        traits: ['мультимодальность'],
      },
      {
        name: 'FindSounds',
        color: '#5c6bc0',
        why: 'Поиск звуковых эффектов по спектру, не по тегам.',
        traits: ['аудио', 'SFX'],
      },
    ],
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'Синтез с источниками',
    desc: 'Ответ + обязательные цитаты',
    engines: [
      {
        name: 'Perplexity',
        color: '#20b8cd',
        why: 'Подзапросы, ранжирование источников, явные ссылки на каждый факт.',
        traits: ['RAG', 'прозрачность'],
      },
      {
        name: 'Google SGE',
        color: '#4285f4',
        why: 'LLM поверх топ-документов индекса; только проиндексированные источники.',
        traits: ['гибрид', 'проверяемость'],
      },
      {
        name: 'Яндекс + Алиса',
        color: '#fc3f1d',
        why: 'Диалог, Знаток, локальные сервисы; сильна в бытовых и региональных задачах.',
        traits: ['многоходовый', 'Рунет'],
      },
    ],
  },
];

function SearchEnginesHubInner() {
  const [taskId, setTaskId] = useState('dev');
  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Какой поисковик под задачу?"
        subtitle="Три группы из статьи: массовые, приватные, специализированные — интерактивный подбор"
      >
        <div className={styles.taskGrid}>
          {TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.taskCard, taskId === t.id && styles.taskCardActive)}
              onClick={() => setTaskId(t.id)}
            >
              <span className={styles.taskIcon}>{t.icon}</span>
              <strong>{t.title}</strong>
              <span style={{fontSize: '0.72rem', color: 'var(--ifm-color-content-secondary)'}}>
                {t.desc}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.engineCards}>
          {task.engines.map((e) => (
            <div key={e.name} className={styles.engineCard}>
              <div className={styles.engineBadge} style={{background: e.color}}>
                {e.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong>{e.name}</strong>
                <p className={styles.hint} style={{margin: '0.25rem 0 0'}}>
                  {e.why}
                </p>
                <div className={styles.traits}>
                  {e.traits.map((tr) => (
                    <span key={tr} className={styles.trait}>
                      {tr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.hint}>
          Правило из раздела: комбинируйте источники (триангуляция) и не путайте высокий ранг в
          выдаче с фактической достоверностью.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default SearchEnginesHubInner;
