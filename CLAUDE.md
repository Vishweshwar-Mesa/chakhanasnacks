# Chakhana — working notes for Claude

This file is auto-loaded into context at the start of every session in this repo, regardless of which Claude account is used. It exists so context survives an account switch, a compacted conversation, or a totally new session. Read it first. Keep it short — put depth in the files it links to, not here.

## What this is

A custom Shopify Online Store 2.0 theme (Dawn 15.5.0 base) for Chakhana, a makhana (fox nut) chips D2C brand. Full architecture, product model, and build rationale: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md). Design tokens/motion: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Setup/deploy steps: [SETUP.md](SETUP.md), [SHOPIFY_SETUP.md](SHOPIFY_SETUP.md), [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md).

**Detailed, dated history of decisions and sessions lives in [docs/PROJECT_LOG.md](docs/PROJECT_LOG.md) — read that for "what happened recently and why."**

## Store facts that are easy to get wrong

- **Two different store identifiers exist.** `chakhanasnacks.myshopify.com` is the primary/connected domain (used in `shopify.theme.toml` for `theme push`/`theme dev`). `k33nfs-ew.myshopify.com` is the actual permanent store handle underneath — **Admin GraphQL calls via `shopify store execute` / `shopify store auth` must use `k33nfs-ew.myshopify.com`**, not chakhanasnacks, or auth fails with an OAuth callback mismatch.
- The Shopify CLI (`shopify store auth --store k33nfs-ew.myshopify.com --scopes <...>`) caches credentials locally per scope set. Different tasks need different scopes (`read_products,write_products` for catalog work; `read_locations,write_locations` for shipping/pickup settings). If a query 403s with `ACCESS_DENIED`, it's almost always a missing scope, not a broken auth — re-run `store auth` with the added scope.
- **GitHub remote (`origin`) is Shopify's native GitHub theme sync**, not a plain backup repo — it auto-commits "Update from Shopify" whenever the live theme is edited in admin. Local `main` and `origin/main` diverged and were reconciled on 2026-09-25 (see PROJECT_LOG); they can diverge again any time the live theme is edited in admin after a local commit. If `git status` shows diverged history again: diff `main` vs `origin/main` per-file before touching anything — so far every real conflict has turned out to be "local's later edit vs. the older pre-edit text still on origin," safe to resolve in favor of local, but verify that per file rather than assuming it always holds.
- No Shopify Admin API token/secret lives in this repo. CLI auth is interactive (opens a browser); it cannot be run unattended.
- **Working-tree-discarding git commands (`git checkout --ours`, `git reset --hard`, etc.) are blocked for Claude by the auto-mode "modify shared resources" classifier**, and its denial explicitly forbids reaching the same result via another tool (e.g. manually stripping conflict markers with Edit) or a later turn. When a merge needs resolving: diagnose every conflict fully, state the recommended resolution and why it's safe, then hand the user the exact commands to run themselves in their own terminal. Don't retry-loop the blocked command.

## Working agreements (from user feedback this session)

- Storefront copy should read as human-written, not AI-generated: avoid em dashes in visible copy (use periods, commas, or parentheses instead); this was a deliberate cleanup pass, keep new copy consistent with it.
- Auto mode's safety classifier blocks Claude from running `shopify store auth` (and reading its credential cache) unattended most of the time — it's inconsistent, not a fixed 100% block, but don't loop retrying it. The reliable path is asking the user to run CLI auth themselves in their own terminal and relay results, or pasting query output back for Claude to act on.
- Only commit when explicitly asked. Pushing to `origin` is fine once asked for, but always diff against `origin/main` first given the auto-sync behavior above.

## Keeping this current

**Mandatory: whichever Claude account is used to build/edit this codebase must update this file and/or docs/PROJECT_LOG.md on every code update — not optional, not just for "big" sessions.** After any change to the theme (a new section, a copy edit, a config change, a bug fix — any of it), append a dated entry to **[docs/PROJECT_LOG.md](docs/PROJECT_LOG.md)** (newest entry on top) before ending the session. If a fact belongs here instead (a durable rule, not a dated event), update this file directly. This is the entire mechanism by which context survives a switch between Claude accounts — skipping it defeats the point of these files existing. Commit both when the user asks for a commit — don't let them drift out of sync with the actual repo state.

A `Stop` hook in `.claude/settings.json` (tracked in git — see the `.gitignore` exception for it) reinforces this: it fires after each turn and shows a reminder whenever the working tree has real uncommitted changes outside `CLAUDE.md`/`PROJECT_LOG.md` themselves. Don't rely on it alone — it only nudges, it doesn't check whether the log entry is actually good or commit anything itself.
