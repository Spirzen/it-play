import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdGrid2, CdHint, CdMono, CdStack, CdTextarea} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const INITIAL = {
  code: `class Task {
  id: int
  title: string
  due_date: date
}`,
  sql: `CREATE TABLE tasks (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  due_date DATE
);`,
};

function OrmMigrationPlayInner() {
  const [mode, setMode] = useState('codeFirst');
  const [code, setCode] = useState(INITIAL.code);
  const [dbSchema, setDbSchema] = useState(INITIAL.sql);
  const [migration, setMigration] = useState('');

  const addField = () => {
    const nextCode = code.includes('priority')
      ? code
      : code.replace('due_date: date', 'due_date: date\n  priority: int');
    const nextSql = dbSchema.includes('priority')
      ? dbSchema
      : dbSchema.replace('due_date DATE', 'due_date DATE,\n  priority INT');
    setCode(nextCode);
    setDbSchema(nextSql);
    setMigration('ALTER TABLE tasks ADD COLUMN priority INT NOT NULL DEFAULT 0;');
  };

  return (
    <DemoShell>
      <DemoCard title="ORM: Code First vs Database First" subtitle="Изменение модели ↔ SQL-миграция">
        <CdStack>
          <div className={toolStyles.chips}>
            <button type="button" className={clsx(toolStyles.chip, mode === 'codeFirst' && toolStyles.chipActive)} onClick={() => setMode('codeFirst')}>
              Code First
            </button>
            <button type="button" className={clsx(toolStyles.chip, mode === 'dbFirst' && toolStyles.chipActive)} onClick={() => setMode('dbFirst')}>
              Database First
            </button>
          </div>

          <CdGrid2>
            <div>
              <p className={styles.sectionLabel}>Класс / модель</p>
              <CdTextarea value={code} onChange={(e) => setCode(e.target.value)} readOnly={mode === 'dbFirst'} rows={8} />
            </div>
            <div>
              <p className={styles.sectionLabel}>Таблица SQL</p>
              <CdTextarea value={dbSchema} onChange={(e) => setDbSchema(e.target.value)} readOnly={mode === 'codeFirst'} rows={8} />
            </div>
          </CdGrid2>

          <CdBtn variant="primary" onClick={addField}>
            {mode === 'codeFirst' ? 'Добавить priority → сгенерировать миграцию' : 'ALTER TABLE → обновить класс'}
          </CdBtn>

          {migration ? <CdMono>{migration}</CdMono> : <CdHint>Нажмите кнопку, чтобы увидеть SQL-миграцию после изменения модели.</CdHint>}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default OrmMigrationPlayInner;
