import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import {
  MARKDOWN_PRESETS,
  markdownStats,
  renderMarkdownToHtml,
} from '@/components/shared/kb/markdownDemoEngine';
import styles from '@/components/demos/MarkdownLivePlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function MarkdownLivePlayInner() {
  const {isMobile} = useBreakpoint();
  const [source, setSource] = useState(MARKDOWN_PRESETS[0].md);
  const [activePreset, setActivePreset] = useState(MARKDOWN_PRESETS[0].id);
  const [view, setView] = useState(isMobile ? 'edit' : 'split');

  const html = useMemo(() => renderMarkdownToHtml(source), [source]);
  const stats = useMemo(() => markdownStats(source), [source]);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setSource(preset.md);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Markdown: живой предпросмотр"
        subtitle="Слева — исходник, справа — как его увидит генератор документации (заголовки, списки, код, таблицы)."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {MARKDOWN_PRESETS.map((preset) => (
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

        <div className={styles.statsRow}>
          <span>{stats.lines} строк</span>
          <span>{stats.headings} заголовков</span>
          <span>{stats.links} ссылок</span>
          <span>{stats.codeBlocks} блоков кода</span>
        </div>

        <div className="it-demo__tabs" role="tablist" style={{marginBottom: '0.65rem'}}>
          {['split', 'edit', 'preview'].map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={clsx('it-demo__tab', view === id && 'it-demo__tab--active')}
              onClick={() => setView(id)}
            >
              {id === 'split' ? 'Рядом' : id === 'edit' ? 'Редактор' : 'Просмотр'}
            </button>
          ))}
        </div>

        <div
          className={clsx(
            styles.workspace,
            view === 'split' && styles.workspaceSplit,
            view === 'edit' && styles.workspaceEdit,
            view === 'preview' && styles.workspacePreview,
          )}
        >
          {(view === 'split' || view === 'edit') && (
            <div className={styles.editorPane}>
              <label className="it-demo__label">Markdown</label>
              <textarea
                className={clsx('it-demo__textarea', toolStyles.textareaMono, styles.editor)}
                value={source}
                onChange={(e) => {
                  setActivePreset('');
                  setSource(e.target.value);
                }}
                rows={isMobile ? 14 : 16}
                spellCheck={false}
              />
            </div>
          )}
          {(view === 'split' || view === 'preview') && (
            <div className={styles.previewPane}>
              <label className="it-demo__label">Предпросмотр</label>
              <div
                className={styles.preview}
                dangerouslySetInnerHTML={{__html: html}}
              />
            </div>
          )}
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.75rem', marginBottom: 0}}>
          Эта энциклопедия (Docusaurus) тоже хранит статьи в Markdown/MDX — тот же принцип "текст → HTML".
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MarkdownLivePlayInner;
