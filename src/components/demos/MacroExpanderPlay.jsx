import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpChip,
  LpChipRow,
  LpCode,
  LpLog,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const MACROS = {
  unless: {
    source: `(defmacro unless [test body]
  (list 'if test nil body))`,
    call: `(unless (= x 0) (/ 1 x))`,
    expanded: `(if (= x 0) nil (/ 1 x))`,
    note: 'unless — sugar для (if test nil else)',
  },
  when: {
    source: `(defmacro when [test & body]
  (cons 'if (cons test body)))`,
    call: `(when (> n 0) (println n))`,
    expanded: `(if (> n 0) (println n))`,
    note: 'when — одна ветка без else',
  },
};

function MacroExpanderPlayInner() {
  const [macroId, setMacroId] = useState('unless');
  const [expanded, setExpanded] = useState(false);
  const m = MACROS[macroId];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Macro expander"
        subtitle="Clojure / Lisp — макрос подставляет форму до eval"
      >
        <LpStack>
          <LpChipRow>
            {Object.keys(MACROS).map((id) => (
              <LpChip
                key={id}
                active={macroId === id}
                onClick={() => {
                  setMacroId(id);
                  setExpanded(false);
                }}
              >
                {id}
              </LpChip>
            ))}
          </LpChipRow>

          <div className={styles.macroSplit}>
            <LpSection label="Исходник">
              <LpCode>{m.source}</LpCode>
              <LpCode>{m.call}</LpCode>
            </LpSection>
            <div className={styles.macroArrow} aria-hidden="true">
              ⇒
            </div>
            <LpSection label="macroexpand-1">
              <LpCode className={!expanded ? styles.codePlaceholder : undefined}>
                {expanded ? m.expanded : '… нажмите Expand'}
              </LpCode>
            </LpSection>
          </div>

          <LpActionBar>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
              onClick={() => setExpanded(true)}
            >
              macroexpand-1
            </button>
            {expanded && (
              <button
                type="button"
                className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                onClick={() => setExpanded(false)}
              >
                Свернуть
              </button>
            )}
          </LpActionBar>

          <LpLog variant={expanded ? 'success' : 'info'}>{m.note}</LpLog>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default MacroExpanderPlayInner;
