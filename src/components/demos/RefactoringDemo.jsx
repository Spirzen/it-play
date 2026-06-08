import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  STEPS,
  flattenTree,
  getFileContent,
  getStep,
} from '@/components/shared/kb/refactoringEngine';
import styles from '@/components/demos/RefactoringDemo.module.css';

function TreeNode({node, depth, selectedFile, onSelect}) {
  if (node.type === 'dir') {
    const name = node.path.split('/').filter(Boolean).pop() || node.path;
    return (
      <li className={styles.treeItem}>
        <div className={styles.treeDir} style={{paddingLeft: `${0.65 + depth * 0.55}rem`}}>
          📁 {name}
        </div>
        <ul className={styles.treeList}>
          {node.children?.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </li>
    );
  }

  const fileName = node.path.split('/').pop();
  return (
    <li className={styles.treeItem}>
      <button
        type="button"
        className={clsx(styles.treeBtn, selectedFile === node.path && styles.treeBtnActive)}
        style={{paddingLeft: `${0.65 + depth * 0.55}rem`}}
        onClick={() => onSelect(node.path)}
      >
        <span aria-hidden>📄</span>
        {fileName}
      </button>
    </li>
  );
}

function RefactoringDemoInner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(STEPS[0].defaultFile);
  const [autoPlay, setAutoPlay] = useState(false);

  const step = getStep(stepIndex);
  const files = useMemo(() => flattenTree(step.tree), [step]);
  const code = getFileContent(stepIndex, selectedFile);
  const m = step.metrics;

  useEffect(() => {
    if (!files.includes(selectedFile)) {
      setSelectedFile(step.defaultFile);
    }
  }, [stepIndex, files, selectedFile, step.defaultFile]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= STEPS.length - 1) {
          setAutoPlay(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);
    return () => window.clearInterval(id);
  }, [autoPlay]);

  const goStep = useCallback((idx) => {
    setAutoPlay(false);
    setStepIndex(Math.max(0, Math.min(idx, STEPS.length - 1)));
  }, []);

  const metricClass = (value, threshold, invert = false) => {
    const bad = invert ? value < threshold : value > threshold;
    return bad ? styles.metricValueBad : styles.metricValueOk;
  };

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Пошаговый рефакторинг мини-проекта</h4>
        <p className={styles.subtitle}>
          От "всё в одном файле" к слоям domain / application / infrastructure — поведение не меняется
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.stepBar} role="tablist" aria-label="Шаги рефакторинга">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={stepIndex === i}
              className={clsx(
                styles.stepBtn,
                stepIndex === i && styles.stepBtnActive,
                i < stepIndex && styles.stepBtnDone,
              )}
              onClick={() => goStep(i)}
              title={s.technique}
            >
              {i}. {s.short}
            </button>
          ))}
        </div>

        <div className={styles.navRow}>
          <span className={styles.techniqueBadge}>{step.technique}</span>
          <div className={styles.playRow}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              disabled={stepIndex === 0}
              onClick={() => goStep(stepIndex - 1)}
            >
              ← Назад
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              disabled={stepIndex === STEPS.length - 1}
              onClick={() => goStep(stepIndex + 1)}
            >
              Далее →
            </button>
            <button
              type="button"
              className={clsx('it-demo__btn it-demo__btn--sm', autoPlay && 'it-demo__btn--primary')}
              onClick={() => setAutoPlay((v) => !v)}
            >
              {autoPlay ? '⏸ Пауза' : '▶ Авто-тур'}
            </button>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{m.files}</span>
            <span className={styles.metricLabel}>файлов</span>
          </div>
          <div className={styles.metricCard}>
            <span className={clsx(styles.metricValue, metricClass(m.lines, 160))}>{m.lines}</span>
            <span className={styles.metricLabel}>строк</span>
          </div>
          <div className={styles.metricCard}>
            <span className={clsx(styles.metricValue, metricClass(m.complexity, 15))}>{m.complexity}</span>
            <span className={styles.metricLabel}>сложность</span>
          </div>
          <div className={styles.metricCard}>
            <span className={clsx(styles.metricValue, metricClass(m.duplication, 0))}>{m.duplication}</span>
            <span className={styles.metricLabel}>дублей</span>
          </div>
          <div className={styles.metricCard}>
            <span className={clsx(styles.metricValue, metricClass(m.smells, 2))}>{m.smells}</span>
            <span className={styles.metricLabel}>запахов</span>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.treePanel}>
            <p className={styles.treeTitle}>Структура проекта</p>
            <ul className={styles.treeList}>
              {step.tree.map((node) => (
                <TreeNode
                  key={node.path}
                  node={node}
                  depth={0}
                  selectedFile={selectedFile}
                  onSelect={setSelectedFile}
                />
              ))}
            </ul>
          </aside>

          <section className={styles.codePanel} aria-label="Содержимое файла">
            <div className={styles.codeHeader}>
              <span>{selectedFile}</span>
              <span>
                шаг {stepIndex + 1}/{STEPS.length}
              </span>
            </div>
            <pre className={styles.codePre}>{code}</pre>
          </section>
        </div>

        <p className={styles.insight}>
          <strong>{step.label}.</strong> {step.insight}
        </p>

        <div className={styles.smellRow}>
          {step.smells.length === 0 ? (
            <span className={clsx(styles.smellTag, styles.smellTagClear)}>Критичные запахи устранены</span>
          ) : (
            step.smells.map((smell) => (
              <span key={smell} className={styles.smellTag}>
                {smell}
              </span>
            ))
          )}
        </div>
      </div>
    </DemoShell>
  );
}

export default RefactoringDemoInner;
