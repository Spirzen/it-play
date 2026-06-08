import React, {useCallback, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import MiniDbTerminal from '@/components/shared/kb/MiniDbTerminal';
import {executeRedisCommand, getRedisWelcome} from '@/components/shared/kb/redisCliEngine';

function RedisDataTypesPlayInner() {
  const [db, setDb] = useState(0);

  const execute = useCallback(
    (cmd) => {
      const r = executeRedisCommand(cmd);
      setDb(r.db);
      return r;
    },
    [],
  );

  return (
    <DemoShell>
      <DemoCard
        title="redis-cli: типы данных Redis"
        subtitle="Строки, хэши и списки в одной in-memory БД; логические базы SELECT 0–15"
      >
        <MiniDbTerminal
          title="redis-cli — 127.0.0.1:6379"
          prompt={`127.0.0.1:6379[${db}]> `}
          welcomeLines={getRedisWelcome(db)}
          execute={execute}
          hints={['SELECT 1', 'GET company_name', 'HGETALL employee:1001', 'KEYS *']}
        />
      </DemoCard>
    </DemoShell>
  );
}

export default RedisDataTypesPlayInner;
