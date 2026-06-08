import React from 'react';
import clsx from 'clsx';
import useDemoFullscreen from './useDemoFullscreen';

/** Кнопка "во весь экран" для DemoShell и DemoCard. */
export function DemoFullscreenButton({isFullscreen, onToggle, className}) {
  return (
    <button
      type="button"
      className={clsx('it-demo__fullscreen-btn', className)}
      onClick={onToggle}
      title={isFullscreen ? 'Выйти из полноэкранного режима (Esc)' : 'Открыть во весь экран'}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? '⊡ Окно' : '⛶'}
    </button>
  );
}

/** Обёртка для интерактивных демо — единые отступы, тема, адаптивность. */
export default function DemoShell({
  children,
  className,
  as: Tag = 'div',
  fullscreenable = true,
}) {
  const {isFullscreen, toggleFullscreen, fullscreenClass} = useDemoFullscreen();

  return (
    <Tag className={clsx('it-demo', fullscreenClass, className)}>
      {fullscreenable && (
        <DemoFullscreenButton
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
          className="it-demo__fullscreen-btn--shell"
        />
      )}
      {children}
    </Tag>
  );
}

export function DemoCard({
  children,
  className,
  title,
  subtitle,
  /** Кнопка на карточке; по умолчанию полноэкран — на DemoShell. */
  fullscreenable = false,
}) {
  const {isFullscreen, toggleFullscreen, fullscreenClass} = useDemoFullscreen();
  const showHeader = title || subtitle || fullscreenable;

  return (
    <div className={clsx('it-demo__card', fullscreenClass, className)}>
      {showHeader && (
        <div className="it-demo__header">
          <div className="it-demo__header-text">
            {title && <h4 className="it-demo__title">{title}</h4>}
            {subtitle && <p className="it-demo__subtitle">{subtitle}</p>}
          </div>
          {fullscreenable && (
            <DemoFullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          )}
        </div>
      )}
      <div className="it-demo__body">{children}</div>
    </div>
  );
}
