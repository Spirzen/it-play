import {Suspense, lazy, useMemo} from 'react';
import type {PlayEntry} from '@/lib/plays';
import {loadDemoComponent} from '@/lib/demoRegistry';
import {demoLoadingFallback} from '@/components/shared/demoFallback';
import {isEmbedPage, useEmbedPlayProps, useEmbedPlayPropsReady} from '@/lib/useEmbedPlayProps';

type Props = {
  play: PlayEntry;
};

export default function PlayViewer({play}: Props) {
  const embedProps = useEmbedPlayProps();
  const propsReady = useEmbedPlayPropsReady();

  const Demo = useMemo(() => {
    const loader = loadDemoComponent(play.component);
    if (!loader) {
      return null;
    }
    return lazy(loader);
  }, [play.component]);

  if (!Demo) {
    return (
      <div className="play-missing" role="alert">
        Компонент <code>{play.component}</code> не зарегистрирован в demoRegistry.
      </div>
    );
  }

  if (isEmbedPage() && !propsReady) {
    return demoLoadingFallback();
  }

  return (
    <Suspense fallback={demoLoadingFallback()}>
      <Demo {...embedProps} />
    </Suspense>
  );
}
