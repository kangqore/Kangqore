// S304 — Geospatial Properties
// No PostGIS dependency assumed — objects with a `properties.location =
// { lat, lng }` field are fetched and filtered/distance-ranked in JS. Fine at
// the object counts this ontology actually runs at; a real geo index is a
// later optimization, not a correctness requirement.

import { prisma } from '../../lib/prisma'

export interface GeoPoint { lat: number; lng: number }

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function readLocation(properties: any): GeoPoint | null {
  const loc = properties?.location
  if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return null
  return { lat: loc.lat, lng: loc.lng }
}

export const OntologyGeoService = {
  async withGeopoints(typeId?: string) {
    const objects = await prisma.ontologyObject.findMany({
      where: { ...(typeId && { typeId }), validTo: null },
      include: { type: { select: { name: true, displayName: true, icon: true, color: true } } },
    })
    return objects
      .map(o => ({ object: o, location: readLocation(o.properties) }))
      .filter((x): x is { object: typeof objects[number]; location: GeoPoint } => x.location !== null)
  },

  async geoSearch(center: GeoPoint, radiusKm: number, typeId?: string) {
    const candidates = await this.withGeopoints(typeId)
    return candidates
      .map(c => ({ ...c.object, location: c.location, distanceKm: haversineKm(center, c.location) }))
      .filter(o => o.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
  },

  async geoBbox(bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }, typeId?: string) {
    const candidates = await this.withGeopoints(typeId)
    return candidates
      .filter(c => c.location.lat >= bounds.minLat && c.location.lat <= bounds.maxLat && c.location.lng >= bounds.minLng && c.location.lng <= bounds.maxLng)
      .map(c => ({ ...c.object, location: c.location }))
  },
}
