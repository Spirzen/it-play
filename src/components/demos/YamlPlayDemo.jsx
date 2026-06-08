import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import {YAML_PRESETS, parseYaml, yamlToDisplayLines} from '@/components/shared/kb/yamlDemoEngine';
import styles from '@/components/demos/YamlPlayDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function YamlPlayDemoInner() {
  const {isMobile} = useBreakpoint();
  const [input, setInput] = useState(YAML_PRESETS[0].yaml);
  const [activePreset, setActivePreset] = useState(YAML_PRESETS[0].id);
  const [tab, setTab] = useState('structure');

  const result = useMemo(() => parseYaml(input), [input]);
  const lines = useMemo(
    () => (result.valid ? yamlToDisplayLines(result.data) : []),
    [result.valid, result.data],
  );

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setInput(preset.yaml);
  };

  return (
    <DemoShell>
      <DemoCard
        title="YAML: отступы и структура"
        subtitle="Парсер проверяет правила из статьи — пробелы вместо табов, двоеточие с пробелом, списки через дефис."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {YAML_PRESETS.map((preset) => (
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
            <label className="it-demo__label">YAML-документ</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              value={input}
              onChange={(e) => {
                setActivePreset('');
                setInput(e.target.value);
              }}
              rows={isMobile ? 12 : 14}
              spellCheck={false}
            />
          </div>
          <div>
            <div
              className={clsx(
                styles.statusBanner,
                result.valid ? styles.statusValid : styles.statusInvalid,
              )}
            >
              {result.valid
                ? 'Структура разобрана — отступы и синтаксис в порядке.'
                : 'Есть замечания по синтаксису — см. список ниже.'}
            </div>

            <div className="it-demo__tabs" role="tablist" style={{marginBottom: '0.65rem'}}>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'structure'}
                className={clsx('it-demo__tab', tab === 'structure' && 'it-demo__tab--active')}
                onClick={() => setTab('structure')}
              >
                Структура
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'json'}
                className={clsx('it-demo__tab', tab === 'json' && 'it-demo__tab--active')}
                onClick={() => setTab('json')}
              >
                Как JSON
              </button>
            </div>

            {tab === 'structure' && lines.length > 0 && (
              <ul className={styles.pathList}>
                {lines.map((row) => (
                  <li key={row.key} className={styles.pathItem}>
                    <code className={styles.pathKey}>{row.key}</code>
                    <span className={styles.pathType}>{row.type}</span>
                    {row.value && <span className={styles.pathVal}>{row.value}</span>}
                  </li>
                ))}
              </ul>
            )}

            {tab === 'json' && result.valid && (
              <pre className={styles.jsonPreview}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}

            {result.issues.length > 0 && (
              <ul className={styles.issueList}>
                {result.issues.map((issue, i) => (
                  <li
                    key={`${issue.line}-${i}`}
                    className={clsx(styles.issueItem, issue.ok ? styles.issueOk : styles.issueFail)}
                  >
                    {issue.line ? `Строка ${issue.line}: ` : ''}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0}}>
          В CI/CD и Kubernetes YAML обрабатывают полноценные парсеры (PyYAML, ruamel.yaml). Здесь — учебное
          подмножество для наглядности правил отступов.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default YamlPlayDemoInner;
