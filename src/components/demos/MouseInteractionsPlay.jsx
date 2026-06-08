import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/MouseInteractionsPlay.module.css';

const BTN_LABELS = {0: 'ЛКМ', 1: 'СКМ', 2: 'ПКМ'};

function formatEvent(type, button) {
  const btn = button != null ? ` (${BTN_LABELS[button] ?? 'кнопка ' + button})` : '';
  const map = {
    enter: 'Наведение — курсор вошёл в зону',
    leave: 'Наведение — курсор покинул зону',
    click: 'Клик' + btn,
    dblclick: 'Двойной клик' + btn,
    dragStart: 'Захват — начало перетаскивания',
    dragEnd: 'Захват — отпустили элемент',
    contextmenu: 'Контекстное меню (ПКМ)',
    auxclick: 'Средний клик (колёсико)',
  };
  return map[type] ?? type;
}

function MouseVisual({activeButton, pulse}) {
  return (
    <div className={styles.mouseWrap} aria-hidden>
      <div className={styles.mouseBody}>
        <div
          className={clsx(styles.mouseBtn, styles.mouseBtnLeft, {
            [styles.mouseBtnActive]: activeButton === 0,
            [styles.mouseBtnPulse]: pulse === 0,
          })}
          title="Левая кнопка (ЛКМ)"
        />
        <div
          className={clsx(styles.mouseWheel, {
            [styles.mouseBtnActive]: activeButton === 1,
            [styles.mouseBtnPulse]: pulse === 1,
          })}
          title="Средняя кнопка / колёсико (СКМ)"
        />
        <div
          className={clsx(styles.mouseBtn, styles.mouseBtnRight, {
            [styles.mouseBtnActive]: activeButton === 2,
            [styles.mouseBtnPulse]: pulse === 2,
          })}
          title="Правая кнопка (ПКМ)"
        />
      </div>
      <ul className={styles.mouseLegend}>
        <li>
          <span className={clsx(styles.legendDot, styles.legendLeft)} /> ЛКМ — основное действие
        </li>
        <li>
          <span className={clsx(styles.legendDot, styles.legendMid)} /> СКМ — нажатие колёсика
        </li>
        <li>
          <span className={clsx(styles.legendDot, styles.legendRight)} /> ПКМ — контекстное меню
        </li>
      </ul>
    </div>
  );
}

function MouseInteractionsPlayInner() {
  const [log, setLog] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [folderOpen, setFolderOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({x: 24, y: 24});
  const dragRef = useRef(null);
  const arenaRef = useRef(null);
  const pulseTimer = useRef(null);

  const pushLog = useCallback((type, button = null) => {
    const text = formatEvent(type, button);
    setLog((prev) => [{id: Date.now() + Math.random(), text}, ...prev].slice(0, 8));
  }, []);

  const flashButton = useCallback((btn) => {
    setActiveButton(btn);
    setPulse(btn);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => {
      setPulse(null);
      setActiveButton(null);
    }, 450);
  }, []);

  const registerPointer = useCallback(
    (type, e) => {
      const btn = e.button;
      flashButton(btn);
      pushLog(type, btn);
    },
    [flashButton, pushLog],
  );

  const onDragPointerDown = (e) => {
    if (e.button !== 0 || !arenaRef.current) return;
    e.preventDefault();
    const rect = arenaRef.current.getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left - dragPos.x,
      offsetY: e.clientY - rect.top - dragPos.y,
    };
    setDragging(true);
    pushLog('dragStart', 0);
    flashButton(0);
  };

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      if (!dragRef.current || !arenaRef.current) return;
      const rect = arenaRef.current.getBoundingClientRect();
      const size = 56;
      const x = Math.max(8, Math.min(e.clientX - rect.left - dragRef.current.offsetX, rect.width - size - 8));
      const y = Math.max(8, Math.min(e.clientY - rect.top - dragRef.current.offsetY, rect.height - size - 8));
      setDragPos({x, y});
    };

    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
      pushLog('dragEnd', 0);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, pushLog]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Попробуйте действия мыши"
        subtitle="Наведите курсор, кликните, сделайте двойной клик, перетащите блок и нажмите разные кнопки — события появятся в журнале."
      >
        <div className={styles.layout}>
          <MouseVisual activeButton={activeButton} pulse={pulse} />

          <div ref={arenaRef} className={styles.arena}>
            <div
              className={clsx(styles.zone, styles.zoneHover, hovered && styles.zoneActive)}
              onMouseEnter={() => {
                setHovered(true);
                pushLog('enter');
              }}
              onMouseLeave={() => {
                setHovered(false);
                pushLog('leave');
              }}
            >
              <span className={styles.zoneIcon} aria-hidden>
                👆
              </span>
              <strong>Наведение</strong>
              <span className={styles.zoneHint}>Подведите курсор сюда</span>
            </div>

            <div
              className={styles.zone}
              onClick={(e) => {
                registerPointer('click', e);
                setClickCount((c) => c + 1);
              }}
            >
              <span className={styles.zoneIcon} aria-hidden>
                🖱️
              </span>
              <strong>Клик (ЛКМ)</strong>
              <span className={styles.zoneHint}>Счётчик: {clickCount}</span>
            </div>

            <div
              className={clsx(styles.zone, folderOpen && styles.zoneFolderOpen)}
              onDoubleClick={(e) => {
                registerPointer('dblclick', e);
                setFolderOpen(true);
              }}
            >
              <span className={styles.zoneIcon} aria-hidden>
                {folderOpen ? '📂' : '📁'}
              </span>
              <strong>Двойной клик</strong>
              <span className={styles.zoneHint}>
                {folderOpen ? 'Папка открыта!' : 'Два быстрых клика ЛКМ'}
              </span>
            </div>

            <div
              className={styles.zone}
              onContextMenu={(e) => {
                e.preventDefault();
                flashButton(2);
                pushLog('contextmenu', 2);
              }}
              onAuxClick={(e) => {
                e.preventDefault();
                registerPointer('auxclick', e);
              }}
            >
              <span className={styles.zoneIcon} aria-hidden>
                ⋮
              </span>
              <strong>ПКМ и СКМ</strong>
              <span className={styles.zoneHint}>ПКМ или нажмите колёсико</span>
            </div>

            <div
              className={clsx(styles.dragBox, dragging && styles.dragBoxActive)}
              style={{left: dragPos.x, top: dragPos.y}}
              onPointerDown={onDragPointerDown}
              role="button"
              tabIndex={0}
              aria-label="Перетаскиваемый элемент"
            >
              ↔
            </div>
            <p className={styles.dragLabel}>Захват и перетаскивание — потяните за синий блок</p>
          </div>
        </div>

        <div className={styles.logPanel} aria-live="polite">
          <p className={styles.logTitle}>Журнал событий</p>
          {log.length === 0 ? (
            <p className={styles.logEmpty}>Взаимодействуйте с зонами выше — здесь появятся события</p>
          ) : (
            <ul className={styles.logList}>
              {log.map((entry) => (
                <li key={entry.id}>{entry.text}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="it-demo__row" style={{marginTop: '0.75rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => {
              setLog([]);
              setClickCount(0);
              setFolderOpen(false);
              setDragPos({x: 24, y: 24});
            }}
          >
            Сбросить
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MouseInteractionsPlayInner;
