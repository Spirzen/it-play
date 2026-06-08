import React, {useMemo} from 'react';
import clsx from 'clsx';
import {getTechIconEntry, getTechMonogram} from '@/data/techIconRegistry';
import styles from '@/components/demos/TechIcon.module.css';

const SIZE_MAP = {
  sm: 22,
  md: 28,
  lg: 34,
};

/**
 * @param {{
 *   techId: string;
 *   variant?: 'badge' | 'mono' | 'inline';
 *   size?: 'sm' | 'md' | 'lg' | number;
 *   className?: string;
 *   accent?: string;
 *   title?: string;
 * }} props
 */
export default function TechIcon({
  techId,
  variant = 'badge',
  size = 'md',
  className,
  accent,
  title,
}) {
  const entry = getTechIconEntry(techId);
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] ?? SIZE_MAP.md);

  const brandColor = useMemo(() => {
    if (accent) return accent;
    const hex = entry?.icon?.hex;
    return hex ? `#${hex}` : undefined;
  }, [accent, entry]);

  if (!entry) return null;

  const ariaLabel = title ?? entry.label ?? techId;
  const monogram = getTechMonogram(entry);
  const isEmojiMonogram = /\p{Extended_Pictographic}/u.test(monogram);

  if (entry.icon) {
    const fill =
      variant === 'mono'
        ? 'currentColor'
        : variant === 'badge'
          ? '#ffffff'
          : `#${entry.icon.hex}`;

    const svg = (
      <svg
        className={variant === 'badge' ? styles.svg : styles.monoSvg}
        role="img"
        aria-label={ariaLabel}
        width={px}
        height={px}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={entry.icon.path} fill={fill} />
      </svg>
    );

    if (variant === 'badge') {
      return (
        <span
          className={clsx(
            styles.badge,
            styles.badgeBrand,
            size === 'sm' && styles.badgeSm,
            size === 'md' && styles.badgeMd,
            size === 'lg' && styles.badgeLg,
            className,
          )}
          style={brandColor ? {background: brandColor} : undefined}
          aria-hidden={title ? undefined : true}
          title={title}
        >
          {svg}
        </span>
      );
    }

    return (
      <span className={clsx(styles.mono, className)} title={title}>
        {svg}
      </span>
    );
  }

  if (variant === 'badge') {
    return (
      <span
        className={clsx(
          styles.badge,
          styles.badgeMuted,
          size === 'sm' && styles.badgeSm,
          size === 'md' && styles.badgeMd,
          size === 'lg' && styles.badgeLg,
          monogram.length > 3 && styles.badgeMonogramWide,
          isEmojiMonogram && styles.badgeEmoji,
          className,
        )}
        aria-hidden={title ? undefined : true}
        title={title ?? entry.label}
      >
        {monogram}
      </span>
    );
  }

  return (
    <span className={clsx(styles.mono, styles.monoLabel, className)} title={title}>
      {monogram}
    </span>
  );
}
