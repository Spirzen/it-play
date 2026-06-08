import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataBasicsPlay.module.css';

const LAYERS = {
  technical: {
    title: 'Технические',
    subtitle: 'Нужны декодеру: без них файл — "мёртвые" байты',
    fields: [
      ['Формат', 'JPEG / EXIF'],
      ['Размер', '4000 × 3000 px'],
      ['Цвет', 'sRGB'],
      ['Сжатие', 'JPEG baseline'],
      ['CRC', 'a3f2… (контроль целостности)'],
    ],
  },
  descriptive: {
    title: 'Описательные',
    subtitle: 'Семантика для поиска и каталогов',
    fields: [
      ['Камера', 'iPhone 15 Pro'],
      ['Дата съёмки', '15.07.2025 14:30'],
      ['GPS', '43.5880° N, 39.7250° E'],
      ['Заголовок', 'Пляжный закат'],
      ['Ключевые слова', 'Сочи, отпуск, море'],
    ],
  },
  administrative: {
    title: 'Административные',
    subtitle: 'Права, владение, жизненный цикл',
    fields: [
      ['Владелец', 'Timur'],
      ['Права', 'только чтение для группы "Семья"'],
      ['Создан', '15.07.2025'],
      ['Изменён', '16.07.2025'],
      ['Лицензия', 'CC BY-NC 4.0'],
    ],
  },
  structural: {
    title: 'Структурные',
    subtitle: 'Связи с другими объектами',
    fields: [
      ['Альбом', 'Отпуск-2025 (246 фото)'],
      ['Обложка', 'да, для альбома'],
      ['Связанный DOC', 'travel-plan.pdf'],
      ['Версия', '3 (после кадрирования)'],
    ],
  },
};

function MetadataExplorerPlayInner() {
  const [layer, setLayer] = useState('descriptive');
  const L = LAYERS[layer];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Метаданные файла vacation.jpg"
        subtitle="Данные о данных: четыре класса из статьи. Переключайте слой — список полей меняется."
      >
        <div className={styles.tabs}>
          {Object.entries(LAYERS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              className={clsx(styles.tab, layer === key && styles.tabActive)}
              onClick={() => setLayer(key)}
            >
              {val.title}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>{L.title} метаданные</p>
          <p className={styles.hint} style={{marginTop: 0}}>
            {L.subtitle}
          </p>
          <ul className={styles.metaList}>
            {L.fields.map(([k, v]) => (
              <li key={k} className={styles.metaItem}>
                <span className={styles.metaKey}>{k}</span>
                <span className={styles.metaVal}>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.hint}>
          Встроенные (EXIF в JPEG), сопутствующие (<code>.xmp</code> sidecar) и внешние (Spotlight, Elasticsearch).
          При конвертации JPEG→PNG EXIF может потеряться, если не скопировать явно.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MetadataExplorerPlayInner;
