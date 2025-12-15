# napanext-Cx3

This repository is a minimal Next.js app for the "Cx3" event: Compliments · Confessions · Captions.

Quick local run

```bash
npm install
npm run dev
```

Open http://localhost:3000 and visit `/compliments`, `/confessions`, `/captions` to submit, and `/display` for the big-screen view.

Notes on storage and deployment

- This scaffold uses a simple JSON file at `data/entries.json` for storage which works for local testing. It will not persist reliably on many serverless providers (Vercel, Cloudflare Pages Functions) — for production or multi-instance hosting use Supabase/Postgres or Cloudflare KV.
- To deploy quickly use Vercel or Cloudflare Pages. For a no-DB deploy and event-night reliability, consider Cloudflare Pages + Pages Functions + KV (you would swap the API storage implementation).

If you want, I can:

- Replace JSON file storage with Supabase integration (table + minimal auth). 
- Create a Cloudflare Pages Functions version that uses KV (easy to deploy).
- Add small admin/moderation UI.
