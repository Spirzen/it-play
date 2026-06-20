import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectMatrix,
  ProjectSummaryPills,
  ProjectMessage,
  ProjectHint,
  FIT_GAP_CLASS,
} from '@/components/shared/kb/projectPlayKit';

const VENDORS = ['1С:ERP', 'SAP S/4', 'Oracle NetSuite'];
const REQ = [
  'Регламентированный учёт РФ',
  'Склад WMS',
  'MRP / производство',
  'BI и отчёты',
  'Мобильное приложение полевых',
  'Интеграция с ЕГАИС',
];

const INITIAL = [
  ['fit', 'partial', 'gap'],
  ['fit', 'fit', 'partial'],
  ['partial', 'fit', 'gap'],
  ['fit', 'partial', 'partial'],
  ['gap', 'partial', 'fit'],
  ['fit', 'gap', 'gap'],
];

const CELL_CYCLE = {fit: 'partial', partial: 'gap', gap: 'fit'};
const CELL_LABEL = {fit: 'Fit', partial: 'Partial', gap: 'Gap'};

function FitGapMatrixPlayInner() {
  const [matrix, setMatrix] = useState(INITIAL);

  const summary = useMemo(() => {
    let fit = 0;
    let partial = 0;
    let gap = 0;
    matrix.flat().forEach((c) => {
      if (c === 'fit') fit++;
      else if (c === 'partial') partial++;
      else gap++;
    });
    const customizeCost = gap * 120 + partial * 40;
    return {fit, partial, gap, customizeCost};
  }, [matrix]);

  const toggle = (ri, vi) => {
    setMatrix((m) =>
      m.map((row, i) => (i === ri ? row.map((cell, j) => (j === vi ? CELL_CYCLE[cell] : cell)) : row)),
    );
  };

  const rows = REQ.map((label, index) => ({
    label,
    index,
    cells: matrix[index],
  }));

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Матрица fit-gap" subtitle="Тендер ERP: требования × вендоры">
        <ProjectStack>
          <ProjectMatrix
            headers={['Требование', ...VENDORS]}
            rows={rows}
            renderCell={(cell, ri, vi) => (
              <span
                role="button"
                tabIndex={0}
                className={clsx(s.cell, FIT_GAP_CLASS[cell])}
                onClick={() => toggle(ri, vi)}
                onKeyDown={(e) => e.key === 'Enter' && toggle(ri, vi)}
                title="Клик — сменить Fit / Partial / Gap"
              >
                {CELL_LABEL[cell]}
              </span>
            )}
          />

          <ProjectSummaryPills
            items={[
              {label: 'Fit', value: summary.fit},
              {label: 'Partial', value: summary.partial},
              {label: 'Gap', value: summary.gap},
            ]}
          />

          <ProjectMessage tone="ok">
            Оценка доработок (условно): ~{summary.customizeCost} чел.-дн. Gap без предпроекта — главный риск ERP.
          </ProjectMessage>

          <ProjectHint>Кликайте ячейки, чтобы менять оценку соответствия. Перед подписанием — обязательное обследование.</ProjectHint>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default FitGapMatrixPlayInner;
