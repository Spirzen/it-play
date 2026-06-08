import React, {useCallback, useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import styles from '@/components/demos/QrCodeGenerator.module.css';

const EC_LEVELS = [
  {id: 'L', label: 'L — ~7%', hint: 'Минимальная избыточность, больше данных'},
  {id: 'M', label: 'M — ~15%', hint: 'Баланс (часто по умолчанию в сервисах)'},
  {id: 'Q', label: 'Q — ~25%', hint: 'Устойчивее к царапинам и бликам'},
  {id: 'H', label: 'H — ~30%', hint: 'Максимум кодов Рида–Соломона'},
];

const PRESETS = [
  {
    id: 'url',
    label: 'Ссылка',
    value: 'https://it-universe.ru/encyclopedia/intro',
  },
  {
    id: 'text',
    label: 'Текст',
    value: 'Кодирование — перепаковка информации в другой формат.',
  },
  {
    id: 'tel',
    label: 'Телефон',
    value: 'tel:+79001234567',
  },
];

const MAX_HINT = 2953;

function QrCodeGeneratorInner() {
  const {isMobile} = useBreakpoint();
  const [text, setText] = useState(PRESETS[0].value);
  const [ecLevel, setEcLevel] = useState('M');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    const payload = text.trim();
    if (!payload) {
      setDataUrl('');
      setError(null);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: ecLevel,
        margin: 2,
        width: isMobile ? 220 : 280,
        color: {dark: '#111827', light: '#ffffff'},
      });
      setDataUrl(url);
    } catch (err) {
      setDataUrl('');
      setError(err?.message || 'Не удалось построить QR-код');
    } finally {
      setGenerating(false);
    }
  }, [text, ecLevel, isMobile]);

  useEffect(() => {
    const timer = window.setTimeout(generate, 350);
    return () => window.clearTimeout(timer);
  }, [generate]);

  const downloadPng = () => {
    if (!dataUrl) {
      return;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  const charCount = text.length;
  const nearLimit = charCount > MAX_HINT * 0.85;

  return (
    <DemoShell>
      <DemoCard
        title="Генератор QR-кода"
        subtitle="Текст или ссылка кодируются в двумерный узор; уровень L–H задаёт долю избыточности (коды Рида–Соломона), как в стандарте QR."
      >
        <div className={styles.toolbar}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              onClick={() => setText(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label" htmlFor="qr-payload">
          Сообщение для кодирования
        </label>
        <textarea
          id="qr-payload"
          className="it-demo__textarea"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="URL, текст, tel:+7…"
          spellCheck={false}
        />
        <p className={clsx(styles.meta, nearLimit && styles.metaWarn)}>
          Символов: {charCount}
          {nearLimit && ' — при большом объёме выберите уровень L и короткий текст'}
        </p>

        <fieldset className={styles.ecFieldset}>
          <legend className="it-demo__label">Коррекция ошибок (Reed–Solomon)</legend>
          <div className={styles.ecGrid}>
            {EC_LEVELS.map((level) => (
              <label key={level.id} className={styles.ecOption}>
                <input
                  type="radio"
                  name="qr-ec"
                  value={level.id}
                  checked={ecLevel === level.id}
                  onChange={() => setEcLevel(level.id)}
                />
                <span className={styles.ecLabel}>{level.label}</span>
                <span className={styles.ecHint}>{level.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.previewWrap}>
          {dataUrl ? (
            <img src={dataUrl} alt="Сгенерированный QR-код" className={styles.qrImage} width={280} height={280} />
          ) : (
            <div className={styles.placeholder}>
              {text.trim() ? (generating ? 'Построение…' : 'Введите текст') : 'Введите данные для кодирования'}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={downloadPng}
            disabled={!dataUrl}
          >
            Скачать PNG
          </button>
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        <p className={styles.footnote}>
          Сканер восстанавливает исходное сообщение по геометрии модулей; при повреждении до ~30% (уровень H) данные
          часто читаются благодаря избыточности, описанной выше.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default QrCodeGeneratorInner;
