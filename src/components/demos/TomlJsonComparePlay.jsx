import React, {useMemo, useState} from 'react';
import {
  CodeBlock,
  PlayRoot,
  Section,
  SplitView,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const TOML = `[database]
host = "localhost"
port = 5432

[server]
debug = true
workers = 4`;

function parseTomlSimple(text) {
  const root = {};
  let section = root;
  text.split('\n').forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const sec = t.match(/^\[(.+)\]$/);
    if (sec) {
      root[sec[1]] = root[sec[1]] ?? {};
      section = root[sec[1]];
      return;
    }
    const kv = t.match(/^(\w+)\s*=\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+$/.test(val)) val = Number(val);
      else val = val.replace(/^"|"$/g, '');
      section[kv[1]] = val;
    }
  });
  return root;
}

export default function TomlJsonComparePlay() {
  const [toml, setToml] = useState(TOML);
  const json = useMemo(() => {
    try {
      return JSON.stringify(parseTomlSimple(toml), null, 2);
    } catch (e) {
      return String(e.message);
    }
  }, [toml]);

  return (
    <PlayRoot title="TOML ↔ JSON" subtitle="Секции [name] становятся вложенными объектами">
      <SplitView
        left={
          <Section title="TOML">
            <textarea className={styles.textarea} rows={12} value={toml} onChange={(e) => setToml(e.target.value)} spellCheck={false} />
          </Section>
        }
        right={
          <Section title="JSON (эквивалент)">
            <CodeBlock>{json}</CodeBlock>
          </Section>
        }
      />
    </PlayRoot>
  );
}
