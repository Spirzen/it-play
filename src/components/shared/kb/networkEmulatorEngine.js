/** Симуляция ICMP-подобных зондов и UDP/TCP-датаграмм с задержкой и потерями. */

export const PROTOCOLS = {
  tcp: {id: 'tcp', label: 'TCP', reliable: true},
  udp: {id: 'udp', label: 'UDP', reliable: false},
};

export function rollLoss(lossPct) {
  return Math.random() * 100 < lossPct;
}

export function sampleRtt(baseMs, jitterMs) {
  const jitter = jitterMs > 0 ? (Math.random() * 2 - 1) * jitterMs : 0;
  return Math.max(1, Math.round(baseMs + jitter));
}

let packetSeq = 0;

export function nextPacketId() {
  packetSeq += 1;
  return packetSeq;
}

function simulateLeg(opts, protocol) {
  const lost = rollLoss(opts.lossPct);
  if (!lost) {
    return {lost: false, ms: sampleRtt(opts.baseLatency, opts.jitter), retransmitted: false};
  }
  if (!protocol.reliable) {
    return {lost: true, ms: 0, retransmitted: false};
  }
  const penalty = Math.round(opts.baseLatency * 1.5 + opts.jitter * 0.5);
  return {
    lost: false,
    ms: sampleRtt(opts.baseLatency, opts.jitter) + penalty,
    retransmitted: true,
  };
}

/**
 * @param {{ protocol: 'tcp'|'udp', baseLatency: number, jitter: number, lossPct: number }} opts
 * @returns {{ lost: boolean, rttMs: number | null, retransmitted: boolean }}
 */
export function simulateRoundTrip(opts) {
  const protocol = PROTOCOLS[opts.protocol] ?? PROTOCOLS.udp;
  const out = simulateLeg(opts, protocol);
  if (out.lost) {
    return {lost: true, rttMs: null, retransmitted: false};
  }
  const back = simulateLeg(opts, protocol);
  if (back.lost) {
    return {lost: true, rttMs: null, retransmitted: back.retransmitted || out.retransmitted};
  }
  return {
    lost: false,
    rttMs: out.ms + back.ms,
    retransmitted: out.retransmitted || back.retransmitted,
  };
}

export function emptyStats() {
  return {
    sent: 0,
    received: 0,
    lost: 0,
    retransmitted: 0,
    rtts: [],
  };
}

export function applyPacketResult(stats, result) {
  const next = {...stats, sent: stats.sent + 1};
  if (result.lost) {
    return {...next, lost: next.lost + 1};
  }
  return {
    ...next,
    received: next.received + 1,
    retransmitted: next.retransmitted + (result.retransmitted ? 1 : 0),
    rtts: [...next.rtts, result.rttMs],
  };
}

export function summarizeStats(stats) {
  const {sent, received, lost, retransmitted, rtts} = stats;
  const lossPct = sent ? Math.round((lost / sent) * 1000) / 10 : 0;
  const sorted = [...rtts].sort((a, b) => a - b);
  const avg = rtts.length ? Math.round(rtts.reduce((s, v) => s + v, 0) / rtts.length) : null;
  const min = sorted[0] ?? null;
  const max = sorted[sorted.length - 1] ?? null;
  const p95 = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] : null;
  return {sent, received, lost, retransmitted, lossPct, avg, min, max, p95};
}
