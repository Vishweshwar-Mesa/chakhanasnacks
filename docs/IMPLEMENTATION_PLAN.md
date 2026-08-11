# Chakhana — Implementation Plan

## 1. What this is

Chakhana sells roasted makhana (fox nut) and ragi (finger millet) chips in four and two flavours respectively, each in 50g/100g resealable pouches, plus sampler packs. Brand tone: bold, young, Hinglish-aware, premium — not clinical health food. This document is the architecture record for turning the storefront into a genuinely custom Online Store 2.0 theme instead of a reconfigured stock theme.

## 2. Starting state (audited before building)

The repo was Shopify Dawn 15.5.0 with **configuration-only** customization already applied: 7 packaging-derived color schemes, Poppins/Inter fonts, pill buttons, 24px card radii, Chakhana copy in `settings_data.json` / `header-group.json` / `footer-group.json`, a homepage (`templates/index.json`) built from stock section types (`image-banner`, `multicolumn`, `featured-collection`, `image-with-text`), two extra PDP accordion tabs, and `chakhana-products-import.csv` (7 products, `Weight` as the single 50g/100g variant option). No custom Liquid, CSS, or JS existed anywhere — every section/snippet/asset file was byte-identical to stock Dawn.

## 3. Product / Shopify model

**Product = flavour. Variant = size (`Weight`: 50g / 100g).** Confirmed correct and kept as-is:

- Makhana: Masala, Peri Peri, Cream & Onion, Cheese & Herbs — ₹79 (50g) / ₹139 (100g)
- Ragi: Masala, Peri Peri — ₹69 (50g) / ₹129 (100g)
- Sampler packs: standalone single-variant products (4-flavour bundles), pricing flagged as placeholder pending owner confirmation

Prices, titles, images, and availability are never hardcoded into new UI — every new section/snippet pulls from `product`, `collection`, or `product.selected_or_first_available_variant` objects, so Shopify Admin remains the single source of truth.

## 4. Shopify architecture decision

**Custom Online Store 2.0 theme (Liquid + JSON templates + Sections/Blocks), not Hydrogen.** Reasoning: the merchant needs Theme Editor–level content control without a separate deploy pipeline, and Dawn's Ajax Cart, facets, predictive search, and checkout are already production-grade — headless would mean rebuilding all of that for no functional gain here. All new work extends the existing Dawn skeleton with new sections and CSS/JS assets rather than replacing engine-level code (cart.js, facets.js, product-form.js) that already talks to Shopify's Cart/Product APIs correctly.

## 5. Payments

Shopify checkout stays the single checkout surface. Razorpay connects as a Shopify-listed **third-party payment provider** (Settings → Payments → Third-party providers → Razorpay), optionally upgraded later to **Razorpay Magic Checkout** (a Shopify App Store app) for UPI/wallet-optimized accelerated checkout — both keep order/inventory/tax/discount logic inside Shopify. No custom payment forms, no secrets in theme code. Full steps: `RAZORPAY_SETUP.md`.

## 6. New section inventory (homepage storytelling)

All new sections live in `sections/*.liquid`, are fully schema-driven (settings + blocks) so a non-developer can reorder/edit/hide them in Theme Editor, and are wired into `templates/index.json`:

`marquee` · `shop-by-craving` · `bestsellers-carousel` · `why-chakhana` · `flavour-universe` · `makhana-story` · `ragi-story` · `combo-builder` · `testimonials` (placeholder content, clearly labeled) · `ugc-grid` (editable image blocks, Instagram app hookup documented, not built) · `final-cta`.

Existing stock sections (`header`, `footer`, `main-product`, `main-collection-product-grid`, `cart-drawer`, `predictive-search`) are extended in place with new snippets/CSS/JS rather than rewritten, since their commerce logic (variant switching, Ajax cart, facet filtering, predictive search) is already correct and shouldn't be reinvented.

## 7. Motion strategy

One shared, dependency-free controller: `assets/chakhana-motion.js` — an `IntersectionObserver` that toggles a `.is-visible` class for scroll-reveal, plus small targeted enhancements per component (marquee via CSS `@keyframes` + `animation-play-state`, flavour-universe via CSS scroll-snap, cart-badge pulse via a class toggle on cart update). No animation library. Every animation is wrapped so `@media (prefers-reduced-motion: reduce)` disables translate/scale/parallax and leaves instant, accessible state changes.

## 8. Pages

`page.our-story.json`, `page.faq.json`, `page.shipping-returns.json` ship as theme templates with their own content sections (copy lives in the theme, not pasted manually). Privacy/Terms use Shopify's native auto-generated policy pages (legal text needs the owner's review, not mine). No fundraising, supplier, margin, or team-ops information is published anywhere on the storefront.

## 9. SEO / analytics

Product/Organization/BreadcrumbList JSON-LD snippets, OG/Twitter meta audit, and theme-setting-gated (not hardcoded) placeholders for GA4/Meta Pixel — documented in `SHOPIFY_SETUP.md` under "Analytics."

## 10. What is NOT done by theme code (manual Admin steps)

Documented precisely in `SETUP.md` / `SHOPIFY_SETUP.md` / `RAZORPAY_SETUP.md`: product CSV import, collection creation, navigation menus, metafield **definitions** (Shopify requires these created in Admin before Liquid can read them), Razorpay dashboard KYC + app install, and any live-browser QA (Lighthouse, console errors) — this session has no interactive browser/OAuth access to run `shopify theme dev` itself.
