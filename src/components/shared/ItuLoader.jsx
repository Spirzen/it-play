import React from 'react';

export default function ItuLoader({
  label = 'Загрузка…',
  title = 'Вселенная IT',
  compact = false,
  variant,
  className = '',
  style,
}) {
  const classes = [
    'itu-loader-host',
    variant === 'overlay' ? 'itu-loader-host--overlay' : '',
    variant === 'page' ? 'itu-loader-host--page' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} role="status" aria-live="polite">
      <div className="itu-loader">
        <div className="itu-loader__stage">
          <div className="itu-loader__orbs" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="itu-loader__book">
            <svg className="itu-loader__book-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 75" aria-hidden="true">
              <rect x="2.5" y="2.5" width="121" height="70" rx="7.5" fill="#fff" stroke="var(--itu-loader-accent, #7b68ee)" strokeWidth="5" />
              <line x1="63.5" x2="63.5" y2="75" stroke="var(--itu-loader-accent, #7b68ee)" strokeWidth="5" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#9370db" d="M25 20H50" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#9370db" d="M101 20H76" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#b19cd9" d="M16 30L50 30" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#b19cd9" d="M110 30L76 30" />
            </svg>
            <svg className="itu-loader__book-page" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 75" aria-hidden="true">
              <path fill="#ffffffb8" stroke="var(--itu-loader-accent, #7b68ee)" strokeWidth="5" d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#9370db" d="M40 20H15" />
              <path strokeLinecap="round" strokeWidth="4" stroke="#b19cd9" d="M49 30L15 30" />
            </svg>
          </div>
        </div>
        {compact ? (
          <p className="itu-loader__label">{label}</p>
        ) : (
          <p className="itu-loader__label">
            <strong>{title}</strong>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
