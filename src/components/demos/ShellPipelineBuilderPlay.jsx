import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayCode,
  PlayLog,
  PlayMetrics,
  PlayPipeline,
  PlaySection,
  PlayStack,
  PlayTabs,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const COMMANDS = {
  cat: {label: 'cat app.log', out: ['INFO boot', 'ERROR disk full', 'ERROR timeout', 'INFO ok']},
  grep: {label: 'grep ERROR', filter: (lines) => lines.filter((l) => l.includes('ERROR'))},
  sort: {label: 'sort', sort: true},
  uniq: {label: 'uniq -c', uniq: true},
  wc: {label: 'wc -l', count: true},
};

const PRESETS = [
  {id: 'pipeline', label: 'grep | sort | uniq', ops: ['|', '|', '|'], cmds: ['cat', 'grep', 'sort', 'uniq']},
  {id: 'redirect', label: 'cat | grep > file', ops: ['|', '>'], cmds: ['cat', 'grep', 'wc']},
];

function runPipeline(cmdIds, opSyms, inputLines) {
  const opIds = opSyms.map((s) => (s === '>' ? 'redirect' : 'pipe'));
  const logs = [`$ ${cmdIds.map((c, i) => `${COMMANDS[c].label}${opSyms[i] ? ` ${opSyms[i]}` : ''}`).join(' ')}`];
  let data = inputLines;
  let fileOut = null;

  cmdIds.forEach((cmdId, index) => {
    const cmd = COMMANDS[cmdId];
    if (cmd.filter) data = cmd.filter(data);
    if (cmd.sort) data = [...data].sort();
    if (cmd.uniq) {
      const map = new Map();
      data.forEach((line) => map.set(line, (map.get(line) ?? 0) + 1));
      data = [...map.entries()].map(([line, n]) => `${n} ${line}`);
    }
    if (cmd.count) {
      logs.push(`stdout: ${data.length}`);
      data = [`${data.length}`];
    }
    if (index < opIds.length && opIds[index] === 'redirect') {
      fileOut = data.join('\n');
      logs.push(`> errors.txt (${data.length} строк)`);
      data = [];
    }
  });

  if (data.length) logs.push(`stdout:\n${data.join('\n')}`);
  if (fileOut) logs.push(`Файл errors.txt:\n${fileOut}`);
  return {logs, outCount: data.length || (fileOut ? fileOut.split('\n').length : 0)};
}

export default function ShellPipelineBuilderPlay() {
  const [preset, setPreset] = useState('pipeline');
  const [cmdIds, setCmdIds] = useState(PRESETS[0].cmds);
  const [opSyms, setOpSyms] = useState(PRESETS[0].ops);

  const {logs, outCount} = useMemo(
    () => runPipeline(cmdIds, opSyms, COMMANDS.cat.out),
    [cmdIds, opSyms],
  );

  const applyPreset = (id) => {
    const p = PRESETS.find((x) => x.id === id);
    setPreset(id);
    setCmdIds(p.cmds);
    setOpSyms(p.ops);
  };

  const replaceCmd = (index, cmdId) => {
    setCmdIds((prev) => prev.map((c, i) => (i === index ? cmdId : c)));
    setPreset('custom');
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Конструктор конвейера shell"
        subtitle="Соберите цепочку команд и посмотрите, как данные текут между stdin/stdout"
      >
        <PlayStack>
          <PlayTabs
            tabs={PRESETS.map((p) => ({id: p.id, label: p.label}))}
            active={preset}
            onChange={applyPreset}
          />

          <PlayPipeline parts={cmdIds.map((c) => COMMANDS[c].label)} operators={opSyms} />

          <PlaySection label="Заменить команду в цепочке">
            <div className={styles.grid2}>
              {cmdIds.map((cmdId, index) => (
                <div key={`slot-${index}`} className={styles.section}>
                  <span className={styles.sectionLabel}>Шаг {index + 1}</span>
                  <div className={styles.grid2}>
                    {Object.entries(COMMANDS).map(([id, cmd]) => (
                      <button
                        key={`${index}-${id}`}
                        type="button"
                        className={clsx(styles.cardBtn, cmdId === id && styles.cardBtnActive)}
                        onClick={() => replaceCmd(index, id)}
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PlaySection>

          <PlayMetrics
            grid
            items={[
              {label: 'Строк на входе', value: COMMANDS.cat.out.length, max: 8},
              {label: 'Строк на выходе', value: Math.max(1, outCount), max: 8},
            ]}
          />

          <PlayCode>{cmdIds.map((c, i) => `${COMMANDS[c].label}${opSyms[i] ? ` ${opSyms[i]}` : ''}`).join(' ')}</PlayCode>

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
