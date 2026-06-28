import { askOpenAI, readJson, sendJson, validateInput } from './_helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Alleen POST is toegestaan.' });
  try {
    const { text, url } = await readJson(req);
    validateInput({ text, url });
    const result = await askOpenAI(
      `Je bent een scherpe eindredacteur. Stel precies vijf journalistieke controlevragen over de aangeleverde tekst. De vragen moeten helpen om feiten, ontbrekende context, wederhoor, cijfers, claims en bronvermelding te controleren. Antwoord alleen met een genummerde lijst van vijf vragen.`,
      `TEKST:\n${text}\n\nURL TER CONTEXT:\n${url || 'geen URL meegegeven'}`
    );
    sendJson(res, 200, { result });
  } catch (error) {
    sendJson(res, 400, { error: error.message || 'Er ging iets mis bij het maken van de vragen.' });
  }
}
