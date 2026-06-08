/** Сложные английские тексты для тренажёра (раскладка QWERTY). */

export const TYPING_ENGLISH_PRESETS = [
  {
    id: 'en-01',
    label: 'Punctuation',
    hint: 'Quotes, dashes, semicolons — English (US) layout',
    text:
      'She said: "Ship it by Friday" — not "maybe"; the deadline is non-negotiable.',
  },
  {
    id: 'en-02',
    label: 'Brackets',
    hint: 'Parentheses, brackets, braces',
    text:
      'Parse JSON: {"id": 42, "tags": ["api", "v2"], "meta": {"ok": true}} — watch commas.',
  },
  {
    id: 'en-03',
    label: 'Paths',
    hint: 'Slashes, backslashes, dots',
    text:
      'Open C:\\Users\\dev\\repo\\src\\index.ts or ./dist/server.js — not mixed separators.',
  },
  {
    id: 'en-04',
    label: 'URL',
    hint: 'Protocol, query string, encoding',
    text:
      'GET https://api.example.com/v2/users?page=2&limit=50&sort=-created_at HTTP/1.1',
  },
  {
    id: 'en-05',
    label: 'Email',
    hint: 'At-sign, plus addressing, dots',
    text:
      'Contact support_team@company.io or alerts+prod@monitor.app — no spaces around @.',
  },
  {
    id: 'en-06',
    label: 'Shortcuts',
    hint: 'Ctrl, Shift, Alt, Win in prose',
    text:
      'Ctrl+Shift+Esc opens Task Manager; Win+V shows clipboard; Alt+F4 closes the window.',
  },
  {
    id: 'en-07',
    label: 'IPv4 & MAC',
    hint: 'Dots, colons, hex pairs',
    text:
      'Gateway 192.168.0.1, DNS 8.8.8.8; MAC AA:BB:CC:DD:EE:FF — letter O is not zero.',
  },
  {
    id: 'en-08',
    label: 'UUID',
    hint: 'Hyphens and lowercase hex',
    text:
      'Session id: a3f2c1b0-9e8d-4f7a-b6c5-d4e3f2a1b0c9 — copy the full string.',
  },
  {
    id: 'en-09',
    label: 'SQL',
    hint: 'Keywords, quotes, semicolon',
    text:
      "SELECT id, email FROM users WHERE active = 1 AND created_at > '2025-01-01';",
  },
  {
    id: 'en-10',
    label: 'Regex',
    hint: 'Carets, brackets, backslashes',
    text:
      'Pattern ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}$ — escape backslashes twice.',
  },
  {
    id: 'en-11',
    label: 'Markdown',
    hint: 'Headers, links, inline code',
    text:
      '## Release notes\n\nSee [changelog](https://example.com/v2) and `npm run build` — keep symbols.',
  },
  {
    id: 'en-12',
    label: 'Versions',
    hint: 'Semver, ranges, tags',
    text:
      'Depends on react@18.2.0; peer eslint>=8.0.0 <9.0.0; breaking change in v2.0.0-rc.1.',
  },
  {
    id: 'en-13',
    label: 'Log line',
    hint: 'Timestamp, level, parentheses',
    text:
      '[2026-06-03 15:04:05] ERROR (worker-3): Connection refused — retry 2/5 in 30s.',
  },
  {
    id: 'en-14',
    label: 'CLI',
    hint: 'Flags, chaining, paths',
    text:
      'npm run build -- --mode=production && node ./dist/server.js --port=3000 --host=0.0.0.0',
  },
  {
    id: 'en-15',
    label: 'Git',
    hint: 'Branches, messages, hashes',
    text:
      'git checkout -b feature/login; git commit -m "fix(auth): handle 401"; merge request #418.',
  },
  {
    id: 'en-16',
    label: 'HTTP',
    hint: 'Methods, status codes, arrows',
    text:
      'GET /api/v1/users → 200 OK; POST /login → 401 Unauthorized; Retry-After: 120.',
  },
  {
    id: 'en-17',
    label: 'Docker',
    hint: 'Image tags, ports, env',
    text:
      'docker run -d -p 8080:80 --name web -e NODE_ENV=production nginx:1.25-alpine',
  },
  {
    id: 'en-18',
    label: 'Env vars',
    hint: 'Underscores, equals, secrets',
    text:
      'export DATABASE_URL=postgres://user:pass@localhost:5432/app; JWT_SECRET=change-me;',
  },
  {
    id: 'en-19',
    label: 'Hash',
    hint: 'SHA-256 hex string',
    text:
      'Checksum: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'en-20',
    label: 'Base64',
    hint: 'Letters, digits, + and =',
    text:
      'Token fragment: SGVsbG8gV29ybGQhIFRoaXMgaXMgYmFzZTY0LXRlc3Q=',
  },
  {
    id: 'en-21',
    label: 'Currency',
    hint: 'Dollars, cents, commas',
    text:
      'Budget: $1,250,000.00; subscription $9.99/mo; EU license €49,00 — mind decimal style.',
  },
  {
    id: 'en-22',
    label: 'Timezone',
    hint: 'ISO-8601, offsets',
    text:
      'Meeting 14:30 (America/New_York); deadline 2026-12-31T23:59:59Z; log 2026-06-03T15:04:05+00:00.',
  },
  {
    id: 'en-23',
    label: 'Units',
    hint: 'MB, GB, ms, Mbps',
    text:
      'File 512 MB, RAM 16 GB, ping 42 ms, link 100 Mbps — bits vs bytes matter.',
  },
  {
    id: 'en-24',
    label: 'Password',
    hint: 'Mixed case and symbols (example only)',
    text:
      'Strong password example (do not use!): Tr0ub4dor&3! — digits, symbols, uppercase.',
  },
  {
    id: 'en-25',
    label: 'Table',
    hint: 'Pipes and alignment',
    text:
      'id | name      | role\n---+-----------+--------\n 1 | Alex      | admin\n 2 | Maria     | editor',
  },
  {
    id: 'en-26',
    label: 'List',
    hint: 'Bullets, dashes, nesting',
    text:
      '- Item one;\n- Item two:\n  * nested;\n  * nested again;\n- Item three (done).',
  },
  {
    id: 'en-27',
    label: 'TypeScript',
    hint: 'Generics, types, union',
    text:
      'function wrap<T>(value: T): Result<T | null> { return { ok: true, data: value }; }',
  },
  {
    id: 'en-28',
    label: 'Python',
    hint: 'f-strings, underscores in numbers',
    text:
      "for i in range(1_000):\n    print(f'row {i:04d} cost=${price:.2f}')  # noqa: T201",
  },
  {
    id: 'en-29',
    label: 'Legal',
    hint: 'Long words, section numbers',
    text:
      'Terms of Service (rev. 2026-06-01): Section 4.2.1 — personal data under GDPR Art. 6(1)(b).',
  },
  {
    id: 'en-30',
    label: 'Marathon',
    hint: 'Long prose — stamina on QWERTY',
    text:
      'The engineer opened a terminal, ran git status, pulled origin/main, and executed the test suite — 127 passed, 0 failed — before opening a merge request titled "Refactor auth module; keep backward compatibility". A teammate replied: "LGTM, but document JWT_SECRET in the README". That evening they typed again — not for speed alone, but for accuracy: one typo in production costs more than five words per minute.',
  },
];
