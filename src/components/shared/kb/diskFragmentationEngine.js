/** Учебная модель фрагментации файловой системы на диске. */

export const BLOCK_COUNT = 32;

export const DRIVE_TYPES = [
  {id: 'hdd', label: 'HDD', hint: 'Механический диск: чем больше разрывов файла, тем больше перемещений головки.'},
  {id: 'ssd', label: 'SSD', hint: 'Флэш-накопитель: порядок блоков почти не влияет на скорость; вместо дефрагментации — TRIM.'},
];

const FILE_COLORS = ['#5c6bc0', '#26a69a', '#ef6c00', '#8e24aa', '#00838f', '#c62828'];

export function emptyDisk() {
  return Array.from({length: BLOCK_COUNT}, () => null);
}

/** Пресеты: blocks[i] = fileId (1..n) или null */
export function presetDisk(presetId) {
  const disk = emptyDisk();
  if (presetId === 'fragmented') {
    placeFile(disk, 1, 'Документы', [0, 1, 2]);
    placeFile(disk, 2, 'Фото', [5, 6, 7, 8]);
    placeFile(disk, 3, 'Игра', [12, 13, 14, 15, 16, 17]);
    placeFile(disk, 4, 'Кэш', [20, 21]);
    return buildState(disk);
  }
  placeFile(disk, 1, 'Система', [0, 1, 2, 3]);
  placeFile(disk, 2, 'Проекты', [4, 5, 6, 7, 8]);
  placeFile(disk, 3, 'Медиа', [9, 10, 11, 12]);
  return buildState(disk);
}

function placeFile(disk, id, name, indices) {
  indices.forEach((i) => {
    disk[i] = {fileId: id, name, color: FILE_COLORS[(id - 1) % FILE_COLORS.length]};
  });
}

function buildState(blocks) {
  const filesMap = new Map();
  blocks.forEach((cell, index) => {
    if (!cell) return;
    const existing = filesMap.get(cell.fileId) ?? {
      id: cell.fileId,
      name: cell.name,
      color: cell.color,
      indices: [],
    };
    existing.indices.push(index);
    filesMap.set(cell.fileId, existing);
  });
  const files = [...filesMap.values()].map((f) => ({
    ...f,
    indices: [...f.indices].sort((a, b) => a - b),
    size: f.indices.length,
    fragments: countFragments(f.indices),
  }));
  const free = blocks.filter((c) => !c).length;
  const used = BLOCK_COUNT - free;
  const fragmentationPct = used ? Math.round((files.reduce((s, f) => s + f.fragments - 1, 0) / used) * 100) : 0;
  return {blocks, files, freeBlocks: free, fragmentationPct, nextFileId: Math.max(0, ...files.map((f) => f.id)) + 1};
}

function countFragments(indices) {
  if (!indices.length) return 0;
  let frags = 1;
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] !== indices[i - 1] + 1) frags += 1;
  }
  return frags;
}

function findContiguousRun(blocks, size) {
  let run = 0;
  for (let i = 0; i < BLOCK_COUNT; i += 1) {
    if (!blocks[i]) {
      run += 1;
      if (run >= size) return i - size + 1;
    } else {
      run = 0;
    }
  }
  return -1;
}

function allocateScattered(blocks, size) {
  const freeIdx = [];
  for (let i = 0; i < BLOCK_COUNT; i += 1) {
    if (!blocks[i]) freeIdx.push(i);
  }
  if (freeIdx.length < size) return null;
  return freeIdx.slice(0, size);
}

export function addFile(state, size, name) {
  const blocks = state.blocks.map((c) => (c ? {...c} : null));
  const runStart = findContiguousRun(blocks, size);
  const indices = runStart >= 0
    ? Array.from({length: size}, (_, i) => runStart + i)
    : allocateScattered(blocks, size);
  if (!indices) return {ok: false, reason: 'Недостаточно свободных блоков', state};

  const id = state.nextFileId;
  const color = FILE_COLORS[(id - 1) % FILE_COLORS.length];
  indices.forEach((i) => {
    blocks[i] = {fileId: id, name, color};
  });
  const next = buildState(blocks);
  const file = next.files.find((f) => f.id === id);
  const contiguous = indices.length === size && indices.every((v, i) => v === indices[0] + i);
  return {
    ok: true,
    state: next,
    message: contiguous
      ? `"${name}" записан в ${size} смежных блоков`
      : `"${name}" разбит на ${file?.fragments ?? '?'} фрагментов — свободного "коридора" не хватило`,
    fragmented: !contiguous,
  };
}

export function deleteFile(state, fileId) {
  const blocks = state.blocks.map((c) => (c?.fileId === fileId ? null : c));
  const next = buildState(blocks);
  const name = state.files.find((f) => f.id === fileId)?.name ?? 'файл';
  return {state: next, message: `"${name}" удалён — блоки помечены свободными`};
}

export function defragment(state) {
  const sorted = [...state.files].sort((a, b) => a.id - b.id);
  const blocks = emptyDisk();
  let cursor = 0;
  sorted.forEach((file) => {
    for (let i = 0; i < file.size; i += 1) {
      blocks[cursor] = {fileId: file.id, name: file.name, color: file.color};
      cursor += 1;
    }
  });
  const next = buildState(blocks);
  return {
    state: next,
    message: 'Файлы уплотнены к началу диска — каждый занимает один непрерывный диапазон',
  };
}

export function simulateRead(state, fileId, driveType) {
  const file = state.files.find((f) => f.id === fileId);
  if (!file) return {ok: false, reason: 'Выберите файл'};
  const fragments = file.fragments;
  if (driveType === 'ssd') {
    return {
      ok: true,
      seeks: 0,
      latencyMs: 0.08,
      note: 'SSD читает блоки напрямую — фрагментация почти не замедляет доступ.',
    };
  }
  const seeks = Math.max(0, fragments - 1);
  const latencyMs = 8 + seeks * 4.5;
  return {
    ok: true,
    seeks,
    latencyMs: Math.round(latencyMs * 10) / 10,
    note:
      seeks === 0
        ? 'Файл лежит подряд — одно позиционирование головки.'
        : `Головке пришлось прыгнуть ${seeks} раз(а) между кусками файла.`,
  };
}

export const DEMO_FILES = [
  {size: 4, name: 'report.pdf', label: 'Отчёт 4 блока'},
  {size: 8, name: 'video.mp4', label: 'Видео 8 блоков'},
  {size: 3, name: 'patch.zip', label: 'Патч 3 блока'},
];
