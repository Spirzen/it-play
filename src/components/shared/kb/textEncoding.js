const LABELS = {
  'UTF-8': 'utf-8',
  'UTF-16': 'utf-16',
  'UTF-16BE': 'utf-16be',
  'UTF-16LE': 'utf-16le',
  'Windows-1251': 'windows-1251',
  'ISO-8859-1': 'iso-8859-1',
  'ISO-8859-2': 'iso-8859-2',
  'KOI8-R': 'koi8-r',
  CP437: 'ibm437',
  MacRoman: 'macintosh',
};

export const ENCODING_OPTIONS = Object.keys(LABELS);

const encoderTables = new Map();

export function normalizeEncoding(name) {
  return LABELS[name] || name.toLowerCase();
}

function getSingleByteEncoderTable(label) {
  if (encoderTables.has(label)) {
    return encoderTables.get(label);
  }

  const decoder = new TextDecoder(label);
  const bytes = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) {
    bytes[i] = i;
  }

  const chars = decoder.decode(bytes);
  const map = new Map();
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (ch && ch !== '\uFFFD' && !map.has(ch)) {
      map.set(ch, i);
    }
  }

  encoderTables.set(label, map);
  return map;
}

function encodeSingleByte(text, label) {
  const table = getSingleByteEncoderTable(label);
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const code = table.get(ch);
    if (code === undefined) {
      throw new Error(
        `Символ "${ch}" (U+${text.charCodeAt(i).toString(16).toUpperCase()}) недоступен в ${label}`,
      );
    }
    out[i] = code;
  }
  return out;
}

function encodeUtf16(text, littleEndian) {
  const bom = littleEndian ? [0xff, 0xfe] : [0xfe, 0xff];
  const body = new Uint8Array(text.length * 2);
  for (let i = 0; i < text.length; i += 1) {
    const cp = text.charCodeAt(i);
    if (littleEndian) {
      body[i * 2] = cp & 0xff;
      body[i * 2 + 1] = cp >> 8;
    } else {
      body[i * 2] = cp >> 8;
      body[i * 2 + 1] = cp & 0xff;
    }
  }
  const result = new Uint8Array(bom.length + body.length);
  result.set(bom, 0);
  result.set(body, bom.length);
  return result;
}

export function textToBytes(text, encodingName) {
  const label = normalizeEncoding(encodingName);

  if (label === 'utf-8') {
    return new TextEncoder().encode(text);
  }

  if (label === 'utf-16' || label === 'utf-16le') {
    return encodeUtf16(text, true);
  }

  if (label === 'utf-16be') {
    return encodeUtf16(text, false);
  }

  return encodeSingleByte(text, label);
}

export function bytesToText(bytes, encodingName) {
  const label = normalizeEncoding(encodingName);
  return new TextDecoder(label).decode(bytes);
}

export function convertEncoding(text, fromEncoding, toEncoding) {
  const bytes = textToBytes(text, fromEncoding);
  return {bytes, text: bytesToText(bytes, toEncoding)};
}

export function bytesToHex(bytes, max = 64) {
  const slice = bytes.length > max ? bytes.slice(0, max) : bytes;
  const hex = Array.from(slice, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  return bytes.length > max ? `${hex} … (+${bytes.length - max} байт)` : hex;
}
