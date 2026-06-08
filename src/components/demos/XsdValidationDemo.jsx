import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  CATALOG_XSD,
  CATALOG_XML_VALID,
  CATALOG_XML_NO_ID,
  CATALOG_XML_WRONG_ROOT,
  CATALOG_XML_MALFORMED,
  parseXml,
  validateCatalogXsd,
} from '@/components/shared/kb/xmlDemoShared';
import styles from '@/components/demos/XsdValidationDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const PRESETS = [
  {id: 'valid', label: 'Валидный catalog', xml: CATALOG_XML_VALID},
  {id: 'no-id', label: 'Без id', xml: CATALOG_XML_NO_ID},
  {id: 'wrong-root', label: 'Неверный корень', xml: CATALOG_XML_WRONG_ROOT},
  {id: 'malformed', label: 'Синтаксическая ошибка', xml: CATALOG_XML_MALFORMED},
];

function XsdValidationDemoInner() {
  const {isMobile} = useBreakpoint();
  const [xmlInput, setXmlInput] = useState(CATALOG_XML_VALID);
  const [activePreset, setActivePreset] = useState('valid');
  const {copy, isCopied} = useCopyToClipboard();

  const result = useMemo(() => {
    const {doc, error} = parseXml(xmlInput);
    if (error) {
      return {
        valid: false,
        parseError: error,
        issues: [{rule: 'well-formed XML', ok: false, message: error}],
      };
    }
    return {...validateCatalogXsd(doc), parseError: null};
  }, [xmlInput]);

  const runValidate = useCallback(() => {
    /* результат пересчитывается в useMemo */
  }, []);

  useEffect(() => {
    if (isMobile || !xmlInput) {
      return undefined;
    }
    const timer = window.setTimeout(runValidate, 350);
    return () => window.clearTimeout(timer);
  }, [xmlInput, isMobile, runValidate]);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setXmlInput(preset.xml);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Валидация XML по XSD"
        subtitle="Схема задаёт допустимую структуру; процессор сравнивает документ с правилами и сообщает о нарушениях."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {PRESETS.map((preset) => (
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
            <label className="it-demo__label">XSD-схема (catalog)</label>
            <pre className={styles.schemaBlock}>{CATALOG_XSD}</pre>
          </div>
          <div>
            <label className="it-demo__label">XML-документ</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              value={xmlInput}
              onChange={(e) => {
                setActivePreset('');
                setXmlInput(e.target.value);
              }}
              rows={isMobile ? 10 : 12}
              spellCheck={false}
            />
          </div>
        </div>

        <div className={toolStyles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runValidate}>
            Проверить по схеме
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => copy(xmlInput, 'xml')}
          >
            {isCopied('xml') ? 'Скопировано' : 'Копировать XML'}
          </button>
        </div>

        <div
          className={clsx(
            styles.statusBanner,
            result.parseError || !result.valid ? styles.statusInvalid : styles.statusValid,
          )}
        >
          {result.parseError
            ? 'Документ не well-formed — XSD-валидация невозможна.'
            : result.valid
              ? 'Документ соответствует схеме catalog.'
              : 'Документ не прошёл валидацию по XSD.'}
        </div>

        <ul className={styles.issueList}>
          {result.issues.map((issue, index) => (
            <li
              key={`${issue.rule}-${index}`}
              className={clsx(styles.issueItem, issue.ok ? styles.issueOk : styles.issueFail)}
            >
              <span className={styles.issueIcon} aria-hidden>
                {issue.ok ? '✓' : '✗'}
              </span>
              <span>
                <span className={styles.issueRule}>{issue.rule}</span>
                {issue.message}
              </span>
            </li>
          ))}
        </ul>

        <p className="it-demo__hint" style={{marginTop: '0.75rem', marginBottom: 0}}>
          В продакшене XSD проверяет специализированный процессор (libxml2, Xerces, Saxon). Здесь — те же
          правила схемы catalog из статьи, реализованные для наглядности в браузере.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default XsdValidationDemoInner;
