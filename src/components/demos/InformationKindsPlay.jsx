import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataBasicsPlay.module.css';

const MODALITIES = [
  {
    id: 'text',
    icon: '📄',
    name: 'Текст',
    formats: 'TXT, DOCX, PDF',
    sample: 'Привет',
    hex: ['D0', '9F', 'D1', '80', 'D0', 'B8', 'D0', 'B2', 'D0', 'B5', 'D1', '82'],
    info: 'Последовательность символов в кодировке UTF-8 — для человека это слово, для CPU — байты.',
    encoding: 'Unicode → UTF-8: буква "П" = U+041F → D0 9F',
  },
  {
    id: 'image',
    icon: '🖼️',
    name: 'Графика',
    formats: 'PNG, JPEG, SVG',
    sample: 'RGB пиксель',
    hex: ['FF', '00', '00', '80', '80', '80'],
    info: 'Матрица пикселей: красный (255,0,0) и серый (128,128,128) — визуальный образ после декодирования.',
    encoding: 'JPEG/PNG сжимают коэффициенты; SVG — векторные команды.',
  },
  {
    id: 'audio',
    icon: '🔊',
    name: 'Аудио',
    formats: 'WAV, MP3, FLAC',
    sample: 'Сэмпл PCM',
    hex: ['00', '40', '80', 'C0', 'FF', 'C0'],
    info: 'Временной ряд амплитуд — "песня" возникает только при воспроизведении и знании языка/жанра.',
    encoding: '44,1 кГц × 16 бит — стандарт CD; MP3 убирает психоакустически избыточное.',
  },
  {
    id: 'video',
    icon: '🎬',
    name: 'Видео',
    formats: 'MP4, MKV, AVI',
    sample: 'I/P-кадр',
    hex: ['00', '00', '01', '67', '88', '9A'],
    info: 'Контейнер: видеопоток (H.264) + аудио (AAC) + метаданные; смысл — только при синхронном просмотре.',
    encoding: 'GOP: I-кадр как JPEG, P/B — разности между кадрами.',
  },
];

function InformationKindsPlayInner() {
  const [modId, setModId] = useState('text');
  const mod = MODALITIES.find((m) => m.id === modId) ?? MODALITIES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Виды информации ↔ представление данных"
        subtitle="Выберите модальность: слева — что хранит компьютер, справа — что получает человек."
      >
        <div className={styles.grid4}>
          {MODALITIES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.modCard, modId === m.id && styles.modCardActive)}
              onClick={() => setModId(m.id)}
            >
              <div className={styles.modIcon}>{m.icon}</div>
              <div className={styles.modName}>{m.name}</div>
            </button>
          ))}
        </div>

        <div className={styles.split} style={{marginTop: '0.75rem'}}>
          <div className={styles.dataCol}>
            <span className={styles.labelData}>Данные</span>
            <p className={styles.mono} style={{margin: '0.25rem 0'}}>
              {mod.formats}
            </p>
            <div className={styles.byteTape}>
              {mod.hex.map((h, i) => (
                <span key={i} className={clsx(styles.byteCell, i < 2 && styles.byteCellHot)}>
                  {h}
                </span>
              ))}
            </div>
            <p className={styles.hint}>{mod.encoding}</p>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.labelInfo}>Информация</span>
            <p className={styles.mono} style={{margin: '0.25rem 0', fontWeight: 700}}>
              {mod.sample}
            </p>
            <p className={styles.hint}>{mod.info}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default InformationKindsPlayInner;
