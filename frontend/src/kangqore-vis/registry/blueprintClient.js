const cache = new Map();

export async function fetchBlueprint(url) {
  if (cache.has(url)) return cache.get(url);
  try {
    const res = await fetch(`/api/kangqore-vis/on-page-seo/resolve?url=${encodeURIComponent(url)}`);
    if (!res.ok) {
      cache.set(url, null);
      return null;
    }
    const data = await res.json();
    cache.set(url, data);
    return data;
  } catch (err) {
    cache.set(url, null);
    return null;
  }
}

export function clearBlueprintCache() {
  cache.clear();
}
