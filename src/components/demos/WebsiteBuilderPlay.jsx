import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BLOCK_PALETTE,
  TEMPLATES,
  buildPageHtml,
  newBlock,
  publishSteps,
} from '@/components/shared/kb/websiteBuilderEngine';
import styles from '@/components/demos/WebsiteBuilderPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function blockLabel(block) {
  const p = block.props;
  switch (block.type) {
    case 'hero':
      return `Обложка: ${p.title}`;
    case 'heading':
      return `Заголовок: ${p.text}`;
    case 'text':
      return `Текст: ${String(p.body).slice(0, 40)}…`;
    case 'button':
      return `Кнопка: ${p.label}`;
    case 'image':
      return `Картинка: ${p.alt}`;
    case 'form':
      return `Форма: ${(p.fields || []).join(', ')}`;
    default:
      return block.type;
  }
}

function BlockEditor({block, onChange}) {
  const p = block.props;
  const set = (key, value) => onChange({...block, props: {...p, [key]: value}});

  if (block.type === 'hero') {
    return (
      <>
        <label>
          Заголовок
          <input value={p.title} onChange={(e) => set('title', e.target.value)} />
        </label>
        <label>
          Подзаголовок
          <textarea rows={2} value={p.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
        </label>
      </>
    );
  }
  if (block.type === 'heading') {
    return (
      <label>
        Текст
        <input value={p.text} onChange={(e) => set('text', e.target.value)} />
      </label>
    );
  }
  if (block.type === 'text') {
    return (
      <label>
        Абзац
        <textarea rows={3} value={p.body} onChange={(e) => set('body', e.target.value)} />
      </label>
    );
  }
  if (block.type === 'button') {
    return (
      <>
        <label>
          Подпись
          <input value={p.label} onChange={(e) => set('label', e.target.value)} />
        </label>
        <label>
          Ссылка
          <input value={p.href} onChange={(e) => set('href', e.target.value)} />
        </label>
      </>
    );
  }
  if (block.type === 'image') {
    return (
      <>
        <label>
          Alt
          <input value={p.alt} onChange={(e) => set('alt', e.target.value)} />
        </label>
        <label>
          Подпись
          <input value={p.caption} onChange={(e) => set('caption', e.target.value)} />
        </label>
      </>
    );
  }
  if (block.type === 'form') {
    return (
      <label>
        Поля (через запятую)
        <input
          value={(p.fields || []).join(', ')}
          onChange={(e) =>
            set(
              'fields',
              e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            )
          }
        />
      </label>
    );
  }
  return null;
}

function WebsiteBuilderPlayInner() {
  const [blocks, setBlocks] = useState(() => {
    const tpl = TEMPLATES[0];
    return tpl.blocks.map((b) => {
      const block = newBlock(b.type);
      block.props = {...block.props, ...b.props};
      return block;
    });
  });
  const [activeId, setActiveId] = useState(blocks[0]?.id ?? null);
  const [view, setView] = useState('preview');
  const [published, setPublished] = useState(false);

  const active = blocks.find((b) => b.id === activeId);
  const html = useMemo(() => buildPageHtml(blocks), [blocks]);
  const steps = publishSteps(blocks);

  const updateBlock = (next) => {
    setBlocks((list) => list.map((b) => (b.id === next.id ? next : b)));
  };

  const move = (id, dir) => {
    setBlocks((list) => {
      const i = list.findIndex((b) => b.id === id);
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id) => {
    setBlocks((list) => {
      const next = list.filter((b) => b.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  const applyTemplate = (tpl) => {
    const next = tpl.blocks.map((b) => {
      const block = newBlock(b.type);
      block.props = {...block.props, ...b.props};
      return block;
    });
    setBlocks(next);
    setActiveId(next[0]?.id ?? null);
    setPublished(false);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор сайтов"
        subtitle="Соберите страницу из блоков, как в Tilda или Wix, и посмотрите, что получится после публикации"
      >
        <label className="it-demo__label">Шаблон</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TEMPLATES.map((t) => (
            <button key={t.id} type="button" className={toolStyles.chip} onClick={() => applyTemplate(t)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <p className={styles.panelTitle}>Редактор</p>
            <div className={styles.palette}>
              {BLOCK_PALETTE.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className={styles.paletteBtn}
                  onClick={() => {
                    const b = newBlock(item.type);
                    setBlocks((list) => [...list, b]);
                    setActiveId(b.id);
                    setPublished(false);
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
            <div className={styles.canvas}>
              {blocks.length === 0 ? (
                <p className={styles.empty}>Добавьте блок из палитры или выберите шаблон</p>
              ) : (
                blocks.map((b) => (
                  <div
                    key={b.id}
                    className={clsx(styles.blockRow, activeId === b.id && styles.blockRowActive)}
                    onClick={() => setActiveId(b.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveId(b.id);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.blockPreview}>{blockLabel(b)}</div>
                    <div className={styles.blockControls}>
                      <button type="button" aria-label="Вверх" onClick={(e) => { e.stopPropagation(); move(b.id, -1); }}>
                        ↑
                      </button>
                      <button type="button" aria-label="Вниз" onClick={(e) => { e.stopPropagation(); move(b.id, 1); }}>
                        ↓
                      </button>
                      <button type="button" aria-label="Удалить" onClick={(e) => { e.stopPropagation(); remove(b.id); }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {active && (
              <div className={styles.editor}>
                <p className={styles.panelTitle}>Свойства блока</p>
                <BlockEditor block={active} onChange={updateBlock} />
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.tabs}>
              <button
                type="button"
                className={clsx(styles.tab, view === 'preview' && styles.tabActive)}
                onClick={() => setView('preview')}
              >
                Предпросмотр
              </button>
              <button
                type="button"
                className={clsx(styles.tab, view === 'html' && styles.tabActive)}
                onClick={() => setView('html')}
              >
                HTML
              </button>
            </div>
            {view === 'preview' ? (
              <iframe
                className={styles.previewFrame}
                title="Предпросмотр сайта"
                sandbox="allow-same-origin"
                srcDoc={html}
              />
            ) : (
              <pre className={styles.codeBox}>{html}</pre>
            )}
            <button
              type="button"
              className={clsx(toolStyles.chip, toolStyles.chipActive)}
              style={{marginTop: '0.5rem'}}
              onClick={() => setPublished(true)}
            >
              Опубликовать
            </button>
            {published && (
              <div className={styles.publish}>
                {steps.map((s) => (
                  <div key={s.step} className={styles.publishStep}>
                    <span className={styles.publishNum}>{s.step}</span>
                    <div>
                      <strong>{s.label}</strong> — {s.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default WebsiteBuilderPlayInner;
