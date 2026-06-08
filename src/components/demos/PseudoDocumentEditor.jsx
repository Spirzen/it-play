import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/PseudoDocumentEditor.module.css';

const TEMPLATES = {
  tz: {
    label: 'ТЗ (структура)',
    text: `# Техническое задание\n\n## 1. Основание\n## 2. Назначение\n## 3. Требования\n### 3.1 Функциональные\n| ID | Описание | Приоритет |\n|----|----------|----------|\n| FR-01 | | Must |\n## 4. Критерии приёмки`,
  },
  runbook: {
    label: 'Runbook',
    text: `# Runbook: инцидент API\n\n**Симптом:** 5xx на /orders\n\n1. Проверить метрики\n2. Логи pod-*\n3. Rollback при необходимости`,
  },
  glossary: {
    label: 'Глоссарий',
    text: `# Термины\n\n| Термин | Определение |\n|--------|-------------|\n| SLA | Соглашение об уровне сервиса |\n| BRD | Business Requirements Document |`,
  },
};

function renderPreview(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('# ')) return <h2 key={i}>{line.slice(2)}</h2>;
      if (line.startsWith('## ')) return <h3 key={i}>{line.slice(3)}</h3>;
      if (line.startsWith('### ')) return <h4 key={i}>{line.slice(4)}</h4>;
      if (line.startsWith('|')) {
        return (
          <pre key={i} className={styles.tableLine}>
            {line}
          </pre>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i}>
            <strong>{line.slice(2, -2)}</strong>
          </p>
        );
      }
      if (/^\d+\./.test(line)) return <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>;
      if (!line.trim()) return <br key={i} />;
      return <p key={i}>{line}</p>;
    });
}

function PseudoDocumentEditorInner() {
  const [text, setText] = useState(TEMPLATES.tz.text);
  const [mode, setMode] = useState('split');
  const [wordWrap, setWordWrap] = useState(true);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    return {words, lines, chars: text.length};
  }, [text]);

  return (
    <DemoShell>
      <DemoCard
        title="Псевдотекстовый редактор документации"
        subtitle="Черновик ТЗ, runbook или глоссария — разметка Markdown и предпросмотр"
      >
        <div className={styles.bar}>
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              type="button"
              className={styles.tplBtn}
              onClick={() => setText(tpl.text)}
            >
              {tpl.label}
            </button>
          ))}
          <span className={styles.sep} />
          <button
            type="button"
            className={clsx(styles.modeBtn, mode === 'edit' && styles.modeActive)}
            onClick={() => setMode('edit')}
          >
            Редактор
          </button>
          <button
            type="button"
            className={clsx(styles.modeBtn, mode === 'split' && styles.modeActive)}
            onClick={() => setMode('split')}
          >
            Split
          </button>
          <button
            type="button"
            className={clsx(styles.modeBtn, mode === 'preview' && styles.modeActive)}
            onClick={() => setMode('preview')}
          >
            Просмотр
          </button>
          <label className={styles.wrap}>
            <input
              type="checkbox"
              checked={wordWrap}
              onChange={(e) => setWordWrap(e.target.checked)}
            />
            Перенос строк
          </label>
          <span className={styles.stats}>
            {stats.lines} строк · {stats.words} слов
          </span>
        </div>

        <div
          className={clsx(
            styles.panes,
            mode === 'edit' && styles.panesEdit,
            mode === 'preview' && styles.panesPreview,
          )}
        >
          {mode !== 'preview' && (
            <textarea
              className={clsx(styles.editor, !wordWrap && styles.nowrap)}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          )}
          {mode !== 'edit' && (
            <div className={styles.preview}>{renderPreview(text)}</div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PseudoDocumentEditorInner;
