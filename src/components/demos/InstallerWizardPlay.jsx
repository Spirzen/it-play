import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/InstallerWizardPlay.module.css';

const STEPS = {
  welcome: 'welcome',
  path: 'path',
  progress: 'progress',
  finish: 'finish',
};

const PROGRESS_PHASES = [
  {pct: 8, label: 'Подготовка к установке…'},
  {pct: 22, label: 'Создание папок…'},
  {pct: 48, label: 'Копирование файлов…'},
  {pct: 71, label: 'Регистрация компонентов…'},
  {pct: 88, label: 'Создание ярлыков…'},
  {pct: 100, label: 'Завершение…'},
];

const BROWSE_PRESETS = [
  'C:\\Program Files\\My Demo App',
  'C:\\Program Files (x86)\\My Demo App',
  'D:\\Apps\\My Demo App',
];

function defaultInstallPath(productName) {
  const safe = (productName || 'My Demo App').replace(/[<>:"/\\|?*]/g, '').trim() || 'My Demo App';
  return `C:\\Program Files\\${safe}`;
}

function InstallerWizardPlayInner({
  appName = 'Пример установщика',
  productName = 'My Demo App',
  welcomeText = 'Здесь пишется информация о программе, которая будет установлена.',
  pathDescription = 'Укажите папку, в которую будет установлена программа.',
  defaultPath,
  extraOptionsLabel = 'Внимательно — здесь могут быть дополнительные опции',
  cardTitle = 'Мастер установки (демо)',
  cardSubtitle = 'Типичные шаги Setup.exe: приветствие → путь → прогресс → готово',
  showCard = true,
}) {
  const initialPath = useMemo(
    () => defaultPath || defaultInstallPath(productName),
    [defaultPath, productName],
  );

  const [step, setStep] = useState(STEPS.welcome);
  const [installPath, setInstallPath] = useState(initialPath);
  const [extraOptions, setExtraOptions] = useState(false);
  const [runAfterInstall, setRunAfterInstall] = useState(true);
  const [desktopShortcut, setDesktopShortcut] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState(PROGRESS_PHASES[0].label);
  const [browseOpen, setBrowseOpen] = useState(false);

  const resetWizard = useCallback(() => {
    setStep(STEPS.welcome);
    setInstallPath(initialPath);
    setExtraOptions(false);
    setRunAfterInstall(true);
    setDesktopShortcut(true);
    setProgress(0);
    setProgressLabel(PROGRESS_PHASES[0].label);
    setBrowseOpen(false);
  }, [initialPath]);

  const handleCancel = () => resetWizard();

  useEffect(() => {
    if (step !== STEPS.progress) return undefined;

    let phaseIndex = 0;
    setProgress(PROGRESS_PHASES[0].pct);
    setProgressLabel(PROGRESS_PHASES[0].label);

    const timer = window.setInterval(() => {
      phaseIndex += 1;
      if (phaseIndex >= PROGRESS_PHASES.length) {
        window.clearInterval(timer);
        setStep(STEPS.finish);
        return;
      }
      const phase = PROGRESS_PHASES[phaseIndex];
      setProgress(phase.pct);
      setProgressLabel(phase.label);
    }, 520);

    return () => window.clearInterval(timer);
  }, [step]);

  const titlebarLabel =
    step === STEPS.finish
      ? `${productName} — установка завершена`
      : `${appName} — мастер установки`;

  const wizard = (
    <div className={styles.dialog} role="dialog" aria-label={titlebarLabel}>
      <div className={styles.titlebar}>
        <span className={styles.titleIcon} aria-hidden>
          📦
        </span>
        <span className={styles.titleText}>{titlebarLabel}</span>
        <button
          type="button"
          className={styles.titleClose}
          aria-label="Отмена установки"
          onClick={handleCancel}
        >
          ×
        </button>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar} aria-hidden>
          <span className={styles.sidebarBrand}>Setup</span>
          <span className={styles.sidebarCaption}>
            {step === STEPS.welcome && 'Добро пожаловать'}
            {step === STEPS.path && 'Выбор папки'}
            {step === STEPS.progress && 'Установка'}
            {step === STEPS.finish && 'Готово'}
          </span>
        </aside>

        <div className={styles.content}>
          {step === STEPS.welcome && (
            <>
              <h3 className={styles.heading}>Добро пожаловать</h3>
              <p className={styles.text}>{welcomeText}</p>
              <p className={styles.text}>
                Мастер установит <strong>{productName}</strong> на ваш компьютер. Нажмите «Далее», чтобы
                продолжить, или «Отмена», чтобы выйти.
              </p>
            </>
          )}

          {step === STEPS.path && (
            <>
              <h3 className={styles.heading}>Выбор папки установки</h3>
              <p className={styles.text}>{pathDescription}</p>
              <div className={styles.pathRow}>
                <input
                  type="text"
                  className={styles.pathInput}
                  value={installPath}
                  onChange={(e) => setInstallPath(e.target.value)}
                  aria-label="Папка установки"
                />
                <button
                  type="button"
                  className={styles.pathBrowse}
                  onClick={() => setBrowseOpen(true)}
                >
                  Обзор…
                </button>
              </div>
              <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={extraOptions}
                    onChange={(e) => setExtraOptions(e.target.checked)}
                  />
                  <span>{extraOptionsLabel}</span>
                </label>
              </div>
            </>
          )}

          {step === STEPS.progress && (
            <>
              <h3 className={styles.heading}>Установка</h3>
              <p className={styles.text}>
                Подождите, пока программа будет установлена в{' '}
                <code style={{fontSize: '0.72rem'}}>{installPath}</code>
                {extraOptions ? ' (с дополнительными компонентами)' : ''}.
              </p>
              <div className={styles.progressBlock}>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Ход установки"
                >
                  <div className={styles.progressFill} style={{width: `${progress}%`}} />
                </div>
                <p className={styles.progressStatus}>{progressLabel}</p>
              </div>
            </>
          )}

          {step === STEPS.finish && (
            <>
              <h3 className={styles.heading}>Установка завершена</h3>
              <p className={styles.text}>
                Программа <strong>{productName}</strong> установлена. Снимите галочки ниже, если не нужны
                действия после выхода из мастера.
              </p>
              <div className={styles.finishOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={runAfterInstall}
                    onChange={(e) => setRunAfterInstall(e.target.checked)}
                  />
                  <span>Запустить программу</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={desktopShortcut}
                    onChange={(e) => setDesktopShortcut(e.target.checked)}
                  />
                  <span>Добавить ярлык на рабочий стол</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {step === STEPS.path && (
          <button type="button" className={styles.winBtn} onClick={() => setStep(STEPS.welcome)}>
            &lt; Назад
          </button>
        )}
        {step === STEPS.welcome && (
          <>
            <button type="button" className={clsx(styles.winBtn, styles.winBtnPrimary)} onClick={() => setStep(STEPS.path)}>
              Далее &gt;
            </button>
            <button type="button" className={styles.winBtn} onClick={handleCancel}>
              Отмена
            </button>
          </>
        )}
        {step === STEPS.path && (
          <>
            <button type="button" className={clsx(styles.winBtn, styles.winBtnPrimary)} onClick={() => setStep(STEPS.progress)}>
              Далее &gt;
            </button>
            <button type="button" className={styles.winBtn} onClick={handleCancel}>
              Отмена
            </button>
          </>
        )}
        {step === STEPS.progress && (
          <button type="button" className={styles.winBtn} disabled>
            Отмена
          </button>
        )}
        {step === STEPS.finish && (
          <button type="button" className={clsx(styles.winBtn, styles.winBtnPrimary)} onClick={resetWizard}>
            Готово
          </button>
        )}
      </div>

      {browseOpen && (
        <div
          className={styles.browseOverlay}
          role="presentation"
          onClick={() => setBrowseOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setBrowseOpen(false)}
        >
          <div
            className={styles.browsePanel}
            role="dialog"
            aria-label="Выбор папки"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.browseTitle}>Выберите папку установки</p>
            <ul className={styles.browseList}>
              {BROWSE_PRESETS.map((preset) => (
                <li key={preset}>
                  <button
                    type="button"
                    onClick={() => {
                      setInstallPath(preset);
                      setBrowseOpen(false);
                    }}
                  >
                    {preset}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.browseActions}>
              <button type="button" className={styles.winBtn} onClick={() => setBrowseOpen(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DemoShell className={styles.root}>
      {showCard ? (
        <DemoCard title={cardTitle} subtitle={cardSubtitle}>
          {wizard}
          <p className={styles.hint}>Демонстрация без записи на диск. «Готово» сбрасывает мастер в начало.</p>
        </DemoCard>
      ) : (
        wizard
      )}
    </DemoShell>
  );
}

/**
 * Интерактивный мастер установки (Setup wizard) для статей про дистрибуцию и установку ПО.
 *
 * @param {string} [appName] — заголовок мастера
 * @param {string} [productName] — имя продукта в текстах и пути по умолчанию
 * @param {string} [welcomeText]
 * @param {string} [pathDescription]
 * @param {string} [defaultPath]
 * @param {string} [extraOptionsLabel]
 * @param {string} [cardTitle]
 * @param {string} [cardSubtitle]
 * @param {boolean} [showCard]
 */
export default InstallerWizardPlayInner;
