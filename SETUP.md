# Chakhana Shopify — Setup Handoff

Everything below is a **manual step you do in your Shopify Admin** (chakhanasnacks.myshopify.com/admin). None of it can be done from theme code — it's store content/config, not theme files.

Related docs: `docs/IMPLEMENTATION_PLAN.md` (architecture), `docs/DESIGN_SYSTEM.md` (tokens/motion), `SHOPIFY_SETUP.md` (CLI/deployment), `RAZORPAY_SETUP.md` (payments — steps 6 below now points here).

## 1. Upload product images
Go to **Content → Files → Upload files** and upload all 14 images from `assets/product-images/` in this project. Upload them with their existing filenames unchanged — the theme's homepage banners already reference some of these exact filenames (e.g. `shopify://shop_images/100g-makhana-4-pack.jpg`), so they'll resolve automatically once uploaded.

## 2. Import products
Go to **Products → Import**, upload `chakhana-products-import.csv` (in the project root). This creates 8 products / 14 variants (6 flavour products × 2 weights, plus 2 sampler packs), all as **drafts**.

Before switching them to Active, please check:
- **Sampler pack prices (₹299 / ₹499) are placeholders** — I computed them as a rough bundle discount off the individual flavour prices since the pitch deck didn't specify sampler pricing. Confirm or change these.
- **Inventory qty is set to 25 for every variant** as a placeholder — update to real stock counts.
- Then attach the right image to each product (Products → [product] → Media → Add from URL/Files). Filenames match product names 1:1 (e.g. `masala-makhana-50g.jpg` → Masala Makhana, 50g variant).

## 3. Create 3 collections
Go to **Products → Collections → Create collection**, one each for:
- **Makhana Chips** — handle must be `makhana-chips` — automated condition: Product type is "Makhana Chips"
- **Ragi Chips** — handle must be `ragi-chips` — condition: Product type is "Ragi Chips"
- **Sampler Packs** — handle must be `sampler-packs` — condition: Product type is "Sampler Pack"

The handles matter — the homepage and navigation link directly to `/collections/makhana-chips` etc.

## 4. Set up navigation
Go to **Content → Menus → Main menu**, add: Home, Makhana Chips (→ that collection), Ragi Chips, Sampler Packs, About, Contact.

## 5. Create pages
Go to **Content → Pages → Add page** for each of these. The theme templates already ship with real content built in (no copy-pasting needed) — you just create the page and pick the matching **Theme template** from the dropdown:

- **Contact** — handle `contact`, Theme template → `page.contact` (contact form).
- **Our Story** — handle `our-story`, Theme template → `page.our-story` (full brand-story page — copy already built in).
- **FAQ** — handle `faq`, Theme template → `page.faq` (accordion with 6 starter Q&As already written — edit any of them from the theme editor).
- **Shipping & Returns** — handle `shipping-returns`, Theme template → `page.shipping-returns`.

(The old "About" page from the previous handoff is superseded by **Our Story** above, which has richer built-in content — if you already created an About page, you can delete it or leave it and just link to Our Story instead.)

## 6. Connect Razorpay
Full step-by-step guide, including the correct current Shopify-supported integration path and a test-order checklist, is in **`RAZORPAY_SETUP.md`** at the project root. Short version: **Settings → Payments → Third-party providers → Razorpay**. This is a live-payments/financial-account step — you should do this yourself directly in Admin; see that doc for everything else, including what you need to verify yourself (KYC status, plan/region availability).

## 7. Legal policy pages
**Settings → Policies** — Shopify can auto-generate template Refund/Privacy/Terms/Shipping policy text you then edit. Given this is a food product, pay particular attention to the refund policy language around opened packs (draft note is already in the theme's product "Shipping & returns" tab).

## 8. Logo & favicon
No final logo file existed in your materials yet (your pitch deck's readiness checklist also flagged "Logo final?" as pending). The header currently displays "CHAKHANA" as styled text in your brand font (Poppins ExtraBold) rather than an image, so the site works without one. Once you have a finalized logo:
- Upload it at **Online Store → Themes → Customize → Theme settings → Logo**
- Upload a square version as favicon in the same panel

## 9. Nutrition & ingredients metafields (optional, but recommended)
The PDP has a "Nutrition & ingredients" accordion tab that only appears once you fill in real data — nothing is guessed or hardcoded, on purpose (no health claims are invented anywhere in this theme).
1. Go to **Settings → Custom data → Products → Add definition**.
2. Create a definition named **Ingredients** with namespace/key `custom.ingredients` (type: Single line text).
3. Create a second definition named **Nutrition note** with namespace/key `custom.nutrition_note` (type: Multi-line text).
4. On each product, scroll to the **Metafields** section and fill these in from your actual pack labeling. Leave blank for any product where you don't have verified data yet — the tab simply won't render until you do.

## 10. Cart drawer: free shipping bar & recommendations
Both are on by default and configurable without touching code:
- **Free shipping bar**: theme editor → **Theme settings → Cart** → toggle on/off and set the ₹ threshold (defaults to ₹499).
- **Cart recommendations** ("You might also like"): reuses the existing **Theme settings → Cart → Cart drawer collection** setting — set it to any collection (e.g. Makhana Chips) and the cart drawer will suggest items from it that aren't already in the customer's cart.

## 11. UGC / Instagram section
The homepage "Snack of choice" section (`ugc-grid`) ships with editable image blocks — swap in real product/lifestyle photos anytime via the theme editor. It does **not** auto-pull live Instagram posts (that would require installing a separate Instagram feed app from the Shopify App Store and swapping this section's blocks for that app's embed — deliberately not done here to avoid faking a live integration). The section's Instagram handle field just renders as a link for now.

---

Once steps 1–6 are done, the site is ready to preview and go live. Steps 9–11 are polish/optional and can happen anytime after launch.
