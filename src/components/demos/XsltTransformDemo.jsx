import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  LIBRARY_XML,
  LIBRARY_XSLT,
  parseXml,
  transformLibraryToHtml,
} from '@/components/shared/kb/xmlDemoShared';
import styles from '@/components/demos/XsltTransformDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const OUTPUT_TABS = [
  {id: 'preview', label: 'Просмотр HTML'},
  {id: 'source', label: 'Код HTML'},
  {id: 'steps', label: 'Шаги XSLT'},
];

function XsltTransformDemoInner() {
  const {isMobile} = useBreakpoint();
  const [xmlInput, setXmlInput] = useState(LIBRARY_XML);
  const [outputTab, setOutputTab] = useState('preview');
  const [highlightStep, setHighlightStep] = useState(-1);
  const {copy, isCopied} = useCopyToClipboard();

  const transformResult = useMemo(() => {
    const {doc, error} = parseXml(xmlInput);
    if (error) {
      return {html: '', error, steps: []};
    }
    try {
      const html = transformLibraryToHtml(doc);
      const root = doc.documentElement;
      const books = [...root.querySelectorAll(':scope > book')];
      const steps = [
        {
          id: 'template',
          label: 'xsl:template match="/"',
          detail: 'Создаётся каркас HTML: заголовок и список <ul>.',
        },
        ...books.map((book, i) => {
          const title = book.querySelector(':scope > title')?.textContent?.trim() ?? '';
          const author = book.querySelector(':scope > author')?.textContent?.trim() ?? '';
          return {
            id: `book-${i}`,
            label: `xsl:for-each → book #${i + 1}`,
            detail: `xsl:value-of: "${title}" (${author})`,
          };
        }),
      ];
      return {html, error: null, steps};
    } catch (err) {
      return {html: '', error: err.message, steps: []};
    }
  }, [xmlInput]);

  const runTransform = useCallback(() => {
    setHighlightStep(0);
    setOutputTab('steps');
    let step = 0;
    const max = transformResult.steps.length;
    const intervalId = window.setInterval(() => {
      step += 1;
      setHighlightStep(step);
      if (step >= max) {
        window.clearInterval(intervalId);
      }
    }, 700);
  }, [transformResult.steps.length]);

  useEffect(() => {
    if (isMobile) {
      return undefined;
    }
    const timer = window.setTimeout(() => setHighlightStep(transformResult.steps.length - 1), 400);
    return () => window.clearTimeout(timer);
  }, [xmlInput, isMobile, transformResult.steps.length]);

  return (
    <DemoShell>
      <DemoCard
        title="Преобразование XML → HTML (XSLT)"
        subtitle="Исходный XML и XSL-шаблон обрабатываются процессором; на выходе — готовый HTML для браузера."
      >
        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginBottom: '1rem'}}>
          <div>
            <label className="it-demo__label">Исходный XML (library)</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              rows={isMobile ? 8 : 10}
              spellCheck={false}
            />
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              style={{marginTop: '0.5rem'}}
              onClick={() => setXmlInput(LIBRARY_XML)}
            >
              Сбросить пример
            </button>
          </div>
          <div>
            <label className="it-demo__label">XSL-шаблон</label>
            <pre className={clsx(toolStyles.outputReadonly, styles.xsltBlock)}>{LIBRARY_XSLT}</pre>
          </div>
        </div>

        <div className={toolStyles.toolbar}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={runTransform}
            disabled={Boolean(transformResult.error)}
          >
            Применить XSLT
          </button>
          {transformResult.html && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(transformResult.html, 'html')}
            >
              {isCopied('html') ? 'Скопировано' : 'Копировать HTML'}
            </button>
          )}
        </div>

        {transformResult.error ? (
          <p className="it-demo__error" style={{margin: '0 0 1rem'}}>
            {transformResult.error}
          </p>
        ) : (
          <>
            <div className="it-demo__tabs" role="tablist" style={{marginBottom: '0.75rem'}}>
              {OUTPUT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={outputTab === tab.id}
                  className={clsx('it-demo__tab', outputTab === tab.id && 'it-demo__tab--active')}
                  onClick={() => setOutputTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {outputTab === 'preview' && (
              <iframe
                className={styles.previewFrame}
                title="Результат XSLT"
                sandbox=""
                srcDoc={transformResult.html}
              />
            )}

            {outputTab === 'source' && (
              <textarea
                className={toolStyles.outputReadonly}
                readOnly
                value={transformResult.html}
                rows={12}
                spellCheck={false}
              />
            )}

            {outputTab === 'steps' && (
              <ul className={styles.stepList}>
                {transformResult.steps.map((step, index) => (
                  <li
                    key={step.id}
                    className={clsx(
                      styles.stepItem,
                      index <= highlightStep && styles.stepDone,
                      index === highlightStep && styles.stepActive,
                    )}
                  >
                    <strong>{step.label}</strong>
                    <br />
                    {step.detail}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <p className="it-demo__hint" style={{marginTop: '0.75rem', marginBottom: 0}}>
          Демо повторяет шаблон из статьи: for-each по book, value-of для title и author. В продакшене тот же
          XSLT выполняет Saxon, xsltproc или встроенный процессор платформы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default XsltTransformDemoInner;
