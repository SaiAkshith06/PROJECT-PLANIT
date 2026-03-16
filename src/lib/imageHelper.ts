/**
 * imageHelper.ts
 * Converts a landmark-specific image query into a reliable Unsplash Source URL.
 * Queries in tier1Cities.ts are intentionally specific (e.g. "India Gate Delhi monument")
 * so that Unsplash returns the correct landmark photo.
 */
export function getImage(query: string, width = 1600, height = 900): string {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
}
