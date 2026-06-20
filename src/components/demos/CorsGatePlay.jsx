import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CdGrid2,
  CdHint,
  CdInput,
  CdMono,
  CdStack,
  CdVerdict,
} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function CorsGatePlayInner() {
  const [origin, setOrigin] = useState('https://app.example.com');
  const [api, setApi] = useState('https://api.example.com');
  const [method, setMethod] = useState('GET');
  const [customHeader, setCustomHeader] = useState(false);

  const analysis = useMemo(() => {
    const sameOrigin = origin.replace(/\/$/, '') === api.replace(/\/$/, '');
    const isSimple =
      (method === 'GET' || method === 'HEAD' || method === 'POST') && !customHeader && method !== 'PUT';
    const needsPreflight = !sameOrigin && !isSimple;
    let tone = 'success';
    let verdict = 'Same-origin — CORS не применяется.';
    if (!sameOrigin && isSimple) {
      tone = 'info';
      verdict = 'Cross-origin «простой» запрос: сервер должен вернуть Access-Control-Allow-Origin.';
    }
    if (needsPreflight) {
      tone = 'warning';
      verdict = 'Браузер отправит preflight OPTIONS, затем основной запрос.';
    }
    return {sameOrigin, needsPreflight, tone, verdict};
  }, [origin, api, method, customHeader]);

  const preview = analysis.needsPreflight
    ? `OPTIONS ${api}/data\nAccess-Control-Request-Method: ${method}\n→ 204 + CORS headers\n\n${method} ${api}/data`
    : `${method} ${api}/data\nOrigin: ${origin}\n→ Access-Control-Allow-Origin`;

  return (
    <DemoShell>
      <DemoCard title="CORS — браузерный контроль" subtitle="Same-origin, simple request и preflight">
        <CdStack>
          <div className={styles.corsGrid}>
            <label className={styles.corsOrigin}>
              <span className={styles.sectionLabel}>Origin (страница)</span>
              <CdInput value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </label>
            <div className={styles.corsArrow} aria-hidden>
              →
            </div>
            <label className={styles.corsOrigin}>
              <span className={styles.sectionLabel}>API (сервер)</span>
              <CdInput value={api} onChange={(e) => setApi(e.target.value)} />
            </label>
          </div>

          <div className={toolStyles.chips}>
            {['GET', 'POST', 'PUT'].map((m) => (
              <button
                key={m}
                type="button"
                className={clsx(toolStyles.chip, method === m && toolStyles.chipActive)}
                onClick={() => setMethod(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <label className={styles.hint} style={{display: 'flex', gap: '0.55rem', alignItems: 'center', cursor: 'pointer'}}>
            <input type="checkbox" checked={customHeader} onChange={(e) => setCustomHeader(e.target.checked)} />
            Заголовок Authorization (не simple request)
          </label>

          <CdGrid2>
            <CdHint>Same-origin: {analysis.sameOrigin ? 'да' : 'нет'}</CdHint>
            <CdHint>Preflight OPTIONS: {analysis.needsPreflight ? 'да' : 'нет'}</CdHint>
          </CdGrid2>

          <CdVerdict tone={analysis.tone}>{analysis.verdict}</CdVerdict>
          <CdMono>{preview}</CdMono>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default CorsGatePlayInner;
