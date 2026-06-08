import React, {useMemo, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/RooflinePlay.module.css';

const KERNELS = [
  {id: 'saxpy', name: 'SAXPY y=a*x+y', intensity: 0.08, tip: 'Классический memory-bound kernel.'},
  {id: 'stencil', name: '5-point stencil', intensity: 0.125, tip: 'Трафик памяти обычно ограничивает рост FLOPS.'},
  {id: 'fft', name: 'FFT (средний кейс)', intensity: 1.4, tip: 'Смешанный режим, полезна оптимизация доступа.'},
  {id: 'matmul', name: 'Blocked matmul', intensity: 8.0, tip: 'Чаще compute-bound на современных CPU/GPU.'},
];

function RooflinePlayInner() {
  const [peakFlops, setPeakFlops] = useState(220);
  const [memoryBandwidth, setMemoryBandwidth] = useState(95);
  const [selectedKernel, setSelectedKernel] = useState('saxpy');
  const [customIntensity, setCustomIntensity] = useState(0.08);

  const kernel = KERNELS.find((k) => k.id === selectedKernel) ?? KERNELS[0];

  const data = useMemo(() => {
    const intensity = selectedKernel === 'custom' ? customIntensity : kernel.intensity;
    const memoryCeiling = memoryBandwidth * intensity;
    const attainablePerf = Math.min(peakFlops, memoryCeiling);
    const bound = memoryCeiling < peakFlops ? 'memory' : 'compute';
    return {intensity, memoryCeiling, attainablePerf, bound};
  }, [selectedKernel, customIntensity, kernel, peakFlops, memoryBandwidth]);

  return (
    <DemoShell className={styles.root}>
      <header>
        <h3 className={styles.title}>Roofline Explorer</h3>
        <p className={styles.subtitle}>
          Подберите характеристики железа и тип kernel, чтобы увидеть, что ограничивает производительность.
        </p>
      </header>

      <div className={styles.controls}>
        <label className={styles.control}>
          <span>Peak FLOPS — {peakFlops} GFLOPS</span>
          <input
            type="range"
            min="20"
            max="4000"
            step="10"
            value={peakFlops}
            onChange={(e) => setPeakFlops(Number(e.target.value))}
          />
        </label>

        <label className={styles.control}>
          <span>Bandwidth памяти — {memoryBandwidth} GB/s</span>
          <input
            type="range"
            min="10"
            max="1500"
            step="5"
            value={memoryBandwidth}
            onChange={(e) => setMemoryBandwidth(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.kernelPanel}>
        <div className={styles.kernelList}>
          {KERNELS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.kernelBtn} ${selectedKernel === item.id ? styles.kernelBtnActive : ''}`}
              onClick={() => setSelectedKernel(item.id)}
            >
              {item.name}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.kernelBtn} ${selectedKernel === 'custom' ? styles.kernelBtnActive : ''}`}
            onClick={() => setSelectedKernel('custom')}
          >
            Custom intensity
          </button>
        </div>

        {selectedKernel === 'custom' ? (
          <label className={styles.control}>
            <span>Operational intensity — {customIntensity.toFixed(2)} FLOP/Byte</span>
            <input
              type="range"
              min="0.01"
              max="32"
              step="0.01"
              value={customIntensity}
              onChange={(e) => setCustomIntensity(Number(e.target.value))}
            />
          </label>
        ) : (
          <p className={styles.tip}>{kernel.tip}</p>
        )}
      </div>

      <div className={styles.metrics}>
        <article className={styles.metricCard}>
          <h4>Bandwidth * Intensity</h4>
          <div className={styles.metricValue}>{data.memoryCeiling.toFixed(1)} GFLOPS</div>
        </article>
        <article className={styles.metricCard}>
          <h4>Attainable performance</h4>
          <div className={styles.metricValue}>{data.attainablePerf.toFixed(1)} GFLOPS</div>
        </article>
        <article className={styles.metricCard}>
          <h4>Ограничение</h4>
          <div className={styles.metricValue}>{data.bound === 'memory' ? 'Memory-bound' : 'Compute-bound'}</div>
        </article>
      </div>

      <div className={styles.barWrap}>
        <div className={styles.barRow}>
          <span>Потолок CPU/GPU</span>
          <div className={styles.track}>
            <div className={styles.peak} style={{width: '100%'}} />
          </div>
          <strong>{peakFlops.toFixed(0)}</strong>
        </div>
        <div className={styles.barRow}>
          <span>Предел по памяти</span>
          <div className={styles.track}>
            <div className={styles.memory} style={{width: `${Math.min(100, (data.memoryCeiling / peakFlops) * 100)}%`}} />
          </div>
          <strong>{data.memoryCeiling.toFixed(1)}</strong>
        </div>
        <div className={styles.barRow}>
          <span>Достижимая оценка</span>
          <div className={styles.track}>
            <div className={styles.actual} style={{width: `${Math.min(100, (data.attainablePerf / peakFlops) * 100)}%`}} />
          </div>
          <strong>{data.attainablePerf.toFixed(1)}</strong>
        </div>
      </div>
    </DemoShell>
  );
}

export default RooflinePlayInner;
