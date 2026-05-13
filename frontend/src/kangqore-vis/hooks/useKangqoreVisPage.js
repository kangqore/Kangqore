import { useEffect, useState } from 'react';
import { fetchBlueprint } from '../registry/blueprintClient';
import { findSeoEntryByUrl } from '../registry/seoDataAdapter';

export function useKangqoreVisPage(url) {
  const [state, setState] = useState({ loading: true, blueprint: null, fallback: null });

  useEffect(() => {
    let cancelled = false;
    const fallback = findSeoEntryByUrl(url);
    setState({ loading: true, blueprint: null, fallback });
    fetchBlueprint(url).then((blueprint) => {
      if (cancelled) return;
      setState({ loading: false, blueprint, fallback });
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
