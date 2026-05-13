const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

export function buildBreadcrumbListSchema(url: string) {
  if (!url || url === '/') return null;

  const paths = url.split('/').filter(Boolean);
  const itemListElement: unknown[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
  ];

  let currentPath = '';
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name,
      item: `${BASE_URL}${currentPath}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}
