import { absolute, asset } from '../lib/i18n';

export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute(asset('sitemap-index.xml'))}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
