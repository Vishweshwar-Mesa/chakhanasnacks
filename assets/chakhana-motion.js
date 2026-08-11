/**
 * Shared scroll-reveal controller for `.chk-reveal` elements.
 * No animation library; a single IntersectionObserver drives every
 * reveal on the page. Respects prefers-reduced-motion by skipping
 * straight to the visible state. See docs/DESIGN_SYSTEM.md.
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll(elements) {
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function initReveal() {
    var elements = document.querySelectorAll('.chk-reveal:not([data-chk-observed]), [data-chk-reveal]:not([data-chk-observed])');
    if (!elements.length) return;

    elements.forEach(function (el, index) {
      el.setAttribute('data-chk-observed', 'true');
      if (!el.style.getPropertyValue('--chk-stagger')) {
        el.style.setProperty('--chk-stagger', String(index % 8));
      }
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealAll(elements);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  // New sections can be injected by the theme editor without a full reload;
  // re-scan on Shopify's section load/select events.
  document.addEventListener('shopify:section:load', initReveal);
  document.addEventListener('shopify:section:select', initReveal);

  // Cart icon bump on add-to-cart. `#cart-icon-bubble`'s innerHTML gets
  // replaced by cart.js on every update, but the anchor itself persists,
  // so the class survives; cart.js/pubsub.js define these as globals.
  if (!reduceMotion && typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, function () {
      var cartIcon = document.getElementById('cart-icon-bubble');
      if (!cartIcon) return;
      cartIcon.classList.remove('chk-bump');
      // Force reflow so re-adding the class restarts the animation.
      void cartIcon.offsetWidth;
      cartIcon.classList.add('chk-bump');
    });
  }

  // PDP: briefly highlight the price after a variant swap finishes
  // (product-info.js dispatches this once the fetched section HTML lands).
  if (!reduceMotion) {
    document.addEventListener('product-info:loaded', function (event) {
      var priceEl = event.target && event.target.querySelector && event.target.querySelector('[id^="price-"]');
      if (!priceEl) return;
      priceEl.classList.remove('chk-flash');
      void priceEl.offsetWidth;
      priceEl.classList.add('chk-flash');
    });
  }
})();
