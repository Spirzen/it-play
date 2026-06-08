import type {ComponentType} from 'react';

type DemoLoader = () => Promise<{default: ComponentType}>;

const demoModules = import.meta.glob<{default: ComponentType}>(
  '../components/demos/**/*.{jsx,js,tsx,ts}',
);

function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function moduleBaseName(filePath: string): string {
  const file = filePath.split('/').pop() ?? '';
  return file.replace(/\.(jsx|js|tsx|ts)$/, '');
}

function findDemoLoader(componentId: string): DemoLoader | undefined {
  const pascal = kebabToPascal(componentId);

  for (const [filePath, loader] of Object.entries(demoModules)) {
    const base = moduleBaseName(filePath);
    if (base === componentId || base === pascal || base.toLowerCase() === componentId) {
      return loader;
    }
  }

  return undefined;
}

export function loadDemoComponent(componentId: string): DemoLoader | undefined {
  return findDemoLoader(componentId);
}

export function listRegisteredDemos(): string[] {
  return Object.keys(demoModules).map(moduleBaseName);
}
