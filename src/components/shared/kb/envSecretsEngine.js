export const SECRET_KEYS = [
  {key: 'DB_PASSWORD', label: 'Пароль БД', leak: 'postgres://user:Sup3rS3cret@db:5432/app'},
  {key: 'AWS_SECRET_ACCESS_KEY', label: 'AWS Secret', leak: 'AKIA...wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'},
  {key: 'JWT_SECRET', label: 'JWT secret', leak: 'my-super-secret-jwt-key-2024'},
];

export const MODES = {
  unsafe: {
    id: 'unsafe',
    label: '.env в репозитории',
    gitignore: false,
    ci: 'Секреты в plain-text workflow',
    risk: 'critical',
  },
  safe: {
    id: 'safe',
    label: 'CI secrets + .env.example',
    gitignore: true,
    ci: 'GitHub Secrets / Vault',
    risk: 'low',
  },
};

export function scanText(text) {
  const hits = [];
  for (const s of SECRET_KEYS) {
    if (text.includes(s.key) || text.includes(s.leak)) {
      hits.push(s.key);
    }
  }
  if (/password\s*=\s*\S+/i.test(text)) hits.push('INLINE_PASSWORD');
  return [...new Set(hits)];
}
