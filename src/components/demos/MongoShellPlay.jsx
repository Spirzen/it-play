import React, {useCallback} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import MiniDbTerminal from '@/components/shared/kb/MiniDbTerminal';
import {MONGO_HELP, executeMongoCommand, getMongoWelcome} from '@/components/shared/kb/mongoShellEngine';

function MongoShellPlayInner() {
  const execute = useCallback((cmd) => {
    if (cmd === 'help') {
      return {lines: [{type: 'output', text: MONGO_HELP}]};
    }
    return executeMongoCommand(cmd);
  }, []);

  return (
    <DemoShell>
      <DemoCard
        title="mongosh: первые команды MongoDB"
        subtitle="Переключение БД, вставка документа и выборка из коллекции — без установки сервера"
      >
        <MiniDbTerminal
          title="mongosh"
          prompt="test> "
          welcomeLines={getMongoWelcome()}
          execute={execute}
          hints={['use company_db', 'db.employees.find()', 'help']}
        />
      </DemoCard>
    </DemoShell>
  );
}

export default MongoShellPlayInner;
