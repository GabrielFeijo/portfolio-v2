import type { TFunction } from 'i18next';

export function getTranslatedArray<T>(t: TFunction, key: string): T[] {
  const value = t(key, { returnObjects: true });

  return Array.isArray(value) ? (value as T[]) : [];
}
