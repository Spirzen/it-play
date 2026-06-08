import React from 'react';
import clsx from 'clsx';
import styles from './flowTrack.module.css';

/** Линия передачи пакета между узлами (для демо взаимодействия). */
export function FlowTrack({
  active,
  reverse,
  packetTick,
  durationMs,
  color,
  paused,
  waiting,
}) {
  return (
    <div className={styles.track}>
      <div className={styles.trackInner}>
        <div
          className={clsx(styles.trackLine, {
            [styles.trackLineActive]: active && !waiting,
            [styles.trackLineWaiting]: active && waiting,
          })}
        >
          {active && (
            <span
              key={packetTick}
              className={clsx(styles.packet, styles.packetVisible, {
                [styles.packetReverse]: reverse,
                [styles.packetPaused]: paused,
              })}
              style={{
                background: color,
                '--packet-duration': `${durationMs}ms`,
              }}
              aria-hidden
            />
          )}
        </div>
        <span className={styles.trackArrow} aria-hidden>
          {reverse ? '←' : '→'}
        </span>
      </div>
    </div>
  );
}
