import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, CardGrid, Alert} from '@/components/shared/infra/InfraPlayUi';
import {STRIDE_ELEMENTS} from '@/components/shared/kb/infraSecurityEngines';

const STRIDE_LETTERS = ['S', 'T', 'R', 'I', 'D', 'E'];
const STRIDE_NAMES = {S: 'Spoofing', T: 'Tampering', R: 'Repudiation', I: 'Info disclosure', D: 'DoS', E: 'Elevation'};

function StrideThreatModelPlayInner() {
  const [elId, setElId] = useState(STRIDE_ELEMENTS[0].id);
  const [letter, setLetter] = useState('S');
  const el = STRIDE_ELEMENTS.find((e) => e.id === elId);

  return (
    <DemoShell>
      <DemoCard title="STRIDE threat modeling" subtitle="Компонент архитектуры → угроза и контроль на этапе дизайна">
        <InfraRoot>
          <CardGrid items={STRIDE_ELEMENTS.map((e) => ({id: e.id, title: e.label}))} activeId={elId} onSelect={setElId} />
          <ChipRow>
            {STRIDE_LETTERS.map((l) => (
              <Chip key={l} active={letter === l} onClick={() => setLetter(l)} title={STRIDE_NAMES[l]}>{l}</Chip>
            ))}
          </ChipRow>
          <Alert tone="warn"><strong>{el.label} · {STRIDE_NAMES[letter]}</strong> — {el.threats[letter]}</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default StrideThreatModelPlayInner;
