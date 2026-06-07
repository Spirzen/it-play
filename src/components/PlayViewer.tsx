import type {PlayEntry} from '@/lib/plays';
import {getDemoComponent} from '@/lib/demoRegistry';

type Props = {
  play: PlayEntry;
};

export default function PlayViewer({play}: Props) {
  const Demo = getDemoComponent(play.component);

  if (!Demo) {
    return (
      <div className="play-missing" role="alert">
        Компонент <code>{play.component}</code> не зарегистрирован в demoRegistry.
      </div>
    );
  }

  return <Demo />;
}
