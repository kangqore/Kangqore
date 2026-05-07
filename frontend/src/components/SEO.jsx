import React from 'react';
import { Helmet } from 'react-helmet';

// ─── Constants & Configuration ────────────────────────────────────────────────
const BASE_URL = 'https://kangqore.com';
const SITE_NAME = 'Kangqore';
const SITE_TITLE_SUFFIX = 'Kangqore — Intelligence-First Engineering';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/og-image.jpg`;
const TWITTER_HANDLE = '@kangqore';

// ─── Base Organization Schema ────────────────────────────────────────────────
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": "Kangqore",
  "legalName": "Kangqore Global Pvt Ltd",
  "url": BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    "url": `${BASE_URL}/assets/logo.png`,
    "contentUrl": `${BASE_URL}/assets/logo.png`,
    "width": 512,
    "height": 512,
    "caption": "Kangqore"
  },
  "image": { "@id": `${BASE_URL}/#logo` },
  "description": "Kangqore is a value-driven IT company that enables enterprises and institutions to achieve end-to-end digital transformation through modern engineering and AI-enabled innovation.",
  "foundingDate": "2024",
  "sameAs": [
    "https://www.linkedin.com/company/kangqore",
    "https://x.com/kangqore",
    "https://www.facebook.com/kangqore",
    "https://www.instagram.com/kangqore",
    "https://www.youtube.com/@kangqore",
    "https://www.reddit.com/r/kangqore"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "", // Add if available
      "contactType": "sales",
      "url": `${BASE_URL}/contact`,
      "availableLanguage": ["English"]
    }
  ]
};

const SEO = ({
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
  imageAlt
}) => {
  const fullTitle = title ? `${title} | ${SITE_TITLE_SUFFIX}` : SITE_TITLE_SUFFIX;
  const metaDescription = description || 'Kangqore enables enterprises to achieve end-to-end digital transformation through modern engineering, AI-enabled innovation, and intelligence-first architecture.';
  const metaImage = image || DEFAULT_OG_IMAGE;
  const canonicalUrl = url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : BASE_URL;
  const absoluteImage = metaImage.startsWith('http') ? metaImage : `${BASE_URL}${metaImage}`;
  const metaImageAlt = imageAlt || title || 'Kangqore Enterprise Solutions';

  // ─── Breadcrumb Schema Generation ──────────────────────────────────────────
  const generateBreadcrumbSchema = () => {
    if (!url || url === '/') return null;

    const paths = url.split('/').filter(p => p);
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      // Capitalize and clean path name
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": `${BASE_URL}${currentPath}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };
  };

  // Merge schemas
  const breadcrumbSchema = generateBreadcrumbSchema();
  const allSchemas = [ORGANIZATION_SCHEMA];
  if (breadcrumbSchema) allSchemas.push(breadcrumbSchema);
  if (schemas && Array.isArray(schemas)) {
    allSchemas.push(...schemas);
  } else if (schemas) {
    allSchemas.push(schemas);
  }

  // Schema serialization with safety
  const serializeSchema = (schema) => {
    try {
      return JSON.stringify(schema);
    } catch (e) {
      return JSON.stringify(schema, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (key === 'icon' || key === 'CustomBackground' || key === 'customSections') return undefined;
          if (value.$$typeof || value._owner || value.Provider) return undefined;
        }
        return value;
      });
    }
  };

  return (
    <Helmet htmlAttributes={{ lang: locale.split('_')[0] }}>
      {/* ─── Standard Metadata ──────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots directive */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />

      {/* ─── Open Graph / Facebook ──────────────────────────────────────── */}
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

      {/* Article-specific OG */}
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' && section && <meta property="article:section" content={section} />}

      {/* ─── Twitter Card ───────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={metaImageAlt} />

      {/* ─── Alternate Locales ──────────────────────────────────────────── */}
      {alternateLocales.map((alt, index) => (
        <link
          key={`hreflang-${index}`}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.url.startsWith('http') ? alt.url : `${BASE_URL}${alt.url}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ─── Structured Data (JSON-LD) ──────────────────────────────────── */}
      {allSchemas.filter(s => s).map((schema, index) => (
        <script type="application/ld+json" key={`schema-${index}`}>
          {serializeSchema(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
