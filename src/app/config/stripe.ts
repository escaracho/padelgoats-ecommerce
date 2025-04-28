import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Make sure to add your publishable key in the .env.local file
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// This is used on the server side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // Using the latest stable version
}); 