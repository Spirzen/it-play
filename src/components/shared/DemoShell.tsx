import type {ComponentType, ElementType, ReactNode} from 'react';
import clsx from 'clsx';
import useDemoFullscreen from './useDemoFullscreen';

type DemoShellProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  fullscreenable?: boolean;
};

type DemoCardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

type FullscreenButtonProps = {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
};

export function DemoFullscreenButton({isFullscreen, onToggle, className}: FullscreenButtonProps) {
  return (
    <button
      type="button"
      className={clsx('it-demo__fullscreen-btn', className)}
      onClick={onToggle}
      title={isFullscreen ? 'Выйти из полноэкранного режима (Esc)' : 'Открыть во весь экран'}
      aria-pressed={isFullscreen}>
      {isFullscreen ? '⊡ Окно' : '⛶'}
    </button>
  );
}

export default function DemoShell({
  children,
  className,
  as: Tag = 'div',
  fullscreenable = true,
}: DemoShellProps) {
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

export function DemoCard({children, className, title, subtitle}: DemoCardProps) {
  const showHeader = title || subtitle;

  return (
    <div className={clsx('it-demo__card', className)}>
      {showHeader && (
        <div className="it-demo__header">
          <div className="it-demo__header-text">
            {title && <h4 className="it-demo__title">{title}</h4>}
            {subtitle && <p className="it-demo__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="it-demo__body">{children}</div>
    </div>
  );
}
