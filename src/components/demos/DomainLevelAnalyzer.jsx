import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {analyzeDomain, DOMAIN_PRESETS} from '@/components/shared/kb/domainAnalyze';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/shared/kb/articleWidgets.module.css';

const KIND_CLASS = {
  sub: styles.domainSegmentSub,
  sld: styles.domainSegmentSld,
  tld: styles.domainSegmentTld,
};

const LEVEL_BADGE = {
  subdomain: styles.levelKindSub,
  sld: styles.levelKindSld,
  tld: styles.levelKindTld,
};

function DomainLevelAnalyzerInner() {
  const {isMobile} = useBreakpoint();
  const {copy, isCopied} = useCopyToClipboard();
  const [inputUrl, setInputUrl] = useState('https://mail.google.com/mail/');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAnalyze = useCallback(() => {
    const out = analyzeDomain(inputUrl);
    if (out.error) {
      setError(out.error);
      setResult(null);
    } else {
      setError(null);
      setResult(out);
    }
  }, [inputUrl]);

  useEffect(() => {
    if (isMobile) {
      return undefined;
    }
    const timer = window.setTimeout(runAnalyze, 450);
    return () => window.clearTimeout(timer);
  }, [inputUrl, isMobile, runAnalyze]);

  const summary = useMemo(() => {
    if (!result) {
      return '';
    }
    return [
      result.original,
      ...result.levels.map((l) => `${l.name}: ${l.fullName}`),
      `Путь: ${result.path}`,
    ].join('\n');
  }, [result]);

  return (
    <DemoShell>
      <DemoCard
        title="Анализатор структуры домена"
        subtitle="Разбор URL на поддомены, SLD, TLD и путь к ресурсу."
      >
        <div className={toolStyles.chips}>
          {DOMAIN_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={toolStyles.chip}
              onClick={() => setInputUrl(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label" htmlFor="domain-input">
          URL или домен
        </label>
        <textarea
          id="domain-input"
          className={clsx('it-demo__textarea', toolStyles.textareaMono)}
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), runAnalyze())}
          placeholder="https://mail.google.com/mail/"
          rows={2}
        />

        <div className={toolStyles.toolbar} style={{marginTop: '0.75rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runAnalyze}>
            Проанализировать
          </button>
          {result && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(summary, 'domain')}
            >
              {isCopied('domain') ? 'Скопировано' : 'Копировать разбор'}
            </button>
          )}
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        {result && (
          <>
            <div className={styles.domainDiagram} aria-label="Визуальная схема домена">
              {result.segments.map((seg, i) => (
                <React.Fragment key={`${seg.label}-${i}`}>
                  {i > 0 && <span className={styles.domainDot}>.</span>}
                  <span className={clsx(styles.domainSegment, KIND_CLASS[seg.kind])}>
                    {seg.label}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="it-demo__table-wrap">
              <table className="it-demo__table">
                <thead>
                  <tr>
                    <th>Уровень</th>
                    <th>Значение</th>
                    <th>Описание</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Исходные данные</td>
                    <td className={toolStyles.valueMono}>{result.original}</td>
                    <td>Протокол: {result.protocol}</td>
                  </tr>
                  {result.levels.map((level) => (
                    <tr key={level.fullName + level.name}>
                      <td>
                        <span className={clsx(styles.levelKind, LEVEL_BADGE[level.kind])}>
                          {level.kind === 'subdomain' ? 'SUB' : level.kind === 'sld' ? 'SLD' : 'TLD'}
                        </span>
                        {level.name}
                      </td>
                      <td className={toolStyles.valueMono}>{level.fullName}</td>
                      <td>{level.description}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Путь к ресурсу</td>
                    <td className={toolStyles.valueMono}>{result.path}</td>
                    <td>Расположение страницы или файла на сервере</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem'}}>
          <strong>Иерархия:</strong> TLD — зона (.ru), SLD — имя сайта (yandex), поддомены слева (mail).
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DomainLevelAnalyzerInner;
