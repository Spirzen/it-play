const cache = new Map();

export function executeMemcachedCommand(line) {
  const parts = line.trim().split(/\s+/);
  if (!parts.length) return {lines: []};

  const cmd = parts[0].toLowerCase();

  if (cmd === 'get') {
    const key = parts[1];
    if (!cache.has(key)) {
      return {lines: [{type: 'muted', text: 'END'}]};
    }
    const {value, flags, bytes} = cache.get(key);
    return {
      lines: [
        {type: 'output', text: `VALUE ${key} ${flags} ${bytes}`},
        {type: 'output', text: value},
        {type: 'muted', text: 'END'},
      ],
    };
  }

  if (cmd === 'set') {
    const key = parts[1];
    const flags = parts[2] ?? '0';
    const exptime = parts[3] ?? '0';
    const bytes = parts[4] ?? String((parts[5] ?? '').length);
    const value = parts.slice(5).join(' ') || '';
    cache.set(key, {value, flags, bytes: Number(bytes) || value.length, exptime});
    return {lines: [{type: 'success', text: 'STORED'}]};
  }

  if (cmd === 'delete') {
    cache.delete(parts[1]);
    return {lines: [{type: 'success', text: 'DELETED'}]};
  }

  if (cmd === 'stats') {
    return {
      lines: [
        {type: 'output', text: `curr_items ${cache.size}`},
        {type: 'output', text: 'pid 12345'},
        {type: 'muted', text: 'END'},
      ],
    };
  }

  if (cmd === 'help') {
    return {
      lines: [
        {
          type: 'output',
          text: 'set key flags exptime bytes value\nget key\ndelete key\nstats',
        },
      ],
    };
  }

  return {lines: [{type: 'error', text: 'ERROR'}]};
}

export function getMemcachedWelcome() {
  return [
    {type: 'banner', text: 'telnet localhost 11211'},
    {type: 'muted', text: 'Текстовый протокол Memcached'},
  ];
}
