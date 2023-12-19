import { lazy } from 'react';

export function lazyLoad(path: string, exportName?: string) {
  return lazy(() => {
    const importPromise = import(path)
    if (!exportName) {
      return importPromise;
    }
    return importPromise.then((module) => ({ default: module[exportName] }));
  })
}