import React, {useCallback, useEffect, useRef, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ClusteringPlay.module.css';

const COLORS = ['#e53935', '#1e88e5', '#43a047'];

function randPoints(n = 24) {
  return Array.from({length: n}, () => ({
    x: 40 + Math.random() * 220,
    y: 30 + Math.random() * 140,
  }));
}

function initCentroids() {
  return COLORS.map((_, i) => ({x: 80 + i * 70, y: 80 + i * 25}));
}

function ClusteringPlayInner() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState(randPoints);
  const [centroids, setCentroids] = useState(initCentroids);
  const [assign, setAssign] = useState(() => points.map(() => 0));
  const [step, setStep] = useState(0);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    points.forEach((p, i) => {
      const k = assign[i] ?? 0;
      ctx.fillStyle = COLORS[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    centroids.forEach((cen, k) => {
      ctx.strokeStyle = COLORS[k];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cen.x, cen.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = COLORS[k];
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`C${k + 1}`, cen.x - 8, cen.y - 14);
    });
  }, [points, centroids, assign]);

  useEffect(() => draw(), [draw]);

  const kMeansStep = () => {
    const clusters = [[], [], []];
    const newAssign = points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((cen, k) => {
        const d = (p.x - cen.x) ** 2 + (p.y - cen.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = k;
        }
      });
      clusters[best].push(p);
      return best;
    });
    const newCentroids = centroids.map((cen, k) => {
      const cl = clusters[k];
      if (!cl.length) return cen;
      const x = cl.reduce((s, p) => s + p.x, 0) / cl.length;
      const y = cl.reduce((s, p) => s + p.y, 0) / cl.length;
      return {x, y};
    });
    setAssign(newAssign);
    setCentroids(newCentroids);
    setStep((s) => s + 1);
  };

  const reset = () => {
    const p = randPoints();
    setPoints(p);
    setCentroids(initCentroids());
    setAssign(p.map(() => 0));
    setStep(0);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="K-means (k=3)" subtitle="Один шаг: назначить точки центроидам, затем пересчитать центроиды">
        <canvas ref={canvasRef} className={styles.canvas} width={300} height={180} aria-label="2D точки" />
        <p className={styles.status}>Итерация: {step}</p>
        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={kMeansStep}>
            Шаг k-means
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ClusteringPlayInner;
