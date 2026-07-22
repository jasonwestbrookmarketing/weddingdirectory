import { MetadataRoute } from 'next';

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://storyvenue.com'
).replace(/\/$/, '');

/**
 * Robots: open the whole public site to search engines AND AI answer-engine
 * crawlers (AEO). Only the API surface + non-indexable funnel pages are blocked.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/strategy-call/', '/bride-booking-system', '/maintenance'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // AI answer engines — explicitly welcomed so listings can be cited in
      // ChatGPT / Claude / Perplexity answers.
      { userAgent: 'GPTBot',           allow: '/', disallow },
      { userAgent: 'OAI-SearchBot',    allow: '/', disallow },
      { userAgent: 'ChatGPT-User',     allow: '/', disallow },
      { userAgent: 'ClaudeBot',        allow: '/', disallow },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow },
      { userAgent: 'PerplexityBot',    allow: '/', disallow },
      { userAgent: 'Google-Extended',  allow: '/', disallow },
      { userAgent: 'Bingbot',          allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
