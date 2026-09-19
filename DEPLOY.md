# Put forgor.app live — GitHub Pages

Everything in this folder is deploy-ready. Upload it as-is; nothing here needs editing first.

Files: `index.html` (the phone-first page, v3), `privacy/index.html` + `privacy.html`,
`404.html`, `CNAME`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og.png`,
`robots.txt`, `sitemap.xml`, `.nojekyll`.

`.nojekyll` and `CNAME` are easy to miss in a drag-and-drop — Finder hides dotfiles.
Press **Cmd+Shift+.** in Finder to show `.nojekyll` before you drag, or add it afterwards
with **Add file → Create new file** named `.nojekyll`, left empty.

## 1 — Repo (5 min)
github.com → **New repository** → name `forgor-site` → **Public** → Create.
On the empty repo page click **uploading an existing file** → drag everything from this
folder (including the `privacy` folder and `.nojekyll`) → Commit.

## 2 — Pages (2 min)
Repo → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch `main`, folder
`/ (root)` → Save. In a minute it is live at `https://<username>.github.io/forgor-site/`.
Open it and confirm the page loads before touching DNS.

## 3 — Namecheap DNS (5 min)
Domain List → Manage **forgor.app** → **Advanced DNS**.

⚠️ The Resend MX and DKIM records for `in.forgor.app` live here. Do **not** touch anything
whose host is `in`, `resend._domainkey.in` or `_dmarc.in`, and do not touch Mail Settings.
Only the apex and `www` change.

Delete the existing parking records for `@` and `www` (a URL Redirect on `@` and a CNAME on
`www`), then add:

| Type  | Host | Value                   | TTL       |
|-------|------|-------------------------|-----------|
| A     | @    | 185.199.108.153         | Automatic |
| A     | @    | 185.199.109.153         | Automatic |
| A     | @    | 185.199.110.153         | Automatic |
| A     | @    | 185.199.111.153         | Automatic |
| CNAME | www  | `<username>.github.io.` | Automatic |

## 4 — Bind the domain (3 min + waiting)
Settings → Pages → **Custom domain** → `forgor.app` → Save. The `CNAME` file in the upload
pre-fills this; wait for the green check (15 min to a few hours).
Then tick **Enforce HTTPS** as soon as it is clickable. **.app requires HTTPS** — until the
certificate issues the site will not load at all. That is expected, not broken.

## 5 — Verify
- `https://forgor.app` → the page
- `https://forgor.app/privacy` → privacy
- `https://forgor.app/nothing-here` → the 404
- `https://www.forgor.app` → redirects to the apex
- Paste `https://forgor.app` into iMessage or Slack → the gold wordmark card (`og.png`)

## Still open after this
- **Universal links.** `web/apple-app-site-association` still says `TEAMID` and is not in this
  folder. It has to be served at `/.well-known/apple-app-site-association` as
  `application/json`; GitHub Pages sends extension-less files as `application/octet-stream`,
  which Apple rejects. Options when the Team ID is filled in: move the site to Vercel (headers
  are configurable), or put the file behind a Cloudflare Worker. Not blocking the launch —
  only the `forgor.app/join/<code>` invite links.
- **The privacy page is a first draft**, written from what the app actually does (on-device
  contacts and photo reads, mail read by a model and not stored beyond a 140-char excerpt,
  no ads, no training). Read it before App Store submission; it is the URL App Store Connect
  will want.
- The second, larger showing of the home screen further down the page is still not done.
