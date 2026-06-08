/** Состояние и программы для симулятора turtle (координаты: Y вверх, 0° = восток). */

export const TURTLE_SPEEDS = [
  {key: 'slow', label: 'Медленно', ms: 900},
  {key: 'normal', label: 'Обычно', ms: 500},
  {key: 'fast', label: 'Быстро', ms: 220},
];

export const TURTLE_COLORS = {
  black: '#1a1a1a',
  red: '#e53935',
  blue: '#1e88e5',
  green: '#43a047',
  yellow: '#fdd835',
  orange: '#fb8c00',
  purple: '#8e24aa',
  white: '#f5f5f5',
};

const DEG = Math.PI / 180;

export function createTurtleState(overrides = {}) {
  return {
    x: 0,
    y: 0,
    heading: 0,
    penDown: true,
    color: TURTLE_COLORS.black,
    fillColor: TURTLE_COLORS.yellow,
    filling: false,
    segments: [],
    fillPolygon: null,
    filledRegions: [],
    visible: true,
    ...overrides,
  };
}

function rad(deg) {
  return deg * DEG;
}

function movePoint(x, y, heading, dist) {
  const r = rad(heading);
  return {
    x: x + dist * Math.cos(r),
    y: y + dist * Math.sin(r),
  };
}

function pushSegment(state, from, to) {
  if (!state.penDown) return state;
  const segments = [
    ...state.segments,
    {from, to, color: state.color, width: 2.5},
  ];
  return {...state, segments};
}

function applyMotion(state, dist) {
  const from = {x: state.x, y: state.y};
  const next = movePoint(state.x, state.y, state.heading, dist);
  let nextState = {...state, x: next.x, y: next.y};
  nextState = pushSegment(nextState, from, next);
  if (state.filling && state.fillPolygon) {
    nextState = {
      ...nextState,
      fillPolygon: [...state.fillPolygon, {x: next.x, y: next.y}],
    };
  }
  return nextState;
}

/** Одна команда turtle → новое состояние + метка для UI. */
export function runTurtleCommand(state, command) {
  const {type, args = []} = command;
  let next = {...state};
  let label = '';

  switch (type) {
    case 'forward': {
      const n = Number(args[0]) || 0;
      label = `forward(${n})`;
      next = applyMotion(next, n);
      break;
    }
    case 'backward': {
      const n = Number(args[0]) || 0;
      label = `backward(${n})`;
      next = applyMotion(next, -n);
      break;
    }
    case 'left': {
      const a = Number(args[0]) || 0;
      label = `left(${a})`;
      next = {...next, heading: (next.heading + a) % 360};
      break;
    }
    case 'right': {
      const a = Number(args[0]) || 0;
      label = `right(${a})`;
      next = {...next, heading: (next.heading - a + 360) % 360};
      break;
    }
    case 'penup':
      label = 'penup()';
      next = {...next, penDown: false};
      break;
    case 'pendown':
      label = 'pendown()';
      next = {...next, penDown: true};
      break;
    case 'goto': {
      const gx = Number(args[0]) || 0;
      const gy = Number(args[1]) || 0;
      label = `goto(${gx}, ${gy})`;
      const from = {x: next.x, y: next.y};
      next = {...next, x: gx, y: gy};
      if (next.penDown) {
        next = pushSegment(next, from, {x: gx, y: gy});
      }
      break;
    }
    case 'color': {
      const name = String(args[0] || 'black');
      label = `color("${name}")`;
      const c = TURTLE_COLORS[name] ?? name;
      next = {...next, color: c, fillColor: c};
      break;
    }
    case 'pencolor': {
      const name = String(args[0] || 'black');
      label = `pencolor("${name}")`;
      next = {...next, color: TURTLE_COLORS[name] ?? name};
      break;
    }
    case 'fillcolor': {
      const name = String(args[0] || 'yellow');
      label = `fillcolor("${name}")`;
      next = {...next, fillColor: TURTLE_COLORS[name] ?? name};
      break;
    }
    case 'begin_fill':
      label = 'begin_fill()';
      next = {
        ...next,
        filling: true,
        fillPolygon: [{x: next.x, y: next.y}],
      };
      break;
    case 'end_fill': {
      label = 'end_fill()';
      const poly =
        next.fillPolygon && next.fillPolygon.length >= 3
          ? {points: [...next.fillPolygon], color: next.fillColor}
          : null;
      next = {
        ...next,
        filling: false,
        fillPolygon: null,
        filledRegions: poly
          ? [...(next.filledRegions || []), poly]
          : next.filledRegions || [],
      };
      break;
    }
    case 'circle': {
      const radius = Number(args[0]) || 30;
      const steps = 36;
      label = `circle(${radius})`;
      for (let i = 0; i < steps; i += 1) {
        const arc = (360 / steps) * (Math.PI / 180) * radius;
        next = applyMotion(next, arc);
        next = {...next, heading: (next.heading + 360 / steps) % 360};
      }
      break;
    }
    case 'home':
      label = 'home()';
      next = createTurtleState({color: next.color, fillColor: next.fillColor});
      break;
    case 'hideturtle':
      label = 'hideturtle()';
      next = {...next, visible: false};
      break;
    case 'showturtle':
      label = 'showturtle()';
      next = {...next, visible: true};
      break;
    default:
      label = type;
  }

  return {state: next, label};
}

/** Развернуть шаги программы (с учётом lineIndex для подсветки кода). */
export function expandProgramSteps(program) {
  const out = [];
  for (const block of program.blocks) {
    if (block.repeat) {
      for (let i = 0; i < block.repeat; i += 1) {
        for (const step of block.steps) {
          out.push({
            ...step,
            lineIndex: step.lineIndex ?? block.lineIndex,
            loopIteration: i + 1,
          });
        }
      }
    } else {
      for (const step of block.steps) {
        out.push({...step, lineIndex: step.lineIndex ?? block.lineIndex});
      }
    }
  }
  return out;
}

export const TURTLE_PROGRAMS = {
  square: {
    id: 'square',
    label: 'Квадрат',
    title: 'Квадрат циклом for',
    description: 'Четыре стороны: вперёд и поворот на 90°.',
    code: `import turtle

t = turtle.Turtle()

for i in range(4):
    t.forward(80)
    t.left(90)

turtle.done()`,
    highlightLines: [4, 5],
    blocks: [
      {
        repeat: 4,
        lineIndex: 4,
        steps: [
          {type: 'forward', args: [80], lineIndex: 4},
          {type: 'left', args: [90], lineIndex: 5},
        ],
      },
    ],
    hints: [
      'forward(80) — черепашка рисует линию вперёд',
      'left(90) — поворот против часовой стрелки',
      'range(4) даёт ровно четыре стороны',
    ],
  },
  triangle: {
    id: 'triangle',
    label: 'Треугольник',
    title: 'Равносторонний треугольник',
    description: 'Три стороны и угол 120° (внешний угол равностороннего).',
    code: `import turtle

t = turtle.Turtle()

for i in range(3):
    t.forward(90)
    t.left(120)

turtle.done()`,
    highlightLines: [4, 5],
    blocks: [
      {
        repeat: 3,
        lineIndex: 4,
        steps: [
          {type: 'forward', args: [90], lineIndex: 4},
          {type: 'left', args: [120], lineIndex: 5},
        ],
      },
    ],
    hints: [
      'У равностороннего треугольника внешний угол 120°',
      'Три итерации — три стороны',
    ],
  },
  house: {
    id: 'house',
    label: 'Домик',
    title: 'Квадрат и крыша',
    description: 'Корпус по периметру и две линии крыши.',
    code: `import turtle

t = turtle.Turtle()

for i in range(4):
    t.left(90)
    t.forward(70)

t.left(45)
t.forward(50)
t.left(90)
t.forward(50)

turtle.done()`,
    highlightLines: [4, 5, 8, 9, 10],
    blocks: [
      {
        repeat: 4,
        lineIndex: 4,
        steps: [
          {type: 'left', args: [90], lineIndex: 4},
          {type: 'forward', args: [70], lineIndex: 5},
        ],
      },
      {steps: [{type: 'left', args: [45], lineIndex: 8}]},
      {steps: [{type: 'forward', args: [50], lineIndex: 9}]},
      {steps: [{type: 'left', args: [90], lineIndex: 10}]},
      {steps: [{type: 'forward', args: [50], lineIndex: 10}]},
    ],
    hints: [
      'Сначала рисуем "коробку" из четырёх сторон',
      'Потом крыша: поворот 45° и две короткие линии',
    ],
  },
  flower: {
    id: 'flower',
    label: 'Цветок',
    title: 'Лепестки из кругов',
    description: 'color, pensize и circle в цикле.',
    code: `import turtle

t = turtle.Turtle()
t.color("red")

for i in range(6):
    t.circle(28)
    t.left(60)

turtle.done()`,
    highlightLines: [3, 5, 6],
    blocks: [
      {steps: [{type: 'color', args: ['red'], lineIndex: 3}]},
      {
        repeat: 6,
        lineIndex: 5,
        steps: [
          {type: 'circle', args: [28], lineIndex: 5},
          {type: 'left', args: [60], lineIndex: 6},
        ],
      },
    ],
    hints: [
      'circle(28) рисует дугу — в симуляции это много маленьких шагов',
      'left(60) между лепестками: 360 / 6 = 60°',
    ],
  },
  filled: {
    id: 'filled',
    label: 'Заливка',
    title: 'Треугольник с заливкой',
    description: 'begin_fill / end_fill и fillcolor.',
    code: `import turtle

t = turtle.Turtle()
t.fillcolor("yellow")
t.begin_fill()

for i in range(3):
    t.forward(75)
    t.left(120)

t.end_fill()
turtle.done()`,
    highlightLines: [3, 4, 7, 8, 10],
    blocks: [
      {steps: [{type: 'fillcolor', args: ['yellow'], lineIndex: 3}]},
      {steps: [{type: 'begin_fill', args: [], lineIndex: 4}]},
      {
        repeat: 3,
        lineIndex: 7,
        steps: [
          {type: 'forward', args: [75], lineIndex: 7},
          {type: 'left', args: [120], lineIndex: 8},
        ],
      },
      {steps: [{type: 'end_fill', args: [], lineIndex: 10}]},
    ],
    hints: [
      'begin_fill() запоминает контур для заливки',
      'end_fill() заливает замкнутую область',
    ],
  },
};

export const QUICK_COMMANDS = [
  {type: 'forward', args: [40], label: 'forward(40)'},
  {type: 'backward', args: [40], label: 'backward(40)'},
  {type: 'left', args: [90], label: 'left(90)'},
  {type: 'right', args: [45], label: 'right(45)'},
  {type: 'penup', args: [], label: 'penup()'},
  {type: 'pendown', args: [], label: 'pendown()'},
  {type: 'color', args: ['red'], label: 'color("red")'},
  {type: 'color', args: ['blue'], label: 'color("blue")'},
  {type: 'home', args: [], label: 'home()'},
];

export function getFilledRegions(state) {
  const regions = [...(state.filledRegions || [])];
  if (state.filling && state.fillPolygon?.length >= 3) {
    regions.push({points: state.fillPolygon, color: state.fillColor});
  }
  return regions;
}
