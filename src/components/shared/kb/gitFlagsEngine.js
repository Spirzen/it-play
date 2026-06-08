export const GIT_COMMANDS = [
  {id: 'commit', base: 'git commit', label: 'commit'},
  {id: 'push', base: 'git push', label: 'push'},
  {id: 'merge', base: 'git merge', label: 'merge'},
  {id: 'reset', base: 'git reset', label: 'reset'},
  {id: 'log', base: 'git log', label: 'log'},
];

export const GIT_FLAGS = [
  {id: 'm', flags: ['commit'], short: '-m', long: '--message', desc: 'Сообщение коммита', arg: '"fix: typo"'},
  {id: 'amend', flags: ['commit'], short: null, long: '--amend', desc: 'Изменить последний коммит'},
  {id: 'verbose', flags: ['push'], short: '-v', long: '--verbose', desc: 'Подробный вывод'},
  {id: 'force', flags: ['push'], short: '-f', long: '--force', desc: 'Принудительная отправка (осторожно!)'},
  {id: 'no-ff', flags: ['merge'], short: null, long: '--no-ff', desc: 'Merge commit вместо fast-forward'},
  {id: 'hard', flags: ['reset'], short: null, long: '--hard', desc: 'Сбросить рабочую копию и индекс'},
  {id: 'soft', flags: ['reset'], short: null, long: '--soft', desc: 'Сбросить только HEAD, изменения остаются'},
  {id: 'oneline', flags: ['log'], short: null, long: '--oneline', desc: 'Компактный лог'},
  {id: 'graph', flags: ['log'], short: null, long: '--graph', desc: 'Граф веток в логе'},
  {id: 'dry-run', flags: ['push', 'merge'], short: null, long: '--dry-run', desc: 'Показать действие без выполнения'},
];

export function buildCommand(cmdId, activeFlagIds) {
  const cmd = GIT_COMMANDS.find((c) => c.id === cmdId);
  const parts = [cmd.base];
  for (const f of GIT_FLAGS) {
    if (!f.flags.includes(cmdId) || !activeFlagIds.has(f.id)) continue;
    parts.push(f.long ?? f.short);
    if (f.arg) parts.push(f.arg);
  }
  if (cmdId === 'merge' && !activeFlagIds.has('no-ff')) parts.push('feature/cart');
  if (cmdId === 'push') parts.push('origin main');
  return parts.join(' ');
}
