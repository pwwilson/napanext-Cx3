# napanext-Cx3

Minimal Next.js app for the "Cx3" event: Compliments · Confessions · Captions.

Quick local run

```bash
npm install
# start dev server (default port 3002)
npm run dev
```

If you need to explicitly run on a different port:

```bash
PORT=3003 npm run dev
```

Dev-server troubleshooting

- If you see "Port 3002 is in use" or an error about `.next/dev/lock`:

	1. Find the process and kill it:
		 ```bash
		 ss -ltnp | grep 3002
		 # or
		 lsof -i :3002
		 kill <PID>
		 ```

	2. If a stale lock remains, remove it and restart:
		 ```bash
		 rm -f .next/dev/lock
		 npm run dev
		 ```

Security & dependencies

- `npm install` may warn about an insecure Next.js version. Upgrade with:

```bash
npm install next@latest
npm audit
# optionally try fixes (may bump major versions):
npm audit fix
# or, with risk of major upgrades:
npm audit fix --force
```

What changed in this workspace

- Mobile & UX: the app includes `viewport-fit=cover`, safe-area padding, `font-size:16px` on inputs (prevents iOS zoom), larger touch targets, and improved focus styles.
- Pages added: `/compliments`, `/confessions`, `/captions`, `/display`, `/feed` (real-time scrolling feed that polls `/api/entries`).
- Storage: a local runtime file is used at `data/entries.json` for quick testing (not recommended for production).
- Backgrounds & theme: page and far background set to the same dark blue (`--bg`) for a consistent look.
- Fonts: `Figtree` is loaded and used globally.

Logo and backups

- The header uses `public/logo.svg` for the site logo. If you previously had a logo that was overwritten, a backup was saved at `public/logo.bak.svg`.
- To restore your original logo manually:

```bash
mv public/logo.bak.svg public/logo.svg
# then restart dev if running
```

Or upload/paste your original `logo.svg` into `public/` and it will be used automatically.

Git and ignored files

- A `.gitignore` was added to exclude `node_modules/`, `/.next/`, `/out/`, `.env*`, and by default `/data/entries.json` (recommended). If you want `data/entries.json` tracked, remove that line from `.gitignore`.
- If `node_modules` was already tracked, it has been removed from the index (cached) so it no longer appears in `git status`.

Notes on storage and deployment

- `data/entries.json` is suitable for local testing but not for production. For event-night reliability consider:
	- Supabase (Postgres, REST + JS client)
	- Cloudflare Pages Functions + KV (serverless, single-repo)

Next actions I can take

- Convert storage to Supabase and add a `README` section showing how to configure the DB.
- Convert to Cloudflare Pages Functions + KV (no external DB required).
- Add QR-code generation and a printable PDF with the three QR codes for the event.

Tell me which next step you want and I'll implement it.

## Deployment & Releasing

### Deploy to Vercel (live.napanext.co)

- **Prerequisites**:
  - Node.js 18+ and npm
  - Vercel account/team access
  - CLI: `npm i -g vercel` (or run `npm run setup`)

- **One-time setup**:
  1. **Login**: `npm run vercel:login`
  2. **Link**: `npm run vercel:link && npm run vercel:pull`
  3. **Domain**: `npm run vercel:domain:add`
  4. **DNS**: Ensure CNAME `live` points to `cname.vercel-dns.com`.
  5. **Verify**: `npm run vercel:domain:inspect`

- **Deploying**:
  - **Preview**: `npm run deploy:preview` (deploys to a unique URL for testing)
  - **Production**: `npm run deploy:prod` (deploys to `live.napanext.co`)

- **Operations**:
  - **Logs**: `npm run logs`
  - **Cleanup**: `npm run clear` (clears entries from Redis/KV)

### Releasing a New Version

1. **Commit changes**: Ensure all your changes are committed to git.
2. **Bump version**: Update the `version` in `package.json`.
   ```bash
   npm version patch # or minor, or major
   ```
3. **Push tags**:
   ```bash
   git push origin main --tags
   ```
4. **Deploy**:
   ```bash
   npm run deploy:prod
   ```
