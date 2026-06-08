import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEB_INSTALL_STEPS, DEB_LAYERS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function DebPackageExplorerPlayInner() {
  const [layerId, setLayerId] = useState('deb');
  const [installIdx, setInstallIdx] = useState(-1);

  const control = DEB_LAYERS.find((l) => l.id === 'control');
  const data = DEB_LAYERS.find((l) => l.id === 'data');

  const runInstall = () => {
    setInstallIdx(0);
    DEB_INSTALL_STEPS.forEach((_, i) => {
      setTimeout(() => setInstallIdx(i), i * 700);
    });
    setTimeout(() => setInstallIdx(-1), DEB_INSTALL_STEPS.length * 700 + 400);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Структура .deb и установка"
        subtitle="ar-архив: control + data; dpkg выполняет скрипты жизненного цикла"
      >
        <div className={styles.chips}>
          {DEB_LAYERS.filter((l) => l.id !== 'control' && l.id !== 'data').map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.chip, layerId === l.id && styles.chipActive)}
              onClick={() => setLayerId(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            className={clsx(styles.chip, layerId === 'control' && styles.chipActive)}
            onClick={() => setLayerId('control')}
          >
            control.tar.gz
          </button>
          <button
            type="button"
            className={clsx(styles.chip, layerId === 'data' && styles.chipActive)}
            onClick={() => setLayerId('data')}
          >
            data.tar.xz
          </button>
        </div>

        <div className={styles.debTree}>
          {layerId === 'deb' && (
            <ul>
              <li>
                <strong>debian-binary</strong> → "2.0"
              </li>
              <li>
                <strong>control.tar.gz</strong> — метаданные, скрипты
              </li>
              <li>
                <strong>data.tar.xz</strong> — файлы в FHS (/usr, /etc)
              </li>
            </ul>
          )}
          {layerId === 'control' && control && (
            <ul>
              {control.files.map((f) => (
                <li key={f}>
                  <code>{f}</code>
                  {f === 'control' && ' — имя, версия, Depends'}
                  {f === 'postinst' && ' — после установки'}
                </li>
              ))}
            </ul>
          )}
          {layerId === 'data' && data && (
            <ul>
              {data.paths.map((p) => (
                <li key={p}>
                  <code>{p}</code>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.flowSteps} style={{marginTop: '0.75rem'}}>
          {DEB_INSTALL_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.flowStep, installIdx === i && styles.flowStepActive)}
              onClick={() => setInstallIdx(i)}
            >
              {s.title}
            </button>
          ))}
        </div>
        {installIdx >= 0 && (
          <pre className={styles.mono}>{DEB_INSTALL_STEPS[installIdx].cmd}</pre>
        )}

        <div className={styles.row}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runInstall}>
            Симуляция dpkg -i
          </button>
          <span className="it-demo__hint" style={{margin: 0}}>
            apt install дополнительно тянет Depends из репозитория
          </span>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DebPackageExplorerPlayInner;
