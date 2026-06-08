import React, {useCallback} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import MiniDbTerminal from '@/components/shared/kb/MiniDbTerminal';
import {executeCql, getCqlWelcome} from '@/components/shared/kb/cassandraCqlEngine';

function CassandraCqlPlayInner() {
  const execute = useCallback((cmd) => executeCql(cmd), []);

  return (
    <DemoShell>
      <DemoCard
        title="cqlsh: запросы к wide-column таблице"
        subtitle="SELECT по partition key (user_id) читает одну партицию; без него — дорогой обход"
      >
        <MiniDbTerminal
          title="cqlsh"
          prompt="cqlsh> "
          welcomeLines={getCqlWelcome()}
          execute={execute}
          hints={[
            "SELECT * FROM user_events WHERE user_id = 'u-1';",
            'DESCRIBE TABLE user_events',
          ]}
        />
      </DemoCard>
    </DemoShell>
  );
}

export default CassandraCqlPlayInner;
