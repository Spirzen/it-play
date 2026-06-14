import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  countLines,
  DEFAULT_CODE,
  injectErrorProbe,
  openPreviewInNewTab,
  PLAYGROUND_MESSAGE_TYPE,
  PRESETS,
} from '@/components/shared/kb/htmlPlaygroundEngine';
import styles from '@/components/demos/HtmlPlayground.module.css';

const DEBOUNCE_MS = 450;
const MIN_EDITOR_RATIO = 0.25;
const MAX_EDITOR_RATIO = 0.75;

function HtmlPlaygroundInner() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [presetId, setPresetId] = useState('default');
  const [previewState, setPreviewState] = useState('idle');
  const [previewError, setPreviewError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorRatio, setEditorRatio] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);

  const iframeRef = useRef(null);
  const workspaceRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const debounceRef = useRef(null);

  const {copy, isCopied} = useCopyToClipboard();
  const lineCount = countLines(code);

  const writePreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        return;
      }
      doc.open();
      doc.write(injectErrorProbe(code));
      doc.close();
      setPreviewError(null);
      setPreviewState('live');
    } catch (err) {
      setPreviewError(err?.message || 'Не удалось обновить предпросмотр');
      setPreviewState('idle');
    }
  }, [code]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setPreviewState('pending');
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(writePreview, DEBOUNCE_MS);
    return () => window.clearTimeout(debounceRef.current);
  }, [code, writePreview]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== PLAYGROUND_MESSAGE_TYPE) {
        return;
      }
      setPreviewError(event.data.message || 'Ошибка в скрипте');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    const onMove = (e) => {
      const el = workspaceRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      setEditorRatio(Math.min(MAX_EDITOR_RATIO, Math.max(MIN_EDITOR_RATIO, ratio)));
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isFullscreen) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const applyPreset = (preset) => {
    setPresetId(preset.id);
    setCode(preset.code);
    setPreviewError(null);
    if (isMobile) {
      setMobileView('preview');
    }
  };

  const handleReset = () => applyPreset(PRESETS[0]);

  const handleEditorKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = `${code.slice(0, start)}  ${code.slice(end)}`;
      setCode(next);
      if (presetId !== 'custom') {
        setPresetId('custom');
      }
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      window.clearTimeout(debounceRef.current);
      writePreview();
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (presetId !== 'custom') {
      setPresetId('custom');
    }
  };

  const showEditor = !isMobile || mobileView === 'editor';
  const showPreview = !isMobile || mobileView === 'preview';

  const editorStyle = isMobile ? undefined : {flex: `0 0 ${editorRatio * 100}%`};
  const previewStyle = isMobile ? undefined : {flex: '1 1 0'};

  const statusLabel =
    previewState === 'pending' ? 'обновление…' : previewState === 'live' ? 'live' : 'готов';

  return (
    <DemoShell fullscreenable={false}>
      <div
        className={clsx(styles.shell, isFullscreen && styles.shellFullscreen)}
        role="region"
        aria-label="HTML/CSS/JS песочница"
      >
        <div className={styles.header}>
          <div className={styles.buttons}>
            <button
              type="button"
              className={clsx(styles.winBtn, styles.winBtnRed)}
              title="Сбросить код"
              aria-label="Сбросить код"
              onClick={handleReset}
            />
            <button
              type="button"
              className={clsx(styles.winBtn, styles.winBtnYellow)}
              title="Обновить предпросмотр (Ctrl+Enter)"
              aria-label="Обновить предпросмотр"
              onClick={writePreview}
            />
            <button
              type="button"
              className={clsx(styles.winBtn, styles.winBtnGreen)}
              title="Фокус на редактор"
              aria-label="Фокус на редактор"
              onClick={() => textareaRef.current?.focus()}
            />
          </div>
          <div className={styles.title}>index.html — HTML · CSS · JavaScript</div>
          <div className={styles.status}>
            <span
              className={clsx(
                styles.statusDot,
                previewState === 'live' && styles.statusDotLive,
                previewState === 'pending' && styles.statusDotPending,
              )}
              aria-hidden
            />
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.presets}>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx(styles.presetBtn, presetId === p.id && styles.presetBtnActive)}
                onClick={() => applyPreset(p)}
              >
                {p.icon} {p.label}
              </button>
            ))}
            {presetId === 'custom' && (
              <span className={styles.presetBtn} style={{cursor: 'default', opacity: 0.85}}>
                ✏️ Свой код
              </span>
            )}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={clsx(styles.actionBtn, styles.actionBtnPrimary)}
              onClick={writePreview}
            >
              ▶ Запустить
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => copy(code, 'code')}>
              {isCopied('code') ? '✓ Скопировано' : 'Копировать'}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => openPreviewInNewTab(code)}
            >
              ↗ Вкладка
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setIsFullscreen((v) => !v)}
            >
              {isFullscreen ? '⊡ Окно' : '⛶ Полный экран'}
            </button>
          </div>
        </div>

        {isMobile && (
          <div className={styles.mobileTabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'editor'}
              className={clsx(styles.mobileTab, mobileView === 'editor' && styles.mobileTabActive)}
              onClick={() => setMobileView('editor')}
            >
              Редактор
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'preview'}
              className={clsx(styles.mobileTab, mobileView === 'preview' && styles.mobileTabActive)}
              onClick={() => setMobileView('preview')}
            >
              Предпросмотр
            </button>
          </div>
        )}

        <div
          ref={workspaceRef}
          className={clsx(styles.workspace, isMobile && styles.workspaceMobile)}
        >
          <div
            className={clsx(
              styles.panel,
              styles.panelEditor,
              !showEditor && styles.panelHidden,
            )}
            style={editorStyle}
          >
            <div className={clsx(styles.panelHead, styles.panelHeadEditor)}>
              <span>Редактор</span>
              <span className={styles.panelMeta}>{lineCount} строк</span>
            </div>
            <div className={styles.editorWrap}>
              <div ref={lineNumbersRef} className={styles.lineNumbers} aria-hidden>
                {Array.from({length: lineCount}, (_, i) => (
                  <span key={i} className={styles.lineNum}>
                    {i + 1}
                  </span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={code}
                onChange={handleCodeChange}
                onScroll={(e) => {
                  if (lineNumbersRef.current) {
                    lineNumbersRef.current.scrollTop = e.target.scrollTop;
                  }
                }}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                aria-label="HTML, CSS и JavaScript"
                placeholder="<!DOCTYPE html>…"
              />
            </div>
          </div>

          {!isMobile && (
            <div
              className={clsx(styles.resizer, isDragging && styles.resizerActive)}
              role="separator"
              aria-orientation="vertical"
              aria-label="Изменить ширину панелей"
              onPointerDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
            />
          )}

          <div
            className={clsx(
              styles.panel,
              styles.panelPreview,
              !showPreview && styles.panelHidden,
            )}
            style={previewStyle}
          >
            <div className={clsx(styles.panelHead, styles.panelHeadPreview)}>
              <span>Предпросмотр</span>
              <span className={styles.panelMeta}>sandbox</span>
            </div>
            <iframe
              ref={iframeRef}
              title="HTML preview"
              className={styles.previewFrame}
              sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            />
          </div>
        </div>

        {previewError && (
          <div className={styles.errorBar} role="alert">
            <span>⚠ {previewError}</span>
            <button
              type="button"
              className={styles.errorDismiss}
              aria-label="Скрыть ошибку"
              onClick={() => setPreviewError(null)}
            >
              ×
            </button>
          </div>
        )}

        <p className={styles.hint}>
          Предпросмотр обновляется автоматически · Tab — отступ · Ctrl+Enter — принудительный запуск
          · перетащите разделитель между панелями
        </p>
      </div>
    </DemoShell>
  );
}

export default HtmlPlaygroundInner;
