export const ACTIVATIONS = [
  {id: 'sigmoid', label: 'Sigmoid σ(x)', hint: 'Выход в (0, 1)'},
  {id: 'relu', label: 'ReLU max(0,x)', hint: 'Обнуляет отрицательные'},
  {id: 'tanh', label: 'Tanh tanh(x)', hint: 'Выход в (−1, 1)'},
];

export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function relu(x) {
  return Math.max(0, x);
}

export function tanhAct(x) {
  return Math.tanh(x);
}

export function activate(x, type) {
  if (type === 'relu') return relu(x);
  if (type === 'tanh') return tanhAct(x);
  return sigmoid(x);
}

export function activationLabel(type) {
  if (type === 'relu') return 'ReLU';
  if (type === 'tanh') return 'Tanh';
  return 'Sigmoid';
}

export function createInitialState() {
  return {
    inputValues: [0.5, 0.3, 0.8],
    weights: {
      hidden: [
        [0.2, -0.5, 0.3],
        [0.4, 0.1, -0.2],
        [-0.1, 0.6, 0.4],
      ],
      output: [0.3, -0.4, 0.5],
    },
    bias: {hidden: 0.1, output: -0.2},
    hiddenOutputs: [0, 0, 0],
    finalOutput: 0,
  };
}

export function randomizeState() {
  const rnd = () => (Math.random() - 0.5) * 2;
  return {
    inputValues: [Math.random(), Math.random(), Math.random()],
    weights: {
      hidden: [
        [rnd(), rnd(), rnd()],
        [rnd(), rnd(), rnd()],
        [rnd(), rnd(), rnd()],
      ],
      output: [rnd(), rnd(), rnd()],
    },
    bias: {hidden: rnd(), output: rnd()},
    hiddenOutputs: [0, 0, 0],
    finalOutput: 0,
  };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Пошаговый forward pass. callbacks:
 * onSignal(entry), onHiddenOutputs(arr), onFinalOutput(n), onActiveNeuron(id|null), onProgress(0-1)
 */
export async function runForwardPass(
  {inputValues, weights, bias, activationType},
  {onSignal, onHiddenOutputs, onFinalOutput, onActiveNeuron, onProgress},
) {
  const act = (x) => activate(x, activationType);
  const actName = activationLabel(activationType);
  const totalSteps = 4 + weights.hidden.length * 2 + 3;
  let step = 0;
  const tick = () => {
    step += 1;
    onProgress?.(Math.min(1, step / totalSteps));
  };

  onSignal({
    type: 'input',
    message: 'Входной слой: значения x₁…x₃',
    data: inputValues.map((v, i) => `x${i + 1} = ${v.toFixed(3)}`),
  });
  tick();
  await wait(500);

  const hiddenResults = [];

  for (let i = 0; i < weights.hidden.length; i++) {
    onActiveNeuron?.(`h${i}`);
    let sum = bias.hidden;
    const calculations = [];

    for (let j = 0; j < inputValues.length; j++) {
      const weighted = inputValues[j] * weights.hidden[i][j];
      sum += weighted;
      calculations.push(
        `${inputValues[j].toFixed(3)} × ${weights.hidden[i][j].toFixed(2)} = ${weighted.toFixed(3)}`,
      );
    }

    onSignal({
      type: 'hidden',
      message: `H${i + 1}: Σ = bias + Σ(x·w) = ${sum.toFixed(3)}`,
      data: [`bias = ${bias.hidden.toFixed(2)}`, ...calculations],
      neuron: `h${i}`,
    });
    tick();
    await wait(450);

    const activated = act(sum);
    hiddenResults.push(activated);

    onSignal({
      type: 'activation',
      message: `${actName}(${sum.toFixed(3)}) → ${activated.toFixed(3)}`,
      neuron: `h${i}`,
    });
    tick();
    await wait(380);
  }

  onHiddenOutputs?.(hiddenResults);
  onActiveNeuron?.(null);

  onSignal({
    type: 'hidden-output',
    message: 'Передача в выходной слой',
    data: hiddenResults.map((v, i) => `H${i + 1} = ${v.toFixed(3)}`),
  });
  tick();
  await wait(450);

  onActiveNeuron?.('output');
  let outputSum = bias.output;
  const outputCalculations = [];

  for (let i = 0; i < hiddenResults.length; i++) {
    const weighted = hiddenResults[i] * weights.output[i];
    outputSum += weighted;
    outputCalculations.push(
      `${hiddenResults[i].toFixed(3)} × ${weights.output[i].toFixed(2)} = ${weighted.toFixed(3)}`,
    );
  }

  onSignal({
    type: 'output-sum',
    message: `Выход: Σ = ${outputSum.toFixed(3)}`,
    data: [`bias = ${bias.output.toFixed(2)}`, ...outputCalculations],
  });
  tick();
  await wait(450);

  const finalActivated = act(outputSum);
  onFinalOutput?.(finalActivated);

  onSignal({
    type: 'output',
    message: `Результат сети: ${finalActivated.toFixed(4)}`,
    data: [`${actName}(${outputSum.toFixed(3)}) = ${finalActivated.toFixed(4)}`],
  });
  tick();
  onActiveNeuron?.(null);
  onProgress?.(1);
}

/** Координаты узлов для SVG (viewBox 0 0 100 100) */
export function getNetworkLayout() {
  return {
    inputs: [
      {id: 'i0', x: 8, y: 22},
      {id: 'i1', x: 8, y: 50},
      {id: 'i2', x: 8, y: 78},
    ],
    hidden: [
      {id: 'h0', x: 50, y: 18},
      {id: 'h1', x: 50, y: 50},
      {id: 'h2', x: 50, y: 82},
    ],
    output: {id: 'out', x: 92, y: 50},
  };
}
