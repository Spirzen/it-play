import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';

import {
  DataStructureLayout,
  LangTabs,
} from '@/components/shared/kb/dataStructureDemo';
import {
  INITIAL_ITEMS,
  COLLECTION_LANG_TABS,
  resolveCollectionLang,
  getMethodDefinitions,
  applyCollectionMethod,
  canApplyMethod,
} from '@/components/shared/kb/collectionMethodsEngine';
import styles from '@/components/demos/CollectionMethodsPlay.module.css';

function ListView({items, highlightIndex = -1, emptyLabel = 'пусто'}) {
  if (!items.length) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  return (
    <div className={styles.cells} role="list" aria-label="Коллекция">
      {items.map((item, idx) => (
        <div
          key={`${idx}-${item}`}
          role="listitem"
          className={clsx(styles.cell, idx === highlightIndex && styles.cellHighlight)}
        >
          <span className={styles.cellIndex}>{idx}</span>
          <span className={styles.cellEmoji} aria-hidden>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

function ResultView({result, resultType}) {
  if (result === null || result === undefined) return null;

  if (resultType === 'boolean') {
    return (
      <div className={clsx(styles.resultBox, styles.resultBool)} aria-live="polite">
        {String(result)}
      </div>
    );
  }

  if (resultType === 'list') {
    return (
      <div className={styles.listWrap}>
        <span className={styles.bracket} aria-hidden>
          [
        </span>
        <ListView items={result} emptyLabel="∅" />
        <span className={styles.bracket} aria-hidden>
          ]
        </span>
      </div>
    );
  }

  return (
    <div className={styles.resultBox} aria-live="polite">
      {result}
    </div>
  );
}

function CollectionMethodsLogic({defaultLang = 'general'}) {
  const [lang, setLang] = useState(() => resolveCollectionLang(defaultLang));
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [beforeItems, setBeforeItems] = useState(INITIAL_ITEMS);
  const [lastCall, setLastCall] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastResultType, setLastResultType] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const methods = useMemo(() => getMethodDefinitions(lang, items), [lang, items]);

  const reset = useCallback(() => {
    setItems(INITIAL_ITEMS);
    setBeforeItems(INITIAL_ITEMS);
    setLastCall(null);
    setLastResult(null);
    setLastResultType(null);
    setAnimKey((k) => k + 1);
  }, []);

  const runMethod = (method) => {
    const snapshot = [...items];
    const outcome = applyCollectionMethod(method.id, snapshot);
    setBeforeItems(snapshot);
    setLastCall(method.label);
    setLastResult(outcome.result);
    setLastResultType(outcome.resultType ?? null);
    setAnimKey((k) => k + 1);

    if (outcome.mutates) {
      setItems(outcome.items);
    }
  };

  const langLabel = COLLECTION_LANG_TABS.find((t) => t.id === lang)?.label ?? 'Общее';

  return (
    <div className={styles.body}>
      <div className={styles.hero}>
        <h3 className={styles.heroTitle}>Методы коллекции</h3>
        <p className={styles.heroSub}>
          Нажимайте операции и смотрите, как меняется список. Вкладка «{langLabel}» показывает
          синтаксис выбранного языка.
        </p>
      </div>

      <LangTabs active={lang} onChange={setLang} tabs={COLLECTION_LANG_TABS} />

      <div className={styles.stage} key={animKey}>
        {lastCall ? (
          <>
            <div className={styles.stageRow}>
              <span className={styles.stageLabel}>До</span>
              <div className={styles.listWrap}>
                <span className={styles.bracket} aria-hidden>
                  [
                </span>
                <ListView items={beforeItems} />
                <span className={styles.bracket} aria-hidden>
                  ]
                </span>
              </div>
            </div>
            <div className={styles.stageRow}>
              <span className={styles.stageLabel}>Вызов</span>
              <code className={styles.callBadge}>{lastCall}</code>
            </div>
            <div className={styles.stageRow} aria-hidden>
              <span className={styles.stageLabel} />
              <span className={styles.arrow}>→</span>
            </div>
            <div className={styles.stageRow}>
              <span className={styles.stageLabel}>После</span>
              {lastResultType === 'list' || lastResultType === 'boolean' || lastResultType === 'scalar' ? (
                <ResultView result={lastResult} resultType={lastResultType} />
              ) : (
                <div className={styles.listWrap}>
                  <span className={styles.bracket} aria-hidden>
                    [
                  </span>
                  <ListView items={items} />
                  <span className={styles.bracket} aria-hidden>
                    ]
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.stageRow}>
            <span className={styles.stageLabel}>Список</span>
            <div className={styles.listWrap}>
              <span className={styles.bracket} aria-hidden>
                [
              </span>
              <ListView items={items} />
              <span className={styles.bracket} aria-hidden>
                ]
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.methods}>
        <p className={styles.methodsTitle}>Операции ({langLabel})</p>
        <div className={styles.methodGrid}>
          {methods.map((method) => {
            const disabled = !canApplyMethod(method.id, items);
            return (
              <button
                key={method.id}
                type="button"
                className={clsx(
                  styles.methodBtn,
                  lastCall === method.label && styles.methodBtnActive,
                )}
                disabled={disabled}
                title={disabled ? 'Сейчас недоступно для текущего списка' : method.hint}
                onClick={() => runMethod(method)}
              >
                <span className={styles.methodLabel}>{method.label}</span>
                <span className={styles.methodHint}>{method.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.toolbar}>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          ↺ Сбросить [🍔, 🍟, 🥤]
        </button>
      </div>
    </div>
  );
}

export default function CollectionMethodsPlay({defaultLang = 'general'}) {
  return (
    <DataStructureLayout
      title="Методы коллекции"
      subtitle="Интерактивный обзор операций со списком — от псевдокода до синтаксиса языка"
    >
      <CollectionMethodsLogic defaultLang={defaultLang} />
    </DataStructureLayout>
  );
}
