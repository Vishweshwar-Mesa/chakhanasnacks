/**
 * Mobile sticky add-to-cart bar. Never reimplements cart logic — it mirrors
 * the real buy-box submit button's price/availability state and, on click,
 * simply clicks that real button so the existing product-form/cart-drawer
 * flow (assets/product-form.js, assets/cart.js) handles everything.
 */
(function () {
  function sync(bar) {
    var sectionId = bar.getAttribute('data-section-id');
    var realButton = document.getElementById('ProductSubmitButton-' + sectionId);
    var realPrice = document.getElementById('price-' + sectionId);
    var priceSlot = bar.querySelector('[data-chk-sticky-atc-price]');
    var button = bar.querySelector('[data-chk-sticky-atc-button]');
    if (!realButton) return;

    if (realPrice && priceSlot) {
      priceSlot.innerHTML = realPrice.innerHTML;
    }
    button.disabled = realButton.disabled;
    button.textContent = realButton.textContent.trim();
  }

  function init(bar) {
    var sectionId = bar.getAttribute('data-section-id');
    var realButton = document.getElementById('ProductSubmitButton-' + sectionId);
    var button = bar.querySelector('[data-chk-sticky-atc-button]');
    if (!realButton || !button) return;

    sync(bar);
    bar.hidden = false;

    button.addEventListener('click', function () {
      realButton.click();
    });

    // Re-sync after variant swaps (product-info.js dispatches this once the
    // section's fetched HTML — including the real price/submit button — lands).
    var productInfo = realButton.closest('product-info') || document.getElementById('MainProduct-' + sectionId);
    if (productInfo) {
      productInfo.addEventListener('product-info:loaded', function () {
        sync(bar);
      });
    }

    if (!(('IntersectionObserver' in window))) return;

    // Hide the bar while the real buy box is on-screen, show once it scrolls away.
    var buyBox = document.querySelector('#ProductSubmitButton-' + sectionId)?.closest('.product__info-wrapper, .product__column-sticky, .product-form');
    if (!buyBox) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          bar.classList.toggle('chk-sticky-atc--visible', !entry.isIntersecting);
        });
      },
      { rootMargin: '0px' },
    );
    observer.observe(buyBox);
  }

  function initAll() {
    document.querySelectorAll('[data-chk-sticky-atc]:not([data-chk-ready])').forEach(function (bar) {
      bar.setAttribute('data-chk-ready', 'true');
      init(bar);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
