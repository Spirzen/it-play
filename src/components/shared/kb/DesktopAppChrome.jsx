import React from 'react';
import clsx from 'clsx';
import styles from './DesktopAppChrome.module.css';

export default function DesktopAppChrome({
  title,
  accent = '#2b579a',
  menu,
  toolbar,
  status,
  children,
  className,
}) {
  return (
    <div className={clsx(styles.shell, className)} style={{'--app-accent': accent}}>
      <div className={styles.titleBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{title}</span>
      </div>
      {menu && <div className={styles.menu}>{menu}</div>}
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
      <div className={styles.body}>{children}</div>
      {status && <div className={styles.status}>{status}</div>}
    </div>
  );
}
