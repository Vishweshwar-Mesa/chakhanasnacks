/**
 * Drives the active state for the flavour-universe section: highlights the
 * side nav dot and reveals the current panel's pack image as it scrolls
 * into view. Pure IntersectionObserver, no scroll-jacking.
 */
(function () {
  function init(root) {
    var panels = root.querySelectorAll('[data-flavour-panel]');
    var navItems = root.querySelectorAll('[data-flavour-nav-item]');
    if (!panels.length) return;

    function setActive(id) {
      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.id === id);
      });
      navItems.forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-target') === id);
      });
    }

    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var target = document.getElementById(item.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    if (!('IntersectionObserver' in window)) {
      if (panels[0]) setActive(panels[0].id);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );

    panels.forEach(function (panel) {
      observer.observe(panel);
    });
  }

  function initAll() {
    document.querySelectorAll('[data-flavour-universe]:not([data-chk-fu-ready])').forEach(function (root) {
      root.setAttribute('data-chk-fu-ready', 'true');
      init(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', initAll);
})();
