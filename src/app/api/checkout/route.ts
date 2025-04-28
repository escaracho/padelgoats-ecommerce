import { NextResponse } from 'next/server';
import { stripe } from '@/app/config/stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'ars',
        product_data: {
          name: item.Nombre,
          description: item.Marca,
          images: [item.ImagenURL],
        },
        unit_amount: Math.round(parseFloat(item.Precio) * 100), // Convert to cents and ensure integer
      },
      quantity: item.quantity,
    }));

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
      metadata: {
        orderId: Date.now().toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['AR'], // Argentina
      },
      billing_address_collection: 'required',
    });

    if (!session?.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', {
      error: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });

    let errorMessage = 'Error creating checkout session';
    let statusCode = 500;

    if (error?.type?.startsWith('Stripe')) {
      errorMessage = error.message;
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 