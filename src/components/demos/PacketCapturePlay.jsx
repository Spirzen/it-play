import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/PacketCapturePlay.module.css';

const PACKETS = [
  {
    no: 1,
    time: '0.000',
    src: '192.168.1.42',
    dst: '93.184.216.34',
    proto: 'TCP',
    info: '443 → SYN',
    layer: 'TLS Client Hello после TCP handshake',
    hex: '16 03 01 00 c8 01 00 00 c4 03 03 …',
  },
  {
    no: 2,
    time: '0.008',
    src: '93.184.216.34',
    dst: '192.168.1.42',
    proto: 'TCP',
    info: '443 → SYN, ACK',
    layer: 'Подтверждение сессии HTTPS',
    hex: '… flags=0x012',
  },
  {
    no: 3,
    time: '0.042',
    src: '192.168.1.42',
    dst: '8.8.8.8',
    proto: 'DNS',
    info: 'A? example.com',
    layer: 'UDP/53 — запрос A-записи',
    hex: '00 01 01 00 00 01 00 00 00 00 00 00',
  },
  {
    no: 4,
    time: '0.055',
    src: '8.8.8.8',
    dst: '192.168.1.42',
    proto: 'DNS',
    info: 'A 93.184.216.34',
    layer: 'Ответ резолвера',
    hex: '… RCODE=NOERROR',
  },
  {
    no: 5,
    time: '0.120',
    src: '192.168.1.42',
    dst: '203.0.113.7',
    proto: 'HTTP',
    info: 'GET /index.html',
    layer: 'HTTP/1.1 без TLS — виден Host и User-Agent',
    hex: '47 45 54 20 2f 69 6e 64 65 78',
  },
  {
    no: 6,
    time: '0.310',
    src: '198.51.100.66',
    dst: '192.168.1.42',
    proto: 'TCP',
    info: '3389 → SYN',
    layer: 'Сканирование RDP — подозрительный входящий',
    hex: '… dst port 3389',
  },
  {
    no: 7,
    time: '0.420',
    src: '192.168.1.42',
    dst: '198.51.100.66',
    proto: 'UDP',
    info: '123 → NTP',
    layer: 'Синхронизация времени',
    hex: '… port 123',
  },
];

const FILTER_PRESETS = [
  {label: 'Все', value: ''},
  {label: 'tcp.port == 443', value: 'tcp.port == 443'},
  {label: 'dns', value: 'dns'},
  {label: 'http', value: 'http'},
  {label: 'ip.addr == 198.51.100.66', value: 'ip.addr == 198.51.100.66'},
];

function matchFilter(filter, pkt) {
  const f = filter.trim().toLowerCase();
  if (!f) return true;
  if (f.includes('dns')) return pkt.proto === 'DNS';
  if (f.includes('http')) return pkt.proto === 'HTTP';
  if (f.includes('udp')) return pkt.proto === 'UDP';
  if (f.includes('tcp')) {
    if (f.includes('443')) return pkt.proto === 'TCP' && pkt.info.includes('443');
    return pkt.proto === 'TCP';
  }
  if (f.includes('198.51.100.66')) {
    return pkt.src.includes('198.51.100.66') || pkt.dst.includes('198.51.100.66');
  }
  if (f.includes('port') && f.includes('443')) {
    return pkt.info.includes('443');
  }
  return (
    pkt.info.toLowerCase().includes(f) ||
    pkt.src.includes(f) ||
    pkt.dst.includes(f) ||
    pkt.proto.toLowerCase().includes(f)
  );
}

function protoClass(proto) {
  if (proto === 'TCP') return styles.protoTcp;
  if (proto === 'UDP') return styles.protoUdp;
  if (proto === 'DNS') return styles.protoDns;
  if (proto === 'HTTP') return styles.protoHttp;
  return styles.protoTls;
}

function PacketCapturePlayInner() {
  const [filter, setFilter] = useState('');
  const [selectedNo, setSelectedNo] = useState(1);

  const visible = useMemo(
    () => PACKETS.filter((p) => matchFilter(filter, p)),
    [filter],
  );

  const selected =
    visible.find((p) => p.no === selectedNo) ?? visible[0] ?? PACKETS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Захват и фильтрация пакетов"
        subtitle="Упрощённый вид Wireshark: список кадров, Display Filter и разбор выбранного пакета"
      >
        <div className={styles.toolbar}>
          <label className="it-demo__label" style={{margin: 0}} htmlFor="pcap-filter">
            Display Filter:
          </label>
          <input
            id="pcap-filter"
            type="text"
            className={styles.filterInput}
            placeholder="tcp.port == 443, dns, http…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="it-demo__badge">{visible.length} / {PACKETS.length}</span>
        </div>

        <div className={styles.chips}>
          {FILTER_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={clsx(
                'it-demo__btn it-demo__btn--sm',
                filter === p.value ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
              )}
              onClick={() => setFilter(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Proto</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', opacity: 0.7}}>
                    Нет пакетов по фильтру
                  </td>
                </tr>
              ) : (
                visible.map((p) => (
                  <tr
                    key={p.no}
                    className={selected?.no === p.no ? styles.rowActive : undefined}
                    onClick={() => setSelectedNo(p.no)}
                    style={{cursor: 'pointer'}}
                  >
                    <td>{p.no}</td>
                    <td>{p.time}</td>
                    <td>{p.src}</td>
                    <td>{p.dst}</td>
                    <td className={protoClass(p.proto)}>{p.proto}</td>
                    <td>{p.info}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className={styles.detail}>
            <strong>
              Пакет #{selected.no}: {selected.proto} {selected.src} → {selected.dst}
            </strong>
            <p style={{margin: '0.35rem 0 0'}}>{selected.layer}</p>
            <pre>{selected.hex}</pre>
          </div>
        )}

        <p className={styles.hint}>
          В Wireshark и TShark те же идеи: захват на интерфейсе, BPF/Capture Filter на приёме и Display
          Filter для анализа уже сохранённого `.pcap`.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PacketCapturePlayInner;
