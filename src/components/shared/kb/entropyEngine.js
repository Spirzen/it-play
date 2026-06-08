/** Энтропия Шеннона для демо теории информации */

export const ENTROPY_PRESETS = [
  {
    id: 'uniform',
    label: 'Равномерный алфавит (4 символа)',
    text: 'abcdabcd',
    note: 'Максимальная энтропия на символ при равных частотах — сложно сжать без потерь.',
  },
  {
    id: 'russian',
    label: 'Русский текст (избыточность)',
    text: 'программирование это работа с абстракциями и ограничениями памяти',
    note: 'Язык снижает энтропию: частые буквы и слоги — основа словарного сжатия.',
  },
  {
    id: 'skewed',
    label: 'Перекошенное распределение',
    text: 'aaaaaaaaaab',
    note: 'Низкая энтропия — много предсказуемости, хорошо сжимается RLE/Huffman.',
  },
  {
    id: 'binary',
    label: 'Случайные биты (высокая энтропия)',
    text: '0110100110100110',
    note: 'Близко к пределу 1 бит/символ для двоичного алфавита — типично для шифротекста.',
  },
];

export function charFrequencies(text) {
  const map = new Map();
  for (const ch of text) {
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return map;
}

/** Энтропия в битах на символ */
export function shannonEntropy(text) {
  if (!text.length) return {entropy: 0, perChar: [], unique: 0};
  const freq = charFrequencies(text);
  const n = text.length;
  let h = 0;
  const perChar = [];
  for (const [ch, count] of freq) {
    const p = count / n;
    const contrib = -p * Math.log2(p);
    h += contrib;
    perChar.push({ch: displayChar(ch), count, p, bits: contrib});
  }
  perChar.sort((a, b) => b.count - a.count);
  return {
    entropy: h,
    perChar,
    unique: freq.size,
    totalChars: n,
    maxEntropy: Math.log2(freq.size || 1),
  };
}

function displayChar(ch) {
  if (ch === ' ') return '␣';
  if (ch === '\n') return '↵';
  if (ch === '\t') return '⇥';
  return ch;
}

export function formatBits(v, digits = 3) {
  return `${v.toFixed(digits)} бит`;
}

/** Оценка нижней границы сжатия без потерь (бит на весь текст) */
export function minCodeLengthBits(text) {
  const {entropy, totalChars} = shannonEntropy(text);
  return entropy * totalChars;
}
