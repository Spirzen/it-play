/** Движок веб-версии ArchiStyler: модель классов, шаблоны, генерация C# / Java */

export const RELATION_KINDS = [
  {id: 'Inherits', label: 'Наследует', stroke: '#22d3ee'},
  {id: 'Implements', label: 'Реализует', stroke: '#a78bfa'},
  {id: 'Uses', label: 'Использует', stroke: '#94a3b8'},
  {id: 'Composes', label: 'Композиция', stroke: '#f472b6'},
  {id: 'Aggregates', label: 'Агрегация', stroke: '#fbbf24'},
];

export const ROLES = [
  {id: 'None', label: '— без роли —'},
  {id: 'Interface', label: 'Interface'},
  {id: 'Model', label: 'Model / Entity'},
  {id: 'Dto', label: 'DTO'},
  {id: 'Service', label: 'Service'},
  {id: 'Repository', label: 'Repository'},
  {id: 'OrmContext', label: 'ORM Context'},
  {id: 'View', label: 'View'},
  {id: 'Presenter', label: 'Presenter'},
  {id: 'ViewModel', label: 'ViewModel'},
  {id: 'Controller', label: 'Controller'},
  {id: 'Factory', label: 'Factory'},
  {id: 'Strategy', label: 'Strategy'},
  {id: 'Command', label: 'Command'},
  {id: 'Adapter', label: 'Adapter'},
  {id: 'Handler', label: 'Handler'},
];

const ROLE_SCAFFOLD = {
  Service: [
    {kind: 'Method', name: 'Execute', returnType: 'void', access: 'Public', generateStub: true},
  ],
  Repository: [
    {kind: 'Method', name: 'GetById', returnType: 'object', access: 'Public', generateStub: true,
      parameters: [{name: 'id', type: 'int'}]},
    {kind: 'Method', name: 'Add', returnType: 'void', access: 'Public', generateStub: true,
      parameters: [{name: 'entity', type: 'object'}]},
  ],
  Dto: [
    {kind: 'Property', name: 'Id', type: 'int', access: 'Public'},
  ],
  Entity: [
    {kind: 'Property', name: 'Id', type: 'int', access: 'Public'},
  ],
  Model: [
    {kind: 'Property', name: 'Id', type: 'int', access: 'Public'},
  ],
  OrmContext: [
    {kind: 'Method', name: 'SaveChanges', returnType: 'int', access: 'Public', generateStub: true},
  ],
  View: [
    {kind: 'Method', name: 'Render', returnType: 'void', access: 'Public', generateStub: true},
  ],
  Presenter: [
    {kind: 'Method', name: 'Initialize', returnType: 'void', access: 'Public', generateStub: true},
  ],
  ViewModel: [
    {kind: 'Property', name: 'Title', type: 'string', access: 'Public'},
  ],
};

export const PATTERNS = [
  {
    id: 'mvp',
    name: 'MVP',
    category: 'Architectural',
    description: 'Model-View-Presenter: View делегирует Presenter, Presenter работает с Model.',
    classes: [
      {name: 'IView', role: 'Interface', isInterface: true, offsetX: 0, offsetY: 0, members: [
        {kind: 'Method', name: 'Show', returnType: 'void', access: 'Public', isAbstract: true},
      ]},
      {name: 'View', role: 'View', offsetX: 0, offsetY: 150, implements: ['IView'], members: [
        {kind: 'Method', name: 'Show', returnType: 'void', access: 'Public', generateStub: true},
      ]},
      {name: 'IModel', role: 'Interface', isInterface: true, offsetX: 300, offsetY: 0, members: [
        {kind: 'Method', name: 'Load', returnType: 'void', access: 'Public', isAbstract: true},
      ]},
      {name: 'Model', role: 'Model', offsetX: 300, offsetY: 150, implements: ['IModel'], members: [
        {kind: 'Method', name: 'Load', returnType: 'void', access: 'Public', generateStub: true},
      ]},
      {name: 'Presenter', role: 'Presenter', offsetX: 150, offsetY: 310, members: [
        {kind: 'Field', name: '_view', type: 'IView', access: 'Private'},
        {kind: 'Field', name: '_model', type: 'IModel', access: 'Private'},
        {kind: 'Method', name: 'Initialize', returnType: 'void', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'View', to: 'IView', kind: 'Implements'},
      {from: 'Model', to: 'IModel', kind: 'Implements'},
      {from: 'Presenter', to: 'IView', kind: 'Uses'},
      {from: 'Presenter', to: 'IModel', kind: 'Uses'},
    ],
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: 'Behavioral',
    description: 'Алгоритмы за общим интерфейсом; контекст делегирует стратегии.',
    classes: [
      {name: 'IStrategy', role: 'Strategy', isInterface: true, offsetX: 0, offsetY: 0, members: [
        {kind: 'Method', name: 'Execute', returnType: 'void', access: 'Public', isAbstract: true},
      ]},
      {name: 'ConcreteStrategy', role: 'Strategy', offsetX: 0, offsetY: 130, implements: ['IStrategy'],
        members: [
          {kind: 'Method', name: 'Execute', returnType: 'void', access: 'Public', generateStub: true},
        ]},
      {name: 'Context', role: 'Service', offsetX: 280, offsetY: 40, members: [
        {kind: 'Field', name: '_strategy', type: 'IStrategy', access: 'Private'},
        {kind: 'Method', name: 'DoWork', returnType: 'void', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'ConcreteStrategy', to: 'IStrategy', kind: 'Implements'},
      {from: 'Context', to: 'IStrategy', kind: 'Uses'},
    ],
  },
  {
    id: 'repository-orm',
    name: 'Repository + ORM',
    category: 'Data',
    description: 'Сущность, репозиторий и контекст БД.',
    classes: [
      {name: 'Entity', role: 'Entity', offsetX: 0, offsetY: 0, members: [
        {kind: 'Property', name: 'Id', type: 'int', access: 'Public'},
      ]},
      {name: 'IRepository', role: 'Repository', isInterface: true, offsetX: 260, offsetY: 0, members: [
        {kind: 'Method', name: 'GetById', returnType: 'Entity', access: 'Public', isAbstract: true,
          parameters: [{name: 'id', type: 'int'}]},
      ]},
      {name: 'Repository', role: 'Repository', offsetX: 260, offsetY: 140, implements: ['IRepository'],
        members: [
          {kind: 'Method', name: 'GetById', returnType: 'Entity', access: 'Public', generateStub: true,
            parameters: [{name: 'id', type: 'int'}]},
        ]},
      {name: 'AppDbContext', role: 'OrmContext', offsetX: 520, offsetY: 70, members: [
        {kind: 'Method', name: 'SaveChanges', returnType: 'int', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'Repository', to: 'IRepository', kind: 'Implements'},
      {from: 'Repository', to: 'AppDbContext', kind: 'Uses'},
    ],
  },
  {
    id: 'layered',
    name: 'Слои (Handlers / Data / Models)',
    category: 'Architectural',
    description: 'Модели, доступ к данным и обработчики с зависимостью на абстракции.',
    classes: [
      {name: 'Entity', role: 'Model', offsetX: 0, offsetY: 0, members: [
        {kind: 'Property', name: 'Id', type: 'string', access: 'Public'},
      ]},
      {name: 'IRepository', role: 'Interface', isInterface: true, offsetX: 280, offsetY: 0, members: [
        {kind: 'Method', name: 'GetById', returnType: 'Entity', access: 'Public', isAbstract: true},
      ]},
      {name: 'Repository', role: 'Repository', offsetX: 280, offsetY: 130, implements: ['IRepository'],
        members: [
          {kind: 'Method', name: 'GetById', returnType: 'Entity', access: 'Public', generateStub: true},
        ]},
      {name: 'CreateOrderHandler', role: 'Handler', offsetX: 140, offsetY: 280, members: [
        {kind: 'Field', name: '_repo', type: 'IRepository', access: 'Private'},
        {kind: 'Method', name: 'Handle', returnType: 'void', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'Repository', to: 'IRepository', kind: 'Implements'},
      {from: 'CreateOrderHandler', to: 'IRepository', kind: 'Uses'},
      {from: 'IRepository', to: 'Entity', kind: 'Uses'},
    ],
  },
  {
    id: 'singleton',
    name: 'Singleton',
    category: 'Creational',
    description: 'Один экземпляр с глобальным доступом.',
    classes: [
      {name: 'Singleton', role: 'None', offsetX: 120, offsetY: 80, members: [
        {kind: 'Field', name: '_instance', type: 'Singleton', access: 'Private', isStatic: true},
        {kind: 'Method', name: 'Instance', returnType: 'Singleton', access: 'Public', isStatic: true,
          generateStub: true},
      ]},
    ],
    relations: [],
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: 'Structural',
    description: 'Преобразует интерфейс Adaptee к ожиданиям клиента (ITarget).',
    classes: [
      {name: 'ITarget', role: 'Interface', isInterface: true, offsetX: 0, offsetY: 0, members: [
        {kind: 'Method', name: 'Request', returnType: 'void', access: 'Public', isAbstract: true},
      ]},
      {name: 'Adaptee', role: 'Service', offsetX: 280, offsetY: 120, members: [
        {kind: 'Method', name: 'SpecificRequest', returnType: 'void', access: 'Public', generateStub: true},
      ]},
      {name: 'Adapter', role: 'Adapter', offsetX: 0, offsetY: 140, implements: ['ITarget'], members: [
        {kind: 'Field', name: '_adaptee', type: 'Adaptee', access: 'Private'},
        {kind: 'Method', name: 'Request', returnType: 'void', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'Adapter', to: 'ITarget', kind: 'Implements'},
      {from: 'Adapter', to: 'Adaptee', kind: 'Uses'},
    ],
  },
  {
    id: 'factory',
    name: 'Factory Method',
    category: 'Creational',
    description: 'Создатель объявляет фабричный метод; подклассы возвращают продукт.',
    classes: [
      {name: 'IProduct', role: 'Interface', isInterface: true, offsetX: 0, offsetY: 140, members: [
        {kind: 'Method', name: 'Operation', returnType: 'void', access: 'Public', isAbstract: true},
      ]},
      {name: 'Creator', role: 'Factory', isAbstract: true, offsetX: 0, offsetY: 0, members: [
        {kind: 'Method', name: 'CreateProduct', returnType: 'IProduct', access: 'Public', isAbstract: true},
      ]},
      {name: 'ConcreteCreator', role: 'Factory', offsetX: 280, offsetY: 0, baseType: 'Creator', members: [
        {kind: 'Method', name: 'CreateProduct', returnType: 'IProduct', access: 'Public', generateStub: true},
      ]},
      {name: 'ConcreteProduct', role: 'Model', offsetX: 280, offsetY: 140, implements: ['IProduct'], members: [
        {kind: 'Method', name: 'Operation', returnType: 'void', access: 'Public', generateStub: true},
      ]},
    ],
    relations: [
      {from: 'ConcreteCreator', to: 'Creator', kind: 'Inherits'},
      {from: 'ConcreteProduct', to: 'IProduct', kind: 'Implements'},
    ],
  },
];

let idSeq = 1;
export function nextId(prefix = 'n') {
  idSeq += 1;
  return `${prefix}_${idSeq}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createEmptyModel(namespace = 'App.Demo') {
  return {
    namespace,
    language: 'csharp',
    classes: [],
    relations: [],
  };
}

export function createClass(overrides = {}) {
  const name = overrides.name || `Class${Math.floor(Math.random() * 900) + 100}`;
  return {
    id: nextId('cls'),
    name,
    role: overrides.role || 'None',
    x: overrides.x ?? 80 + Math.random() * 120,
    y: overrides.y ?? 60 + Math.random() * 80,
    w: 168,
    h: 112,
    isInterface: Boolean(overrides.isInterface),
    isAbstract: Boolean(overrides.isAbstract),
    isSealed: false,
    baseType: overrides.baseType || '',
    implements: overrides.implements ? [...overrides.implements] : [],
    members: overrides.members ? JSON.parse(JSON.stringify(overrides.members)) : [],
    summary: overrides.summary || '',
  };
}

export function applyRoleScaffold(cls, roleId) {
  const scaffold = ROLE_SCAFFOLD[roleId];
  if (!scaffold) return cls;
  const names = new Set(cls.members.map((m) => m.name));
  const members = [...cls.members];
  scaffold.forEach((m) => {
    if (!names.has(m.name)) members.push(JSON.parse(JSON.stringify(m)));
  });
  return {...cls, members};
}

export function applyPattern(patternId) {
  const pattern = PATTERNS.find((p) => p.id === patternId);
  if (!pattern) return createEmptyModel();

  const nameToId = new Map();
  const classes = pattern.classes.map((c) => {
    const cls = createClass({
      name: c.name,
      role: c.role || 'None',
      x: 40 + (c.offsetX || 0),
      y: 36 + (c.offsetY || 0),
      isInterface: c.isInterface,
      isAbstract: c.isAbstract,
      baseType: c.baseType || '',
      implements: c.implements || [],
      members: c.members || [],
    });
    nameToId.set(c.name, cls.id);
    return cls;
  });

  const relations = (pattern.relations || []).map((r) => ({
    id: nextId('rel'),
    from: nameToId.get(r.from),
    to: nameToId.get(r.to),
    kind: r.kind || 'Uses',
  })).filter((r) => r.from && r.to);

  return {patternId: pattern.id, classes, relations};
}

export function syncAutoRelations(classes, relations) {
  const byName = new Map(classes.map((c) => [c.name, c.id]));
  const key = (a, b, k) => `${a}|${b}|${k}`;
  const existing = new Set(relations.map((r) => key(r.from, r.to, r.kind)));
  const out = [...relations];

  classes.forEach((cls) => {
    if (cls.baseType) {
      const to = byName.get(cls.baseType);
      if (to) {
        const k = key(cls.id, to, 'Inherits');
        if (!existing.has(k)) {
          out.push({id: nextId('rel'), from: cls.id, to, kind: 'Inherits'});
          existing.add(k);
        }
      }
    }
    (cls.implements || []).forEach((iface) => {
      const to = byName.get(iface);
      if (to) {
        const k = key(cls.id, to, 'Implements');
        if (!existing.has(k)) {
          out.push({id: nextId('rel'), from: cls.id, to, kind: 'Implements'});
          existing.add(k);
        }
      }
    });
  });
  return out;
}

function mapAccess(access, lang) {
  const a = (access || 'Public').toLowerCase();
  if (lang === 'java') {
    if (a === 'private') return 'private';
    if (a === 'protected') return 'protected';
    return 'public';
  }
  if (a === 'private') return 'private';
  if (a === 'protected') return 'protected';
  if (a === 'internal') return 'internal';
  return 'public';
}

function stubBody(member, lang) {
  if (member.isAbstract) return lang === 'java' ? '        throw new UnsupportedOperationException();' : '        throw new NotImplementedException();';
  const ret = member.returnType || 'void';
  if (ret === 'void') return lang === 'java' ? '        // TODO' : '        // TODO';
  if (ret === 'int') return lang === 'java' ? '        return 0;' : '        return 0;';
  if (ret === 'bool' || ret === 'boolean') return lang === 'java' ? '        return false;' : '        return false;';
  return lang === 'java' ? '        return null;' : '        return null;';
}

export function generateClassCode(cls, model) {
  return model.language === 'java'
    ? generateJavaClass(cls, model.namespace)
    : generateCSharpClass(cls, model.namespace);
}

function generateCSharpClass(cls, ns) {
  const lines = [];
  lines.push(`namespace ${ns};`, '');
  const mods = [];
  mods.push(mapAccess('Public', 'csharp'));
  if (cls.isAbstract && !cls.isInterface) mods.push('abstract');
  if (cls.isSealed) mods.push('sealed');
  const kind = cls.isInterface ? 'interface' : 'class';
  mods.push(kind, cls.name);
  const inh = [];
  if (cls.baseType) inh.push(cls.baseType);
  (cls.implements || []).forEach((i) => inh.push(i));
  if (inh.length) mods.push(`: ${inh.join(', ')}`);
  lines.push(mods.join(' '), '{');

  (cls.members || []).forEach((m) => {
    const acc = mapAccess(m.access, 'csharp');
    if (m.kind === 'Field') {
      lines.push(`    ${acc}${m.isStatic ? ' static' : ''} ${m.type || 'object'} ${m.name};`);
    } else if (m.kind === 'Property') {
      lines.push(`    ${acc} ${m.type || 'object'} ${m.name} { get; set; }`);
    } else if (m.kind === 'Method') {
      const pars = (m.parameters || [])
        .map((p) => `${p.type || 'object'} ${p.name}`)
        .join(', ');
      const sig = `    ${acc}${m.isStatic ? ' static' : ''}${m.isAbstract ? ' abstract' : ''} ${m.returnType || 'void'} ${m.name}(${pars})`;
      if (m.isAbstract || cls.isInterface) lines.push(`${sig};`);
      else {
        lines.push(`${sig}`, '    {', stubBody(m, 'csharp'), '    }');
      }
    }
  });

  lines.push('}');
  return lines.join('\n');
}

function generateJavaClass(cls, pkg) {
  const lines = [];
  lines.push(`package ${pkg};`, '');
  const mods = [mapAccess('Public', 'java')];
  if (cls.isAbstract && !cls.isInterface) mods.push('abstract');
  mods.push(cls.isInterface ? 'interface' : 'class', cls.name);
  const inh = [];
  if (cls.baseType) inh.push(`extends ${cls.baseType}`);
  const impl = (cls.implements || []).filter(Boolean);
  if (impl.length) inh.push(`implements ${impl.join(', ')}`);
  if (inh.length) mods.push(inh.join(' '));
  lines.push(`${mods.join(' ')} {`);

  (cls.members || []).forEach((m) => {
    const acc = mapAccess(m.access, 'java');
    if (m.kind === 'Field') {
      lines.push(`    ${acc} ${m.type || 'Object'} ${m.name};`);
    } else if (m.kind === 'Property') {
      lines.push(`    ${acc} ${m.type || 'Object'} ${m.name};`);
    } else if (m.kind === 'Method') {
      const pars = (m.parameters || [])
        .map((p) => `${p.type || 'Object'} ${p.name}`)
        .join(', ');
      const ret = m.returnType === 'void' ? 'void' : (m.returnType || 'void');
      const sig = `    ${acc}${m.isAbstract || cls.isInterface ? ' abstract' : ''} ${ret} ${m.name}(${pars})`;
      if (m.isAbstract || cls.isInterface) lines.push(`${sig};`);
      else {
        lines.push(`${sig} {`, stubBody(m, 'java'), '    }');
      }
    }
  });

  lines.push('}');
  return lines.join('\n');
}

export function relationStroke(kind) {
  return RELATION_KINDS.find((k) => k.id === kind)?.stroke || '#94a3b8';
}

export function cardCenter(cls) {
  return {cx: cls.x + cls.w / 2, cy: cls.y + cls.h / 2};
}

export function edgeAnchors(fromCls, toCls) {
  const a = cardCenter(fromCls);
  const b = cardCenter(toCls);
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const len = Math.hypot(dx, dy) || 1;
  const pad = 8;
  return {
    x1: a.cx + (dx / len) * (fromCls.w / 2 + pad),
    y1: a.cy + (dy / len) * (fromCls.h / 2 + pad),
    x2: b.cx - (dx / len) * (toCls.w / 2 + pad),
    y2: b.cy - (dy / len) * (toCls.h / 2 + pad),
  };
}

export function memberPreview(cls, max = 5) {
  const lines = [];
  if (cls.isInterface) lines.push('"interface"');
  else if (cls.isAbstract) lines.push('"abstract"');
  if (cls.baseType) lines.push(`: ${cls.baseType}`);
  (cls.implements || []).slice(0, 2).forEach((i) => lines.push(`implements ${i}`));
  (cls.members || []).slice(0, max).forEach((m) => {
    const sym = m.access === 'Private' ? '-' : '+';
    if (m.kind === 'Field' || m.kind === 'Property') lines.push(`${sym} ${m.name}: ${m.type || '?'}`);
    else lines.push(`${sym} ${m.name}()`);
  });
  if ((cls.members || []).length > max) lines.push('…');
  return lines;
}
