import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEVOPS_TOOLS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function DevOpsToolsStackPlayInner() {
  const [active, setActive] = useState(DEVOPS_TOOLS[0].id);
  const cat = DEVOPS_TOOLS.find((t) => t.id === active) ?? DEVOPS_TOOLS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Стек автоматизации DevOps"
        subtitle="IaC, CI/CD, конфигурация, наблюдаемость и оркестрация — выберите класс инструментов"
      >
        <div className={styles.chips}>
          {DEVOPS_TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.chip, active === t.id && styles.chipActive)}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.panel}>
          <p style={{margin: '0 0 0.5rem', fontSize: '0.88rem'}}>{cat.desc}</p>
          <div className={styles.chips}>
            {cat.tools.map((tool) => (
              <span key={tool} className={styles.chip} style={{cursor: 'default'}}>
                {tool}
              </span>
            ))}
          </div>
        </div>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          В зрелом конвейере классы связаны: Terraform создаёт среду → Ansible настраивает → GitLab CI
          собирает → Kubernetes разворачивает → Prometheus следит.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DevOpsToolsStackPlayInner;
