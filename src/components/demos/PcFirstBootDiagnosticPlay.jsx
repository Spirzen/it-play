import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SYMPTOMS, checksForSymptom} from '@/components/shared/kb/pcBootDiagnosticEngine';
import styles from '@/components/demos/PcFirstBootDiagnosticPlay.module.css';

function PcFirstBootDiagnosticPlayInner() {
  const [symptomId, setSymptomId] = useState('spin-no-video');
  const symptom = SYMPTOMS.find((s) => s.id === symptomId) ?? SYMPTOMS[1];
  const checks = useMemo(() => checksForSymptom(symptomId), [symptomId]);
  const [doneChecks, setDoneChecks] = useState({});

  const toggleCheck = (title, stepIdx) => {
    const key = `${title}:${stepIdx}`;
    setDoneChecks((prev) => ({...prev, [key]: !prev[key]}));
  };

  const resetChecks = () => setDoneChecks({});

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Диагностика первого запуска"
        subtitle="Выберите симптом — получите чек-лист проверок по подсистемам"
      >
        <div className={styles.symptomGrid}>
          {SYMPTOMS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.symptomBtn, symptomId === s.id && styles.symptomActive)}
              onClick={() => {
                setSymptomId(s.id);
                resetChecks();
              }}
            >
              <span className={styles.symptomIcon}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.statusPanel}>
          <div className={styles.statusRow}>
            <span>Вентиляторы</span>
            <strong className={symptom.fans ? styles.ok : styles.bad}>
              {symptom.fans ? 'крутятся' : 'стоят'}
            </strong>
          </div>
          <div className={styles.statusRow}>
            <span>Экран</span>
            <strong className={symptom.display ? styles.ok : styles.bad}>
              {symptom.display ? 'есть BIOS' : 'чёрный'}
            </strong>
          </div>
          <div className={styles.ledRow}>
            {['cpu', 'dram', 'vga', 'boot'].map((led) => (
              <span
                key={led}
                className={clsx(
                  styles.led,
                  symptom.leds.includes(led) && styles.ledOn,
                  led === 'dram' && styles.ledDram,
                  led === 'vga' && styles.ledVga,
                )}
              >
                {led.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {symptomId === 'post-ok' ? (
          <p className={styles.success}>
            POST пройден — можно устанавливать ОС. "No boot device" без флешки/диска — норма.
          </p>
        ) : (
          checks.map((block) => (
            <div key={block.title} className={styles.checkBlock}>
              <h4 className={styles.checkTitle}>{block.title}</h4>
              <ul className={styles.checkList}>
                {block.steps.map((step, i) => {
                  const key = `${block.title}:${i}`;
                  return (
                    <li key={key}>
                      <label className={styles.checkLabel}>
                        <input
                          type="checkbox"
                          checked={Boolean(doneChecks[key])}
                          onChange={() => toggleCheck(block.title, i)}
                        />
                        {step}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}

        <p className={styles.tip}>
          Если не помогло — минимальная конфигурация (одна RAM, без GPU при iGPU) и повторная сборка "на
          столе".
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PcFirstBootDiagnosticPlayInner;
