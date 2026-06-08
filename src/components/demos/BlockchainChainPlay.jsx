import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/BlockchainChainPlay.module.css';

function demoHash(payload) {
  let h = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    h = (h * 33) ^ payload.charCodeAt(i);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function buildChain(dataRows, consensus) {
  const blocks = [];
  let prev = '00000000';
  dataRows.forEach((data, index) => {
    const nonce = consensus === 'pow' ? String(Math.floor(Math.random() * 9999)) : 'stake';
    const payload = `${index}|${prev}|${data}|${nonce}`;
    const hash = demoHash(payload);
    blocks.push({index, data, prev, nonce, hash, payload});
    prev = hash;
  });
  return blocks;
}

function verifyChain(blocks) {
  for (let i = 0; i < blocks.length; i += 1) {
    const expected = demoHash(blocks[i].payload);
    if (blocks[i].hash !== expected) return {ok: false, at: i, reason: 'хеш блока не совпадает с содержимым'};
    if (i > 0 && blocks[i].prev !== blocks[i - 1].hash) {
      return {ok: false, at: i, reason: 'ссылка на предыдущий блок разорвана'};
    }
  }
  return {ok: true};
}

function BlockchainChainPlayInner() {
  const [rows, setRows] = useState(['Genesis', 'TX: Алиса → Боб 1 BTC', 'TX: Боб → CRM 0.2 BTC']);
  const [consensus, setConsensus] = useState('pow');
  const [tamperIndex, setTamperIndex] = useState(null);
  const [log, setLog] = useState('');

  const blocks = useMemo(() => {
    const built = buildChain(rows, consensus);
    if (tamperIndex != null && built[tamperIndex]) {
      built[tamperIndex] = {
        ...built[tamperIndex],
        data: `${built[tamperIndex].data} [подмена]`,
        hash: 'deadbeef',
      };
    }
    return built;
  }, [rows, consensus, tamperIndex]);

  const check = verifyChain(blocks);

  const addBlock = () => {
    setTamperIndex(null);
    setRows((r) => [...r, `TX #${r.length}: новая операция`]);
    setLog('Добавлен блок: сеть пересчитала хеш и связала его с предыдущим.');
  };

  const tamper = () => {
    if (blocks.length < 2) return;
    const idx = 1;
    setTamperIndex(idx);
    setLog(
      `Подменили данные в блоке #${idx}. Хеш блока и все последующие ссылки стали невалидными — цепочка "ломается".`,
    );
  };

  const mineBlock = () => {
    setTamperIndex(null);
    setLog(
      consensus === 'pow'
        ? 'PoW: майнер перебирает nonce, пока хеш не удовлетворит сложности — блок принят сетью.'
        : 'PoS: валидатор с залогом предлагает блок — узлы проверяют подпись и долю.',
    );
    addBlock();
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Цепочка блоков"
        subtitle="Добавление блока, связь через хеш предыдущего и последствия подмены данных"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {[
            {id: 'pow', label: 'Proof of Work'},
            {id: 'pos', label: 'Proof of Stake'},
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, consensus === c.id && toolStyles.chipActive)}
              onClick={() => setConsensus(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.chain}>
          {blocks.map((b, i) => (
            <React.Fragment key={`${b.index}-${b.hash}`}>
              {i > 0 && (
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              )}
              <div
                className={clsx(
                  styles.block,
                  i === 0 && styles.blockGenesis,
                  check.ok || i < (check.at ?? blocks.length) ? styles.blockValid : styles.blockBroken,
                )}
              >
                <p className={styles.blockIndex}>Блок #{b.index}</p>
                <p className={styles.blockData}>{b.data}</p>
                <p className={styles.blockHash}>hash: {b.hash}</p>
                <p className={styles.blockHash}>prev: {b.prev.slice(0, 8)}…</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={mineBlock}>
            {consensus === 'pow' ? 'Смайнить блок' : 'Валидировать блок'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={tamper}>
            Подменить блок #1
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => {
              setTamperIndex(null);
              setRows(['Genesis', 'TX: Алиса → Боб 1 BTC', 'TX: Боб → CRM 0.2 BTC']);
              setLog('Цепочка сброшена к исходному состоянию.');
            }}
          >
            Сброс
          </button>
        </div>

        <p className={clsx(styles.log, check.ok ? styles.logOk : styles.logErr)}>
          {check.ok
            ? 'Цепочка валидна: каждый блок ссылается на хеш предыдущего.'
            : `Цепочка нарушена на блоке #${check.at}: ${check.reason}.`}
        </p>
        {log && <p className={styles.log}>{log}</p>}
      </DemoCard>
    </DemoShell>
  );
}

export default BlockchainChainPlayInner;
