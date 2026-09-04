/* Filters the PDP media gallery so only the selected variant's own pack
   photo + back label show (e.g. picking 50g hides every 100g slide and
   thumbnail, and vice versa). Media is tagged with data-media-weight
   ("50g"/"100g") by product-media-gallery.liquid based on the filename;
   untagged media (single-variant products like the sampler bundles)
   is left alone entirely. */
(function () {
  function filterGallery(gallery, weight) {
    // Only ever filter on an exact "50g"/"100g" variant title - a bundle
    // product like "200g Pack (4x50g)" isn't what this is for, and must
    // be left with every image visible.
    if (weight !== '50g' && weight !== '100g') return;

    const items = gallery.querySelectorAll('[data-media-weight]');
    if (items.length === 0) return;

    items.forEach((item) => {
      item.classList.toggle('hidden', item.dataset.mediaWeight !== weight);
    });
  }

  document.querySelectorAll('media-gallery[data-initial-media-weight]').forEach((gallery) => {
    filterGallery(gallery, gallery.dataset.initialMediaWeight);
  });

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
      const variant = event?.data?.variant;
      const sectionId = event?.data?.sectionId;
      if (!variant || !variant.title || !sectionId) return;

      const gallery = document.querySelector(`media-gallery[data-section-id="${sectionId}"]`);
      if (gallery) filterGallery(gallery, variant.title);
    });
  }
})();
