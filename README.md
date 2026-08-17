# Car Poshish — Next.js website

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Connecting the Strapi CMS

This site can pull its content (services, products, testimonials, FAQs,
gallery items, and site-wide settings like phone/address/hours) from the
companion `car-poshish-cms` Strapi project instead of the hardcoded
defaults.

1. Get the CMS running first — see its own README (`npm install`,
   `npm run develop`, create an admin account at
   http://localhost:1337/admin). It seeds itself with starter content
   automatically.
2. In this project, copy the env template:
   ```bash
   cp .env.local.example .env.local
   ```
3. `.env.local` already points at `STRAPI_URL=http://localhost:1337` —
   leave it as-is for local development.
4. Restart `npm run dev` if it was already running (env vars are only
   read on start).

That's it — every page now fetches from Strapi. Edit a service's price in
the CMS admin panel, refresh the site (content revalidates at most once a
minute), and you'll see it update without touching any code.

**If `STRAPI_URL` isn't set, or the CMS isn't running, or a request to it
fails for any reason** — the site automatically falls back to the same
default content it shipped with (see `lib/site-config.ts`). This means
the two projects are fully independent: you can develop, deploy, or demo
this website on its own without the CMS ever being involved, and turn on
the CMS connection whenever it's ready.

The fetch layer lives in `lib/cms.ts` if you want to see exactly how the
fallback logic works or add more fields.