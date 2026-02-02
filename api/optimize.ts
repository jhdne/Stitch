// Vercel Serverless Function for NVIDIA chat completions
// This mirrors the local server/index.js logic but reads from environment variables.

import type { VercelRequest, VercelResponse } from '@vercel/node';

type Category = 'high-level' | 'detailed' | 'refinement' | 'theming' | 'general';

interface OptimizeResponse {
  original: string;
  optimized: string;
  improvements: string[];
  category: Category;
}

function normalizeCategory(category: unknown): Category {
  const allowed: Category[] = ['high-level', 'detailed', 'refinement', 'theming', 'general'];
  if (typeof category !== 'string') return 'general';
  return (allowed as string[]).includes(category) ? (category as Category) : 'general';
}

async function callNvidiaOptimize(prompt: string): Promise<OptimizeResponse> {
  const endpoint =
    process.env.NVIDIA_API_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions';
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error('Missing NVIDIA_API_KEY environment variable');
  }

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
    throw new Error(
      `NVIDIA API error: ${resp.status} ${resp.statusText}${
        errText ? ` - ${errText}` : ''
      }`.slice(0, 300),
    );
  }

  const data: any = await resp.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('NVIDIA API returned empty content');
  }

  const trimmed = content.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const jsonSlice =
    firstBrace !== -1 && lastBrace !== -1 ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;

  let parsed: any;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch {
    throw new Error('Model output is not valid JSON');
  }

  const optimized = typeof parsed.optimized === 'string' ? parsed.optimized : '';
  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements.filter((x: unknown) => typeof x === 'string').slice(0, 12)
    : [];
  const category = normalizeCategory(parsed.category);

  if (!optimized.trim()) throw new Error('Model output missing optimized text');

  return {
    original: prompt,
    optimized,
    improvements,
    category,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
    if (!prompt.trim()) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const out = await callNvidiaOptimize(prompt);

    // Keep response shape consistent with local server/index.js
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(out);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: message });
  }
}

