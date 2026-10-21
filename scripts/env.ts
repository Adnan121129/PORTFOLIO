import { loadEnvConfig } from '@next/env';

/** Load .env / .env.local the same way Next.js does, so scripts see the app's settings. */
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
