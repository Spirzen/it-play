import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import {
  CheckField,
  CodeBlock,
  Hint,
  PlayRoot,
  Section,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const BASE_CSS = `.card {
  padding: 1rem;
  border: 1px solid var(--demo-border);
  border-radius: 8px;
  background: var(--ifm-background-surface-color);
}
.card:has(.error) {
  border-color: color-mix(in srgb, var(--demo-error) 55%, var(--demo-border));
  background: color-mix(in srgb, var(--demo-error) 10%, var(--ifm-background-surface-color));
}
.card:has(input:focus) {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ifm-color-primary) 35%, transparent);
}`;

export default function CssHasPlay() {
  const [hasError, setHasError] = useState(true);
  const [focused, setFocused] = useState(false);

  const cardClass = useMemo(
    () =>
      clsx(
        styles.previewCard,
        hasError && styles.previewCardError,
        focused && styles.previewCardFocus,
      ),
    [hasError, focused],
  );

  return (
    <PlayRoot title="CSS :has()" subtitle="Стили родителя по содержимому потомка — без JavaScript">
      <CheckField label="Показать .error внутри карточки" checked={hasError} onChange={setHasError} />
      <Section title="Live preview">
        <div className={styles.previewFrame}>
          <div className={cardClass}>
            {hasError ? <span className={styles.statusErr}>Error!</span> : <span className={styles.statusOk}>OK</span>}
            <input
              className={styles.input}
              placeholder="focus me"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        </div>
      </Section>
      <Section title="CSS">
        <CodeBlock>{BASE_CSS}</CodeBlock>
      </Section>
      <Hint>
        <code>:has()</code> выбирает родителя, если внутри есть подходящий потомок — удобно для форм и карточек.
      </Hint>
    </PlayRoot>
  );
}
