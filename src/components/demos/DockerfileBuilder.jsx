import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  DEFAULT_INSTRUCTIONS,
  EXAMPLES,
  INSTRUCTION_TEMPLATES,
  INSTRUCTION_TYPES,
  analyzeDockerfile,
  createInstructionId,
  generateDockerfile,
  getInstructionColor,
  instructionsFromTemplate,
  simulateDockerBuild,
} from '@/components/shared/kb/dockerfileEngine';
import styles from '@/components/demos/DockerfileBuilder.module.css';

const PRESETS = [
  {id: 'node', label: 'Node.js'},
  {id: 'python', label: 'Python'},
  {id: 'nginx', label: 'Nginx'},
  {id: 'multistage', label: 'Multi-stage'},
];

function DockerfileBuilderInner() {
  const [instructions, setInstructions] = useState(() => instructionsFromTemplate(DEFAULT_INSTRUCTIONS));
  const [selectedType, setSelectedType] = useState('COPY');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(null);
  const [buildLogs, setBuildLogs] = useState([]);
  const [layers, setLayers] = useState([]);
  const [activeLine, setActiveLine] = useState(-1);
  const [isBuilding, setIsBuilding] = useState(false);
  const {copy, isCopied} = useCopyToClipboard();

  const dockerfile = useMemo(() => generateDockerfile(instructions), [instructions]);
  const warnings = useMemo(() => analyzeDockerfile(instructions), [instructions]);
  const template = INSTRUCTION_TEMPLATES[selectedType];

  const addInstruction = () => {
    const err = template.validate(value);
    if (err) {
      setError(err);
      window.setTimeout(() => setError(null), 3000);
      return;
    }
    setInstructions((prev) => [
      ...prev,
      {
        id: createInstructionId(),
        type: selectedType,
        value: value.trim(),
        description: desc.trim() || template.description,
      },
    ]);
    setValue('');
    setDesc('');
    setError(null);
  };

  const removeInstruction = (id) => {
    if (instructions.length <= 1) return;
    setInstructions((prev) => prev.filter((i) => i.id !== id));
  };

  const moveInstruction = (id, dir) => {
    setInstructions((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = dir === 'up' ? idx - 1 : idx + 1;
      if (next < 0 || next >= prev.length) return prev;
      const copyList = [...prev];
      [copyList[idx], copyList[next]] = [copyList[next], copyList[idx]];
      return copyList;
    });
  };

  const loadPreset = (id) => {
    setInstructions(instructionsFromTemplate(EXAMPLES[id] ?? DEFAULT_INSTRUCTIONS));
    setBuildLogs([]);
    setLayers([]);
    setActiveLine(-1);
  };

  const handleBuild = useCallback(async () => {
    setIsBuilding(true);
    setBuildLogs([]);
    setLayers([]);
    setActiveLine(-1);
    let lineIdx = 0;

    await simulateDockerBuild(instructions, (message) => {
      setBuildLogs((prev) => [...prev, message]);
      if (message.startsWith('▶ [')) {
        setActiveLine(lineIdx);
        const inst = instructions[lineIdx];
        if (inst) {
          setLayers((prev) => [
            ...prev,
            {id: lineIdx, label: `${inst.type} ${inst.value}`},
          ]);
        }
        lineIdx += 1;
      }
    });

    setActiveLine(-1);
    setIsBuilding(false);
  }, [instructions]);

  const handleExport = () => {
    const blob = new Blob([dockerfile], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dockerfile';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = dockerfile.split('\n');

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор Dockerfile"
        subtitle="Соберите образ по слоям, проверьте предупреждения и симулируйте docker build"
      >
        <div className="it-demo__row" style={{marginBottom: '0.75rem'}}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
              onClick={() => loadPreset(p.id)}
              disabled={isBuilding}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <div>
            <h4 style={{margin: '0 0 0.65rem', fontSize: '0.95rem'}}>Добавить инструкцию</h4>
            <div className="it-demo__grid" style={{gridTemplateColumns: 'auto 1fr', gap: '0.5rem'}}>
              <select
                className="it-demo__select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={isBuilding}
              >
                {INSTRUCTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                className="it-demo__input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={template.example}
                disabled={isBuilding}
              />
              <input
                className="it-demo__input"
                style={{gridColumn: '1 / -1'}}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Комментарий (опционально)"
                disabled={isBuilding}
              />
            </div>
            <div className="it-demo__row" style={{marginTop: '0.5rem'}}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={addInstruction}
                disabled={isBuilding}
              >
                Добавить
              </button>
            </div>

            {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

            <div
              className={styles.hintBox}
              style={{borderLeftColor: getInstructionColor(selectedType), marginTop: '0.75rem'}}
            >
              <strong>{selectedType}</strong> — {template.description}
              <div style={{fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--demo-muted)'}}>
                {template.syntax}
              </div>
            </div>

            {warnings.length > 0 && (
              <div className="it-demo__alert it-demo__alert--warning" style={{marginTop: '0.65rem'}}>
                {warnings.map((w) => (
                  <div key={w}>
                    {w}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.instructionList} style={{marginTop: '0.75rem'}}>
              <h4 style={{margin: '0 0 0.5rem', fontSize: '0.9rem'}}>
                Инструкции ({instructions.length})
              </h4>
              {instructions.map((inst) => (
                <div
                  key={inst.id}
                  className={styles.instructionCard}
                  style={{borderLeftColor: getInstructionColor(inst.type)}}
                >
                  <div className={styles.instructionHead}>
                    <span className={styles.typeTag} style={{color: getInstructionColor(inst.type)}}>
                      {inst.type}
                    </span>
                    <code style={{fontSize: '0.78rem'}}>{inst.value}</code>
                  </div>
                  {inst.description && (
                    <div style={{fontSize: '0.75rem', color: 'var(--demo-muted)'}}>{inst.description}</div>
                  )}
                  <input
                    className="it-demo__input"
                    style={{marginTop: '0.4rem', fontSize: '0.8rem'}}
                    value={inst.value}
                    onChange={(e) =>
                      setInstructions((prev) =>
                        prev.map((i) => (i.id === inst.id ? {...i, value: e.target.value} : i)),
                      )
                    }
                    disabled={isBuilding}
                  />
                  <div className={styles.instructionActions}>
                    <button
                      type="button"
                      className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                      onClick={() => moveInstruction(inst.id, 'up')}
                      disabled={isBuilding}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                      onClick={() => moveInstruction(inst.id, 'down')}
                      disabled={isBuilding}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="it-demo__btn it-demo__btn--sm it-demo__btn--danger"
                      onClick={() => removeInstruction(inst.id)}
                      disabled={isBuilding}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="it-demo__row" style={{marginBottom: '0.5rem', justifyContent: 'space-between'}}>
              <h4 style={{margin: 0, fontSize: '0.95rem'}}>Предпросмотр</h4>
              <div className="it-demo__row">
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                  onClick={() => copy(dockerfile, 'df')}
                >
                  {isCopied('df') ? 'Скопировано' : 'Копировать'}
                </button>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                  onClick={handleExport}
                >
                  Скачать
                </button>
              </div>
            </div>

            <div className="it-demo__terminal">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={clsx(styles.previewLine, activeLine === i && styles.previewLineActive)}
                >
                  <span className={styles.lineNum}>{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              style={{width: '100%', marginTop: '0.65rem'}}
              onClick={handleBuild}
              disabled={isBuilding}
            >
              {isBuilding ? 'Сборка…' : 'docker build'}
            </button>

            {layers.length > 0 && (
              <div>
                <h4 style={{margin: '0.75rem 0 0.35rem', fontSize: '0.85rem'}}>Слои образа</h4>
                <div className={styles.layers}>
                  {layers.map((layer, i) => (
                    <div
                      key={layer.id}
                      className={clsx(styles.layer, i === layers.length - 1 && styles.layerLatest)}
                    >
                      Layer {i + 1}: {layer.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h4 style={{margin: '0.85rem 0 0.35rem', fontSize: '0.85rem'}}>Лог сборки</h4>
            <div className="it-demo__log" style={{minHeight: '8rem'}}>
              {buildLogs.length === 0 ? (
                <span style={{color: 'var(--demo-muted)'}}>Нажмите "docker build" для симуляции</span>
              ) : (
                buildLogs.map((log, i) => (
                  <div key={i} className="it-demo__log-entry">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <details style={{marginTop: '1rem'}}>
          <summary style={{cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'}}>
            Справочник инструкций
          </summary>
          <div className={styles.refGrid} style={{marginTop: '0.65rem'}}>
            {INSTRUCTION_TYPES.slice(0, 8).map((key) => {
              const t = INSTRUCTION_TEMPLATES[key];
              return (
                <div
                  key={key}
                  className={styles.refCard}
                  style={{borderLeftColor: getInstructionColor(key)}}
                >
                  <strong style={{color: getInstructionColor(key)}}>{key}</strong>
                  <div style={{marginTop: '0.2rem'}}>{t.description}</div>
                  <code className={styles.refExample}>{t.example}</code>
                </div>
              );
            })}
          </div>
        </details>
      </DemoCard>
    </DemoShell>
  );
}

export default DockerfileBuilderInner;
