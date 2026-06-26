/**
 * Post-build script: packages the Vite/Nitro output into Vercel's
 * Build Output API v3 format (.vercel/output/).
 *
 * Vercel's Node.js runtime supports Web Fetch API handlers, so the
 * Nitro server.js (which exports fetch(request, env, ctx)) works directly.
 */

import { cpSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const vercelOut = join(root, '.vercel', 'output');
const clientDist = join(root, 'dist', 'client');
const serverDist = join(root, 'dist', 'server');

// Validate build output exists
if (!existsSync(clientDist) || !existsSync(serverDist)) {
  console.error('❌ Build output not found. Run `npm run build` first.');
  process.exit(1);
}

// Clean previous .vercel/output
if (existsSync(vercelOut)) {
  rmSync(vercelOut, { recursive: true, force: true });
}

// ──────────────────────────────────────────────
// 1. Static files  →  .vercel/output/static/
// ──────────────────────────────────────────────
console.log('📦 Copying client assets → .vercel/output/static/');
const staticDir = join(vercelOut, 'static');
cpSync(clientDist, staticDir, { recursive: true });

// ──────────────────────────────────────────────
// 2. Serverless function  →  .vercel/output/functions/__server.func/
// ──────────────────────────────────────────────
console.log('⚡ Packaging serverless function → .vercel/output/functions/__server.func/');
const funcDir = join(vercelOut, 'functions', '__server.func');
mkdirSync(funcDir, { recursive: true });

// Copy the entire Nitro server output into the function directory.
// dist/server/server.js dynamically imports ./assets/*.js, so the
// relative structure must be preserved.
cpSync(serverDist, funcDir, { recursive: true });

// Thin index.mjs entry that re-exports the Nitro fetch handler.
// Vercel's Node.js runtime calls this as a Web Fetch API handler.
const indexMjs = `import server from './server.js';
export default server.fetch.bind(server);
`;
writeFileSync(join(funcDir, 'index.mjs'), indexMjs);

// Function runtime config
writeFileSync(join(funcDir, '.vc-config.json'), JSON.stringify({
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: false,
  supportsResponseStreaming: true,
  runtime: 'nodejs20.x'
}, null, 2));

// Ensure ESM resolution in the function
writeFileSync(join(funcDir, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));

// ──────────────────────────────────────────────
// 3. Routing config  →  .vercel/output/config.json
// ──────────────────────────────────────────────
console.log('🛣️  Writing routing config → .vercel/output/config.json');
writeFileSync(join(vercelOut, 'config.json'), JSON.stringify({
  version: 3,
  routes: [
    // Cache immutable hashed assets forever
    {
      src: '/assets/(.*)',
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    // Serve static files directly (images, favicon, etc.)
    { handle: 'filesystem' },
    // All other requests → SSR server function
    { src: '/(.*)', dest: '/__server' }
  ]
}, null, 2));

console.log('✅ .vercel/output ready for deployment!');
