import React, {useMemo, useState} from 'react';
import {MetricGrid, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

function scoreSelector(sel) {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  sel.split(/(\s+|>|\+|~)/).filter(Boolean).forEach((part) => {
    if (/^[>+~]$/.test(part)) return;
    part.split(/(?=[.#\[])/).filter(Boolean).forEach((tok) => {
      if (tok.startsWith('#')) a += 1;
      else if (tok.startsWith('.') || tok.startsWith('[') || tok.startsWith(':')) b += 1;
      else if (/^[a-zA-Z]/.test(tok)) c += 1;
      else d += 1;
    });
  });
  return {a, b, c, d, total: a * 1000 + b * 100 + c * 10 + d};
}

export default function CssSpecificityCalculatorPlay() {
  const [sel, setSel] = useState('article.card:hover h1#title');

  const s = useMemo(() => scoreSelector(sel), [sel]);

  return (
    <PlayRoot title="Специфичность CSS" subtitle="(a, b, c, d) — inline > id > class > element">
      <input className="it-demo__input" value={sel} onChange={(e) => setSel(e.target.value)} spellCheck={false} />
      <MetricGrid
        items={[
          {label: 'IDs (a)', value: String(s.a)},
          {label: 'Classes (b)', value: String(s.b)},
          {label: 'Elements (c)', value: String(s.c)},
          {label: 'Score', value: `(${s.a}, ${s.b}, ${s.c}, ${s.d})`},
        ]}
      />
      <p className="it-demo__hint">:where() обнуляет специфичность; :is() берёт max из списка.</p>
    </PlayRoot>
  );
}
