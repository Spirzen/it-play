import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdFlynnGrid, CdHint, CdMono, CdStack} from '@/components/shared/kb/codeDevPlayKit';

const FLYNN = [
  {id: 'SISD', title: 'SISD', sub: 'Single Instruction, Single Data'},
  {id: 'SIMD', title: 'SIMD', sub: 'Single Instruction, Multiple Data'},
  {id: 'MISD', title: 'MISD', sub: 'Multiple Instruction, Single Data'},
  {id: 'MIMD', title: 'MIMD', sub: 'Multiple Instruction, Multiple Data'},
];

const DETAIL = {
  SISD: {text: 'Один поток команд, один поток данных — классическое последовательное ядро.', code: 'x = a + b  // одна пара операндов'},
  SIMD: {text: 'Одна инструкция обрабатывает вектор — AVX, GPU warp.', code: 'c[i] = a[i] + b[i]  // 8 lanes за такт'},
  MISD: {text: 'Редко на практике — отказоустойчивые системы с дублированием.', code: 'pipeline stages on same datum'},
  MIMD: {text: 'Независимые ядра с разным кодом — OpenMP, MPI, многопоточность.', code: 'thread0: render()\nthread1: physics()'},
};

function FlynnTaxonomyPlayInner() {
  const [active, setActive] = useState('SIMD');
  const d = DETAIL[active];

  return (
    <DemoShell>
      <DemoCard title="Таксономия Флинна" subtitle="Потоки управления × потоки данных">
        <CdStack>
          <CdFlynnGrid cells={FLYNN} active={active} onSelect={setActive} />
          <CdHint>{d.text}</CdHint>
          <CdMono>{d.code}</CdMono>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default FlynnTaxonomyPlayInner;
