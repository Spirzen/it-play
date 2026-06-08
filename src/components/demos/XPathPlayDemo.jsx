import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import {
  LIBRARY_XML,
  XPATH_PRESETS,
  evaluateXPath,
  formatXPathNode,
  parseXml,
} from '@/components/shared/kb/xmlDemoShared';
import styles from '@/components/demos/XPathPlayDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function XPathPlayDemoInner() {
  const {isMobile} = useBreakpoint();
  const [xmlInput, setXmlInput] = useState(LIBRARY_XML);
  const [query, setQuery] = useState(XPATH_PRESETS[0].query);
  const [activePreset, setActivePreset] = useState(XPATH_PRESETS[0].id);

  const result = useMemo(() => {
    const {doc, error} = parseXml(xmlInput);
    if (error) {
      return {parseError: error, nodes: [], xpathError: null, count: 0};
    }
    const xpath = evaluateXPath(doc, query);
    return {
      parseError: null,
      nodes: xpath.nodes,
      xpathError: xpath.error,
      count: xpath.nodes.length,
    };
  }, [xmlInput, query]);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setQuery(preset.query);
  };

  const presetHint = XPATH_PRESETS.find((p) => p.id === activePreset)?.hint;

  return (
    <DemoShell>
      <DemoCard
        title="XPath: запросы к XML-дереву"
        subtitle="Выражение выбирает узлы в документе library — как в примерах из статьи."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {XPATH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={clsx(toolStyles.chip, activePreset === preset.id && toolStyles.chipActive)}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginBottom: '1rem'}}>
          <div>
            <label className="it-demo__label">XML (library)</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              rows={isMobile ? 10 : 12}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="it-demo__label">XPath-выражение</label>
            <input
              className={clsx('it-demo__input', toolStyles.mono)}
              value={query}
              onChange={(e) => {
                setActivePreset('');
                setQuery(e.target.value);
              }}
              spellCheck={false}
            />
            {presetHint && (
              <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
                {presetHint}
              </p>
            )}
            <div
              className={clsx(
                styles.statusBanner,
                result.parseError || result.xpathError
                  ? styles.statusInvalid
                  : result.count > 0
                    ? styles.statusValid
                    : styles.statusPending,
              )}
              style={{marginTop: '0.75rem'}}
            >
              {result.parseError
                ? 'XML не разобран — исправьте синтаксис.'
                : result.xpathError
                  ? result.xpathError
                  : `Найдено узлов: ${result.count}`}
            </div>
            <ul className={styles.resultList}>
              {result.nodes.slice(0, 12).map((node, index) => (
                <li key={`${query}-${index}`} className={styles.resultItem}>
                  <span className={styles.resultIndex}>{index + 1}</span>
                  <code className={styles.resultCode}>{formatXPathNode(node)}</code>
                </li>
              ))}
              {result.count > 12 && (
                <li className={styles.resultMore}>… и ещё {result.count - 12} узлов</li>
              )}
            </ul>
          </div>
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0}}>
          В браузере XPath выполняется через DOM API (XPath 1.0). В серверных пайплайнах те же выражения
          обрабатывают libxml, Saxon и встроенные процессоры платформы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default XPathPlayDemoInner;
