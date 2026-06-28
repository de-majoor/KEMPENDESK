import { askOpenAI, readJson, sendJson, validateInput } from './_helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Alleen POST is toegestaan.' });
  try {
    const { text, url } = await readJson(req);
    validateInput({ text, url });
    const result = await askOpenAI(
      `Je bent een kritische Nederlandse journalistieke factchecker voor een lokale/redactionele nieuwsdesk. Controleer streng maar eerlijk. Verzin geen bronnen. Maak onderscheid tussen bewezen feit, aannemelijke claim, ontbrekende context en risico. Als een URL is meegegeven: behandel die als opgegeven context, maar beweer niet dat je de pagina live hebt bezocht. Antwoord in helder Nederlands met: Kernclaims, Wat klopt waarschijnlijk, Onzekerheden/risico's, Nodige broncontrole, Concrete verbeteringen, Eindoordeel.`,
      `TEKST:\n${text}\n\nURL TER CONTEXT:\n${url || 'geen URL meegegeven'}`
    );
    sendJson(res, 200, { result });
  } catch (error) {
    sendJson(res, 400, { error: error.message || 'Er ging iets mis bij de factcheck.' });
  }
}
