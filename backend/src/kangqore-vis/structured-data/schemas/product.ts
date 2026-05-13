interface ProductInput {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
}

export function buildProductSchema(input: ProductInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : { '@type': 'Brand', name: 'Kangqore' },
  };
}
