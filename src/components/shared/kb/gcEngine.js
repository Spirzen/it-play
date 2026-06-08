export const GC_PHASE = {
  idle: 'idle',
  mark: 'mark',
  sweep: 'sweep',
};

export function createMemoryBlock(id, reachableOverride) {
  const reachable = reachableOverride ?? Math.random() > 0.4;
  return {
    id,
    name: `obj_${id}`,
    size: Math.floor(Math.random() * 28) + 8,
    reachable,
    marked: false,
    rooted: reachable && Math.random() > 0.55,
  };
}

export function toggleBlockReachable(blocks, id) {
  return blocks.map((b) =>
    b.id === id ? {...b, reachable: !b.reachable, rooted: false} : b,
  );
}

export function markBlocks(blocks) {
  return blocks.map((b) => ({...b, marked: b.reachable || b.rooted}));
}

export function sweepBlocks(blocks) {
  const removed = blocks.filter((b) => !b.marked);
  const kept = blocks
    .filter((b) => b.marked)
    .map((b) => ({...b, marked: false}));
  return {kept, removed};
}

export function memoryStats(blocks) {
  const total = blocks.reduce((s, b) => s + b.size, 0);
  const garbage = blocks.filter((b) => !b.reachable && !b.rooted).reduce((s, b) => s + b.size, 0);
  return {
    count: blocks.length,
    total,
    alive: total - garbage,
    garbage,
    rooted: blocks.filter((b) => b.rooted).length,
  };
}
