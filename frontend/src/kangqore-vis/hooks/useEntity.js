import { useEffect, useState } from 'react';

export function useEntity(slug) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/kangqore-vis/entities/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : { entity: null }))
      .then((data) => {
        if (cancelled) return;
        setEntity(data?.entity ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { entity, loading };
}
