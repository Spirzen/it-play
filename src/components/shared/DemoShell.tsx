import type {ReactNode} from 'react';
import clsx from 'clsx';

type DemoShellProps = {
  children: ReactNode;
  className?: string;
};

type DemoCardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

export default function DemoShell({children, className}: DemoShellProps) {
  return <div className={clsx('it-demo', className)}>{children}</div>;
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
