import { Product } from '@/app/services/dynamodb';

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://padelgoats.com';
  
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.Nombre,
    description: product.Descripcion,
    image: [product.ImagenURL, product.ImagenHoverURL],
    brand: {
      '@type': 'Brand',
      name: product.Marca,
    },
    sku: product.ProductoID,
    mpn: product.ProductoID,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/productos/${product.ProductoID}`,
      priceCurrency: 'ARS',
      price: product.Precio,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.Stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'PadelGoats',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          currency: 'ARS',
          value: '0',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'AR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 