import React, {useMemo, useState} from 'react';
import {
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
  SliderRow,
} from '@/components/shared/dataMarkupPlayKit';

export default function ProbabilityBayesPlay() {
  const [prevalence, setPrevalence] = useState(0.01);
  const [sensitivity, setSensitivity] = useState(0.95);
  const [specificity, setSpecificity] = useState(0.9);

  const stats = useMemo(() => {
    const pD = prevalence;
    const pPos = sensitivity * pD + (1 - specificity) * (1 - pD);
    const pDgivenPos = pPos > 0 ? (sensitivity * pD) / pPos : 0;
    return {pPos, pDgivenPos};
  }, [prevalence, sensitivity, specificity]);

  return (
    <PlayRoot title="Байес — условная вероятность" subtitle="Ложноположительный тест: P(болезнь | +)">
      <SliderRow
        label="Prevalence P(D)"
        value={prevalence}
        displayValue={`${(prevalence * 100).toFixed(1)}%`}
        min={0.001}
        max={0.2}
        step={0.001}
        onChange={setPrevalence}
      />
      <SliderRow
        label="Sensitivity P(+|D)"
        value={sensitivity}
        displayValue={`${(sensitivity * 100).toFixed(0)}%`}
        min={0.5}
        max={1}
        step={0.01}
        onChange={setSensitivity}
      />
      <SliderRow
        label="Specificity P(−|¬D)"
        value={specificity}
        displayValue={`${(specificity * 100).toFixed(0)}%`}
        min={0.5}
        max={1}
        step={0.01}
        onChange={setSpecificity}
      />
      <MetricGrid
        items={[
          {label: 'P(+)', value: `${(stats.pPos * 100).toFixed(2)}%`},
          {label: 'P(D|+)', value: `${(stats.pDgivenPos * 100).toFixed(2)}%`, tone: stats.pDgivenPos < 0.2 ? 'error' : 'success'},
        ]}
      />
      <Panel title="Интуиция" muted>
        При редкой болезни даже хороший тест даёт много ложных «+» — доля истинных больных среди положительных остаётся низкой.
      </Panel>
      <Hint>Сдвигайте prevalence влево — P(D|+) резко падает.</Hint>
    </PlayRoot>
  );
}
