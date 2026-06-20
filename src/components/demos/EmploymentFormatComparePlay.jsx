import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {EMPLOYMENT_FORMATS} from '@/components/shared/kb/careerInteractiveEngines';
import {toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

function EmploymentFormatComparePlayInner() {
  const [formatId, setFormatId] = useState('tk');
  const fmt = EMPLOYMENT_FORMATS.find((f) => f.id === formatId) ?? EMPLOYMENT_FORMATS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Сравнение форматов занятости"
        subtitle="ТК, ГПХ и самозанятость — гарантии, гибкость и налоги"
      >
        <div className={toolStyles.chips}>
          {EMPLOYMENT_FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(toolStyles.chip, formatId === f.id && toolStyles.chipActive)}
              onClick={() => setFormatId(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Критерий</th>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <th key={f.id} className={f.id === formatId ? styles.colActive : undefined}>
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Отпуск</td>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <td key={f.id} className={f.id === formatId ? styles.colActive : undefined}>
                    <span className={f.vacation ? styles.checkYes : styles.checkNo}>{f.vacation ? '✓' : '—'}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Больничный</td>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <td key={f.id} className={f.id === formatId ? styles.colActive : undefined}>
                    <span className={f.sick ? styles.checkYes : styles.checkNo}>{f.sick ? '✓' : '—'}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Пенсионные взносы</td>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <td key={f.id} className={f.id === formatId ? styles.colActive : undefined}>
                    <span className={f.pension ? styles.checkYes : styles.checkNo}>{f.pension ? '✓' : '—'}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Стабильность</td>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <td key={f.id} className={f.id === formatId ? styles.colActive : undefined}>{f.stability}%</td>
                ))}
              </tr>
              <tr>
                <td>Гибкость</td>
                {EMPLOYMENT_FORMATS.map((f) => (
                  <td key={f.id} className={f.id === formatId ? styles.colActive : undefined}>{f.flexibility}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.panelAccent} style={{marginTop: '0.65rem'}}>
          <strong>{fmt.label}</strong>
          <p className="it-demo__hint" style={{margin: '0.35rem 0 0'}}>{fmt.taxNote}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default EmploymentFormatComparePlayInner;
