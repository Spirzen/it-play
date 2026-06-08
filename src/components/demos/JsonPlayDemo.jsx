import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {JSON_PRESETS, flattenJsonTree, parseJson} from '@/components/shared/kb/jsonDemoEngine';
import styles from '@/components/demos/JsonPlayDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function JsonPlayDemoInner() {
  const {isMobile} = useBreakpoint();
  const {copy, isCopied} = useCopyToClipboard();
  const [input, setInput] = useState(JSON_PRESETS[0].json);
  const [activePreset, setActivePreset] = useState(JSON_PRESETS[0].id);

  const parsed = useMemo(() => parseJson(input), [input]);
  const tree = useMemo(
    () => (parsed.value != null ? flattenJsonTree(parsed.value) : []),
    [parsed.value],
  );

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setInput(preset.json);
  };

  return (
    <DemoShell>
      <DemoCard
        title="JSON: разбор и дерево данных"
        subtitle="Парсер проверяет синтаксис; при успехе показывает типы и пути к полям."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {JSON_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={clsx(toolStyles.chip, activePreset === preset.id && toolStyles.chipActive)}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginBottom: '1rem'}}>
          <div>
            <label className="it-demo__label">JSON-документ</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              value={input}
              onChange={(e) => {
                setActivePreset('');
                setInput(e.target.value);
              }}
              rows={isMobile ? 12 : 14}
              spellCheck={false}
            />
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              style={{marginTop: '0.5rem'}}
              onClick={() => copy(input, 'json')}
            >
              {isCopied('json') ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
          <div>
            <div
              className={clsx(
                styles.statusBanner,
                parsed.error ? styles.statusInvalid : styles.statusValid,
              )}
            >
              {parsed.error
                ? `Ошибка: ${parsed.error}${parsed.line ? ` (строка ${parsed.line}, столбец ${parsed.column})` : ''}`
                : `Документ валиден — корень: ${Array.isArray(parsed.value) ? 'массив' : 'объект'}`}
            </div>
            {tree.length > 0 ? (
              <div className={styles.treeWrap}>
                <table className={styles.treeTable}>
                  <thead>
                    <tr>
                      <th>Путь</th>
                      <th>Тип</th>
                      <th>Значение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tree.map((row) => (
                      <tr key={row.path}>
                        <td>
                          <code>{row.path}</code>
                        </td>
                        <td>{row.type}</td>
                        <td className={styles.previewCell}>{row.preview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="it-demo__hint">Исправьте синтаксис, чтобы увидеть дерево полей.</p>
            )}
          </div>
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0}}>
          В приложениях тот же текст передаёт через <code>JSON.parse</code> / <code>JSON.stringify</code> —
          стандарт ECMAScript и RFC 8259.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default JsonPlayDemoInner;
