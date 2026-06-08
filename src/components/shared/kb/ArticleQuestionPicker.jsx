import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import BrowserOnly from '@/components/shared/BrowserOnly';
import DemoShell, {DemoCard} from './DemoShell';
import {demoLoadingFallback, demoSkeletonFallback} from './demoFallback';
import useCopyToClipboard from './useCopyToClipboard';
import useBreakpoint from './useBreakpoint';
import {
  extractArticleQuestions,
  extractChecklistQuestions,
  getArticleElement,
  pickRandom,
  pickRandomDifferent,
} from './articleExtract';
import styles from './articleWidgets.module.css';

const EXTRACTORS = {
  checklist: extractChecklistQuestions,
  article: extractArticleQuestions,
};

function ArticleQuestionPickerInner({
  mode,
  title,
  subtitle,
  emptyMessage,
  errorHint,
  showCounter = true,
}) {
  const {isMobile} = useBreakpoint();
  const {copy, isCopied} = useCopyToClipboard();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('loading');
  const [fading, setFading] = useState(false);

  const load = useCallback(() => {
    const article = getArticleElement();
    const extract = EXTRACTORS[mode];
    const found = extract(article);

    if (!found.length) {
      setQuestions([]);
      setCurrent(emptyMessage);
      setStatus('empty');
      return;
    }

    const initial = pickRandom(found);
    setQuestions(found);
    setCurrent(initial);
    setCurrentIndex(found.indexOf(initial));
    setStatus('ready');
  }, [mode, emptyMessage]);

  useEffect(() => {
    const timer = window.setTimeout(load, 300);
    return () => window.clearTimeout(timer);
  }, [load]);

  const regenerate = useCallback(() => {
    if (questions.length === 0) {
      return;
    }
    setFading(true);
    window.setTimeout(() => {
      const next = pickRandomDifferent(questions, current);
      setCurrent(next);
      setCurrentIndex(questions.indexOf(next));
      setFading(false);
    }, 180);
  }, [questions, current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') {
          return;
        }
        regenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [regenerate]);

  if (status === 'loading') {
    return demoSkeletonFallback();
  }

  if (status === 'empty' && mode === 'checklist') {
    return (
      <DemoShell>
        <DemoCard title={title} subtitle={subtitle}>
          <div className="it-demo__alert it-demo__alert--info">{current}</div>
        </DemoCard>
      </DemoShell>
    );
  }

  if (status === 'empty' && mode === 'article') {
    return (
      <DemoShell>
        <DemoCard title="Не удалось загрузить вопросы">
          <div className="it-demo__alert it-demo__alert--error">{current}</div>
          {errorHint && (
            <details style={{marginTop: '0.75rem', fontSize: '0.85rem'}}>
              <summary style={{cursor: 'pointer', color: 'var(--demo-muted)'}}>
                Как устроена разметка
              </summary>
              <p className="it-demo__subtitle" style={{marginTop: '0.5rem'}}>
                {errorHint}
              </p>
            </details>
          )}
        </DemoCard>
      </DemoShell>
    );
  }

  const canRegenerate = questions.length > 1;

  return (
    <DemoShell>
      <DemoCard title={title} subtitle={isMobile ? undefined : subtitle}>
        {showCounter && questions.length > 0 && (
          <span className={styles.poolBadge} aria-live="polite">
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
        )}

        <div
          className={clsx(styles.questionDisplay, fading && styles.questionDisplayFading)}
          aria-live="polite"
        >
          {current}
        </div>

        {canRegenerate && (
          <div className={styles.actions}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={regenerate}
              aria-label="Другой вопрос"
            >
              Другой вопрос
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(current, 'q')}
            >
              {isCopied('q') ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
        )}

        <p className={styles.footnote}>
          {isMobile
            ? `* ${questions.length} вопросов из статьи`
            : `* Случайный выбор из ${questions.length} вопросов на странице · клавиша R — ещё вопрос`}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default function ArticleQuestionPicker(props) {
  return (
    <BrowserOnly fallback={demoLoadingFallback('Загрузка вопросов…')}>
      {() => <ArticleQuestionPickerInner {...props} />}
    </BrowserOnly>
  );
}
