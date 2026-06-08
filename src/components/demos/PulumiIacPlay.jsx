import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PULUMI_LANGUAGES, PULUMI_RESOURCES} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function PulumiIacPlayInner() {
  const [lang, setLang] = useState('ts');
  const [up, setUp] = useState(false);

  const l = PULUMI_LANGUAGES.find((x) => x.id === lang) ?? PULUMI_LANGUAGES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Pulumi: IaC на языке программирования"
        subtitle="TypeScript, Python или Go — один `pulumi up` строит граф ресурсов"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {PULUMI_LANGUAGES.map((x) => (
            <button
              key={x.id}
              type="button"
              className={clsx(toolStyles.chip, lang === x.id && toolStyles.chipActive)}
              onClick={() => setLang(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className={styles.grid2}>
          <div>
            <label className="it-demo__label">Программа инфраструктуры</label>
            <pre className={styles.mono}>{l.snippet}</pre>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={() => setUp(true)}
            >
              pulumi up
            </button>
          </div>
          <div>
            <label className="it-demo__label">Ресурсы в state</label>
            <div className={styles.panel}>
              {(up ? PULUMI_RESOURCES : []).map((r) => (
                <div key={r.id} className={styles.statRow}>
                  <span>{r.name}</span>
                  <strong>{r.status}</strong>
                </div>
              ))}
              {!up && (
                <span style={{fontSize: '0.8rem', opacity: 0.7}}>Запустите up, чтобы увидеть граф</span>
              )}
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PulumiIacPlayInner;
