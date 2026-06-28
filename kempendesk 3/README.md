# KempenDesk Factcheck

Een kleine Vercel-webapp met:

- tekstveld
- URL-veld
- knop Factcheck
- knop Stel vijf vragen
- OpenAI API via veilige Vercel serverless functions

## Vercel

1. Zet deze map in een GitHub-repository.
2. Importeer de repository in Vercel.
3. Voeg bij Environment Variables toe:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.5-mini
```

4. Deploy.

De API-key staat dus niet in de browser.
