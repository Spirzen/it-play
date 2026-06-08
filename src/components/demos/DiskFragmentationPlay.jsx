import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BLOCK_COUNT,
  DRIVE_TYPES,
  DEMO_FILES,
  addFile,
  defragment,
  deleteFile,
  presetDisk,
  simulateRead,
} from '@/components/shared/kb/diskFragmentationEngine';
import styles from '@/components/demos/DiskFragmentationPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function DiskFragmentationPlayInner() {
  const [state, setState] = useState(() => presetDisk('tidy'));
  const [driveType, setDriveType] = useState('hdd');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [log, setLog] = useState('Диск разбит на блоки. Запишите файлы, удалите часть — появятся "дыры", затем сравните чтение до и после дефрагментации.');

  const drive = DRIVE_TYPES.find((d) => d.id === driveType) ?? DRIVE_TYPES[0];
  const readSim = useMemo(
    () => (selectedFileId ? simulateRead(state, selectedFileId, driveType) : null),
    [state, selectedFileId, driveType],
  );

  const apply = (result) => {
    if (result.state) setState(result.state);
    if (result.message) setLog(result.message);
  };

  const loadPreset = (id) => {
    setState(presetDisk(id));
    setSelectedFileId(null);
    setLog(id === 'fragmented' ? 'Фрагментированный диск: файлы разорваны пустыми блоками.' : 'Упорядоченный диск: файлы лежат подряд.');
  };

  const onAdd = (spec) => {
    const result = addFile(state, spec.size, spec.name);
    if (!result.ok) {
      setLog(result.reason);
      return;
    }
    apply(result);
    setSelectedFileId(result.state.files[result.state.files.length - 1]?.id ?? null);
  };

  const onDeleteSelected = () => {
    if (!selectedFileId) return;
    apply(deleteFile(state, selectedFileId));
    setSelectedFileId(null);
  };

  const onDefrag = () => {
    if (driveType === 'ssd') {
      setLog('На SSD дефрагментация не нужна: ОС отправляет TRIM, контроллер сам освобождает ячейки.');
      return;
    }
    apply(defragment(state));
  };

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор фрагментации диска"
        subtitle="Как пустые блоки между файлами заставляют HDD &quot;прыгать&quot; головкой — и почему SSD ведёт себя иначе"
      >
        <label className="it-demo__label">Тип накопителя</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {DRIVE_TYPES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={clsx(toolStyles.chip, driveType === d.id && toolStyles.chipActive)}
              onClick={() => setDriveType(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{drive.hint}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Блоков на диске</span>
            <strong>{BLOCK_COUNT}</strong>
          </div>
          <div className={styles.stat}>
            <span>Свободно</span>
            <strong>{state.freeBlocks}</strong>
          </div>
          <div className={styles.stat}>
            <span>"Разрывов" данных</span>
            <strong>{state.fragmentationPct}%</strong>
          </div>
        </div>

        <div className={styles.disk} aria-label="Карта блоков диска">
          {state.blocks.map((cell, i) => (
            <div
              key={i}
              className={clsx(
                styles.block,
                !cell && styles.blockFree,
                cell && selectedFileId === cell.fileId && styles.blockActive,
              )}
              style={cell ? {backgroundColor: cell.color, borderColor: cell.color} : undefined}
              title={cell ? `${cell.name} · блок ${i + 1}` : `Свободно · блок ${i + 1}`}
              onClick={() => cell && setSelectedFileId(cell.fileId)}
              role={cell ? 'button' : undefined}
              tabIndex={cell ? 0 : undefined}
              onKeyDown={(e) => {
                if (cell && (e.key === 'Enter' || e.key === ' ')) setSelectedFileId(cell.fileId);
              }}
            >
              {cell ? cell.fileId : ''}
            </div>
          ))}
        </div>

        {state.files.length > 0 && (
          <>
            <label className="it-demo__label">Файлы на диске</label>
            <div className={styles.fileList}>
              {state.files.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={clsx(styles.fileBtn, selectedFileId === f.id && styles.fileBtnActive)}
                  style={{borderLeftColor: f.color, borderLeftWidth: 4}}
                  onClick={() => setSelectedFileId(f.id)}
                >
                  {f.name} · {f.size} бл. · {f.fragments} фр.
                </button>
              ))}
            </div>
          </>
        )}

        <div className={styles.actions}>
          {DEMO_FILES.map((f) => (
            <button key={f.name} type="button" className={styles.actionBtn} onClick={() => onAdd(f)}>
              + {f.label}
            </button>
          ))}
          <button type="button" className={styles.actionBtn} disabled={!selectedFileId} onClick={onDeleteSelected}>
            Удалить файл
          </button>
          <button type="button" className={clsx(styles.actionBtn, styles.actionPrimary)} onClick={onDefrag}>
            {driveType === 'ssd' ? 'TRIM (учебно)' : 'Дефрагментировать'}
          </button>
          <button type="button" className={styles.actionBtn} onClick={() => loadPreset('fragmented')}>
            Пример: хаос
          </button>
          <button type="button" className={styles.actionBtn} onClick={() => loadPreset('tidy')}>
            Сброс
          </button>
        </div>

        <button
          type="button"
          className={clsx(styles.actionBtn, styles.actionPrimary)}
          disabled={!selectedFileId}
          onClick={() => {
            if (!readSim?.ok) return;
            setLog(
              `${readSim.note} Условная задержка чтения: ~${readSim.latencyMs} мс` +
                (driveType === 'hdd' ? ` (перемещений головки: ${readSim.seeks}).` : '.'),
            );
          }}
        >
          Симулировать чтение файла
        </button>

        <div
          className={clsx(
            styles.readout,
            state.fragmentationPct > 15 && driveType === 'hdd' && styles.readoutWarn,
            state.fragmentationPct <= 5 && styles.readoutGood,
          )}
        >
          {log}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DiskFragmentationPlayInner;
