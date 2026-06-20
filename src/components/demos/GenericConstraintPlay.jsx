import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpBadge,
  LpChip,
  LpChipRow,
  LpCode,
  LpPanel,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const CANDIDATES = [
  {id: 'user', label: 'User', detail: '{ id: number; name: string }', ok: true},
  {id: 'number', label: 'number', detail: 'примитив без id', ok: false},
  {id: 'product', label: 'Product', detail: '{ sku: string }', ok: false},
];

function GenericConstraintPlayInner() {
  const [picked, setPicked] = useState('user');
  const candidate = CANDIDATES.find((c) => c.id === picked) ?? CANDIDATES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Generic constraints"
        subtitle="T extends HasId — подставьте тип и проверьте constraint"
      >
        <LpStack>
          <LpCode>{`interface HasId { id: number }

function save<T extends HasId>(entity: T): T {
  db.store(entity.id, entity);
  return entity;
}`}</LpCode>

          <LpSection label="Подставить T =">
            <LpChipRow>
              {CANDIDATES.map((c) => (
                <LpChip key={c.id} active={picked === c.id} onClick={() => setPicked(c.id)}>
                  {c.label}
                </LpChip>
              ))}
            </LpChipRow>
          </LpSection>

          <LpPanel>
            <p className={styles.typeMuted}>{candidate.detail}</p>
            {candidate.ok ? (
              <>
                <LpBadge variant="ok">✓ Компилируется</LpBadge>
                <p className={clsx(styles.typeMuted, styles.spacedTopMd)}>
                  Поле <code>id: number</code> присутствует — constraint выполнен.
                </p>
              </>
            ) : (
              <>
                <LpBadge variant="err">✗ TS2344: constraint HasId</LpBadge>
                <p className={clsx(styles.typeMuted, styles.spacedTopMd)}>
                  Property <code>id</code> is missing in type {candidate.label}.
                </p>
              </>
            )}
          </LpPanel>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default GenericConstraintPlayInner;
