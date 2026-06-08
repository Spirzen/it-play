/** Разбор URL на уровни доменной иерархии. */

export const DOMAIN_PRESETS = [
  {label: 'Google Mail', value: 'https://mail.google.com/mail/'},
  {label: 'Яндекс', value: 'https://yandex.ru'},
  {label: 'Amazon UK', value: 'shop.amazon.co.uk'},
  {label: 'Python docs', value: 'https://docs.python.org/3/library/'},
  {label: 'Много поддоменов', value: 'a.b.c.example.org'},
];

export function analyzeDomain(inputUrl) {
  let urlToAnalyze = inputUrl.trim();
  if (!urlToAnalyze) {
    return {error: 'Введите адрес для анализа.'};
  }

  try {
    if (!/^https?:\/\//i.test(urlToAnalyze)) {
      urlToAnalyze = `https://${urlToAnalyze}`;
    }

    const urlObj = new URL(urlToAnalyze);
    const hostname = urlObj.hostname.toLowerCase();
    const parts = hostname.split('.').filter((p) => p.length > 0);

    if (parts.length < 2) {
      return {
        error: 'Не удалось определить структуру домена. Нужно минимум два уровня (example.com).',
      };
    }

    const tld = parts[parts.length - 1];
    const sld = parts[parts.length - 2];
    const subdomains = parts.slice(0, parts.length - 2);
    const levels = [];

    for (let i = subdomains.length - 1; i >= 0; i -= 1) {
      const currentSubdomain = subdomains[i];
      const fullPath = [...subdomains.slice(i), sld, tld].join('.');
      levels.push({
        kind: 'subdomain',
        name: `Поддомен ${subdomains.length - i}`,
        value: currentSubdomain,
        fullName: fullPath,
        description:
          'Часть имени слева от основного домена — сервис, регион или раздел сайта.',
      });
    }

    levels.push({
      kind: 'sld',
      name: 'Второй уровень (SLD)',
      value: sld,
      fullName: `${sld}.${tld}`,
      description: 'Основное имя, которое регистрирует владелец.',
    });

    levels.push({
      kind: 'tld',
      name: 'Верхний уровень (TLD)',
      value: tld,
      fullName: tld,
      description: 'Категория домена (.ru, .com, .org и т.д.).',
    });

    const segments = [
      ...subdomains.map((s) => ({label: s, kind: 'sub'})),
      {label: sld, kind: 'sld'},
      {label: tld, kind: 'tld'},
    ];

    return {
      error: null,
      original: urlToAnalyze.replace(/^https?:\/\//i, ''),
      hostname,
      protocol: urlObj.protocol.replace(':', ''),
      path: urlObj.pathname || '/',
      levels,
      segments,
    };
  } catch (err) {
    return {error: `Ошибка анализа: ${err.message}`};
  }
}
