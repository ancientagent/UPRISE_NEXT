// Generate or update stub routes for dev-backend based on a network log
// Input: /mnt/d/uprise_mob/artifacts/net_boot.txt (default)
// Output: dev-backend/stubs.json (merged, idempotent)
const fs = require('fs');
const path = require('path');

const NET_LOG = process.env.NET_LOG || '/mnt/d/uprise_mob/artifacts/net_boot.txt';
const OUT_FILE = path.join(__dirname, 'stubs.json');

function safeReadJSON(p) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {}
  return {};
}

function parseEndpoints(text) {
  const out = new Set();
  const lines = text.split(/\r?\n/);
  const reMethodUrl = /\b(GET|POST|PUT|DELETE|PATCH|OPTIONS)\s+https?:\/\/[^/]+(\/[\w\-\.\/%]*)(?:[\s?\"]|$)/i;
  const reUrlOnly = /https?:\/\/[^/]+(\/[\w\-\.\/%]*)(?:[\s?\"]|$)/i;
  for (const line of lines) {
    let m = line.match(reMethodUrl);
    if (m) {
      const method = m[1].toUpperCase();
      const p = m[2] || '/';
      out.add(`${method} ${p}`);
      continue;
    }
    m = line.match(reUrlOnly);
    if (m) {
      const p = m[1] || '/';
      out.add(`GET ${p}`);
    }
  }
  return Array.from(out);
}

function heuristicPayload(method, p) {
  const lower = p.toLowerCase();
  if (lower.includes('config')) return { features: {}, env: 'dev' };
  if (lower.includes('session')) return { authenticated: false };
  if (lower === '/me' || lower.endsWith('/me')) return { id: 'dev-user', roles: [], displayName: 'Dev User' };
  if (/genres|list|feed|discovery|popular|radio|home|events|promos/.test(lower)) return [];
  return {};
}

function main() {
  const defaults = {
    'GET /config': { features: {}, env: 'dev' },
    'GET /auth/session': { authenticated: false },
    'GET /me': { id: 'dev-user', roles: [], displayName: 'Dev User' },
    'GET /auth/genres': [],
    'GET /onboarding/all-genres': [],
    'GET /home/feed': [],
  };

  let existing = safeReadJSON(OUT_FILE);
  const merged = { ...defaults, ...existing };

  let text = '';
  try { text = fs.readFileSync(NET_LOG, 'utf8'); } catch (_) {}
  if (text) {
    for (const ep of parseEndpoints(text)) {
      if (!merged.hasOwnProperty(ep)) {
        const [method, ...rest] = ep.split(' ');
        const p = rest.join(' ') || '/';
        merged[ep] = heuristicPayload(method, p);
      }
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  const count = Object.keys(merged).length;
  process.stdout.write(JSON.stringify({ stubs: OUT_FILE, count }) + '\n');
}

main();

