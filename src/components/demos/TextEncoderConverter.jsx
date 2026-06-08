import React, {useCallback, useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  ENCODING_OPTIONS,
  bytesToHex,
  convertEncoding,
} from '@/components/shared/kb/textEncoding';
import styles from '@/components/shared/kb/toolDemo.module.css';

const SAMPLE = 'Привет, мир! Hello';

function TextEncoderConverterInner() {
  const {isMobile} = useBreakpoint();
  const [inputText, setInputText] = useState('');
  const [sourceEncoding, setSourceEncoding] = useState('UTF-8');
  const [targetEncoding, setTargetEncoding] = useState('Windows-1251');
  const [outputText, setOutputText] = useState('');
  const [hexPreview, setHexPreview] = useState('');
  const [byteCount, setByteCount] = useState(0);
  const [error, setError] = useState(null);
  const {copy, isCopied} = useCopyToClipboard();

  const runConvert = useCallback(() => {
    setError(null);
    if (!inputText) {
      setOutputText('');
      setHexPreview('');
      setByteCount(0);
      return;
    }
    try {
      const {bytes, text} = convertEncoding(inputText, sourceEncoding, targetEncoding);
      setOutputText(text);
      setHexPreview(bytesToHex(bytes));
      setByteCount(bytes.length);
    } catch (err) {
      setError(err.message);
      setOutputText('');
      setHexPreview('');
      setByteCount(0);
    }
  }, [inputText, sourceEncoding, targetEncoding]);

  useEffect(() => {
    if (isMobile || !inputText) {
      return undefined;
    }
    const timer = window.setTimeout(runConvert, 400);
    return () => window.clearTimeout(timer);
  }, [inputText, sourceEncoding, targetEncoding, isMobile, runConvert]);

  const swapEncodings = () => {
    setSourceEncoding(targetEncoding);
    setTargetEncoding(sourceEncoding);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Конвертер кодировок"
        subtitle="Текст кодируется в байты исходной кодировки и декодируется целевой — как при записи и чтении файла."
      >
        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginBottom: '1rem'}}>
          <div>
            <label className="it-demo__label" htmlFor="source-enc">
              Исходная кодировка
            </label>
            <select
              id="source-enc"
              className="it-demo__select"
              value={sourceEncoding}
              onChange={(e) => setSourceEncoding(e.target.value)}
            >
              {ENCODING_OPTIONS.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="it-demo__label" htmlFor="target-enc">
              Целевая кодировка
            </label>
            <select
              id="target-enc"
              className="it-demo__select"
              value={targetEncoding}
              onChange={(e) => setTargetEncoding(e.target.value)}
            >
              {ENCODING_OPTIONS.map((enc) => (
                <option key={enc} value={enc}>
                  {enc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={swapEncodings}>
            ⇄ Поменять местами
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => setInputText(SAMPLE)}
          >
            Пример текста
          </button>
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')}>
          <div>
            <label className="it-demo__label">Вход ({sourceEncoding})</label>
            <textarea
              className={clsx('it-demo__textarea', styles.textareaMono)}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите текст…"
              rows={isMobile ? 5 : 8}
            />
          </div>
          <div className={styles.arrowCol} aria-hidden>
            →
          </div>
          <div>
            <label className="it-demo__label">Результат ({targetEncoding})</label>
            <textarea
              className={styles.outputReadonly}
              readOnly
              value={outputText}
              placeholder="Здесь появится результат…"
              rows={isMobile ? 5 : 8}
            />
            {hexPreview && (
              <p className={styles.hexLine}>
                Байты ({byteCount}): {hexPreview}
              </p>
            )}
          </div>
        </div>

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runConvert}>
            {isMobile ? 'Преобразовать' : 'Преобразовать сейчас'}
          </button>
          {outputText && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(outputText, 'out')}
            >
              {isCopied('out') ? 'Скопировано' : 'Копировать результат'}
            </button>
          )}
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        {isMobile && (
          <div className="it-demo__alert it-demo__alert--info">
            На мобильных устройствах конвертация запускается кнопкой — так экономится батарея.
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default TextEncoderConverterInner;
