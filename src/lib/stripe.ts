import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'CouncilIA',
    version: '12.0.0',
  },
});

/**
 * Generates an absolute URL for redirects.
 * Prioritizes NEXT_PUBLIC_SITE_URL or falls back to origin.
 */
export function getAbsoluteUrl(path: string, fallbackOrigin?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') 
        ? process.env.NEXT_PUBLIC_SITE_URL 
        : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
    : (fallbackOrigin || 'https://www.councilia.com');

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
}
