import OpenAI from 'openai';

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_500_000) {
        reject(new Error('De tekst is te lang.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Ongeldige JSON.')) }
    });
    req.on('error', reject);
  });
}

export function validateInput({ text, url }) {
  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    throw new Error('Vul eerst een tekst in.');
  }
  if (url && typeof url === 'string') {
    try { new URL(url); }
    catch { throw new Error('De URL is niet geldig.'); }
  }
}

export async function askOpenAI(systemInstruction, userContent) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY ontbreekt in Vercel.');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.5-mini',
    input: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userContent }
    ]
  });
  return response.output_text || 'Geen antwoord ontvangen.';
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
