const text = document.querySelector('#text');
const url = document.querySelector('#url');
const result = document.querySelector('#result');
const factcheck = document.querySelector('#factcheck');
const questions = document.querySelector('#questions');
const copy = document.querySelector('#copy');

async function run(endpoint, loadingText) {
  const payload = { text: text.value.trim(), url: url.value.trim() };
  if (!payload.text) {
    result.textContent = 'Vul eerst tekst in.';
    return;
  }
  factcheck.disabled = true;
  questions.disabled = true;
  result.textContent = loadingText;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    result.textContent = response.ok ? data.result : (data.error || 'Onbekende fout.');
  } catch {
    result.textContent = 'Kan de serverfunctie niet bereiken. Controleer de Vercel-deployment.';
  } finally {
    factcheck.disabled = false;
    questions.disabled = false;
  }
}

factcheck.addEventListener('click', () => run('/api/factcheck', 'Factcheck wordt uitgevoerd...'));
questions.addEventListener('click', () => run('/api/five-questions', 'Vijf vragen worden gemaakt...'));
copy.addEventListener('click', async () => {
  await navigator.clipboard.writeText(result.textContent);
  copy.textContent = 'Gekopieerd';
  setTimeout(() => copy.textContent = 'Kopieer', 1200);
});
