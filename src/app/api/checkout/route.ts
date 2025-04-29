import { NextResponse } from 'next/server';
import { stripe } from '@/app/config/stripe';
import { headers } from 'next/headers';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    // Validate request origin
    const headersList = headers();
    const origin = headersList.get('origin') || '';
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || '',
      'http://localhost:3000',
      'https://master.d3dtekhglrfuc9.amplifyapp.com'
    ].filter(Boolean);

    // CORS headers
    const responseHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Parse request body
    const body = await req.json().catch(() => null);
    if (!body || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers: responseHeaders }
      );
    }

    // Validate items
    const { items } = body;
    for (const item of items) {
      if (!item.Nombre || !item.Precio || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400, headers: responseHeaders }
        );
      }
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'ars',
        product_data: {
          name: item.Nombre,
          description: item.Marca || '',
          images: item.ImagenURL ? [item.ImagenURL] : [],
        },
        unit_amount: Math.round(parseFloat(item.Precio) * 100),
      },
      quantity: item.quantity,
    }));

    // Get the site URL
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/carrito`,
      metadata: {
        orderId: Date.now().toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['AR'],
      },
      billing_address_collection: 'required',
      locale: 'es',
    }).catch((error) => {
      console.error('Stripe session creation error:', error);
      throw new Error(error.message);
    });

    if (!session?.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { headers: responseHeaders }
    );
  } catch (error: any) {
    console.error('Checkout error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });

    const errorMessage = error?.type?.startsWith('Stripe')
      ? error.message
      : 'Error al procesar el pago. Por favor, intenta nuevamente.';

    return NextResponse.json(
      { error: errorMessage },
      { 
        status: error?.type?.startsWith('Stripe') ? 400 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
} 