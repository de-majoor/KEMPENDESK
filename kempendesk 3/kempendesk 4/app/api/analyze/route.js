import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { mode, text, url } = await req.json();
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY ontbreekt in Vercel.' }, { status: 500 });
    if (!text && !url) return NextResponse.json({ error: 'Vul tekst of een URL in.' }, { status: 400 });

    const instruction = mode === 'vragen'
      ? `Je bent een scherpe Nederlandse eindredacteur. Formuleer precies vijf journalistieke controlevragen bij de aangeleverde tekst en URL. Geef per vraag kort waarom die belangrijk is. Richt je op bron, bewijs, hoor/wederhoor, cijfers, juridische risico's en lokale context.`
      : `Je bent een Nederlandse factcheck-redacteur. Controleer de tekst en URL op feitelijke claims. Gebruik web search wanneer nodig. Geef een gestructureerd rapport met: 1) kernclaim(s), 2) oordeel per claim: klopt / deels / twijfelachtig / niet controleerbaar / onjuist, 3) onderbouwing met bronnen of zoekrichting, 4) ontbrekende informatie, 5) concrete redactionele verbeteringen, 6) risico's voor publicatie. Wees streng en praktisch. Verzin geen bronnen.`;

    const input = `TEKST:\n${text || '(geen tekst)'}\n\nURL:\n${url || '(geen URL)'}`;

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      tools: mode === 'factcheck' ? [{ type: 'web_search_preview' }] : [],
      input: [{ role: 'system', content: instruction }, { role: 'user', content: input }]
    });

    return NextResponse.json({ result: response.output_text || 'Geen tekstuele output ontvangen.' });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Onbekende fout.' }, { status: 500 });
  }
}
