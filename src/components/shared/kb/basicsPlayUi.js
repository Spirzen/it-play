import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/BasicsNewPlays.module.css';

export function scoreToneClass(score) {
  if (score >= 70) return styles.scoreValueOk;
  if (score >= 40) return styles.scoreValueMid;
  return styles.scoreValueLow;
}

export function scoreBadgeClass(score) {
  if (score >= 70) return 'it-demo__badge it-demo__badge--success';
  if (score >= 40) return 'it-demo__badge it-demo__badge--warning';
  return 'it-demo__badge it-demo__badge--error';
}

export function heatMeterClass(level) {
  if (level === 'hot') return styles.meterFillHot;
  if (level === 'warm') return styles.meterFillWarm;
  return styles.meterFillCool;
}

export function heatTextClass(level) {
  if (level === 'hot') return styles.heatHot;
  if (level === 'warm') return styles.heatWarm;
  return styles.heatCool;
}

export function readCanvasColors(canvas) {
  const root = canvas?.closest('.it-demo');
  if (!root) {
    return {
      bg: '#111827',
      wave: '#94a3b8',
      sampleOk: '#2e7d32',
      sampleBad: '#c62828',
      text: '#94a3b8',
    };
  }
  const s = getComputedStyle(root);
  return {
    bg: s.getPropertyValue('--demo-code-bg').trim() || '#111827',
    wave: s.getPropertyValue('--it-primary').trim() || '#7b68ee',
    sampleOk: s.getPropertyValue('--demo-success').trim() || '#2e7d32',
    sampleBad: s.getPropertyValue('--demo-error').trim() || '#c62828',
    text: s.getPropertyValue('--demo-muted').trim() || '#94a3b8',
  };
}

export const FPS_SEGMENT_COLORS = [
  'var(--it-primary)',
  '#7e57c2',
  '#9575cd',
  '#5c6bc0',
  '#ab47bc',
  '#7986cb',
];

export {toolStyles, styles};
