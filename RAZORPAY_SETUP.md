# Razorpay + Shopify — Setup Guide

Chakhana ships to customers in India, so we want Razorpay's UPI/cards/netbanking/wallet coverage available at checkout. **All of this happens in Shopify Admin and the Razorpay Dashboard — none of it is theme code, and none of it can be done for you automatically from this repo.** Nothing here involves editing the theme; the theme only ever hands off to Shopify's own checkout.

## Why this approach (and not a custom checkout)

- Shopify Payments is not available to India-based merchants, so a third-party payment provider is required.
- Razorpay is an **officially Shopify-listed third-party payment provider** — you connect it once in Payment settings and Shopify's native checkout does the rest (cart, tax, discounts, order creation, inventory all stay in Shopify).
- The theme never renders a card/UPI form itself. `templates/cart.json`'s checkout button and the cart drawer's checkout link both go straight to Shopify's hosted checkout (`{{ routes.cart_url }}` → `/checkout`), which is where Razorpay actually takes over.
- No Razorpay key, secret, or webhook URL ever needs to live in this repository. If you ever see one in a theme file, remove it — it doesn't belong there.

## Option A — Razorpay as a Third-Party Payment Provider (recommended default)

This is the standard integration and needs no app install.

1. **Create/verify your Razorpay account** at [dashboard.razorpay.com](https://dashboard.razorpay.com) if you haven't already, and complete KYC (business PAN, bank account, etc.) — Razorpay can't process live payments until KYC is approved.
2. In the Razorpay Dashboard, go to **Account & Settings → API Keys** and generate your **Live** Key ID and Key Secret. Keep the Key Secret private — you'll paste it once into Shopify's payment settings UI, never into a file.
3. In **Shopify Admin → Settings → Payments**, scroll to **Third-party providers**, click **Choose third-party provider**, and search for **Razorpay**.
4. Select Razorpay, paste in the Key ID / Key Secret from step 2, and **Activate**.
5. Shopify will show Razorpay as an active payment method on your checkout. Confirm it's listed above/alongside any other payment methods you have (e.g. Cash on Delivery, if you use Shopify's manual COD).
6. Under **Settings → Payments**, deactivate or reorder any placeholder/test payment methods you don't want live.

Once activated, customers see Razorpay's payment methods (UPI, cards, netbanking, wallets — whichever you've enabled on the Razorpay side) directly inside Shopify's checkout. No redirect to a separate Razorpay-branded page is required for this to work correctly.

## Option B — Razorpay Magic Checkout (optional upgrade, do this later if at all)

Magic Checkout is a separate Shopify App Store app from Razorpay that adds 1-click saved payment details, address auto-fill, and COD risk scoring on top of the same underlying Razorpay account. It's worth considering only after Option A is live and working — it's an enhancement, not a prerequisite.

1. Install **Razorpay Magic Checkout** from the [Shopify App Store](https://apps.shopify.com) (search "Razorpay").
2. Follow the in-app setup wizard — it will ask you to authorize against the same Razorpay account from Option A.
3. Review how Magic Checkout affects your checkout flow in Razorpay's own docs before enabling it live, since it changes more of the checkout UI than the basic third-party-provider integration. Shopify checkout still owns the order/cart/inventory either way.

## What you need to double check yourself (I cannot verify these)

- **Your exact Shopify plan** — third-party payment providers are available on all standard Shopify plans, but confirm your plan/region combination still allows it at the time you set this up, since Shopify's payment provider availability by plan/country can change.
- **Razorpay KYC approval status** — live payments won't process until Razorpay approves your account.
- **Which payment methods you enable inside Razorpay** (UPI / cards / netbanking / wallets / EMI) — configure these in the Razorpay Dashboard under Payment Methods; the theme has no control over this.
- **Webhook configuration**, if you use Razorpay for anything beyond what Shopify's checkout already handles (e.g. a separate reconciliation tool) — standard Shopify order webhooks already fire on order creation without any extra setup.

## Test order checklist (do this before going live)

1. In Shopify Admin, use **Settings → Payments → Manage → Deactivate live mode temporarily** or Razorpay's **Test Mode** API keys to place a test order without moving real money.
2. Add a product to cart on the storefront → checkout → pay with Razorpay's test UPI/card credentials (from Razorpay's test-mode docs).
3. Confirm the order appears in **Shopify Admin → Orders** with the correct line items, price, and "Paid" status.
4. Confirm inventory decremented correctly for the variant purchased.
5. Switch back to live Key ID/Secret, place one small real order yourself, and confirm funds settle to your Razorpay account per their settlement schedule before announcing launch.

## Go-live checklist

- [ ] Razorpay KYC approved, live API keys generated
- [ ] Third-party provider activated in Shopify Payments settings (Option A)
- [ ] Test order completed successfully in test mode
- [ ] One real, small live-mode order completed and confirmed in Shopify Admin
- [ ] Unwanted/placeholder payment methods removed from Shopify Payments settings
- [ ] (Optional) Magic Checkout reviewed and enabled, if wanted
