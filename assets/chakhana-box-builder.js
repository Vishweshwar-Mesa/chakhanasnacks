if (!customElements.get('box-builder')) {
  customElements.define(
    'box-builder',
    class BoxBuilder extends HTMLElement {
      constructor() {
        super();
        this.selections = new Map(); // variantId -> { qty, price }
        this.tier2Qty = parseInt(this.dataset.tier2Qty, 10);
        this.tier2Pct = parseInt(this.dataset.tier2Pct, 10);
        this.tier4Qty = parseInt(this.dataset.tier4Qty, 10);
        this.tier4Pct = parseInt(this.dataset.tier4Pct, 10);

        this.tierMessageEl = this.querySelector('[data-tier-message]');
        this.totalPriceEl = this.querySelector('[data-total-price]');
        this.addButton = this.querySelector('[data-add-to-cart]');

        this.addEventListener('click', this.onClick.bind(this));
      }

      onClick(event) {
        const incrementBtn = event.target.closest('[data-increment]');
        const decrementBtn = event.target.closest('[data-decrement]');
        const addBtn = event.target.closest('[data-add-to-cart]');

        if (incrementBtn) this.changeQty(incrementBtn.closest('[data-variant-row]'), 1);
        else if (decrementBtn) this.changeQty(decrementBtn.closest('[data-variant-row]'), -1);
        else if (addBtn) this.addToCart();
      }

      changeQty(row, delta) {
        const variantId = row.dataset.variantId;
        const price = parseInt(row.dataset.variantPrice, 10);
        const current = this.selections.get(variantId)?.qty || 0;
        const next = Math.max(0, current + delta);

        if (next === 0) this.selections.delete(variantId);
        else this.selections.set(variantId, { qty: next, price });

        row.querySelector('[data-qty]').textContent = next;
        row.querySelector('[data-decrement]').disabled = next === 0;

        this.updateSummary();
      }

      totalQuantity() {
        let total = 0;
        this.selections.forEach((v) => (total += v.qty));
        return total;
      }

      rawTotalPrice() {
        let total = 0;
        this.selections.forEach((v) => (total += v.qty * v.price));
        return total;
      }

      estimatedDiscountPercent(totalQty) {
        if (totalQty >= this.tier4Qty) return this.tier4Pct;
        if (totalQty >= this.tier2Qty) return this.tier2Pct;
        return 0;
      }

      updateSummary() {
        const totalQty = this.totalQuantity();
        const rawTotal = this.rawTotalPrice();
        const pct = this.estimatedDiscountPercent(totalQty);
        const estimatedTotal = Math.round(rawTotal * (1 - pct / 100));

        this.totalPriceEl.textContent = this.formatMoney(estimatedTotal);
        this.addButton.disabled = totalQty === 0;

        if (totalQty === 0) {
          this.tierMessageEl.textContent = `Pick ${this.tier2Qty} pouches for ${this.tier2Pct}% off, or ${this.tier4Qty} for ${this.tier4Pct}% off`;
        } else if (totalQty < this.tier2Qty) {
          const remaining = this.tier2Qty - totalQty;
          this.tierMessageEl.textContent = `Add ${remaining} more for ${this.tier2Pct}% off`;
        } else if (totalQty < this.tier4Qty) {
          const remaining = this.tier4Qty - totalQty;
          this.tierMessageEl.textContent = `🎉 ${this.tier2Pct}% off unlocked — add ${remaining} more for ${this.tier4Pct}% off`;
        } else {
          this.tierMessageEl.textContent = `🎉 ${this.tier4Pct}% off unlocked!`;
        }
      }

      formatMoney(cents) {
        return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: window.Shopify?.currency?.active || 'INR', minimumFractionDigits: 2 });
      }

      addToCart() {
        if (this.selections.size === 0) return;

        this.addButton.setAttribute('aria-disabled', 'true');
        this.addButton.classList.add('loading');

        const items = Array.from(this.selections.entries()).map(([id, v]) => ({
          id: parseInt(id, 10),
          quantity: v.qty,
        }));

        const cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
        const sections = cart?.getSectionsToRender ? cart.getSectionsToRender().map((s) => s.id) : [];

        fetch(window.routes.cart_add_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/javascript' },
          body: JSON.stringify({
            items,
            sections,
            sections_url: window.location.pathname,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
                publish(PUB_SUB_EVENTS.cartError, {
                  source: 'box-builder',
                  errors: response.errors || response.description,
                  message: response.message,
                });
              }
              this.tierMessageEl.textContent = response.description || response.message || 'Something went wrong — please try again.';
              return;
            }

            if (cart && typeof cart.renderContents === 'function') {
              cart.renderContents(response);
            }

            if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
              publish(PUB_SUB_EVENTS.cartUpdate, { source: 'box-builder', cartData: response });
            }

            this.resetSelections();
          })
          .catch((e) => {
            console.error(e);
            this.tierMessageEl.textContent = 'Network error — please try again.';
          })
          .finally(() => {
            this.addButton.removeAttribute('aria-disabled');
            this.addButton.classList.remove('loading');
          });
      }

      resetSelections() {
        this.selections.clear();
        this.querySelectorAll('[data-variant-row]').forEach((row) => {
          row.querySelector('[data-qty]').textContent = '0';
          row.querySelector('[data-decrement]').disabled = true;
        });
        this.updateSummary();
      }

      connectedCallback() {
        this.querySelectorAll('[data-decrement]').forEach((btn) => (btn.disabled = true));
        this.updateSummary();
      }
    }
  );
}
