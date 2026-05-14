const http = require('http');
const fs = require('fs');
const path = require('path');

loadEnv();

const PORT = Number(process.env.PORT || 8787);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_KEY;
const PROVIDER = OPENROUTER_API_KEY ? 'openrouter' : 'anthropic';
const MODEL = OPENROUTER_API_KEY
  ? (process.env.OPENROUTER_MODEL || 'openrouter/free')
  : (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514');
const USE_OPENROUTER_WEB = process.env.OPENROUTER_USE_WEB === 'true' && MODEL !== 'openrouter/free';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseJsonFromText(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('Planner did not return JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeItem(item, type, index) {
  const isFood = type === 'food';
  return {
    id: String(item.id || `${type}-${index}`),
    name: String(item.name || 'Recommended stop'),
    type: isFood ? 'food' : String(item.type || 'walk'),
    dur: isFood ? undefined : String(item.dur || '1 hr'),
    cost: isFood ? undefined : toNumber(item.cost, 0),
    cph: isFood ? toNumber(item.cph ?? item.cost, 0) : undefined,
    crowd: String(item.crowd || 'medium'),
    indoor: item.indoor === true,
    cuisine: isFood ? String(item.cuisine || 'Local') : undefined,
    veg: isFood ? item.veg !== false : undefined,
    desc: String(item.desc || ''),
    why: String(item.why || 'This fits the mood and location you gave.'),
    tradeoff: item.tradeoff ? String(item.tradeoff) : null,
    sourceUrl: item.sourceUrl ? String(item.sourceUrl) : null,
  };
}

function normalizePlan(raw, prefs) {
  if (!raw || !Array.isArray(raw.slots)) throw new Error('Planner response missing slots');

  const slots = raw.slots.slice(0, 8).map((slot, index) => {
    const type = slot.type === 'food' ? 'food' : 'act';
    return {
      time: String(slot.time || `${9 + index}:00 AM`),
      type,
      item: normalizeItem(slot.item || slot, type === 'food' ? 'food' : 'activity', index),
    };
  });

  if (slots.length < 2) throw new Error('Planner returned too few stops');

  const subtotal = slots.reduce((sum, slot) => (
    sum + (slot.type === 'food' ? toNumber(slot.item.cph, 0) : toNumber(slot.item.cost, 0))
  ), 0);
  const transport = raw.transport || {};
  const transportCost = toNumber(
    transport.cost ?? transport.estimatedCost ?? raw.transportCost,
    estimateTransportFallback(prefs, slots)
  );
  const total = subtotal + transportCost;

  return {
    slots,
    foodTotal: slots.filter(s => s.type === 'food').reduce((sum, slot) => sum + toNumber(slot.item.cph, 0), 0),
    actTotal: slots.filter(s => s.type !== 'food').reduce((sum, slot) => sum + toNumber(slot.item.cost, 0), 0),
    transportCost,
    transport: {
      mode: String(transport.mode || 'Auto/cab between stops'),
      cost: transportCost,
      desc: String(transport.desc || transport.note || 'Estimated local travel between the starting area and recommended stops.'),
      sourceUrl: transport.sourceUrl ? String(transport.sourceUrl) : null,
    },
    total,
    overBudget: total > toNumber(prefs.budget, 0),
    tradeoff: raw.tradeoff ? String(raw.tradeoff) : null,
    sources: Array.isArray(raw.sources) ? raw.sources.slice(0, 8) : [],
  };
}

function getBudgetTarget(prefs) {
  const budget = toNumber(prefs?.budget, 0);
  if (budget > 1500) return { min: 0.3, max: 0.4, label: 'buffer-aware' };
  return { min: 0.65, max: 0.9, label: 'tight-budget' };
}

function validateBudgetUse(plan, prefs) {
  const budget = toNumber(prefs?.budget, 0);
  if (!budget) return null;

  const target = getBudgetTarget(prefs);
  const minimumSpend = Math.round(budget * target.min);
  const maximumSpend = Math.round(budget * target.max);
  if (plan.total >= minimumSpend && plan.total <= maximumSpend) return null;

  if (plan.total < minimumSpend) {
    return `Plan spends Rs.${plan.total.toLocaleString('en-IN')} against a Rs.${budget.toLocaleString('en-IN')} budget. For this app, target about 30-40% of budget when budget is above Rs.1,500, so revise toward Rs.${minimumSpend.toLocaleString('en-IN')}-Rs.${maximumSpend.toLocaleString('en-IN')}.`;
  }

  return `Plan spends Rs.${plan.total.toLocaleString('en-IN')} against a Rs.${budget.toLocaleString('en-IN')} budget. Preserve buffer for extra expenses; target about Rs.${minimumSpend.toLocaleString('en-IN')}-Rs.${maximumSpend.toLocaleString('en-IN')} instead of using most of the budget.`;
}

function estimateTransportFallback(prefs, slots) {
  const stopCount = Array.isArray(slots) ? slots.length : 3;
  const base = prefs?.budget >= 7000 ? 550 : prefs?.budget >= 4000 ? 400 : 250;
  return Math.max(180, base + Math.max(0, stopCount - 3) * 75);
}

function makePlannerPrompt(input) {
  const { prefs, freetext } = input;
  const searchMode = PROVIDER === 'openrouter' && !USE_OPENROUTER_WEB
    ? 'Use your local Bangalore knowledge and the provided planning constraints. Do not claim that you performed live web search.'
    : 'Use web search first for current local recommendations.';

  return `Plan a real, current 4-8 stop Bangalore weekend route. ${searchMode}

Use every user signal:
- City: Bangalore only
- Starting area / notes: ${freetext || 'none'}
- Budget: Rs.${prefs.budget}
- Available time: ${prefs.hours} hours
- Mood: ${prefs.mood}
- Interests: ${prefs.interests.join(', ') || 'none'}
- Constraints: ${prefs.constraints.join(', ') || 'none'}
- Vegetarian: ${prefs.isVeg ? 'yes' : 'no'}
- Avoid crowds: ${prefs.noCrowd ? 'yes' : 'no'}
- Indoors only: ${prefs.indoorOnly ? 'yes' : 'no'}
- Outdoors only: ${prefs.outdoorOnly ? 'yes' : 'no'}

Prioritize places near the notes/location when a location is provided, especially HSR Layout Sector 1, Koramangala, Bellandur, Indiranagar, BTM, and nearby Bangalore areas. Prefer real, specific venues. Do not invent impossible routes.

Budget philosophy:
- If budget is above Rs.1,500, do not try to spend the full budget.
- Target total estimated activity + food + transport cost around 30-40% of the user's budget.
- This leaves room for real-world extra spending: snacks, surge pricing, parking, add-ons, tips, and changed transport.
- If budget is Rs.5,750, aim around Rs.1,725-Rs.2,300 total, not Rs.850 and not Rs.5,000.
- Higher budgets should still improve quality within the 30-40% band: better ambience, better-rated restaurants, more comfortable transport, or one paid experience.
- Lower budgets should stay practical and value-conscious.
- Two users with different budgets should not get the same plan if the higher budget can improve comfort or quality while staying near the 30-40% target.

Transport:
- Search or infer normal local Bangalore auto/cab fares for the route distance and time.
- Include transport as a real cost in the final total.
- Prefer geographically sensible stops near the user's starting area to avoid wasting the budget on travel.

Return ONLY valid JSON with this shape:
{
  "slots": [
    {
      "time": "10:00 AM",
      "type": "act",
      "item": {
        "id": "short-id",
        "name": "Place name",
        "type": "walk|nature|coffee|food|art|books|markets|music",
        "dur": "1 hr",
        "cost": 0,
        "crowd": "low|medium|high",
        "indoor": false,
        "desc": "Specific description based on search.",
        "why": "One sentence tying it to the user's mood, interests, notes, and location.",
        "tradeoff": null,
        "sourceUrl": "https://..."
      }
    },
    {
      "time": "11:30 AM",
      "type": "food",
      "item": {
        "id": "short-id",
        "name": "Restaurant/cafe name",
        "cuisine": "Cuisine",
        "veg": true,
        "cph": 400,
        "crowd": "low|medium|high",
        "desc": "Specific description based on search.",
        "why": "One sentence tying it to the user's input.",
        "tradeoff": null,
        "sourceUrl": "https://..."
      }
    }
  ],
  "transport": {
    "mode": "Auto/cab",
    "cost": 450,
    "desc": "Estimated local fare for the route between the starting area and stops.",
    "sourceUrl": "https://..."
  },
  "tradeoff": null,
  "sources": [{ "title": "Source title", "url": "https://..." }]
}

Hard rules:
- Stay in Bangalore.
- If a starting area is given, keep the plan geographically sensible.
- Respect vegetarian, no alcohol, wheelchair, pet friendly, child friendly, indoors, outdoors, and avoid-crowds constraints when present.
- Keep total estimated activity + food + transport cost within the 30-40% budget target when budget is above Rs.1,500.
- "Within budget" does not mean "as cheap as possible" and does not mean "spend everything."
- Use 2-3 stops for 2-3 hours, 3-5 stops for 4-5 hours, and 5-7 stops for 6-8 hours.
- For food items, cph means cost per head in INR.
- No markdown. No commentary outside JSON.`;
}

async function planWithAnthropic(input) {
  if (!ANTHROPIC_API_KEY) {
    const err = new Error('Missing ANTHROPIC_API_KEY');
    err.status = 503;
    throw err;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3500,
      system: 'You are Vibin, a Bangalore weekend-planning agent. You must use web search for current local recommendations, then produce compact validated JSON.',
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5,
          user_location: {
            type: 'approximate',
            city: 'Bangalore',
            region: 'Karnataka',
            country: 'IN',
            timezone: 'Asia/Kolkata',
          },
        },
      ],
      messages: [{ role: 'user', content: makePlannerPrompt(input) + (input.retryHint ? `\n\nCorrection required: ${input.retryHint}` : '') }],
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.message || `Anthropic API ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const text = (data.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text || '')
    .join('\n')
    .trim();

  if (!text) throw new Error('Planner returned no text');
  const rawPlan = parseJsonFromText(text);
  return normalizePlan(rawPlan, input.prefs);
}

async function planWithOpenRouter(input) {
  if (!OPENROUTER_API_KEY) {
    const err = new Error('Missing OPENROUTER_API_KEY');
    err.status = 503;
    throw err;
  }

  const body = {
    model: MODEL,
    max_tokens: MODEL === 'openrouter/free' ? 1600 : 3500,
    temperature: 0.35,
    messages: [
      {
        role: 'system',
        content: USE_OPENROUTER_WEB
          ? 'You are Vibin, a Bangalore weekend-planning agent. Use real-time web search when available, then produce compact validated JSON only.'
          : 'You are Vibin, a Bangalore weekend-planning agent. Produce compact validated JSON only using reliable local knowledge and the provided constraints.',
      },
      {
        role: 'user',
        content: makePlannerPrompt(input) + (input.retryHint ? `\n\nCorrection required: ${input.retryHint}` : ''),
      },
    ],
  };

  if (USE_OPENROUTER_WEB) {
    body.plugins = [{ id: 'web' }];
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-OpenRouter-Title': 'Vibin Weekend Planner',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.message || `OpenRouter API ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenRouter planner returned no text');
  const rawPlan = parseJsonFromText(text);
  return normalizePlan(rawPlan, input.prefs);
}

async function planWithWebSearch(input) {
  const plan = await (PROVIDER === 'openrouter'
    ? planWithOpenRouter(input)
    : planWithAnthropic(input));
  const budgetIssue = validateBudgetUse(plan, input.prefs);

  if (!budgetIssue || input.retryHint) return plan;

  const retryInput = { ...input, retryHint: budgetIssue };
  return PROVIDER === 'openrouter'
    ? planWithOpenRouter(retryInput)
    : planWithAnthropic(retryInput);
}

async function handlePlan(req, res) {
  try {
    const body = await readBody(req);
    const input = JSON.parse(body || '{}');
    if (!input.prefs) return sendJson(res, 400, { error: 'Missing prefs' });

    const plan = await planWithWebSearch(input);
    return sendJson(res, 200, { source: 'web', plan });
  } catch (error) {
    console.error('[Vibin API]', error);
    return sendJson(res, error.status || 500, {
      error: error.message || 'Planning failed',
      source: 'web',
    });
  }
}

function serveStatic(req, res) {
  const buildDir = path.join(__dirname, 'build');
  if (!fs.existsSync(buildDir)) {
    return sendJson(res, 404, { error: 'Build folder not found. Run npm.cmd run build first.' });
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(buildDir, safePath === '/' ? 'index.html' : safePath);
  const finalPath = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(buildDir, 'index.html');

  const ext = path.extname(finalPath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(finalPath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method === 'POST' && req.url.startsWith('/api/plan')) return handlePlan(req, res);
  if (req.method === 'GET' && req.url.startsWith('/api/health')) {
    return sendJson(res, 200, {
      ok: true,
      provider: PROVIDER,
      hasOpenRouterKey: Boolean(OPENROUTER_API_KEY),
      hasAnthropicKey: Boolean(ANTHROPIC_API_KEY),
      hasKey: PROVIDER === 'openrouter' ? Boolean(OPENROUTER_API_KEY) : Boolean(ANTHROPIC_API_KEY),
      model: MODEL,
    });
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Vibin API listening on http://localhost:${PORT}`);
});
