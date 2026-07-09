import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Branded referral redirects. Change the destination here, never in a profile bio
  // or a published issue. Fallback only: a host-level redirect takes precedence.
  redirects: {
    '/railway': 'https://railway.com/?referralCode=theanthropicstack',
  },
  build: {
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
    cacheDir: '/tmp/vite-cache-tas',
  },
});
