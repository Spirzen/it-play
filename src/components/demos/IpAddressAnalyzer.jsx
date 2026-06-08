import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import styles from '@/components/shared/kb/toolDemo.module.css';

const PRESETS = [
  {label: 'Дом /24', ip: '192.168.1.10', mask: '/24'},
  {label: 'Офис /16', ip: '10.0.5.20', mask: '/16'},
  {label: 'Хост /32', ip: '8.8.8.8', mask: '/32'},
];

function isValidIp(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !Number.isNaN(num) && num >= 0 && num <= 255 && part === String(num);
  });
}

function parseCidr(mask) {
  if (mask.startsWith('/')) {
    const val = parseInt(mask.substring(1), 10);
    if (Number.isNaN(val) || val < 0 || val > 32) {
      return null;
    }
    return val;
  }
  const parts = mask.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  const binary = parts.map((p) => p.toString(2).padStart(8, '0')).join('');
  if (!/^1*0*$/.test(binary)) {
    return null;
  }
  return binary.split('1').length - 1;
}

function calculateNetwork(ip, cidrBits) {
  const ipParts = ip.split('.').map(Number);
  const ipLong = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
  const maskLong = cidrBits === 0 ? 0 : (-1 >>> (32 - cidrBits)) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | (~maskLong >>> 0)) >>> 0;

  const fromLong = (long) =>
    [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');

  const totalHosts = Math.max(0, 2 ** (32 - cidrBits) - 2);
  const hostBits = 32 - cidrBits;

  return {
    cidr: `/${cidrBits}`,
    network: fromLong(networkLong),
    broadcast: fromLong(broadcastLong),
    firstHost: cidrBits >= 31 ? '—' : fromLong(networkLong + 1),
    lastHost: cidrBits >= 31 ? '—' : fromLong(broadcastLong - 1),
    totalHosts,
    wildcard: fromLong((~maskLong) >>> 0),
    hostBits,
    networkPct: cidrBits > 0 ? (cidrBits / 32) * 100 : 0,
    hostPct: hostBits > 0 ? (hostBits / 32) * 100 : 0,
  };
}

function IpAddressAnalyzerInner() {
  const {isMobile} = useBreakpoint();
  const [ipInput, setIpInput] = useState('192.168.1.10');
  const [maskInput, setMaskInput] = useState('/24');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const {copy, isCopied} = useCopyToClipboard();

  const runCalc = useCallback(() => {
    setError(null);
    setResult(null);

    const ip = ipInput.trim();
    const mask = maskInput.trim();

    if (!ip || !mask) {
      setError('Заполните IP-адрес и маску подсети.');
      return;
    }
    if (!isValidIp(ip)) {
      setError('Неверный IP. Ожидается формат X.X.X.X (0–255).');
      return;
    }

    const cidrBits = parseCidr(mask);
    if (cidrBits === null) {
      setError('Неверная маска. Используйте CIDR (/24) или 255.255.255.0.');
      return;
    }

    try {
      setResult({ip, mask, ...calculateNetwork(ip, cidrBits)});
    } catch (err) {
      setError(err.message);
    }
  }, [ipInput, maskInput]);

  useEffect(() => {
    if (isMobile) {
      return undefined;
    }
    const timer = window.setTimeout(runCalc, 500);
    return () => window.clearTimeout(timer);
  }, [ipInput, maskInput, isMobile, runCalc]);

  const summary = useMemo(() => {
    if (!result) {
      return '';
    }
    return [
      `IP: ${result.ip} ${result.cidr}`,
      `Сеть: ${result.network}`,
      `Broadcast: ${result.broadcast}`,
      `Хосты: ${result.firstHost} — ${result.lastHost} (${result.totalHosts.toLocaleString('ru-RU')})`,
    ].join('\n');
  }, [result]);

  return (
    <DemoShell>
      <DemoCard
        title="Анализатор IP и маски подсети"
        subtitle="Сетевой и broadcast-адрес, диапазон хостов и wildcard-маска."
      >
        <div className={styles.chips}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.chip}
              onClick={() => {
                setIpInput(p.ip);
                setMaskInput(p.mask);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')}>
          <div>
            <label className="it-demo__label" htmlFor="ip-input">
              IP-адрес
            </label>
            <input
              id="ip-input"
              className={clsx('it-demo__input', styles.mono)}
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runCalc()}
              placeholder="192.168.1.10"
            />
          </div>
          <div>
            <label className="it-demo__label" htmlFor="mask-input">
              Маска
            </label>
            <input
              id="mask-input"
              className={clsx('it-demo__input', styles.mono)}
              value={maskInput}
              onChange={(e) => setMaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runCalc()}
              placeholder="/24"
            />
          </div>
        </div>

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runCalc}>
            Рассчитать
          </button>
          {result && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(summary, 'sum')}
            >
              {isCopied('sum') ? 'Скопировано' : 'Копировать сводку'}
            </button>
          )}
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        {result && (
          <>
            <div
              className={styles.subnetBar}
              title={`Сеть ${result.cidr}: ${result.networkPct.toFixed(0)}% адреса, хосты ${result.hostPct.toFixed(0)}%`}
              aria-hidden
            >
              <span
                className={styles.subnetNetwork}
                style={{width: `${Math.max(result.networkPct, 4)}%`}}
              />
              <span className={styles.subnetHost} style={{flex: 1}} />
              {result.cidr !== '/32' && result.cidr !== '/31' && (
                <span className={styles.subnetBroadcast} style={{width: '4%'}} />
              )}
            </div>

            <div className="it-demo__table-wrap">
              <table className="it-demo__table">
                <tbody>
                  {[
                    ['Исходные данные', `${result.ip} ${result.cidr}`],
                    ['Сетевой адрес', result.network],
                    ['Broadcast', result.broadcast],
                    ['Первый хост', result.firstHost],
                    ['Последний хост', result.lastHost],
                    ['Количество хостов', result.totalHosts.toLocaleString('ru-RU')],
                    ['Wildcard-маска', result.wildcard],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td className={styles.valueMono}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="it-demo__alert it-demo__alert--info">
          Маска в формате CIDR (<code className={styles.mono}>/24</code>) или классическая (
          <code className={styles.mono}>255.255.255.0</code>).
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default IpAddressAnalyzerInner;
