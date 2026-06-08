export const BIT_OPS = [
  {id: 'and', symbol: '&', label: 'AND', fn: (a, b) => a & b},
  {id: 'or', symbol: '|', label: 'OR', fn: (a, b) => a | b},
  {id: 'xor', symbol: '^', label: 'XOR', fn: (a, b) => a ^ b},
  {id: 'shl', symbol: '<<', label: 'SHL', fn: (a, b) => (a << b) >>> 0},
  {id: 'shr', symbol: '>>', label: 'SHR', fn: (a, b) => a >> b},
];

export function toU8(n) {
  return (n & 0xff) >>> 0;
}

export function bits8(n) {
  const v = toU8(n);
  return Array.from({length: 8}, (_, i) => (v >> (7 - i)) & 1);
}

export function bits32Hex(n) {
  const v = (n >>> 0) & 0xffffffff;
  return Array.from({length: 32}, (_, i) => (v >> (31 - i)) & 1);
}

/** Дополнительный код 8 бит */
export function toTwos8(n) {
  return toU8(n);
}

export function signedFromTwos8(u) {
  return u >= 128 ? u - 256 : u;
}

export function formatBin8(n) {
  return bits8(n).join('');
}

export function formatHex8(n) {
  return `0x${toU8(n).toString(16).toUpperCase().padStart(2, '0')}`;
}

export function endianBytes32(value, endian) {
  const v = (value >>> 0) & 0xffffffff;
  const bytes = [
    (v >>> 24) & 0xff,
    (v >>> 16) & 0xff,
    (v >>> 8) & 0xff,
    v & 0xff,
  ];
  return endian === 'le' ? [...bytes].reverse() : bytes;
}

export function float32Parts(value) {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setFloat32(0, value, false);
  const bits = view.getUint32(0, false);
  const sign = (bits >>> 31) & 1;
  const exp = (bits >>> 23) & 0xff;
  const frac = bits & 0x7fffff;
  return {sign, exp, frac, bits};
}
