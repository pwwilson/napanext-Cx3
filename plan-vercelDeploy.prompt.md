Plan: Vercel deployment at live.napanext.co

1) Setup & Link
- Install CLI: npm i -g vercel
- Login: vercel login
- Link project: vercel link --yes
- Pull config (optional): vercel pull --yes --environment=production

2) Domain Configuration
- Add domain: vercel domains add live.napanext.co
- DNS (registrar):
  - Create CNAME: host live → cname.vercel-dns.com
- Verify: vercel domains inspect live.napanext.co

3) Deploy
- Preview: vercel --yes
- Production: vercel --prod --yes
- If domain isn’t mapped automatically, alias once:
  - vercel alias set <prod-deployment-url> live.napanext.co

4) Day-2 Operations
- Logs: vercel logs -f live.napanext.co
- (Optional) Scope flags for teams: add --scope <team> to domain/deploy commands

5) Storage Note
- Current API writes to data/entries.json; Vercel serverless filesystem is ephemeral.
- Replace file writes with a durable store before production:
  - Vercel KV (@vercel/kv): LPUSH JSON.stringify(entry) to a list key; LRANGE on read
  - Supabase (Postgres) via @supabase/supabase-js for structured persistence

Package.json scripts to add
{
  "vercel:login": "vercel login",
  "vercel:link": "vercel link --yes",
  "vercel:pull": "vercel pull --yes --environment=production",
  "vercel:domain:add": "vercel domains add live.napanext.co",
  "vercel:domain:inspect": "vercel domains inspect live.napanext.co",
  "deploy:preview": "vercel --yes",
  "deploy:prod": "vercel --prod --yes",
  "logs": "vercel logs -f live.napanext.co"
}

README section (paste-ready)
**Deploy to Vercel (live.napanext.co)**
- Prerequisites:
  - Node.js 18+ and npm
  - Vercel account/team access
  - CLI: npm i -g vercel
- One-time setup:
  - Login: npm run vercel:login
  - Link: npm run vercel:link && npm run vercel:pull
  - Domain: npm run vercel:domain:add
  - DNS (registrar): CNAME live → cname.vercel-dns.com; verify: npm run vercel:domain:inspect
- Deploy:
  - Preview: npm run deploy:preview
  - Production: npm run deploy:prod
  - If needed, alias latest prod URL: vercel alias set <prod-deployment-url> live.napanext.co
- Logs: npm run logs
- Storage note:
  - data/entries.json won’t persist on Vercel; use @vercel/kv or Supabase before production.

vercel.json
- Not required for this Next.js app by default; add only for custom headers/rewrites/regions.