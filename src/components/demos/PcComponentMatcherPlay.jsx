import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayFeedback,
  PlayField,
  PlayLog,
  PlayMetrics,
  PlayStack,
  SN_COLORS,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const CPUS = [
  {id: 'r5600', label: 'Ryzen 5 5600', socket: 'AM4', tdp: 65},
  {id: 'i12400', label: 'i5-12400', socket: 'LGA1700', tdp: 65},
];
const BOARDS = [
  {id: 'b550', label: 'B550', socket: 'AM4', ram: 'DDR4'},
  {id: 'b660', label: 'B660', socket: 'LGA1700', ram: 'DDR4'},
];
const RAM = [
  {id: 'ddr4_32', label: '32GB DDR4', type: 'DDR4'},
  {id: 'ddr5_32', label: '32GB DDR5', type: 'DDR5'},
];
const PSU = [
  {id: '550', label: '550W', watts: 550},
  {id: '750', label: '750W', watts: 750},
];

export default function PcComponentMatcherPlay() {
  const [cpu, setCpu] = useState(CPUS[0].id);
  const [board, setBoard] = useState(BOARDS[0].id);
  const [ram, setRam] = useState(RAM[0].id);
  const [psu, setPsu] = useState(PSU[0].id);

  const c = CPUS.find((x) => x.id === cpu);
  const b = BOARDS.find((x) => x.id === board);
  const r = RAM.find((x) => x.id === ram);
  const p = PSU.find((x) => x.id === psu);

  const issues = useMemo(() => {
    const list = [];
    if (c.socket !== b.socket) list.push(`Сокет CPU (${c.socket}) ≠ материнская плата (${b.socket})`);
    if (r.type !== b.ram) list.push(`RAM ${r.type} не подходит к плате ${b.ram}`);
    const need = c.tdp + 150 + 200;
    if (p.watts < need) list.push(`PSU ${p.watts}W мал для TDP~${need}W (CPU+GPU+запас)`);
    return list;
  }, [c, b, r, p]);

  const ok = issues.length === 0;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Подбор совместимости ПК" subtitle="Сокет, тип RAM и запас блока питания">
        <PlayStack>
          <div className={clsx(styles.compatRing, ok ? styles.compatOk : styles.compatBad)} aria-hidden>
            {ok ? '✓' : '!'}
          </div>

          {[
            ['CPU', CPUS, cpu, setCpu],
            ['Плата', BOARDS, board, setBoard],
            ['RAM', RAM, ram, setRam],
            ['PSU', PSU, psu, setPsu],
          ].map(([label, opts, val, setVal]) => (
            <PlayField key={label} label={label}>
              <select value={val} onChange={(e) => setVal(e.target.value)}>
                {opts.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </PlayField>
          ))}

          <PlayFeedback tone={ok ? 'success' : 'danger'}>
            {ok ? 'Конфигурация совместима — можно собирать.' : `Найдено проблем: ${issues.length}`}
          </PlayFeedback>

          <PlayMetrics
            grid
            items={[
              {
                label: 'Совместимость',
                value: ok ? 100 : 20,
                max: 100,
                color: ok ? SN_COLORS.success : SN_COLORS.danger,
              },
              {
                label: 'Запас PSU',
                value: Math.min(100, Math.round((p.watts / (c.tdp + 350)) * 100)),
                max: 100,
              },
            ]}
          />

          <PlayLog lines={ok ? ['✓ Конфигурация совместима — можно собирать'] : issues.map((i) => `❌ ${i}`)} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
