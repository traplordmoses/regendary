// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.json());

// --- serve TonConnect manifest from code (not static)
app.get('/tonconnect-manifest.json', (req, res) => {
  const port = process.env.PORT || 3000;

  // IMPORTANT: MINI_APP_URL must be EXACTLY the host you open in the browser/wallet
  const { MINI_APP_URL = `http://localhost:${port}` } = process.env;

  const manifest = {
    url: MINI_APP_URL,
    name: 'Regendary Bets',
    iconUrl: `${MINI_APP_URL}/icon.png`
  };

  console.log('[TonConnect manifest]', manifest);
  res
    .type('application/json')
    .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    .set('Pragma', 'no-cache')
    .set('Expires', '0')
    .send(JSON.stringify(manifest));
});

// --- static files from /public
const pub = path.join(__dirname, 'public');
console.log('[static dir]', pub);
app.use(express.static(pub));

// --- serve index.html at /
app.get('/', (req, res) => {
  res.sendFile(path.join(pub, 'index.html'));
});

// health
app.get('/healthz', (_req, res) => res.json({ ok: true }));

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log('web on', PORT);
  console.log('MINI_APP_URL =', process.env.MINI_APP_URL || `http://localhost:${PORT}`);
});
