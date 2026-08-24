# Egypt One — Brand Domain & Contact Identity (addendum to the approved frontend plan)

Adds `www.egypt-one.com` and `info@egypt-one.com` as the platform's canonical identity across every place the frontend declares a URL or a contact address. This is placeholder-safe: the values are correct now and stay correct after real publishing.

## 1. Single source of truth

One config module (`apps/web/src/config/site.ts`, mirrored into this sandbox app if we build here first):

```ts
export const SITE = {
  name: "Egypt One",
  tagline: "One Egypt. One Journey. One Platform.",
  url: "https://www.egypt-one.com",
  domain: "www.egypt-one.com",
  email: "info@egypt-one.com",
  support: "info@egypt-one.com",
  locales: ["en", "ar"],
} as const;
```

Nothing hardcodes the domain or email anywhere else. Swapping to a different production host later is a one-line change.

## 2. Where the domain is used

- `metadataBase` for the app, so every relative OG/Twitter image resolves absolutely.
- Per-route `canonical` and `hreflang` alternates: `https://www.egypt-one.com/en/...` and `/ar/...`, plus `x-default`.
- `og:url`, `og:site_name`, `twitter:domain`.
- JSON-LD: `Organization` (`name`, `url`, `logo`, `contactPoint.email`, `sameAs`), `WebSite` (+ `SearchAction` pointing at the real `/api/search`-backed search route), `BreadcrumbList` per page.
- `sitemap.xml` and `robots.txt` absolute URLs and `Sitemap:` line.
- `manifest` / PWA `start_url` and `id`.
- Any share, copy-link, or QR affordance in the footer and app-download block.

## 3. Where the email is used

- Footer "Contact" column and the top utility "Support" entry — a real `mailto:info@egypt-one.com`, not a dead button.
- Contact / Support / Help pages: primary contact address (no fake phone numbers, no fake office addresses).
- Newsletter block: reply-to shown as `info@egypt-one.com`; the form itself stays non-submitting and labelled PLANNED until a backend endpoint exists (no fake success state).
- Investment inquiry, partner, provider and press CTAs: since no backend form endpoint exists, these become `mailto:info@egypt-one.com` with a prefilled subject (e.g. "Investment inquiry — Egypt One"). Honest and functional, no fabricated API.
- Legal pages (privacy, terms, cookie) contact clause.
- `Organization` JSON-LD `contactPoint` and `WebSite` publisher.

## 4. Honesty rules kept intact

- No claim that the domain is government-owned or officially endorsed.
- Legal/policy copy stays owner-authored and factual; certification, compliance and audit claims are excluded unless you supply evidence.
- Arabic parity: the same address and domain appear in AR routes with RTL-correct rendering and LTR-isolated email/URL strings (`dir="ltr"` on the address span) so they never render reversed.

## 5. Domain connection (outside the code)

Connecting `egypt-one.com` and `www.egypt-one.com` is a Lovable Project Settings → Domains action (or your Hostinger DNS if you host the monorepo yourself), not a code change. Add both the apex and `www`, and set `www.egypt-one.com` as primary so the metadata above matches the served host exactly. I'll implement the code side now regardless of when DNS is pointed.

## 6. Sequencing

Folded into Phase 1–2 of the approved plan: the `SITE` config lands with the design-system/token work, and header, footer, contact surfaces and per-route metadata consume it as those surfaces are built. No separate phase.
