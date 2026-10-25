# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-25T06:45:02+05:30 — Add vercel.json and publish to Vercel

- Changed: Added `vercel.json` with explicit Vite build settings (`npm run build`, `dist` output, `npm install`) and an SPA fallback rewrite to `index.html`. Deployed the project to Vercel (`omnipotent`, linked to `simply-sameen/devin-uno`, auto-deploys on push to `main`) and disabled Vercel Authentication (SSO protection) so the demo is publicly reachable.
- Why: Make the app publicly accessible at https://omnipotent-ten.vercel.app for the demo, and make the build/deploy config explicit since the project's framework detection was unset.
- Validation: `curl` against https://omnipotent-ten.vercel.app returns 200 with the app HTML; JS bundle (`/assets/index-BvYkExZr.js`, 362 KB) and CSS (33 KB) return 200.
- Limitations: No environment variables are set on the Vercel project — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_GEMINI_API_KEY` are unset, so the app runs in its built-in fallback mode (local mesh sync, Gemini key entered via UI). A redeploy is required after setting `VITE_*` vars since they are inlined at build time.

## Template setup — 10 October 2026

- Changed: Added the event README, rules, agent guide, change log, AI usage record, submission checklist, Git ignore rules, and pull request checklist.
- Why: Give participants a consistent starting point for event rules, basic coding patterns, documented changes, and regular commits.
- Validation: Checked local Markdown links, event detail consistency, required documents, and diff whitespace before publishing.
- Limitations: Documentation scaffolding only; no participant project, application, or working demo is included. GitHub publication and template status are verified separately after creation.
