import React from 'react';
import VARIANTS from '../../data/imageVariants.json';

// ─── ResponsiveImage ──────────────────────────────────────────────────────────
// Serves the AVIF/WebP variants produced by scripts/generate-images.mjs, falling
// back to the original PNG/JPG. Before this, full-size PNGs (up to 2.1 MB) were
// being painted into ~400 px bento cards.
//
// Variants follow the generator's naming convention:
//   /images/foo.png -> /images/foo-480w.avif, foo-960w.avif, foo-1600w.avif (+ .webp)
//
// If a variant is absent the browser simply falls through to the next <source>
// and ultimately to the original, so this is safe on paths that were never
// processed (external URLs, /assets/*, data URIs).
// ────────────────────────────────────────────────────────────────────────────────

// Only widths the generator actually produced. Advertising a width that was
// never rendered makes the browser request a URL that resolves to the SPA's
// HTML catch-all, which fails the <source> and silently falls back to the
// original PNG — defeating the entire pipeline.
function buildSrcSet(widths, src, ext) {
  const stem = src.replace(/\.(png|jpe?g)$/i, '');
  return widths.map((w) => `${stem}-${w}w.${ext} ${w}w`).join(', ');
}

export default function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  fetchPriority,
  className = '',
  width,
  height,
  style,
  ...rest
}) {
  // `alt` is required for content images; a caller that genuinely wants a
  // decorative image should pass alt="" explicitly plus aria-hidden.
  const img = (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      width={width}
      height={height}
      className={className}
      style={style}
      {...rest}
    />
  );

  const widths = src ? VARIANTS[src] : null;
  if (!widths || widths.length === 0) return img;

  return (
    <picture>
      <source type="image/avif" srcSet={buildSrcSet(widths, src, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(widths, src, 'webp')} sizes={sizes} />
      {img}
    </picture>
  );
}
