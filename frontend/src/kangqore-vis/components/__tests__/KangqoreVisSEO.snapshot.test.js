/**
 * Byte-equivalence guard for the SEO migration.
 *
 * Renders KangqoreVisSEO via ReactDOMServer + Helmet.renderStatic for a deterministic
 * server-side capture of the head, then asserts the critical metadata that the
 * legacy SEO.jsx produced for representative pages: <title>, meta description,
 * canonical, Open Graph, Twitter Card, Organization JSON-LD, BreadcrumbList JSON-LD.
 *
 * If this test fails after a KangqoreVisSEO change, treat it as a regression on the
 * existing 200+ pages until the change is confirmed intentional.
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import KangqoreVisSEO from '../KangqoreVisSEO';

const FIXTURES = [
  {
    label: 'home',
    props: {
      title: 'Enterprise AI, Cloud & Digital Transformation',
      description:
        'Kangqore enables enterprises to achieve end-to-end digital transformation through modern engineering, AI-enabled innovation, and intelligence-first architecture.',
      keywords: 'enterprise AI, digital transformation',
      url: '/',
    },
  },
  {
    label: 'services',
    props: {
      title: 'Our Services — 15 Departments · 61 Services',
      description: "Explore Kangqore's full-spectrum digital capabilities.",
      url: '/services',
    },
  },
  {
    label: 'department-ai-cognitive',
    props: {
      title: 'AI & Cognitive Solutions',
      description: "Kangqore's AI & Cognitive Solutions services for enterprise transformation.",
      url: '/department/ai-cognitive',
    },
  },
  {
    label: 'industries-banking',
    props: {
      title: 'Banking — Industry Solutions',
      description: "Kangqore's Banking industry capabilities and use cases.",
      url: '/industries/banking',
    },
  },
  {
    label: 'blog-detail',
    props: {
      title: 'How to Adopt Agentic AI in Enterprise',
      description: 'A founder POV on enterprise-grade agentic AI adoption.',
      url: '/blogs/adopting-agentic-ai',
      type: 'article',
      publishedTime: '2026-01-01T00:00:00.000Z',
      modifiedTime: '2026-01-15T00:00:00.000Z',
      author: 'Kangqore Founders',
      section: 'AI',
    },
  },
];

function captureHead(props) {
  // Force react-helmet into SSR mode so renderStatic() works under jsdom.
  const wasDom = Helmet.canUseDOM;
  Helmet.canUseDOM = false;
  try {
    ReactDOMServer.renderToStaticMarkup(<KangqoreVisSEO {...props} />);
    return Helmet.renderStatic();
  } finally {
    Helmet.canUseDOM = wasDom;
  }
}

function decode(s) {
  if (s === undefined) return s;
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function findMeta(metaString, attr, value) {
  const re = new RegExp(`<meta[^>]*${attr}="${value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"[^>]*content="([^"]*)"`);
  const m = metaString.match(re);
  if (m) return decode(m[1]);
  const re2 = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"`);
  return decode(metaString.match(re2)?.[1]);
}

describe('KangqoreVisSEO byte-equivalence', () => {
  for (const fx of FIXTURES) {
    test(fx.label, () => {
      const head = captureHead(fx.props);
      const title = head.title.toString();
      const meta = head.meta.toString();
      const link = head.link.toString();
      const script = head.script.toString();

      const expectedTitle = `${fx.props.title} | Kangqore — Intelligence-First Engineering`;
      expect(decode(title)).toContain(expectedTitle);
      expect(title).toMatch(/<title[^>]*>/);

      expect(findMeta(meta, 'name', 'description')).toBe(fx.props.description);
      expect(findMeta(meta, 'property', 'og:site_name')).toBe('Kangqore');
      expect(findMeta(meta, 'property', 'og:title')).toBe(expectedTitle);
      expect(findMeta(meta, 'property', 'og:description')).toBe(fx.props.description);
      expect(findMeta(meta, 'property', 'og:url')).toBe(`https://kangqore.com${fx.props.url}`);
      expect(findMeta(meta, 'property', 'og:image:width')).toBe('1200');
      expect(findMeta(meta, 'property', 'og:image:height')).toBe('630');

      expect(findMeta(meta, 'name', 'twitter:card')).toBe('summary_large_image');
      expect(findMeta(meta, 'name', 'twitter:site')).toBe('@kangqore');
      expect(findMeta(meta, 'name', 'twitter:title')).toBe(expectedTitle);

      expect(link).toContain(`href="https://kangqore.com${fx.props.url}"`);

      const jsonScripts = [...script.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
        JSON.parse(m[1])
      );
      const org = jsonScripts.find((s) => s['@type'] === 'Organization');
      expect(org).toBeDefined();
      expect(org['@id']).toBe('https://kangqore.com/#organization');
      expect(org.name).toBe('Kangqore');
      expect(org.legalName).toBe('Kangqore Global Pvt Ltd');
      expect(org.sameAs).toContain('https://www.linkedin.com/company/kangqore');

      if (fx.props.url && fx.props.url !== '/') {
        const breadcrumb = jsonScripts.find((s) => s['@type'] === 'BreadcrumbList');
        expect(breadcrumb).toBeDefined();
        expect(breadcrumb.itemListElement[0].name).toBe('Home');
      }

      if (fx.props.type === 'article') {
        expect(findMeta(meta, 'property', 'article:published_time')).toBe(fx.props.publishedTime);
        expect(findMeta(meta, 'property', 'article:modified_time')).toBe(fx.props.modifiedTime);
        expect(findMeta(meta, 'property', 'article:author')).toBe(fx.props.author);
        expect(findMeta(meta, 'property', 'article:section')).toBe(fx.props.section);
      }
    });
  }
});
