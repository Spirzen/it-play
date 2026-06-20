import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';

const BLOCKS = [
  {id: 'embed', title: 'Token + Positional Embedding', desc: 'ID токена + позиция → вектор d_model.'},
  {id: 'mha', title: 'Multi-Head Self-Attention', desc: 'Параллельные головы считают Q, K, V и смешивают контекст.'},
  {id: 'add1', title: 'Add & Norm', desc: 'Residual connection + LayerNorm после attention.'},
  {id: 'ffn', title: 'Feed-Forward Network', desc: 'Два линейных слоя с нелинейностью на каждой позиции.'},
  {id: 'add2', title: 'Add & Norm (выход)', desc: 'Второй residual — вход следующего слоя.'},
];

function TransformerBlockStepperInner() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Блок трансформера" subtitle="Пошаговый encoder-слой">
        <div className={shared.progressTrack}>
          <div className={shared.progressFill} style={{width: `${((step + 1) / BLOCKS.length) * 100}%`}} />
        </div>

        <div className={shared.stepList}>
          {BLOCKS.map((b, i) => (
            <div key={b.id} className={clsx(shared.stepCard, i <= step && shared.stepCardDone, i === step && shared.stepCardActive)}>
              <span className={shared.stepCardNum}>{i + 1}</span>
              <div className={shared.stepCardBody}>
                <span className={shared.stepCardTitle}>{b.title}</span>
                {i <= step && <p className={shared.stepCardDesc}>{b.desc}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setStep((s) => Math.min(BLOCKS.length - 1, s + 1))} disabled={step >= BLOCKS.length - 1}>
            Далее
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStep(0)}>
            С начала
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TransformerBlockStepperInner;
