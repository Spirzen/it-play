import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DisplayTechPlay.module.css';

const PANELS = [
  {
    id: 'tn',
    label: 'TN',
    name: 'Twisted Nematic',
    emissive: false,
    black: 'Серый "чёрный"',
    contrast: '~1000:1',
    response: '3–5 мс',
    angles: 'Узкие',
    use: 'Киберспорт, бюджет',
    hint: 'Быстрый отклик, но цвет "плывёт", если смотреть сбоку.',
    glow: false,
    offAxis: true,
  },
  {
    id: 'ips',
    label: 'IPS',
    name: 'In-Plane Switching',
    emissive: false,
    black: 'Тёмно-серый',
    contrast: '~1200:1',
    response: '4–8 мс',
    angles: 'Широкие ±85°',
    use: 'Дизайн, код, офис',
    hint: 'IPS glow — засветка по краям на тёмных сценах под углом.',
    glow: true,
    offAxis: false,
  },
  {
    id: 'va',
    label: 'VA',
    name: 'Vertical Alignment',
    emissive: false,
    black: 'Глубокий чёрный',
    contrast: '3000:1+',
    response: '25–30 мс (тёмный→светлый)',
    angles: 'Средние',
    use: 'ТВ, кино',
    hint: 'Отличный контраст, но в динамике возможен motion blur.',
    glow: false,
    offAxis: true,
  },
  {
    id: 'oled',
    label: 'OLED',
    name: 'Organic LED',
    emissive: true,
    black: 'Пиксель выключен',
    contrast: '∞ (теор.)',
    response: '< 0,1 мс',
    angles: 'Идеальные',
    use: 'Премиум, смартфоны',
    hint: 'Риск burn-in при статичных панелях интерфейса.',
    glow: false,
    offAxis: false,
  },
];

const RES_PRESETS = [
  {id: 'hd', label: 'HD', w: 1280, h: 720},
  {id: 'fhd', label: 'Full HD', w: 1920, h: 1080},
  {id: 'qhd', label: 'QHD', w: 2560, h: 1440},
  {id: 'uhd', label: '4K UHD', w: 3840, h: 2160},
];

const PORTS = [
  {
    id: 'hdmi',
    label: 'HDMI 2.1',
    bw: '48 Гбит/с',
    max: '4K @ 120 Гц / 8K @ 60 Гц',
    extra: 'VRR, eARC, домашний кинотеатр',
  },
  {
    id: 'dp',
    label: 'DisplayPort 2.0',
    bw: '77 Гбит/с',
    max: '4K @ 240 Гц (с DSC)',
    extra: 'MST, мониторы и ПК, без роялти',
  },
  {
    id: 'usbc',
    label: 'USB-C (DP Alt)',
    bw: 'до 40 Гбит/с',
    max: 'видео + данные + питание',
    extra: 'Ноутбуки, док-станции — не каждый порт выводит видео',
  },
];

function DisplayTechPlayInner() {
  const [panelId, setPanelId] = useState('oled');
  const [offAxis, setOffAxis] = useState(false);
  const [resIdx, setResIdx] = useState(2);
  const [diag, setDiag] = useState(27);
  const [portId, setPortId] = useState('dp');

  const panel = PANELS.find((p) => p.id === panelId) ?? PANELS[3];
  const res = RES_PRESETS[resIdx] ?? RES_PRESETS[2];
  const port = PORTS.find((p) => p.id === portId) ?? PORTS[1];

  const ppi = useMemo(() => {
    const diagPx = Math.sqrt(res.w * res.w + res.h * res.h);
    return Math.round(diagPx / diag);
  }, [res, diag]);

  const scaleHint = useMemo(() => {
    if (ppi < 110) return 'Элементы интерфейса крупные — масштаб 100% комфортен.';
    if (ppi < 150) return 'На 27″ QHD часто ставят масштаб 125–150%.';
    return '4K на 24–27″ почти всегда требует 150–200% — иначе текст мелкий.';
  }, [ppi]);

  const pixels = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 48; i++) {
      if (panel.emissive) {
        const on = i % 7 !== 0;
        arr.push(on ? ['r', 'g', 'b'][i % 3] : 'off');
      } else {
        arr.push(['r', 'g', 'b'][i % 3]);
      }
    }
    return arr;
  }, [panel.emissive]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Типы матриц" subtitle="Сравните принцип свечения, контраст и углы обзора.">
        <div className={styles.tabs}>
          {PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.tab, panelId === p.id && styles.tabActive)}
              onClick={() => setPanelId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <div>
            <div className={styles.panelPreview}>
              <div
                className={clsx(
                  styles.panelScene,
                  offAxis && !panel.emissive && styles.panelSceneOffAxis,
                )}
                style={{
                  background: panel.emissive
                    ? '#000'
                    : 'linear-gradient(180deg, #1a1a2e 0%, #0f0f14 100%)',
                }}
              >
                {!panel.emissive && <div className={styles.panelBacklight} />}
                <div
                  className={styles.panelGradient}
                  style={{opacity: panel.emissive ? 1 : 0.85}}
                />
                {!panel.emissive && (
                  <div className={clsx(styles.panelGlow, panel.glow && styles.ipsGlow)} />
                )}
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>{panel.name}</span>
                  <span className={styles.badge}>{panel.emissive ? 'эмиссия' : 'подсветка LED'}</span>
                </div>
              </div>
            </div>
            <label className={styles.hint} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={offAxis}
                onChange={(e) => setOffAxis(e.target.checked)}
                disabled={panel.emissive}
              />
              Смотреть под углом (IPS glow / TN-дрейф цвета)
            </label>
            <div className={styles.pixelGrid} aria-hidden>
              {pixels.map((kind, i) => (
                <span
                  key={i}
                  className={clsx(
                    styles.pixel,
                    kind === 'r' && styles.pixelR,
                    kind === 'g' && styles.pixelG,
                    kind === 'b' && styles.pixelB,
                    kind === 'off' && styles.pixelOff,
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <ul className={styles.specList}>
              <li>
                <strong>Чёрный:</strong> {panel.black}
              </li>
              <li>
                <strong>Контраст:</strong> {panel.contrast}
              </li>
              <li>
                <strong>Отклик:</strong> {panel.response}
              </li>
              <li>
                <strong>Углы:</strong> {panel.angles}
              </li>
              <li>
                <strong>Где:</strong> {panel.use}
              </li>
            </ul>
            <p className={styles.hint}>{panel.hint}</p>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Разрешение и PPI" subtitle="Логические пиксели vs физическая сетка — зачем нужен масштаб HiDPI.">
        <div className={styles.tabs}>
          {RES_PRESETS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={clsx(styles.tab, resIdx === i && styles.tabActive)}
              onClick={() => setResIdx(i)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label className={styles.hint}>
          Диагональ монитора: {diag}″
          <input
            type="range"
            className={styles.resSlider}
            min={13}
            max={32}
            value={diag}
            onChange={(e) => setDiag(Number(e.target.value))}
          />
        </label>
        <div className={styles.resStats}>
          <div className={styles.resBox}>
            <span className={styles.resVal}>
              {res.w}×{res.h}
            </span>
            <span className={styles.resLbl}>разрешение</span>
          </div>
          <div className={styles.resBox}>
            <span className={styles.resVal}>{ppi}</span>
            <span className={styles.resLbl}>PPI</span>
          </div>
          <div className={styles.resBox}>
            <span className={styles.resVal}>{Math.round((res.w * res.h) / 1e6)}M</span>
            <span className={styles.resLbl}>пикселей</span>
          </div>
        </div>
        <p className={styles.scalePreview}>{scaleHint}</p>
      </DemoCard>

      <DemoCard title="Кабель и пропускная способность" subtitle="От разъёма зависит максимум разрешения и частоты без сжатия.">
        <div className={styles.portRow}>
          {PORTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.portBtn, portId === p.id && styles.portBtnActive)}
              onClick={() => setPortId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={styles.pipe}>
          <span className={styles.pipeNode}>GPU</span>
          <span className={styles.pipeArrow}>→</span>
          <span className={styles.pipeNode}>{port.label}</span>
          <span className={styles.pipeArrow}>→</span>
          <span className={styles.pipeNode}>Монитор</span>
        </div>
        <ul className={styles.specList}>
          <li>
            <strong>Полоса:</strong> {port.bw}
          </li>
          <li>
            <strong>Потолок:</strong> {port.max}
          </li>
          <li>
            <strong>Заметка:</strong> {port.extra}
          </li>
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default DisplayTechPlayInner;
