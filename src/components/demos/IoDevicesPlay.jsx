import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataBasicsPlay.module.css';

const DEVICES = [
  {id: 'kb', icon: '⌨️', name: 'Клавиатура', dir: 'in', mech: 'Прерывание', data: 'Коды клавиш (Unicode/scan)', flow: ['Клавиша', 'Драйвер', 'ОС', 'Приложение']},
  {id: 'mouse', icon: '🖱️', name: 'Мышь', dir: 'in', mech: 'Прерывание', data: 'Координаты, клики, колесо', flow: ['Сенсор', 'HID', 'Окно']},
  {id: 'mic', icon: '🎤', name: 'Микрофон', dir: 'in', mech: 'DMA / поток', data: 'PCM-сэмплы', flow: ['Аналог', 'АЦП', 'Буфер', 'Кодек']},
  {id: 'mon', icon: '🖥️', name: 'Монитор', dir: 'out', mech: 'DMA', data: 'Кадр в видеопамяти', flow: ['GPU', 'HDMI/DP', 'Пиксели']},
  {id: 'print', icon: '🖨️', name: 'Принтер', dir: 'out', mech: 'Блочный I/O', data: 'PDF/PostScript', flow: ['Спулер', 'Драйвер', 'Бумага']},
  {id: 'hdd', icon: '💾', name: 'SSD/HDD', dir: 'both', mech: 'DMA', data: 'Блоки 4 КБ', flow: ['Приложение', 'ОС', 'Контроллер', 'Накопитель']},
  {id: 'net', icon: '📡', name: 'Сеть', dir: 'both', mech: 'Прерывание + DMA', data: 'Пакеты TCP/IP', flow: ['Сокет', 'NIC', 'Кабель', 'Сервер']},
];

const MECHS = [
  {id: 'prog', name: 'Программный', desc: 'CPU опрашивает порт в цикле — просто, но нагружает процессор.'},
  {id: 'intr', name: 'Прерывания', desc: 'Устройство сигнализирует "данные готовы" — типично для клавиатуры.'},
  {id: 'dma', name: 'DMA', desc: 'Прямой доступ к RAM без CPU — диск, сеть, звук.'},
];

function IoDevicesPlayInner() {
  const [devId, setDevId] = useState('kb');
  const [mechId, setMechId] = useState('intr');
  const dev = DEVICES.find((d) => d.id === devId) ?? DEVICES[0];
  const mech = MECHS.find((m) => m.id === mechId) ?? MECHS[1];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Ввод и вывод (I/O)" subtitle="Выберите устройство — увидите направление потока и тип данных.">
        <div className={styles.grid4} style={{gridTemplateColumns: 'repeat(auto-fill, minmax(5.5rem, 1fr))'}}>
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={clsx(styles.modCard, devId === d.id && styles.modCardActive)}
              onClick={() => {
                setDevId(d.id);
                if (d.mech.includes('DMA')) setMechId('dma');
                else if (d.mech.includes('Прерыван')) setMechId('intr');
                else setMechId('prog');
              }}
            >
              <div className={styles.modIcon}>{d.icon}</div>
              <div className={styles.modName}>{d.name}</div>
            </button>
          ))}
        </div>

        <div className={styles.flowRow}>
          {dev.flow.map((step, i) => (
            <React.Fragment key={step}>
              <span className={clsx(styles.flowNode, i === dev.flow.length - 1 && styles.flowNodeActive)}>{step}</span>
              {i < dev.flow.length - 1 && <span className={styles.flowArrow}>→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.statGrid}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>
              {dev.dir === 'in' ? '📥' : dev.dir === 'out' ? '📤' : '🔄'}
            </span>
            <span className={styles.statLbl}>
              {dev.dir === 'in' ? 'ввод' : dev.dir === 'out' ? 'вывод' : 'двунаправл.'}
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{fontSize: '0.7rem'}}>
              {dev.mech}
            </span>
            <span className={styles.statLbl}>механизм</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{fontSize: '0.72rem'}}>
              {dev.data}
            </span>
            <span className={styles.statLbl}>данные</span>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Организация I/O" subtitle="Три способа, как процессор отдаёт работу устройствам.">
        <div className={styles.tabs}>
          {MECHS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.tab, mechId === m.id && styles.tabActive)}
              onClick={() => setMechId(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{mech.desc}</p>
        <p className={styles.hint}>
          По типу данных: символьный (текст посимвольно), блочный (файлы блоками), потоковый (аудио/видео без
          фиксированного размера блока).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default IoDevicesPlayInner;
