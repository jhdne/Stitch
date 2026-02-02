import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Minimal local API server:
 * - Reads NVIDIA endpoint + API key from KPI.env (plain text)
 * - Exposes POST /api/optimize for the Vite frontend
 *
 * Security note:
 * - Keep KPI.env local and DO NOT expose it to the browser.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const KPI_ENV_PATH = path.resolve(PROJECT_ROOT, 'KPI.env');

function json(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    // CORS for local dev; Vite proxy will also keep it same-origin.
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

function text(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Parse KPI.env file (plain text format).
 * Expected lines:
 * 1) https://integrate.api.nvidia.com/v1/chat/completions
 * 2) nvidia API Key: nvapi-xxxx
 */
async function loadNvidiaConfig() {
  if (!existsSync(KPI_ENV_PATH)) {
    throw new Error(`Missing KPI.env at: ${KPI_ENV_PATH}`);
  }

  const raw = await readFile(KPI_ENV_PATH, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const endpoint = lines.find((l) => /^https?:\/\//i.test(l));
  const keyLine = lines.find((l) => /api\s*key/i.test(l));

  const apiKey = keyLine?.includes(':') ? keyLine.split(':').slice(1).join(':').trim() : undefined;

  if (!endpoint) throw new Error('KPI.env missing NVIDIA endpoint URL');
  if (!apiKey) throw new Error('KPI.env missing NVIDIA API key');

  return { endpoint, apiKey };
}

function normalizeCategory(category) {
  const allowed = new Set(['high-level', 'detailed', 'refinement', 'theming', 'general']);
  if (typeof category !== 'string') return 'general';
  return allowed.has(category) ? category : 'general';
}

async function callNvidiaOptimize({ endpoint, apiKey, prompt }) {
  const system = [
    'You are a prompt optimization assistant.',
    'Optimize the user prompt according to Google AI Stitch prompt best practices:',
    '- be clear and specific',
    '- one change at a time',
    '- focus on a specific screen/section/component when relevant',
    '- include UI/UX vocabulary (navigation bar, call-to-action button, hero section, card layout, etc.) when appropriate',
    '- include vibe/style adjectives (modern, minimalist, vibrant, elegant, professional, etc.) when appropriate',
    '- keep it concise; if the prompt is too broad, propose a focused, actionable version',
    '',
    'Return ONLY strict JSON with the following schema:',
    '{ "optimized": string, "improvements": string[], "category": "high-level"|"detailed"|"refinement"|"theming"|"general" }',
    'Do not wrap it in markdown.',
  ].join('\n');

  const user = `User prompt:\n${prompt}`;

  // NVIDIA OpenAI-compatible chat/completions
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`NVIDIA API error: ${resp.status} ${resp.statusText}${errText ? ` - ${errText}` : ''}`);
  }

  /** @type {{ choices?: Array<{ message?: { content?: string } }> }} */
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('NVIDIA API returned empty content');
  }

  // Parse strict JSON, but be resilient to minor leading/trailing text
  const trimmed = content.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const jsonSlice = firstBrace !== -1 && lastBrace !== -1 ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;

  let parsed;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch {
    throw new Error('Model output is not valid JSON');
  }

  const optimized = typeof parsed.optimized === 'string' ? parsed.optimized : '';
  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements.filter((x) => typeof x === 'string').slice(0, 12)
    : [];
  const category = normalizeCategory(parsed.category);

  if (!optimized.trim()) throw new Error('Model output missing optimized text');

  return { optimized, improvements, category };
}

const PORT = Number(process.env.PORT || 8787);

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) return text(res, 404, 'Not found');

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      return res.end();
    }

    if (req.method === 'GET' && req.url === '/health') {
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && req.url === '/api/optimize') {
      const body = await readJsonBody(req);
      const prompt = typeof body?.prompt === 'string' ? body.prompt : '';
      if (!prompt.trim()) return json(res, 400, { error: 'prompt is required' });

      const cfg = await loadNvidiaConfig();
      const out = await callNvidiaOptimize({ ...cfg, prompt });

      return json(res, 200, {
        original: prompt,
        optimized: out.optimized,
        improvements: out.improvements,
        category: out.category,
      });
    }

    return text(res, 404, 'Not found');
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return json(res, 500, { error: message });
  }
});

server.listen(PORT, () => {
  // Intentionally minimal console output
  console.log(`Local API server listening on http://localhost:${PORT}`);
});

