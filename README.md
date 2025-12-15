# napanext-Cx3

Minimal Next.js app for the "Cx3" event: Compliments · Confessions · Captions.

Quick local run

```bash
npm install
# start dev server (default port 3000)
npm run dev
```

If port 3000 is already in use, Next will pick another port (3001, 3002...). To explicitly run on a different port:

```bash
PORT=3001 npm run dev
```

Dev-server troubleshooting

- If you see "Port 3000 is in use" or an error about `.next/dev/lock`:

	1. Find the process and kill it:
		 ```bash
		 ss -ltnp | grep 3000
		 # or
		 lsof -i :3000
		 kill <PID>
		 ```

	2. If a stale lock remains, remove it and restart:
		 ```bash
		 rm -f .next/dev/lock
		 npm run dev
		 ```

Security & dependencies

- `npm install` warns about `next@13.4.12` (security advisory). To upgrade to a patched Next.js:

```bash
npm install next@latest
npm audit
# optionally try fixes (may bump major versions):
npm audit fix
# or, with risk of major upgrades:
npm audit fix --force
```

Mobile UX improvements in this scaffold

- The app now includes a mobile-friendly viewport and CSS tweaks:
	- `viewport-fit=cover` and `safe-area-inset` padding for notches.
	- Input font-size set to 16px to prevent iOS auto-zoom on focus.
	- Larger touch targets and improved focus outlines.
	- Responsive layout for narrow screens.

If the screen still zooms or shows white borders on your device, test these steps:

- Make sure the browser isn't applying a custom zoom or minimum-font-size setting.
- On iOS Safari, confirm the page is not forced into Reader/zoom — try in private mode.

Storage and deployment notes

- This scaffold uses `data/entries.json` for quick local testing only. For production or multi-instance hosting use a managed DB (Supabase/Postgres) or Cloudflare KV for serverless persistence.
- Recommended deploy targets: Vercel (Next-first) or Cloudflare Pages (Pages Functions + KV for a single-repo, no-DB option).

Next steps I can do for you

- Swap JSON storage for Supabase (table + client) — quick and durable.
- Convert the API to Cloudflare Pages Functions using KV for night-of reliability.
- Add QR-code generation for the three routes and a printable sheet.
- Add a lightweight moderation/admin UI.

If you want one of those, say which and I'll implement it.
