'use client';
import { useState } from 'react';

export default function Page() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function login(e) {
    e.preventDefault(); setError('');
    const r = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
    if (r.ok) setLoggedIn(true); else setError('Wachtwoord klopt niet.');
  }

  async function analyze(mode) {
    setLoading(true); setResult(''); setError('');
    try {
      const r = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, text, url }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Er ging iets mis.');
      setResult(data.result);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  if (!loggedIn) return <main className="login"><section className="card small"><h1>KempenDesk</h1><p>Redactietool voor factcheck en journalistieke controle.</p><form onSubmit={login}><input type="password" placeholder="Wachtwoord" value={password} onChange={e=>setPassword(e.target.value)} /><button>Inloggen</button></form>{error && <p className="error">{error}</p>}</section></main>;

  return <main className="wrap"><header><div><h1>KempenDesk</h1><p>Plak tekst, voeg eventueel een URL toe en laat de AI controleren.</p></div><span>Redactie MVP</span></header>
    <section className="grid"><div className="card"><label>Tekst</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Plak hier je bericht, claim, persbericht of conceptartikel..." />
      <label>URL</label><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." />
      <div className="buttons"><button onClick={()=>analyze('factcheck')} disabled={loading}>Factcheck</button><button className="secondary" onClick={()=>analyze('vragen')} disabled={loading}>Stel vijf vragen</button></div>
      <p className="hint">De factcheck gebruikt OpenAI met web search waar beschikbaar. Controleer gevoelige claims altijd nog redactioneel.</p></div>
      <div className="card output"><h2>Resultaat</h2>{loading && <p>Bezig met analyseren...</p>}{error && <p className="error">{error}</p>}<pre>{result || 'Nog geen resultaat.'}</pre></div></section>
  </main>;
}
