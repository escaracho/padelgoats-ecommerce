import { getProductos } from '@/app/services/dynamodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getProductos();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://padelgoats.com';

    const feed = {
      '?xml version="1.0"?': null,
      'rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"': {
        channel: {
          title: 'PadelGoats - Productos',
          description: 'Catálogo de productos de PadelGoats',
          link: baseUrl,
          item: products.map(product => ({
            'g:id': product.ProductoID,
            'g:title': product.Nombre,
            'g:description': product.Descripcion,
            'g:link': `${baseUrl}/productos/${product.ProductoID}`,
            'g:image_link': product.ImagenURL,
            'g:additional_image_link': product.ImagenHoverURL,
            'g:availability': product.Stock > 0 ? 'in stock' : 'out of stock',
            'g:price': `${product.Precio} ARS`,
            'g:brand': product.Marca,
            'g:condition': 'new',
            'g:identifier_exists': 'yes',
            'g:mpn': product.ProductoID,
            'g:google_product_category': '7323', // Sports Equipment > Racquet Sports Equipment > Paddle Tennis Equipment
            'g:product_type': 'Deportes > Padel > Paletas',
            'g:shipping': {
              'g:country': 'AR',
              'g:service': 'Envío Estándar',
              'g:price': '0 ARS'
            }
          }))
        }
      }
    };

    // Convert the feed object to XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>PadelGoats - Productos</title>
    <description>Catálogo de productos de PadelGoats</description>
    <link>${baseUrl}</link>
    ${products.map(product => `
    <item>
      <g:id>${product.ProductoID}</g:id>
      <g:title>${product.Nombre}</g:title>
      <g:description>${product.Descripcion}</g:description>
      <g:link>${baseUrl}/productos/${product.ProductoID}</g:link>
      <g:image_link>${product.ImagenURL}</g:image_link>
      <g:additional_image_link>${product.ImagenHoverURL}</g:additional_image_link>
      <g:availability>${product.Stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${product.Precio} ARS</g:price>
      <g:brand>${product.Marca}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>yes</g:identifier_exists>
      <g:mpn>${product.ProductoID}</g:mpn>
      <g:google_product_category>7323</g:google_product_category>
      <g:product_type>Deportes > Padel > Paletas</g:product_type>
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Envío Estándar</g:service>
        <g:price>0 ARS</g:price>
      </g:shipping>
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating merchant feed:', error);
    return NextResponse.json(
      { error: 'Error generating merchant feed' },
      { status: 500 }
    );
  }
} 