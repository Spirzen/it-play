import type {AnchorHTMLAttributes, ReactNode} from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children: ReactNode;
};

/** Внутренние ссылки энциклопедии (в iframe → spirzen.ru). */
export default function KbLink({to, children, ...rest}: Props) {
  const href =
    to.startsWith('http://') || to.startsWith('https://')
      ? to
      : `https://spirzen.ru${to.startsWith('/') ? to : `/${to}`}`;

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
