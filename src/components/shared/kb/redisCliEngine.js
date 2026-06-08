const stores = {
  0: {strings: {}, hashes: {}, lists: {}, sets: {}, zsets: {}, ttl: {}},
  1: {strings: {}, hashes: {}, lists: {}, sets: {}, zsets: {}, ttl: {}},
};

let dbIndex = 0;

function store() {
  if (!stores[dbIndex]) {
    stores[dbIndex] = {strings: {}, hashes: {}, lists: {}, sets: {}, zsets: {}, ttl: {}};
  }
  return stores[dbIndex];
}

function splitArgs(line) {
  const parts = [];
  const re = /"([^"]*)"|(\S+)/g;
  let m;
  while ((m = re.exec(line))) parts.push(m[1] ?? m[2]);
  return parts;
}

function keyTtl(s, key) {
  const exp = s.ttl[key];
  if (exp == null) return true;
  if (Date.now() < exp) return true;
  delete s.strings[key];
  delete s.hashes[key];
  delete s.lists[key];
  delete s.sets[key];
  delete s.zsets[key];
  delete s.ttl[key];
  return false;
}

function setTtl(s, key, seconds) {
  if (seconds > 0) s.ttl[key] = Date.now() + seconds * 1000;
  else delete s.ttl[key];
}

function parseSetArgs(parts) {
  const key = parts[1];
  let i = 2;
  let value = parts[i] ?? '';
  if (parts[i] && !/^(EX|PX|NX|XX|KEEPTTL)$/i.test(parts[i])) {
    value = parts[i];
    i = 3;
  } else {
    value = '';
    i = 2;
  }
  const opts = {ex: null, nx: false, xx: false};
  while (i < parts.length) {
    const f = parts[i].toUpperCase();
    if (f === 'EX') {
      opts.ex = Number(parts[++i]);
    } else if (f === 'NX') {
      opts.nx = true;
    } else if (f === 'XX') {
      opts.xx = true;
    } else if (!value) {
      value = parts[i];
    }
    i++;
  }
  if (!value && parts[2] && !/^(EX|PX|NX|XX)$/i.test(parts[2])) value = parts[2];
  return {key, value, opts};
}

export function executeRedisCommand(line) {
  const parts = splitArgs(line.trim());
  if (!parts.length) return {lines: [], db: dbIndex};

  const cmd = parts[0].toUpperCase();

  if (cmd === 'SELECT') {
    dbIndex = Number(parts[1]) || 0;
    return {lines: [{type: 'success', text: 'OK'}], db: dbIndex};
  }

  const s = store();

  if (cmd === 'SET') {
    const {key, value, opts} = parseSetArgs(parts);
    const exists = key in s.strings;
    if (opts.nx && exists) return {lines: [{type: 'muted', text: '(nil)'}], db: dbIndex};
    if (opts.xx && !exists) return {lines: [{type: 'muted', text: '(nil)'}], db: dbIndex};
    s.strings[key] = value;
    if (opts.ex != null) setTtl(s, key, opts.ex);
    return {lines: [{type: 'success', text: 'OK'}], db: dbIndex};
  }
  if (cmd === 'GET') {
    const key = parts[1];
    if (!keyTtl(s, key)) return {lines: [{type: 'muted', text: '(nil)'}], db: dbIndex};
    const v = s.strings[parts[1]];
    return {
      lines: [{type: v != null ? 'output' : 'muted', text: v != null ? `"${v}"` : '(nil)'}],
      db: dbIndex,
    };
  }
  if (cmd === 'DEL') {
    let n = 0;
    for (let i = 1; i < parts.length; i++) {
      const k = parts[i];
      if (k in s.strings || k in s.hashes || k in s.lists || k in s.sets || k in s.zsets) n++;
      delete s.strings[k];
      delete s.hashes[k];
      delete s.lists[k];
      delete s.sets[k];
      delete s.zsets[k];
      delete s.ttl[k];
    }
    return {lines: [{type: 'success', text: `(integer) ${n}`}], db: dbIndex};
  }
  if (cmd === 'EXISTS') {
    const key = parts[1];
    const ok =
      keyTtl(s, key) &&
      (key in s.strings || key in s.hashes || key in s.lists || key in s.sets || key in s.zsets);
    return {lines: [{type: 'success', text: `(integer) ${ok ? 1 : 0}`}], db: dbIndex};
  }
  if (cmd === 'TYPE') {
    const key = parts[1];
    if (!keyTtl(s, key)) return {lines: [{type: 'output', text: 'none'}], db: dbIndex};
    if (key in s.strings) return {lines: [{type: 'output', text: 'string'}], db: dbIndex};
    if (key in s.hashes) return {lines: [{type: 'output', text: 'hash'}], db: dbIndex};
    if (key in s.lists) return {lines: [{type: 'output', text: 'list'}], db: dbIndex};
    if (key in s.zsets) return {lines: [{type: 'output', text: 'zset'}], db: dbIndex};
    return {lines: [{type: 'output', text: 'none'}], db: dbIndex};
  }
  if (cmd === 'EXPIRE') {
    const key = parts[1];
    const sec = Number(parts[2]) || 0;
    if (!keyTtl(s, key)) return {lines: [{type: 'success', text: '(integer) 0'}], db: dbIndex};
    const exists =
      key in s.strings || key in s.hashes || key in s.lists || key in s.sets || key in s.zsets;
    if (exists) setTtl(s, key, sec);
    return {lines: [{type: 'success', text: `(integer) ${exists ? 1 : 0}`}], db: dbIndex};
  }
  if (cmd === 'TTL') {
    const key = parts[1];
    const exp = s.ttl[key];
    if (exp == null) return {lines: [{type: 'success', text: '(integer) -1'}], db: dbIndex};
    const left = Math.ceil((exp - Date.now()) / 1000);
    if (left <= 0) {
      keyTtl(s, key);
      return {lines: [{type: 'success', text: '(integer) -2'}], db: dbIndex};
    }
    return {lines: [{type: 'success', text: `(integer) ${left}`}], db: dbIndex};
  }
  if (cmd === 'HSET') {
    const key = parts[1];
    const field = parts[2];
    const val = parts[3] ?? '';
    if (!s.hashes[key]) s.hashes[key] = {};
    const isNew = !(field in s.hashes[key]);
    s.hashes[key][field] = val;
    return {lines: [{type: 'success', text: `(integer) ${isNew ? 1 : 0}`}], db: dbIndex};
  }
  if (cmd === 'HGET') {
    const h = s.hashes[parts[1]];
    const v = h?.[parts[2]];
    return {
      lines: [{type: v != null ? 'output' : 'muted', text: v != null ? `"${v}"` : '(nil)'}],
      db: dbIndex,
    };
  }
  if (cmd === 'HGETALL') {
    const h = s.hashes[parts[1]];
    if (!h) return {lines: [{type: 'muted', text: '(empty hash)'}], db: dbIndex};
    const text = Object.entries(h)
      .flatMap(([k, v]) => [k, v])
      .join('\n');
    return {lines: [{type: 'output', text}], db: dbIndex};
  }
  if (cmd === 'LPUSH') {
    const key = parts[1];
    if (!s.lists[key]) s.lists[key] = [];
    for (let i = parts.length - 1; i >= 2; i--) s.lists[key].unshift(parts[i]);
    return {lines: [{type: 'success', text: `(integer) ${s.lists[key].length}`}], db: dbIndex};
  }
  if (cmd === 'LRANGE') {
    const list = s.lists[parts[1]] ?? [];
    return {lines: [{type: 'output', text: JSON.stringify(list)}], db: dbIndex};
  }
  if (cmd === 'ZADD') {
    const key = parts[1];
    if (!s.zsets[key]) s.zsets[key] = [];
    let added = 0;
    for (let i = 2; i < parts.length; i += 2) {
      const score = Number(parts[i]);
      const member = parts[i + 1];
      const idx = s.zsets[key].findIndex((e) => e.member === member);
      if (idx >= 0) s.zsets[key][idx].score = score;
      else {
        s.zsets[key].push({score, member});
        added++;
      }
    }
    s.zsets[key].sort((a, b) => a.score - b.score);
    return {lines: [{type: 'success', text: `(integer) ${added}`}], db: dbIndex};
  }
  if (cmd === 'ZRANGE') {
    const key = parts[1];
    const z = s.zsets[key] ?? [];
    const rev = parts.includes('REV');
    const withScores = parts.includes('WITHSCORES');
    const sorted = [...z].sort((a, b) => (rev ? b.score - a.score : a.score - b.score));
    const text = withScores
      ? sorted.flatMap((e) => [e.member, String(e.score)]).join('\n')
      : sorted.map((e) => e.member).join('\n');
    return {lines: [{type: 'output', text: text || '(empty)'}], db: dbIndex};
  }
  if (cmd === 'KEYS') {
    const all = [
      ...Object.keys(s.strings),
      ...Object.keys(s.hashes),
      ...Object.keys(s.lists),
      ...Object.keys(s.zsets),
    ];
    return {lines: [{type: 'output', text: all.join('\n') || '(empty)'}], db: dbIndex};
  }

  if (cmd === 'HELP') {
    return {
      lines: [
        {
          type: 'output',
          text:
            'SELECT n · SET key val [EX sec] [NX] · GET · DEL · EXISTS · TYPE · TTL · EXPIRE\n' +
            'HSET · HGET · HGETALL · LPUSH · LRANGE · ZADD · ZRANGE [REV] [WITHSCORES] · KEYS *',
        },
      ],
      db: dbIndex,
    };
  }

  return {lines: [{type: 'error', text: `ERR unknown command '${cmd}'`}], db: dbIndex};
}

export function getRedisWelcome(db) {
  return [
    {type: 'banner', text: 'redis-cli · Universe IT (учебный эмулятор)'},
    {type: 'muted', text: `127.0.0.1:6379 [db ${db}] — HELP для списка команд`},
  ];
}
