import React from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {SPIRZEN_ONLINE_TOOLS_LIST} from '@/components/shared/kb/spirzenOnlineTools';
import styles from '@/components/demos/SpirzenOnlineToolsPanel.module.css';

function SpirzenOnlineToolsPanelInner({
  title = 'Онлайн-инструменты автора',
  subtitle = 'Отдельные веб-приложения автора — html.spirzen.ru и spirzen.github.io; дополнение к встроенным демо энциклопедии',
}) {
  return (
    <DemoShell className={styles.root}>
      <DemoCard title={title} subtitle={subtitle}>
        <ul className={styles.list}>
          {SPIRZEN_ONLINE_TOOLS_LIST.map((tool) => (
            <li key={tool.id} className={styles.item}>
              <a
                className={styles.link}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tool.name}
              </a>
              <p className={styles.desc}>{tool.tagline}</p>
            </li>
          ))}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

/** Панель со ссылками на веб-приложения автора на spirzen.github.io. */
export default SpirzenOnlineToolsPanelInner;
