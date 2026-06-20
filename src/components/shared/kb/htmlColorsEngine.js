/** Именованные HTML/CSS-цвета (W3C). Данные по категориям, как на colorscheme.ru. */
export const HTML_COLOR_GROUPS = [
  {
    id: 'red',
    label: 'Красные тона',
    colors: [
      {name: 'IndianRed', hex: '#CD5C5C', r: 205, g: 92, b: 92},
      {name: 'LightCoral', hex: '#F08080', r: 240, g: 128, b: 128},
      {name: 'Salmon', hex: '#FA8072', r: 250, g: 128, b: 114},
      {name: 'DarkSalmon', hex: '#E9967A', r: 233, g: 150, b: 122},
      {name: 'LightSalmon', hex: '#FFA07A', r: 255, g: 160, b: 122},
      {name: 'Crimson', hex: '#DC143C', r: 220, g: 20, b: 60},
      {name: 'Red', hex: '#FF0000', r: 255, g: 0, b: 0},
      {name: 'FireBrick', hex: '#B22222', r: 178, g: 34, b: 34},
      {name: 'DarkRed', hex: '#8B0000', r: 139, g: 0, b: 0},
    ],
  },
  {
    id: 'pink',
    label: 'Розовые тона',
    colors: [
      {name: 'Pink', hex: '#FFC0CB', r: 255, g: 192, b: 203},
      {name: 'LightPink', hex: '#FFB6C1', r: 255, g: 182, b: 193},
      {name: 'HotPink', hex: '#FF69B4', r: 255, g: 105, b: 180},
      {name: 'DeepPink', hex: '#FF1493', r: 255, g: 20, b: 147},
      {name: 'MediumVioletRed', hex: '#C71585', r: 199, g: 21, b: 133},
      {name: 'PaleVioletRed', hex: '#DB7093', r: 219, g: 112, b: 147},
    ],
  },
  {
    id: 'orange',
    label: 'Оранжевые тона',
    colors: [
      {name: 'Coral', hex: '#FF7F50', r: 255, g: 127, b: 80},
      {name: 'Tomato', hex: '#FF6347', r: 255, g: 99, b: 71},
      {name: 'OrangeRed', hex: '#FF4500', r: 255, g: 69, b: 0},
      {name: 'DarkOrange', hex: '#FF8C00', r: 255, g: 140, b: 0},
      {name: 'Orange', hex: '#FFA500', r: 255, g: 165, b: 0},
    ],
  },
  {
    id: 'yellow',
    label: 'Жёлтые тона',
    colors: [
      {name: 'Gold', hex: '#FFD700', r: 255, g: 215, b: 0},
      {name: 'Yellow', hex: '#FFFF00', r: 255, g: 255, b: 0},
      {name: 'LightYellow', hex: '#FFFFE0', r: 255, g: 255, b: 224},
      {name: 'LemonChiffon', hex: '#FFFACD', r: 255, g: 250, b: 205},
      {name: 'LightGoldenrodYellow', hex: '#FAFAD2', r: 250, g: 250, b: 210},
      {name: 'PapayaWhip', hex: '#FFEFD5', r: 255, g: 239, b: 213},
      {name: 'Moccasin', hex: '#FFE4B5', r: 255, g: 228, b: 181},
      {name: 'PeachPuff', hex: '#FFDAB9', r: 255, g: 218, b: 185},
      {name: 'PaleGoldenrod', hex: '#EEE8AA', r: 238, g: 232, b: 170},
      {name: 'Khaki', hex: '#F0E68C', r: 240, g: 230, b: 140},
      {name: 'DarkKhaki', hex: '#BDB76B', r: 189, g: 183, b: 107},
    ],
  },
  {
    id: 'purple',
    label: 'Фиолетовые тона',
    colors: [
      {name: 'Lavender', hex: '#E6E6FA', r: 230, g: 230, b: 250},
      {name: 'Thistle', hex: '#D8BFD8', r: 216, g: 191, b: 216},
      {name: 'Plum', hex: '#DDA0DD', r: 221, g: 160, b: 221},
      {name: 'Violet', hex: '#EE82EE', r: 238, g: 130, b: 238},
      {name: 'Orchid', hex: '#DA70D6', r: 218, g: 112, b: 214},
      {name: 'Fuchsia', hex: '#FF00FF', r: 255, g: 0, b: 255, aliases: ['Magenta']},
      {name: 'MediumOrchid', hex: '#BA55D3', r: 186, g: 85, b: 211},
      {name: 'MediumPurple', hex: '#9370DB', r: 147, g: 112, b: 219},
      {name: 'BlueViolet', hex: '#8A2BE2', r: 138, g: 43, b: 226},
      {name: 'DarkViolet', hex: '#9400D3', r: 148, g: 0, b: 211},
      {name: 'DarkOrchid', hex: '#9932CC', r: 153, g: 50, b: 204},
      {name: 'DarkMagenta', hex: '#8B008B', r: 139, g: 0, b: 139},
      {name: 'Purple', hex: '#800080', r: 128, g: 0, b: 128},
      {name: 'Indigo', hex: '#4B0082', r: 75, g: 0, b: 130},
      {name: 'SlateBlue', hex: '#6A5ACD', r: 106, g: 90, b: 205},
      {name: 'DarkSlateBlue', hex: '#483D8B', r: 72, g: 61, b: 139},
    ],
  },
  {
    id: 'brown',
    label: 'Коричневые тона',
    colors: [
      {name: 'Cornsilk', hex: '#FFF8DC', r: 255, g: 248, b: 220},
      {name: 'BlanchedAlmond', hex: '#FFEBCD', r: 255, g: 235, b: 205},
      {name: 'Bisque', hex: '#FFE4C4', r: 255, g: 228, b: 196},
      {name: 'NavajoWhite', hex: '#FFDEAD', r: 255, g: 222, b: 173},
      {name: 'Wheat', hex: '#F5DEB3', r: 245, g: 222, b: 179},
      {name: 'BurlyWood', hex: '#DEB887', r: 222, g: 184, b: 135},
      {name: 'Tan', hex: '#D2B48C', r: 210, g: 180, b: 140},
      {name: 'RosyBrown', hex: '#BC8F8F', r: 188, g: 143, b: 143},
      {name: 'SandyBrown', hex: '#F4A460', r: 244, g: 164, b: 96},
      {name: 'Goldenrod', hex: '#DAA520', r: 218, g: 165, b: 32},
      {name: 'DarkGoldenRod', hex: '#B8860B', r: 184, g: 134, b: 11},
      {name: 'Peru', hex: '#CD853F', r: 205, g: 133, b: 63},
      {name: 'Chocolate', hex: '#D2691E', r: 210, g: 105, b: 30},
      {name: 'SaddleBrown', hex: '#8B4513', r: 139, g: 69, b: 19},
      {name: 'Sienna', hex: '#A0522D', r: 160, g: 82, b: 45},
      {name: 'Brown', hex: '#A52A2A', r: 165, g: 42, b: 42},
      {name: 'Maroon', hex: '#800000', r: 128, g: 0, b: 0},
    ],
  },
  {
    id: 'green',
    label: 'Зелёные тона',
    colors: [
      {name: 'GreenYellow', hex: '#ADFF2F', r: 173, g: 255, b: 47},
      {name: 'Chartreuse', hex: '#7FFF00', r: 127, g: 255, b: 0},
      {name: 'LawnGreen', hex: '#7CFC00', r: 124, g: 252, b: 0},
      {name: 'Lime', hex: '#00FF00', r: 0, g: 255, b: 0},
      {name: 'LimeGreen', hex: '#32CD32', r: 50, g: 205, b: 50},
      {name: 'PaleGreen', hex: '#98FB98', r: 152, g: 251, b: 152},
      {name: 'LightGreen', hex: '#90EE90', r: 144, g: 238, b: 144},
      {name: 'MediumSpringGreen', hex: '#00FA9A', r: 0, g: 250, b: 154},
      {name: 'SpringGreen', hex: '#00FF7F', r: 0, g: 255, b: 127},
      {name: 'MediumSeaGreen', hex: '#3CB371', r: 60, g: 179, b: 113},
      {name: 'SeaGreen', hex: '#2E8B57', r: 46, g: 139, b: 87},
      {name: 'ForestGreen', hex: '#228B22', r: 34, g: 139, b: 34},
      {name: 'Green', hex: '#008000', r: 0, g: 128, b: 0},
      {name: 'DarkGreen', hex: '#006400', r: 0, g: 100, b: 0},
      {name: 'YellowGreen', hex: '#9ACD32', r: 154, g: 205, b: 50},
      {name: 'OliveDrab', hex: '#6B8E23', r: 107, g: 142, b: 35},
      {name: 'Olive', hex: '#808000', r: 128, g: 128, b: 0},
      {name: 'DarkOliveGreen', hex: '#556B2F', r: 85, g: 107, b: 47},
      {name: 'MediumAquamarine', hex: '#66CDAA', r: 102, g: 205, b: 170},
      {name: 'DarkSeaGreen', hex: '#8FBC8F', r: 143, g: 188, b: 143},
      {name: 'LightSeaGreen', hex: '#20B2AA', r: 32, g: 178, b: 170},
      {name: 'DarkCyan', hex: '#008B8B', r: 0, g: 139, b: 139},
      {name: 'Teal', hex: '#008080', r: 0, g: 128, b: 128},
    ],
  },
  {
    id: 'blue',
    label: 'Синие тона',
    colors: [
      {name: 'Aqua', hex: '#00FFFF', r: 0, g: 255, b: 255, aliases: ['Cyan']},
      {name: 'LightCyan', hex: '#E0FFFF', r: 224, g: 255, b: 255},
      {name: 'PaleTurquoise', hex: '#AFEEEE', r: 175, g: 238, b: 238},
      {name: 'Aquamarine', hex: '#7FFFD4', r: 127, g: 255, b: 212},
      {name: 'Turquoise', hex: '#40E0D0', r: 64, g: 224, b: 208},
      {name: 'MediumTurquoise', hex: '#48D1CC', r: 72, g: 209, b: 204},
      {name: 'DarkTurquoise', hex: '#00CED1', r: 0, g: 206, b: 209},
      {name: 'CadetBlue', hex: '#5F9EA0', r: 95, g: 158, b: 160},
      {name: 'SteelBlue', hex: '#4682B4', r: 70, g: 130, b: 180},
      {name: 'LightSteelBlue', hex: '#B0C4DE', r: 176, g: 196, b: 222},
      {name: 'PowderBlue', hex: '#B0E0E6', r: 176, g: 224, b: 230},
      {name: 'LightBlue', hex: '#ADD8E6', r: 173, g: 216, b: 230},
      {name: 'SkyBlue', hex: '#87CEEB', r: 135, g: 206, b: 235},
      {name: 'LightSkyBlue', hex: '#87CEFA', r: 135, g: 206, b: 250},
      {name: 'DeepSkyBlue', hex: '#00BFFF', r: 0, g: 191, b: 255},
      {name: 'DodgerBlue', hex: '#1E90FF', r: 30, g: 144, b: 255},
      {name: 'CornflowerBlue', hex: '#6495ED', r: 100, g: 149, b: 237},
      {name: 'MediumSlateBlue', hex: '#7B68EE', r: 123, g: 104, b: 238},
      {name: 'RoyalBlue', hex: '#4169E1', r: 65, g: 105, b: 225},
      {name: 'Blue', hex: '#0000FF', r: 0, g: 0, b: 255},
      {name: 'MediumBlue', hex: '#0000CD', r: 0, g: 0, b: 205},
      {name: 'DarkBlue', hex: '#00008B', r: 0, g: 0, b: 139},
      {name: 'Navy', hex: '#000080', r: 0, g: 0, b: 128},
      {name: 'MidnightBlue', hex: '#191970', r: 25, g: 25, b: 112},
    ],
  },
  {
    id: 'white',
    label: 'Белые тона',
    colors: [
      {name: 'White', hex: '#FFFFFF', r: 255, g: 255, b: 255},
      {name: 'Snow', hex: '#FFFAFA', r: 255, g: 250, b: 250},
      {name: 'Honeydew', hex: '#F0FFF0', r: 240, g: 255, b: 240},
      {name: 'MintCream', hex: '#F5FFFA', r: 245, g: 255, b: 250},
      {name: 'Azure', hex: '#F0FFFF', r: 240, g: 255, b: 255},
      {name: 'AliceBlue', hex: '#F0F8FF', r: 240, g: 248, b: 255},
      {name: 'GhostWhite', hex: '#F8F8FF', r: 248, g: 248, b: 255},
      {name: 'WhiteSmoke', hex: '#F5F5F5', r: 245, g: 245, b: 245},
      {name: 'Seashell', hex: '#FFF5EE', r: 255, g: 245, b: 238},
      {name: 'Beige', hex: '#F5F5DC', r: 245, g: 245, b: 220},
      {name: 'OldLace', hex: '#FDF5E6', r: 253, g: 245, b: 230},
      {name: 'FloralWhite', hex: '#FFFAF0', r: 255, g: 250, b: 240},
      {name: 'Ivory', hex: '#FFFFF0', r: 255, g: 255, b: 240},
      {name: 'AntiqueWhite', hex: '#FAEBD7', r: 250, g: 235, b: 215},
      {name: 'Linen', hex: '#FAF0E6', r: 250, g: 240, b: 230},
      {name: 'LavenderBlush', hex: '#FFF0F5', r: 255, g: 240, b: 245},
      {name: 'MistyRose', hex: '#FFE4E1', r: 255, g: 228, b: 225},
    ],
  },
  {
    id: 'gray',
    label: 'Серые тона',
    colors: [
      {name: 'Gainsboro', hex: '#DCDCDC', r: 220, g: 220, b: 220},
      {name: 'LightGray', hex: '#D3D3D3', r: 211, g: 211, b: 211, aliases: ['LightGrey']},
      {name: 'Silver', hex: '#C0C0C0', r: 192, g: 192, b: 192},
      {name: 'DarkGray', hex: '#A9A9A9', r: 169, g: 169, b: 169, aliases: ['DarkGrey']},
      {name: 'Gray', hex: '#808080', r: 128, g: 128, b: 128, aliases: ['Grey']},
      {name: 'DimGray', hex: '#696969', r: 105, g: 105, b: 105, aliases: ['DimGrey']},
      {name: 'LightSlateGray', hex: '#778899', r: 119, g: 136, b: 153, aliases: ['LightSlateGrey']},
      {name: 'SlateGray', hex: '#708090', r: 112, g: 128, b: 144, aliases: ['SlateGrey']},
      {name: 'DarkSlateGray', hex: '#2F4F4F', r: 47, g: 79, b: 79, aliases: ['DarkSlateGrey']},
      {name: 'Black', hex: '#000000', r: 0, g: 0, b: 0},
    ],
  },
];

export const ALL_HTML_COLORS = HTML_COLOR_GROUPS.flatMap((group) =>
  group.colors.map((color) => ({
    ...color,
    groupId: group.id,
    groupLabel: group.label,
  })),
);

export const QUIZ_ROUND_SIZE = 10;

export function formatRgb(color) {
  return `${color.r}, ${color.g}, ${color.b}`;
}

export function formatRgbCss(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function colorLabel(color) {
  if (!color.aliases?.length) return color.name;
  return `${color.name} (${color.aliases.join(', ')})`;
}

export function matchesColorName(input, color) {
  const normalized = input.trim().toLowerCase();
  if (color.name.toLowerCase() === normalized) return true;
  return color.aliases?.some((alias) => alias.toLowerCase() === normalized) ?? false;
}

export function contrastText(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#f5f5f5';
}

export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(correct, pool, count, keyFn) {
  const correctValue = keyFn(correct);
  const candidates = pool.filter((c) => keyFn(c) !== correctValue);
  const sameGroup = candidates.filter((c) => c.groupId === correct.groupId);
  const picked = shuffle(sameGroup.length >= count ? sameGroup : candidates).slice(0, count);
  while (picked.length < count) {
    const extra = candidates.find((c) => !picked.includes(c));
    if (!extra) break;
    picked.push(extra);
  }
  return picked;
}

export function buildQuizQuestion(mode, color, pool = ALL_HTML_COLORS) {
  const keyFns = {
    name: (c) => c.name,
    hex: (c) => c.hex.toUpperCase(),
    rgb: (c) => formatRgb(c),
  };
  const labelFns = {
    name: (c) => c.name,
    hex: (c) => c.hex.toUpperCase(),
    rgb: (c) => formatRgbCss(c),
  };

  const keyFn = keyFns[mode];
  const labelFn = labelFns[mode];
  const distractors = pickDistractors(color, pool, 3, keyFn);
  const options = shuffle([
    {id: color.name, label: labelFn(color), correct: true},
    ...distractors.map((d) => ({id: d.name, label: labelFn(d), correct: false})),
  ]);

  return {color, options, mode};
}

export function buildQuizRound(mode, size = QUIZ_ROUND_SIZE, pool = ALL_HTML_COLORS) {
  return shuffle(pool).slice(0, Math.min(size, pool.length)).map((color) => buildQuizQuestion(mode, color, pool));
}

export function filterColors(query, groupId = 'all') {
  const q = query.trim().toLowerCase();
  return ALL_HTML_COLORS.filter((color) => {
    if (groupId !== 'all' && color.groupId !== groupId) return false;
    if (!q) return true;
    const haystack = [color.name, color.hex, formatRgb(color), ...(color.aliases ?? [])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
