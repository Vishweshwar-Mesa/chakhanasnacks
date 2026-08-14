/* GSAP setup. Loads gsap.min.js + ScrollTrigger.min.js (vendored from the
   npm gsap package into assets/, since this theme has no bundler) and
   registers ScrollTrigger once, globally.

   window.chkGSAP(callback, scope) is the vanilla equivalent of @gsap/react's
   useGSAP hook: it runs `callback` inside a gsap.context() scoped to `scope`
   (selectors/targets inside the callback resolve within that scope), passes
   in { reduceMotion } so every animation respects prefers-reduced-motion
   without re-checking it itself, and returns a revert() function to kill
   everything the callback created — call it from a `shopify:section:unload`
   listener if animating content the theme editor can add/remove live.

   No animations are wired up yet — this file only sets up the plumbing. */

(function () {
  if (typeof window.gsap === 'undefined') {
    console.error('[chakhana-gsap] gsap.min.js did not load.');
    return;
  }

  if (typeof window.ScrollTrigger === 'undefined') {
    console.error('[chakhana-gsap] ScrollTrigger.min.js did not load.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  window.chkGSAP = function chkGSAP(callback, scope) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => callback({ reduceMotion }), scope);
    return function revert() {
      ctx.revert();
    };
  };

  console.log('[chakhana-gsap] ready — gsap ' + gsap.version + ', ScrollTrigger registered.');
})();
