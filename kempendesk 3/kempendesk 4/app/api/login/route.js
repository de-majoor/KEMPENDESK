import { NextResponse } from 'next/server';
export async function POST(req) {
  const { password } = await req.json();
  const expected = process.env.APP_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'APP_PASSWORD ontbreekt in Vercel.' }, { status: 500 });
  if (password !== expected) return NextResponse.json({ error: 'Onjuist wachtwoord.' }, { status: 401 });
  return NextResponse.json({ ok: true });
}
