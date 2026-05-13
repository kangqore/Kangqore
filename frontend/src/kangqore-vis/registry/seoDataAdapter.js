import { coreSEO, contentSEO, departmentSEO, industrySEO, serviceSEO } from '../../data/seoData';

const ALL_REGISTRIES = [coreSEO, contentSEO, departmentSEO, industrySEO, serviceSEO];

export function findSeoEntryByUrl(url) {
  for (const registry of ALL_REGISTRIES) {
    if (!registry) continue;
    for (const key of Object.keys(registry)) {
      if (registry[key]?.url === url) {
        return { ...registry[key], _registryKey: key };
      }
    }
  }
  return null;
}

export function listAllSeoEntries() {
  const all = [];
  for (const registry of ALL_REGISTRIES) {
    if (!registry) continue;
    for (const key of Object.keys(registry)) {
      all.push({ key, ...registry[key] });
    }
  }
  return all;
}
