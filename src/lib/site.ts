/** Префикс пути из astro.config (с завершающим слэшем). */
export const baseUrl = import.meta.env.BASE_URL;

/** Абсолютный путь на этом сайте с учётом base. */
export function sitePath(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${baseUrl}${normalized}`;
}
