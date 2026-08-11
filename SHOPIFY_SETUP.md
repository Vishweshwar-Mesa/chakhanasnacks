# Shopify CLI & Deployment — Chakhana

This project is a customized Shopify Online Store 2.0 theme (built on Dawn 15.5.0). `shopify.theme.toml` already points it at `chakhanasnacks.myshopify.com`. Everything below runs from the project root in your terminal.

## 1. Prerequisites

- A Shopify store (`chakhanasnacks.myshopify.com`) with theme-editing access.
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) installed. Check with:
  ```
  shopify version
  ```
  If missing: `npm install -g @shopify/cli@latest` (or via Homebrew: `brew install shopify-cli`).
- Node.js installed (CLI dependency).

## 2. Authenticate

```
shopify auth login
```

This opens a browser window — log in with the account that has access to `chakhanasnacks.myshopify.com`. (This step needs a real browser session; it can't be done from an unattended/non-interactive environment.)

## 3. Connect the local theme to your store

The store is already set in `shopify.theme.toml`, so most commands below will target it automatically. To double check or switch stores:

```
shopify theme dev --store=chakhanasnacks.myshopify.com
```

## 4. Local development preview

```
shopify theme dev
```

This starts a local preview server and gives you a private preview URL (hot-reloads on file save). Use this to visually QA every change before pushing — this is the step that needs to happen in your own browser, since it requires the interactive auth from step 2.

## 5. Lint before pushing

```
shopify theme check
```

Should report 0 errors (a handful of pre-existing stock-Dawn warnings are expected and don't block anything — see `docs/IMPLEMENTATION_PLAN.md`).

## 6. Push to a new unpublished theme (recommended, safest)

```
shopify theme push --unpublished --theme="Chakhana — staging"
```

This uploads the theme as a new, unpublished theme in your Admin (**Online Store → Themes**) so you can review it live without affecting your current storefront.

To push to a specific existing theme instead (e.g. to update the same staging theme again):

```
shopify theme list
shopify theme push --theme=<theme-id-from-list>
```

## 7. Products, collections, navigation, pages, metafields

All of this is store content, not theme code — full step-by-step instructions are in **`SETUP.md`**. Do these before your first real preview so the homepage/collections/PDP aren't showing empty states:

1. Upload product images (`SETUP.md` §1)
2. Import products via `chakhana-products-import.csv` (`SETUP.md` §2)
3. Create the 3 collections with exact handles `makhana-chips`, `ragi-chips`, `sampler-packs` (`SETUP.md` §3)
4. Set up the main navigation menu (`SETUP.md` §4)
5. Create the Contact / Our Story / FAQ / Shipping & Returns pages with their matching theme templates (`SETUP.md` §5)
6. (Optional) Nutrition & ingredients metafield definitions (`SETUP.md` §9)

## 8. Theme customizer review

**Online Store → Themes → [your staging theme] → Customize.** Every new homepage section (hero, marquee, shop-by-craving, bestsellers, flavour universe, editorial stories, combo builder, testimonials, UGC grid, final CTA) is fully editable/reorderable here — nothing is hardcoded. Check:
- Announcement bar messages
- Free shipping threshold (**Theme settings → Cart**)
- Color schemes if you want to nudge any flavour's brand color
- Testimonials are placeholder/demo content by design — replace with real reviews here once you have them

## 9. Razorpay

Separate guide: **`RAZORPAY_SETUP.md`**. Payments setup happens entirely in Shopify Admin + Razorpay Dashboard, not in the theme.

## 10. Analytics (optional)

Shopify's native analytics and the Google/Meta sales channel apps (Settings → Customer events) need no theme changes. If you specifically also want GA4/Meta Pixel loaded directly by the theme, fill in **Theme settings → Analytics → GA4 measurement ID / Meta Pixel ID** — leave blank to skip; no IDs are hardcoded anywhere in the codebase.

## 11. Test order

Follow the checklist in `RAZORPAY_SETUP.md` — place at least one test-mode order and one small real order before announcing launch.

## 12. Go live

Once staging looks right in step 8 and a real test order completed successfully:

```
shopify theme list
shopify theme publish --theme=<staging-theme-id>
```

**This immediately makes the theme live for all visitors — only run it when you're ready.** Alternatively, do this manually from **Online Store → Themes → Actions → Publish** in Admin, which gives you one more visual confirmation step before going live.

## Go-live checklist

- [ ] `shopify theme check` passes with 0 errors
- [ ] Products imported, images attached, collections created with correct handles
- [ ] Navigation menu set up
- [ ] Contact / Our Story / FAQ / Shipping & Returns pages created with matching templates
- [ ] Legal policy pages reviewed (`SETUP.md` §7)
- [ ] Razorpay connected and test order completed (`RAZORPAY_SETUP.md`)
- [ ] Reviewed the full storefront on desktop + mobile in the theme preview URL
- [ ] Logo/favicon uploaded (or knowingly shipping with the text wordmark)
- [ ] Theme published
