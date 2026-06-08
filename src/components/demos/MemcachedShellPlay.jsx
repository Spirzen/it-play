import React, {useCallback} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import MiniDbTerminal from '@/components/shared/kb/MiniDbTerminal';
import {executeMemcachedCommand, getMemcachedWelcome} from '@/components/shared/kb/memcachedShellEngine';

function MemcachedShellPlayInner() {
  const execute = useCallback((cmd) => executeMemcachedCommand(cmd), []);

  return (
    <DemoShell>
      <DemoCard
        title="Протокол Memcached (порт 11211)"
        subtitle="Текстовые команды set / get / delete / stats — сервер не интерпретирует значения"
      >
        <MiniDbTerminal
          title="memcached — :11211"
          prompt="memcached> "
          welcomeLines={getMemcachedWelcome()}
          execute={execute}
          hints={['set page:home 0 300 5 hello', 'get page:home', 'stats']}
        />
      </DemoCard>
    </DemoShell>
  );
}

export default MemcachedShellPlayInner;
