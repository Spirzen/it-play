/**
 * Токены стилей для демо с inline-стилями — привязка к теме Docusaurus.
 */

export const colors = {
  surface: 'var(--ifm-card-background-color)',
  background: 'var(--ifm-background-color)',
  backgroundMuted: 'var(--ifm-background-surface-color)',
  content: 'var(--ifm-color-content)',
  muted: 'var(--ifm-color-content-secondary)',
  primary: 'var(--ifm-color-primary)',
  primaryDark: 'var(--ifm-color-primary-dark)',
  border: 'var(--ifm-color-emphasis-300)',
  codeBg: 'var(--ifm-code-background)',
  codeFg: 'var(--ifm-pre-color)',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#c62828',
};

export function demoContainer(isMobile = false) {
  return {
    fontFamily: 'var(--ifm-font-family-base)',
    backgroundColor: colors.surface,
    color: colors.content,
    border: `1px solid ${colors.border}`,
    borderRadius: 'var(--ifm-card-border-radius, 12px)',
    boxShadow: 'var(--ifm-global-shadow-lw)',
    padding: isMobile ? '12px' : '20px',
    margin: isMobile ? '12px 0' : '20px 0',
    maxWidth: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };
}

export function demoPanel() {
  return {
    backgroundColor: colors.backgroundMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
  };
}

export function demoTerminal() {
  return {
    backgroundColor: colors.codeBg,
    color: colors.codeFg,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
    lineHeight: 1.55,
    overflowX: 'auto',
    maxWidth: '100%',
  };
}

export function primaryButton(disabled = false) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    lineHeight: 1.25,
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    backgroundColor: 'var(--ifm-button-background-color)',
    color: 'var(--ifm-button-color)',
    transition: 'background-color 0.2s ease, transform 0.15s ease',
  };
}

export function secondaryButton() {
  return {
    ...primaryButton(),
    backgroundColor: colors.backgroundMuted,
    color: colors.content,
    border: `1px solid ${colors.border}`,
  };
}

export function demoInput() {
  return {
    width: '100%',
    maxWidth: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    color: colors.content,
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
  };
}

export function alertBox(variant = 'info') {
  const borders = {
    info: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
  return {
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    borderLeft: `4px solid ${borders[variant] || borders.info}`,
    backgroundColor: colors.backgroundMuted,
    fontSize: '0.875rem',
    lineHeight: 1.55,
    margin: '0.75rem 0',
    color: colors.content,
  };
}

/** Подсветка активной строки кода в демо */
export function codeLineHighlight(active) {
  return {
    padding: '0.25rem 0.5rem',
    margin: '0.15rem 0',
    borderRadius: '4px',
    transition: 'background-color 0.25s ease',
    backgroundColor: active ? 'var(--demo-highlight, rgba(123, 104, 238, 0.2))' : 'transparent',
  };
}
