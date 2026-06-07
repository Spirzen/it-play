import type {ComponentType} from 'react';
import BlockBuilder from '@/components/demos/BlockBuilder';

const DEMO_MAP: Record<string, ComponentType> = {
  'block-builder': BlockBuilder,
};

export function getDemoComponent(componentId: string): ComponentType | undefined {
  return DEMO_MAP[componentId];
}

export function listRegisteredDemos(): string[] {
  return Object.keys(DEMO_MAP);
}
