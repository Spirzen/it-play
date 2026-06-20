import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SbomGraph} from '@/components/shared/infra/InfraPlayUi';
import {SBOM_GRAPH} from '@/components/shared/kb/infraSecurityEngines';

function SbomBlastRadiusPlayInner() {
  const [pkgId, setPkgId] = useState('lodash');
  return (
    <DemoShell>
      <DemoCard title="SBOM — blast radius" subtitle="Выберите пакет с CVE и посмотрите, какие сервисы попадают в зону поражения">
        <InfraRoot>
          <SbomGraph packages={SBOM_GRAPH.packages} services={SBOM_GRAPH.services} pkgId={pkgId} onSelectPkg={setPkgId} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SbomBlastRadiusPlayInner;
