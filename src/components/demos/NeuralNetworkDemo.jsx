import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ACTIVATIONS,
  createInitialState,
  getNetworkLayout,
  randomizeState,
  runForwardPass,
} from '@/components/shared/kb/neuralNetworkEngine';
import styles from '@/components/demos/NeuralNetworkDemo.module.css';

const SIGNAL_CLASS = {
  input: styles.signalInput,
  hidden: styles.signalHidden,
  activation: styles.signalActivation,
  'hidden-output': styles.signalHidden,
  'output-sum': styles.signalActivation,
  output: styles.signalOutput,
};

function NetworkSvg({layout, inputValues, hiddenOutputs, finalOutput, activeNeuron, pulseEdges}) {
  const edges = [];
  layout.inputs.forEach((inp, j) => {
    layout.hidden.forEach((hid, i) => {
      edges.push({
        key: `i${j}-h${i}`,
        x1: inp.x,
        y1: inp.y,
        x2: hid.x,
        y2: hid.y,
        active: pulseEdges && activeNeuron === `h${i}`,
      });
    });
  });
  layout.hidden.forEach((hid, i) => {
    edges.push({
      key: `h${i}-out`,
      x1: hid.x,
      y1: hid.y,
      x2: layout.output.x,
      y2: layout.output.y,
      active: pulseEdges && activeNeuron === 'output',
    });
  });

  const nodeClass = (id, layer) => {
    const active = activeNeuron === id;
    if (layer === 'input') return clsx(styles.neuronCircle, styles.neuronCircleInput, active && styles.neuronCircleActive);
    if (layer === 'hidden') return clsx(styles.neuronCircle, styles.neuronCircleHidden, active && styles.neuronCircleActive);
    return clsx(styles.neuronCircle, styles.neuronCircleOutput, active && styles.neuronCircleActive);
  };

  return (
    <svg className={styles.svgWrap} viewBox="0 0 100 100" role="img" aria-label="Схема нейросети">
      {edges.map((e) => (
        <line
          key={e.key}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          className={clsx(styles.svgEdge, e.active && styles.svgEdgeActive)}
        />
      ))}
      {layout.inputs.map((n, i) => (
        <g key={n.id} className={styles.neuronNode}>
          <circle cx={n.x} cy={n.y} r="6" className={nodeClass(`i${i}`, 'input')} />
          <text x={n.x} y={n.y - 8} textAnchor="middle" className={styles.neuronLabel}>
            x{i + 1}
          </text>
          <text x={n.x} y={n.y + 11} textAnchor="middle" className={styles.neuronValue}>
            {inputValues[i].toFixed(2)}
          </text>
        </g>
      ))}
      {layout.hidden.map((n, i) => (
        <g key={n.id} className={styles.neuronNode}>
          <circle cx={n.x} cy={n.y} r="6" className={nodeClass(`h${i}`, 'hidden')} />
          <text x={n.x} y={n.y - 8} textAnchor="middle" className={styles.neuronLabel}>
            H{i + 1}
          </text>
          <text x={n.x} y={n.y + 11} textAnchor="middle" className={styles.neuronValue}>
            {hiddenOutputs[i].toFixed(2)}
          </text>
        </g>
      ))}
      <g className={styles.neuronNode}>
        <circle cx={layout.output.x} cy={layout.output.y} r="7" className={nodeClass('output', 'output')} />
        <text x={layout.output.x} y={layout.output.y - 9} textAnchor="middle" className={styles.neuronLabel}>
          OUT
        </text>
        <text x={layout.output.x} y={layout.output.y + 12} textAnchor="middle" className={styles.neuronValue}>
          {finalOutput.toFixed(3)}
        </text>
      </g>
    </svg>
  );
}

function NeuralNetworkDemoInner() {
  const [state, setState] = useState(createInitialState);
  const [activationType, setActivationType] = useState('sigmoid');
  const [activeNeuron, setActiveNeuron] = useState(null);
  const [signalFlow, setSignalFlow] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulseEdges, setPulseEdges] = useState(false);

  const layout = getNetworkLayout();
  const {inputValues, weights, bias, hiddenOutputs, finalOutput} = state;

  const updateInput = (index, value) => {
    if (isProcessing) return;
    setState((s) => {
      const next = [...s.inputValues];
      next[index] = value;
      return {...s, inputValues: next};
    });
  };

  const updateWeight = (type, i, j, value) => {
    if (isProcessing) return;
    setState((s) => {
      if (type === 'hidden') {
        const hidden = s.weights.hidden.map((row, ri) =>
          ri === i ? row.map((w, ci) => (ci === j ? value : w)) : row,
        );
        return {...s, weights: {...s.weights, hidden}};
      }
      const output = s.weights.output.map((w, wi) => (wi === i ? value : w));
      return {...s, weights: {...s.weights, output}};
    });
  };

  const updateBias = (layer, value) => {
    if (isProcessing) return;
    setState((s) => ({...s, bias: {...s.bias, [layer]: value}}));
  };

  const handleRandomize = () => {
    if (isProcessing) return;
    setState((s) => ({...s, ...randomizeState()}));
    setSignalFlow([]);
    setProgress(0);
  };

  const handleReset = () => {
    if (isProcessing) return;
    setState(createInitialState());
    setSignalFlow([]);
    setProgress(0);
    setActiveNeuron(null);
  };

  const forwardPass = useCallback(async () => {
    setIsProcessing(true);
    setPulseEdges(true);
    setSignalFlow([]);
    setProgress(0);
    setState((s) => ({...s, hiddenOutputs: [0, 0, 0], finalOutput: 0}));

    await runForwardPass(
      {inputValues, weights, bias, activationType},
      {
        onSignal: (entry) => setSignalFlow((prev) => [...prev, entry]),
        onHiddenOutputs: (arr) => setState((s) => ({...s, hiddenOutputs: arr})),
        onFinalOutput: (v) => setState((s) => ({...s, finalOutput: v})),
        onActiveNeuron: setActiveNeuron,
        onProgress: setProgress,
      },
    );

    setIsProcessing(false);
    setPulseEdges(false);
    setActiveNeuron(null);
  }, [inputValues, weights, bias, activationType]);

  return (
    <DemoShell>
      <DemoCard
        title="Нейросеть: прямое распространение"
        subtitle="Вход → взвешенная сумма + bias → функция активации → следующий слой"
      >
        <div className="it-demo__row" style={{marginBottom: '0.75rem', justifyContent: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={forwardPass}
            disabled={isProcessing}
          >
            {isProcessing ? 'Расчёт…' : 'Запустить forward pass'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={handleRandomize}
            disabled={isProcessing}
          >
            Случайные веса
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={handleReset}
            disabled={isProcessing}
          >
            Сброс
          </button>
          <select
            className="it-demo__select"
            style={{width: 'auto', minWidth: '10rem'}}
            value={activationType}
            onChange={(e) => setActivationType(e.target.value)}
            disabled={isProcessing}
          >
            {ACTIVATIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {(isProcessing || progress > 0) && (
          <div className={styles.progressBar} aria-hidden>
            <div className={styles.progressFill} style={{width: `${progress * 100}%`}} />
          </div>
        )}

        <div className={styles.networkCanvas}>
          <NetworkSvg
            layout={layout}
            inputValues={inputValues}
            hiddenOutputs={hiddenOutputs}
            finalOutput={finalOutput}
            activeNeuron={activeNeuron}
            pulseEdges={pulseEdges}
          />
        </div>

        {finalOutput > 0 && !isProcessing && (
          <div className={styles.outputHero}>y = {finalOutput.toFixed(4)}</div>
        )}

        <div className={styles.controlsGrid}>
          <div className={styles.controlPanel}>
            <h4 className={styles.controlPanelTitle}>Входы x₁…x₃</h4>
            {inputValues.map((val, idx) => (
              <div key={idx} className={styles.weightRow}>
                <div className={styles.weightLabel}>
                  x{idx + 1}: {val.toFixed(3)}
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={val}
                  onChange={(e) => updateInput(idx, parseFloat(e.target.value))}
                  disabled={isProcessing}
                  style={{width: '100%'}}
                />
              </div>
            ))}
          </div>

          <div className={styles.controlPanel}>
            <h4 className={styles.controlPanelTitle}>Веса скрытого слоя</h4>
            {weights.hidden.map((neuron, i) => (
              <div key={i} className={styles.weightRow}>
                <div className={styles.weightLabel}>H{i + 1}</div>
                <div className={styles.weightSliders}>
                  {neuron.map((w, j) => (
                    <input
                      key={j}
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={w}
                      onChange={(e) => updateWeight('hidden', i, j, parseFloat(e.target.value))}
                      disabled={isProcessing}
                      title={`w${j + 1}=${w.toFixed(2)}`}
                    />
                  ))}
                </div>
                <div style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
                  {neuron.map((w) => w.toFixed(2)).join(' · ')}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.controlPanel}>
            <h4 className={styles.controlPanelTitle}>Выходной слой и bias</h4>
            <div className={styles.weightRow}>
              <div className={styles.weightLabel}>Веса → OUT</div>
              <div className={styles.weightSliders}>
                {weights.output.map((w, i) => (
                  <input
                    key={i}
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={w}
                    onChange={(e) => updateWeight('output', i, 0, parseFloat(e.target.value))}
                    disabled={isProcessing}
                  />
                ))}
              </div>
            </div>
            <div className="it-demo__grid it-demo__grid--2" style={{marginTop: '0.5rem'}}>
              <div>
                <label className="it-demo__label">Bias скрытый ({bias.hidden.toFixed(2)})</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={bias.hidden}
                  onChange={(e) => updateBias('hidden', parseFloat(e.target.value))}
                  disabled={isProcessing}
                  style={{width: '100%'}}
                />
              </div>
              <div>
                <label className="it-demo__label">Bias выход ({bias.output.toFixed(2)})</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={bias.output}
                  onChange={(e) => updateBias('output', parseFloat(e.target.value))}
                  disabled={isProcessing}
                  style={{width: '100%'}}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="it-demo__panel" style={{marginTop: '0.75rem', maxHeight: '280px', overflowY: 'auto'}}>
          <h4 style={{margin: '0 0 0.5rem', fontSize: '0.9rem'}}>Поток вычислений</h4>
          {signalFlow.length === 0 ? (
            <p style={{margin: 0, color: 'var(--demo-muted)', fontSize: '0.85rem'}}>
              Запустите forward pass, чтобы увидеть пошаговый расчёт каждого нейрона.
            </p>
          ) : (
            signalFlow.map((signal, idx) => (
              <div
                key={idx}
                className={clsx(styles.signalEntry, SIGNAL_CLASS[signal.type] ?? styles.signalHidden)}
              >
                <div style={{fontWeight: 600}}>{signal.message}</div>
                {signal.data && (
                  <div className={styles.signalData}>
                    {signal.data.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '0.85rem', marginBottom: 0}}>
          <strong>Как читать схему:</strong> линии — связи с весами; подсветка показывает, какой нейрон
          сейчас считает сумму. Меняйте входы и веса, затем снова запускайте расчёт.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default NeuralNetworkDemoInner;
