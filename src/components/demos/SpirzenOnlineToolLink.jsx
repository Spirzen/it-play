import React from 'react';
import {SPIRZEN_ONLINE_TOOLS} from '@/components/shared/kb/spirzenOnlineTools';

/** Ссылка на полную онлайн-версию инструмента под встроенным демо. */
export default function SpirzenOnlineToolLink({toolId, className = 'it-demo__online-link'}) {
  const tool = SPIRZEN_ONLINE_TOOLS[toolId];
  if (!tool) return null;

  return (
    <p className={className}>
      Отдельная версия в браузере:{' '}
      <a href={tool.href} target="_blank" rel="noopener noreferrer">
        {tool.name}
      </a>
      {' — '}
      {tool.tagline}
    </p>
  );
}
