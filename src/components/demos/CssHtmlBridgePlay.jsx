import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ACCESS_MODES,
  DOM_TREE,
  ELEMENT_IDS,
  ELEMENT_META,
  PIPELINE_STEPS,
  SOURCE_META,
  SOURCE_PRESETS,
  TREE_NODE_LABELS,
  buildMiniHtml,
  formatComputedBlock,
  getCascadeLayers,
  resolveStyles,
  stylesToReact,
} from '@/components/shared/kb/cssHtmlBridgeEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CssHtmlBridgePlay.module.css';

const MODES = [
  {id: 'pipeline', label: 'DOM → CSSOM → экран'},
  {id: 'sources', label: 'Источники CSS'},
  {id: 'cascade', label: 'Каскад'},
  {id: 'access', label: 'Доступ к стилям'},
];

function DomTreeNode({node, depth = 0, selectedId, onSelect}) {
  const label = TREE_NODE_LABELS[node.id] || node.id;
  const selectable = ELEMENT_META[node.id];
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={clsx(
          styles.treeRow,
          selectable && styles.treeRowSelectable,
          isSelected && styles.treeRowHit,
        )}
        style={{paddingLeft: `${depth * 0.65}rem`}}
        onClick={() => selectable && onSelect(node.id)}
        onKeyDown={(e) => {
          if (selectable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
        role={selectable ? 'button' : undefined}
        tabIndex={selectable ? 0 : undefined}
      >
        {label}
      </div>
      {node.children?.map((child) => (
        <DomTreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function PreviewCard({selectedId, sources, pipelineStep, onSelect}) {
  const styled = pipelineStep?.styled !== false;
  const cardStyles = styled ? stylesToReact(resolveStyles('card', sources)) : {};
  const titleStyles = styled ? stylesToReact(resolveStyles('title', sources)) : {};
  const leadStyles = styled ? stylesToReact(resolveStyles('lead', sources)) : {};
  const ctaStyles = styled ? stylesToReact(resolveStyles('cta', sources)) : {};

  const pick = (id) => () => onSelect(id);

  return (
    <div
      className={clsx(styles.preview, !styled && styles.previewUnstyled)}
      aria-label="Превью страницы"
    >
      <div
        className={clsx(styles.previewCard, selectedId === 'card' && styles.previewSelected)}
        style={cardStyles}
        onClick={pick('card')}
        onKeyDown={(e) => e.key === 'Enter' && pick('card')()}
        role="button"
        tabIndex={0}
      >
        <h1
          className={clsx(styles.previewTitle, selectedId === 'title' && styles.previewSelected)}
          style={titleStyles}
          onClick={(e) => {
            e.stopPropagation();
            pick('title')();
          }}
        >
          Заголовок карточки
        </h1>
        <p
          className={clsx(styles.previewLead, selectedId === 'lead' && styles.previewSelected)}
          style={leadStyles}
          onClick={(e) => {
            e.stopPropagation();
            pick('lead')();
          }}
        >
          Абзац с классом <code>.lead</code> — смотрите, как меняется цвет при отключении{' '}
          <code>&lt;style&gt;</code>.
        </p>
        <button
          type="button"
          className={clsx(styles.previewBtn, selectedId === 'cta' && styles.previewSelected)}
          style={ctaStyles}
          onClick={(e) => {
            e.stopPropagation();
            pick('cta')();
          }}
        >
          Кнопка #cta
        </button>
      </div>
    </div>
  );
}

function FlowDiagram({step}) {
  const on = (key) => {
    if (!step) return false;
    if (key === 'dom') return step.dom;
    if (key === 'cssom') return step.cssom;
    if (key === 'render') return step.render;
    return false;
  };

  return (
    <div className={styles.flowDiagram} aria-hidden>
      <span className={clsx(styles.flowBox, styles.flowHtml, on('dom') && styles.flowBoxOn)}>HTML</span>
      <span className={styles.flowArrow}>→</span>
      <span className={clsx(styles.flowBox, styles.flowDom, on('dom') && styles.flowBoxOn)}>DOM</span>
      <span className={styles.flowArrow}>+</span>
      <span className={clsx(styles.flowBox, styles.flowCss, on('cssom') && styles.flowBoxOn)}>CSS</span>
      <span className={styles.flowArrow}>→</span>
      <span className={clsx(styles.flowBox, styles.flowCssom, on('cssom') && styles.flowBoxOn)}>CSSOM</span>
      <span className={styles.flowArrow}>→</span>
      <span className={clsx(styles.flowBox, styles.flowRender, on('render') && styles.flowBoxOn)}>
        Render Tree
      </span>
    </div>
  );
}

function HighlightedHtml({sources}) {
  const text = buildMiniHtml(sources);
  const hot = (line) => {
    if (!sources.link && line.includes('link')) return true;
    if (!sources.style && (line.includes('<style>') || line.includes('</style>') || line.includes('#title'))) {
      return line.trim().startsWith('<!--');
    }
    if (!sources.inline && line.includes('style=')) return true;
    if (sources.link && line.includes('link rel')) return true;
    if (sources.style && line.includes('<style>')) return true;
    if (sources.inline && line.includes('style=')) return true;
    return false;
  };

  return (
    <pre className={styles.miniHtml}>
      {text.split('\n').map((line) => (
        <span key={line} className={clsx(styles.miniHtmlLine, hot(line) && styles.miniHtmlHot)}>
          {line}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}

function StylesPanel({elementId, sources}) {
  const layers = getCascadeLayers(elementId, sources);
  if (!layers.length) {
    return <p className="it-demo__hint">Нет правил для этого элемента при текущих источниках.</p>;
  }

  return (
    <div className={styles.stylesPanel}>
      {layers.map((layer) => {
        const meta = SOURCE_META[layer.source];
        return (
          <div
            key={`${layer.selector}-${layer.prop}-${layer.value}`}
            className={clsx(styles.styleRule, !layer.active && styles.styleRuleOff)}
          >
            <div className={styles.styleMeta}>
              <span className={styles.styleBadge} style={{background: meta.color}}>
                {meta.short}
              </span>
              <span>{layer.selector}</span>
              <span>спец. {layer.specificity}</span>
              {layer.active && <span>✓ применено</span>}
            </div>
            <div>
              <span className={styles.styleProp}>{layer.prop}</span>: {layer.value};
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CssHtmlBridgePlayInner() {
  const [mode, setMode] = useState('pipeline');
  const [pipelineIdx, setPipelineIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState('cta');
  const [sources, setSources] = useState({link: true, style: true, inline: true});
  const [accessId, setAccessId] = useState('devtools');

  const pipelineStep = PIPELINE_STEPS[pipelineIdx] ?? PIPELINE_STEPS[0];
  const accessMode = ACCESS_MODES.find((a) => a.id === accessId) ?? ACCESS_MODES[0];

  const fullSources = useMemo(() => ({ua: true, ...sources}), [sources]);

  const advancePipeline = useCallback(() => {
    setPipelineIdx((i) => (i + 1) % PIPELINE_STEPS.length);
  }, []);

  useEffect(() => {
    if (mode !== 'pipeline' || !playing) return undefined;
    const id = window.setInterval(advancePipeline, 2200);
    return () => window.clearInterval(id);
  }, [mode, playing, advancePipeline]);

  useEffect(() => {
    if (mode === 'pipeline') {
      setPlaying(false);
      setPipelineIdx(0);
    }
  }, [mode]);

  const toggleSource = (key) => {
    setSources((prev) => ({...prev, [key]: !prev[key]}));
  };

  const applyPreset = (preset) => {
    setSources(preset.sources);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="CSS и HTML: от разметки до пикселей"
        subtitle="Загрузка стилей, CSSOM, Render Tree, три способа подключения, каскад и доступ через DevTools и JS"
      >
        <div className={styles.tabs} role="tablist" aria-label="Режим демо">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(styles.tab, mode === m.id && styles.tabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'pipeline' && (
          <>
            <FlowDiagram step={pipelineStep} />
            <div className={styles.playRow}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? 'Пауза' : '▶ Пошаговая анимация'}
              </button>
              <button type="button" className="it-demo__btn" onClick={advancePipeline}>
                Следующий шаг
              </button>
            </div>
            <div className={styles.pipeline}>
              {PIPELINE_STEPS.map((step, i) => (
                <button
                  key={step.id}
                  type="button"
                  className={clsx(styles.pipelineStep, i === pipelineIdx && styles.pipelineStepOn)}
                  onClick={() => {
                    setPlaying(false);
                    setPipelineIdx(i);
                  }}
                >
                  <span className={styles.pipelineDot} />
                  <div>
                    <div className={styles.pipelineLabel}>{step.label}</div>
                    <p className={styles.pipelineDetail}>{step.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'sources' && (
          <>
            <div className={toolStyles.chips}>
              {SOURCE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={toolStyles.chip}
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className={styles.sourceToggles} role="group" aria-label="Источники CSS">
              {(['link', 'style', 'inline']).map((key) => {
                const meta = SOURCE_META[key];
                const on = sources[key];
                return (
                  <label
                    key={key}
                    className={clsx(styles.sourceToggle, on && styles.sourceToggleOn)}
                    style={on ? {borderColor: meta.color} : undefined}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleSource(key)}
                      className="sr-only"
                    />
                    <span className={styles.sourceDot} style={{background: meta.color}} />
                    {meta.label}
                  </label>
                );
              })}
            </div>
            <p className="it-demo__hint">
              UA-стили браузера всегда в основе. Включайте и выключайте link, style и inline — смотрите
              превью и подсветку в разметке.
            </p>
          </>
        )}

        {mode === 'cascade' && (
          <>
            <div className={toolStyles.chips}>
              {ELEMENT_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={clsx(toolStyles.chip, selectedId === id && toolStyles.chipActive)}
                  onClick={() => setSelectedId(id)}
                >
                  {ELEMENT_META[id].label}
                </button>
              ))}
            </div>
            <p className="it-demo__hint">
              Как в DevTools → Styles: активные правила внизу по весу; перечёркнутые переопределены
              специфичностью или порядком.
            </p>
            <StylesPanel elementId={selectedId} sources={fullSources} />
          </>
        )}

        {mode === 'access' && (
          <>
            <div className={toolStyles.chips}>
              {ACCESS_MODES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={clsx(toolStyles.chip, accessId === a.id && toolStyles.chipActive)}
                  onClick={() => setAccessId(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p className="it-demo__hint">{accessMode.hint}</p>
            {accessMode.code && <pre className={styles.codeLine}>{accessMode.code}</pre>}
            {accessId === 'computed' && (
              <div className={styles.computedBlock}>
                {`/* getComputedStyle('#${selectedId}') */\n`}
                {formatComputedBlock(selectedId, fullSources)}
              </div>
            )}
            {accessId === 'devtools' && <StylesPanel elementId={selectedId} sources={fullSources} />}
            {accessId === 'sheets' && (
              <ul className="it-demo__hint" style={{marginTop: '0.5rem', paddingLeft: '1.2rem'}}>
                <li>
                  <strong>styleSheets[0]</strong> — {sources.link ? 'theme.css (link)' : '— отключён'}
                </li>
                <li>
                  <strong>styleSheets[1]</strong> — {sources.style ? 'блок &lt;style&gt; в head' : '— отключён'}
                </li>
                <li>inline-правила в атрибуте не попадают в cssRules — только через element.style</li>
              </ul>
            )}
          </>
        )}

        <div className={clsx(styles.layout, styles.layoutSplit, {marginTop: '1rem'})}>
          <div>
            <p className="it-demo__label">
              {mode === 'sources' ? 'Разметка и подключение' : 'Страница в браузере'}
            </p>
            {mode === 'sources' ? (
              <HighlightedHtml sources={sources} />
            ) : (
              <PreviewCard
                selectedId={selectedId}
                sources={fullSources}
                pipelineStep={mode === 'pipeline' ? pipelineStep : {styled: true}}
                onSelect={setSelectedId}
              />
            )}
          </div>
          <div>
            <p className="it-demo__label">{mode === 'pipeline' ? 'Узлы документа' : 'Выбор элемента'}</p>
            <div className={styles.treePanel}>
              <DomTreeNode node={DOM_TREE} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            {mode !== 'pipeline' && mode !== 'sources' && (
              <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
                Клик по превью или дереву — смена элемента для каскада и computed.
              </p>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CssHtmlBridgePlayInner;
