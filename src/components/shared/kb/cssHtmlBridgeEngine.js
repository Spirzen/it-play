/** Учебная модель "HTML ↔ CSS" для статьи 3-10-css/111. */

export const ELEMENT_IDS = ['card', 'title', 'lead', 'cta'];

export const ELEMENT_META = {
  card: {label: 'div.card', tag: 'div', classes: ['card']},
  title: {label: 'h1#title', tag: 'h1', id: 'title'},
  lead: {label: 'p.lead', tag: 'p', classes: ['lead']},
  cta: {label: 'button#cta', tag: 'button', id: 'cta', classes: ['cta']},
};

export const DOM_TREE = {
  id: 'html',
  children: [
    {
      id: 'head',
      children: [{id: 'link'}, {id: 'styleTag'}],
    },
    {
      id: 'body',
      children: [{id: 'card', children: [{id: 'title'}, {id: 'lead'}, {id: 'cta'}]}],
    },
  ],
};

export const TREE_NODE_LABELS = {
  html: 'html',
  head: 'head',
  link: 'link rel=stylesheet',
  styleTag: 'style',
  body: 'body',
  card: 'div.card',
  title: 'h1#title',
  lead: 'p.lead',
  cta: 'button#cta',
};

export const SOURCE_META = {
  ua: {label: 'UA stylesheet', short: 'UA', color: '#6b7280'},
  link: {label: 'theme.css', short: 'link', color: '#7c3aed'},
  style: {label: '<style>', short: 'style', color: '#2563eb'},
  inline: {label: 'style=""', short: 'inline', color: '#e44d26'},
};

/** Порядок в таблице стилей: позже и специфичнее побеждают. */
export const STYLE_RULES = [
  {
    source: 'ua',
    selector: 'h1',
    specificity: 1,
    props: {margin: '0.67em 0', fontWeight: 'bold', fontSize: '2em'},
    matches: (el) => el.tag === 'h1',
  },
  {
    source: 'ua',
    selector: 'p',
    specificity: 1,
    props: {margin: '1em 0'},
    matches: (el) => el.tag === 'p',
  },
  {
    source: 'ua',
    selector: 'button',
    specificity: 1,
    props: {
      display: 'inline-block',
      padding: '2px 6px',
      border: '2px outset buttonface',
      background: 'buttonface',
    },
    matches: (el) => el.tag === 'button',
  },
  {
    source: 'link',
    selector: 'body',
    specificity: 1,
    props: {fontFamily: 'system-ui, sans-serif', color: '#1a1a1a'},
    matches: () => true,
    inherited: true,
  },
  {
    source: 'link',
    selector: '.card',
    specificity: 10,
    props: {
      padding: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      background: '#fafafa',
    },
    matches: (el) => el.classes?.includes('card'),
  },
  {
    source: 'link',
    selector: 'p',
    specificity: 1,
    props: {color: '#4b5563', lineHeight: '1.5'},
    matches: (el) => el.tag === 'p',
  },
  {
    source: 'link',
    selector: 'button',
    specificity: 1,
    props: {background: '#264de4', color: '#fff', border: 'none', borderRadius: '8px'},
    matches: (el) => el.tag === 'button',
  },
  {
    source: 'style',
    selector: '#title',
    specificity: 100,
    props: {color: '#264de4', fontSize: '1.35rem', margin: '0 0 0.5rem'},
    matches: (el) => el.id === 'title',
  },
  {
    source: 'style',
    selector: '.lead',
    specificity: 10,
    props: {color: '#1565c0', fontSize: '1.05rem'},
    matches: (el) => el.classes?.includes('lead'),
  },
  {
    source: 'style',
    selector: '#cta',
    specificity: 100,
    props: {padding: '0.55rem 1.1rem', cursor: 'pointer'},
    matches: (el) => el.id === 'cta',
  },
  {
    source: 'inline',
    selector: 'style attribute',
    specificity: 1000,
    props: {background: '#e44d26', fontWeight: '700'},
    matches: (el) => el.id === 'cta',
    requiresInline: true,
  },
];

export const PIPELINE_STEPS = [
  {
    id: 'parse-html',
    label: 'HTML → DOM',
    detail: 'Браузер разбирает разметку и строит дерево узлов (DOM). Стили ещё не применены.',
    dom: true,
    cssom: false,
    render: false,
    styled: false,
  },
  {
    id: 'parse-css',
    label: 'CSS → CSSOM',
    detail:
      'Запросы по <link> и разбор <style> дают CSSOM — дерево правил, не привязанное к конкретным пикселям.',
    dom: true,
    cssom: true,
    render: false,
    styled: false,
  },
  {
    id: 'render-tree',
    label: 'DOM + CSSOM → Render Tree',
    detail: 'Для видимых узлов DOM подбираются итоговые стили; скрытые ветки (display:none) не попадают в дерево.',
    dom: true,
    cssom: true,
    render: true,
    styled: true,
  },
  {
    id: 'paint',
    label: 'Layout и Paint',
    detail: 'По Render Tree считаются размеры и позиции, затем пиксели рисуются на экране.',
    dom: true,
    cssom: true,
    render: true,
    styled: true,
  },
];

export const SOURCE_PRESETS = [
  {
    id: 'all',
    label: 'Все источники',
    sources: {link: true, style: true, inline: true},
    hint: 'Типичная страница: внешний файл, блок <style> и точечный inline.',
  },
  {
    id: 'link-only',
    label: 'Только link',
    sources: {link: true, style: false, inline: false},
    hint: 'Стили из theme.css; внутренние и inline отключены.',
  },
  {
    id: 'no-external',
    label: 'Без внешнего файла',
    sources: {link: false, style: true, inline: true},
    hint: 'Прототип в одном HTML: <style> + style="" на кнопке.',
  },
];

export const ACCESS_MODES = [
  {
    id: 'devtools',
    label: 'DevTools → Styles',
    hint: 'Панель показывает все правила по слоям; перечёркнуто — переопределено каскадом.',
    code: null,
  },
  {
    id: 'computed',
    label: 'getComputedStyle',
    hint: 'Итоговые вычисленные значения после каскада и наследования.',
    code: "const el = document.querySelector('#cta');\nconst cs = getComputedStyle(el);\ncs.backgroundColor; // rgb(228, 77, 38)",
  },
  {
    id: 'inline-js',
    label: 'element.style',
    hint: 'Только inline-стили элемента; запись сюда создаёт style="" с высоким приоритетом.',
    code: "el.style.background = '#00c853';\n// появится в атрибуте style и перебьёт многие правила",
  },
  {
    id: 'sheets',
    label: 'document.styleSheets',
    hint: 'Список таблиц стилей страницы (link + style), доступ к cssRules из JS.',
    code: 'document.styleSheets.length;\n// 0 — theme.css, 1 — <style> в head',
  },
];

function ruleEnabled(rule, sources) {
  if (rule.source === 'ua') return sources.ua !== false;
  if (rule.source === 'link') return sources.link;
  if (rule.source === 'style') return sources.style;
  if (rule.source === 'inline') return sources.inline;
  return false;
}

function compareRules(a, b) {
  if (a.specificity !== b.specificity) return a.specificity - b.specificity;
  const order = {ua: 0, link: 1, style: 2, inline: 3};
  return order[a.source] - order[b.source];
}

export function getMatchingRules(elementId, sources = {ua: true, link: true, style: true, inline: true}) {
  const meta = ELEMENT_META[elementId];
  if (!meta) return [];
  return STYLE_RULES.filter((rule) => {
    if (!ruleEnabled(rule, sources)) return false;
    if (rule.requiresInline && !sources.inline) return false;
    return rule.matches(meta);
  });
}

/** Слои каскада для панели Styles: active / overridden. */
export function getCascadeLayers(elementId, sources) {
  const rules = getMatchingRules(elementId, sources);
  const byProp = new Map();

  rules.forEach((rule) => {
    Object.entries(rule.props).forEach(([prop, value]) => {
      const entry = {prop, value, rule};
      const list = byProp.get(prop) || [];
      list.push(entry);
      byProp.set(prop, list);
    });
  });

  const layers = [];
  byProp.forEach((entries, prop) => {
    const sorted = [...entries].sort((a, b) => compareRules(a.rule, b.rule));
    const winner = sorted[sorted.length - 1];
    sorted.forEach((entry) => {
      layers.push({
        prop,
        value: entry.value,
        selector: entry.rule.selector,
        source: entry.rule.source,
        specificity: entry.rule.specificity,
        active: entry === winner,
      });
    });
  });

  return layers.sort((a, b) => {
    if (a.prop !== b.prop) return a.prop.localeCompare(b.prop);
    return compareRules(
      {specificity: a.specificity, source: a.source},
      {specificity: b.specificity, source: b.source},
    );
  });
}

export function resolveStyles(elementId, sources) {
  const layers = getCascadeLayers(elementId, sources);
  const result = {};
  layers.forEach((layer) => {
    if (layer.active) result[layer.prop] = layer.value;
  });

  if (sources.link !== false && sources.ua !== false) {
    const bodyRule = STYLE_RULES.find((r) => r.source === 'link' && r.selector === 'body');
    if (bodyRule?.props.color && !result.color) {
      const inherited = ['lead', 'title'].includes(elementId);
      if (inherited || elementId === 'card') {
        result.color = bodyRule.props.color;
      }
    }
    if (bodyRule?.props.fontFamily) {
      result.fontFamily = bodyRule.props.fontFamily;
    }
  }

  return result;
}

export function stylesToReact(styleObj) {
  const map = {
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
    fontWeight: 'fontWeight',
    lineHeight: 'lineHeight',
    color: 'color',
    background: 'background',
    margin: 'margin',
    padding: 'padding',
    border: 'border',
    borderRadius: 'borderRadius',
    display: 'display',
    cursor: 'cursor',
  };
  const out = {};
  Object.entries(styleObj).forEach(([k, v]) => {
    const key = map[k];
    if (key) out[key] = v;
  });
  return out;
}

export function buildMiniHtml(sources) {
  const lines = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    sources.link ? '    <link rel="stylesheet" href="theme.css">' : '    <!-- link отключён -->',
    sources.style
      ? '    <style>\n      #title { color: #264de4; }\n      .lead { color: #1565c0; }\n    </style>'
      : '    <!-- <style> отключён -->',
    '  </head>',
    '  <body>',
    '    <div class="card">',
    '      <h1 id="title">Заголовок</h1>',
    '      <p class="lead">Текст карточки</p>',
    sources.inline
      ? '      <button id="cta" style="background:#e44d26">Действие</button>'
      : '      <button id="cta">Действие</button>',
    '    </div>',
    '  </body>',
    '</html>',
  ];
  return lines.join('\n');
}

export function formatComputedBlock(elementId, sources) {
  const styles = resolveStyles(elementId, sources);
  return Object.entries(styles)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n');
}
