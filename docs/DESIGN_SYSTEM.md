# Chakhana — Design System

Source of truth for tokens used by every new section/snippet/asset. All values are implemented as CSS custom properties in `assets/chakhana-base.css` (loaded globally) so Theme Editor color-scheme swaps still work — new components should reference `rgb(var(--color-*))` from Dawn's existing scheme system wherever the value is content-color, and the tokens below for spacing/motion/radii that Dawn doesn't already define.

## Colour

Derived directly from the packaging (verified against the pasted pack renders, not invented): each flavour's pack background is a real, distinct brand colour, already encoded as Dawn color schemes in `settings_data.json`. New sections reuse these — no new palette is introduced.

| Scheme | Hex (bg) | Flavour / use |
|---|---|---|
| scheme-1 | `#FBF4E7` cream | default page background |
| scheme-2 | `#F3E4C8` tan | secondary background |
| scheme-3 | `#132C86` navy | **Masala** |
| scheme-4 | `#F17706` orange | **Peri Peri** |
| scheme-5 | `#7C9A2E` olive green | **Cream & Onion** |
| scheme-6 | `#F2A93E` marigold | **Cheese & Herbs** |
| scheme-7 | `#FFFFFF` white | product cards |

Flavour → scheme map is the backbone of `flavour-universe.liquid`: as each flavour panel scrolls into view, the section's own background switches to that flavour's scheme.

## Typography

Headings: Poppins ExtraBold (`poppins_n8`, already set as `type_header_font`). Body: Inter (`inter_n4`). No new fonts are introduced — new sections reuse `var(--font-heading-family)` / `var(--font-body-family)` set globally in `layout/theme.liquid`. Display/hero type uses `clamp()` for fluid sizing instead of fixed breakpoint jumps, e.g. `font-size: clamp(2.75rem, 6vw + 1rem, 6.5rem)`.

## Spacing scale

8px base unit, exposed as tokens in `chakhana-base.css`:

```
--space-1: 0.4rem;   /* 4px  */
--space-2: 0.8rem;   /* 8px  */
--space-3: 1.6rem;   /* 16px */
--space-4: 2.4rem;   /* 24px */
--space-5: 4rem;     /* 40px */
--space-6: 6.4rem;   /* 64px */
--space-7: 9.6rem;   /* 96px */
--space-8: 14.4rem;  /* 144px, large section padding on desktop */
```

## Radii & shadows

Reuse Dawn's existing settings-driven values (`--product-card-corner-radius`, `buttons_radius: 999` = pill, `inputs_radius: 12`). New one-off token for large editorial image crops:

```
--radius-editorial: 2.4rem;
--shadow-pop: 0 12px 32px -8px rgba(var(--color-shadow), 0.28);
```

## Motion

```
--duration-instant: 100ms;
--duration-fast:    200ms;
--duration-base:    400ms;
--duration-slow:    700ms;
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back:  cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
```

Rules:
- Scroll reveals: `translateY(24px)` + `opacity:0` → resting state, `--duration-base` / `--ease-out-expo`, staggered 60–90ms per sibling via `nth-child` custom property, never re-triggering once revealed.
- Hover/press micro-interactions: `--duration-fast`, transform-only (no layout-triggering properties) for 60fps.
- Marquee: pure CSS `@keyframes translateX` loop, `animation-play-state: paused` under reduced-motion.
- **Everything above is wrapped in `@media (prefers-reduced-motion: no-preference)`** — under reduced-motion, all elements render in their resting/final state instantly, no transforms, no autoplay.

## Responsive rules

Breakpoints match Dawn's existing convention (`749px`, `989px`, `1400px`) plus explicit QA checkpoints at 320/360/390/430/768/1024/1280/1440/1920px. Mobile-first authoring: base styles target the smallest viewport, `min-width` media queries layer up. No hover-only interactive affordance — every hover state has a tap/focus equivalent.

## Components

- **Buttons**: pill (existing `buttons_radius: 999`), `--duration-fast` transform on active/hover, no new button component — reuse Dawn's `.button`/`.button--secondary`.
- **Cards**: 24px radius (existing), `--shadow-pop` on hover only, image scale `1.04` on hover (`--duration-base`).
- **Badges** (bestseller/spicy/new): pill, flavour-scheme colored, 1.1rem uppercase, letter-spacing `0.04em`.
