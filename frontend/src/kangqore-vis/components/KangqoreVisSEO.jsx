// KangqoreVisSEO is a pure client-side component — it does NOT call the backend.
// Title, description, canonical, OG, Twitter, robots, hreflang come from props.
// Organization + BreadcrumbList JSON-LD come from local generators in
// ../registry/schemaBuilders.js. Any extra schemas are passed via the `schemas` prop.
// This means the existing 200+ pages keep rendering identical SEO output even if
// the KangqoreVis backend is down or the migration has not been applied yet.
import React from 'react';
import { Helmet } from 'react-helmet';
import SchemaInjector from './SchemaInjector';
import { ORGANIZATION_SCHEMA, buildBreadcrumbList, SCHEMA_BASE_URL } from '../registry/schemaBuilders';

const SITE_NAME = 'Kangqore';
const SITE_TITLE_SUFFIX = 'Kangqore — Intelligence-First Engineering';
const DEFAULT_OG_IMAGE = `${SCHEMA_BASE_URL}/assets/og-image.jpg`;
const TWITTER_HANDLE = '@kangqore';
const DEFAULT_DESCRIPTION =
  'Kangqore enables enterprises to achieve end-to-end digital transformation through modern engineering, AI-enabled innovation, and intelligence-first architecture.';

const KangqoreVisSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schemas = [],
  noindex = false,
  locale = 'en_US',
  alternateLocales = [],
  publishedTime,
  modifiedTime,
  author,
  section,
  imageAlt,
}) => {
  const fullTitle = title ? `${title} | ${SITE_TITLE_SUFFIX}` : SITE_TITLE_SUFFIX;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_OG_IMAGE;
  const canonicalUrl = url
    ? url.startsWith('http')
      ? url
      : `${SCHEMA_BASE_URL}${url}`
    : SCHEMA_BASE_URL;
  const absoluteImage = metaImage.startsWith('http') ? metaImage : `${SCHEMA_BASE_URL}${metaImage}`;
  const metaImageAlt = imageAlt || title || 'Kangqore Enterprise Solutions';

  const breadcrumb = buildBreadcrumbList(url);
  const allSchemas = [ORGANIZATION_SCHEMA];
  if (breadcrumb) allSchemas.push(breadcrumb);
  const extras = Array.isArray(schemas) ? schemas : [schemas];
  for (const s of extras) {
    if (s) allSchemas.push(s);
  }

  return (
    <>
      <Helmet htmlAttributes={{ lang: locale.split('_')[0] }}>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="robots"
          content={
            noindex
              ? 'noindex, nofollow'
              : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          }
        />

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:image:alt" content={metaImageAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={locale} />
        <meta property="og:url" content={canonicalUrl} />

        {type === 'article' && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === 'article' && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === 'article' && author && <meta property="article:author" content={author} />}
        {type === 'article' && section && <meta property="article:section" content={section} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={absoluteImage} />
        <meta name="twitter:image:alt" content={metaImageAlt} />

        {alternateLocales.map((alt, idx) => (
          <link
            key={`hreflang-${idx}`}
            rel="alternate"
            hrefLang={alt.lang}
            href={alt.url.startsWith('http') ? alt.url : `${SCHEMA_BASE_URL}${alt.url}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      </Helmet>
      <SchemaInjector schemas={allSchemas} />
    </>
  );
};

export default KangqoreVisSEO;
