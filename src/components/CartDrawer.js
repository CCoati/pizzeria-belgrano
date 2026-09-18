import { formatCurrency } from '../utils/formatters.js';
import { cartStore } from '../state/cartStore.js';

export function createCartDrawer({ onCheckout }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'cart-drawer-backdrop';
  backdrop.id = 'cart-drawer-backdrop';

  backdrop.innerHTML = `
    <div class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div class="cart-drawer-header">
        <div class="cart-drawer-title-group">
          <h2 class="cart-drawer-title" id="cart-title">Tu Pedido</h2>
          <span class="cart-drawer-count" id="cart-drawer-items-count">0 items</span>
        </div>
        <button type="button" class="cart-drawer-close" id="cart-drawer-close-btn" aria-label="Cerrar pedido">✕</button>
      </div>

      <div class="cart-drawer-body" id="cart-items-container">
        <!-- Renderizado dinámico de items -->
      </div>

      <div class="cart-drawer-footer" id="cart-drawer-footer">
        <div class="cart-summary-row">
          <span>Subtotal</span>
          <span id="cart-subtotal-val">$0</span>
        </div>
        <div class="cart-summary-row">
          <span>Costo de envío</span>
          <span style="color: var(--color-secondary); font-weight: 700;">A coordinar según zona</span>
        </div>
        <div class="cart-summary-row total-row">
          <span>TOTAL</span>
          <span class="cart-total-price" id="cart-total-val">$0</span>
        </div>

        <button type="button" class="btn btn-primary cart-checkout-btn" id="cart-checkout-trigger">
          <span>Continuar al Checkout</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `;

  const drawer = backdrop.querySelector('.cart-drawer');
  const closeBtn = backdrop.querySelector('#cart-drawer-close-btn');
  const itemsContainer = backdrop.querySelector('#cart-items-container');
  const itemsCountBadge = backdrop.querySelector('#cart-drawer-items-count');
  const subtotalEl = backdrop.querySelector('#cart-subtotal-val');
  const totalEl = backdrop.querySelector('#cart-total-val');
  const checkoutTrigger = backdrop.querySelector('#cart-checkout-trigger');

  const closeDrawer = () => {
    backdrop.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    backdrop.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  closeBtn.addEventListener('click', closeDrawer);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeDrawer();
    }
  });

  checkoutTrigger.addEventListener('click', () => {
    const state = cartStore.getState();
    if (state.items.length === 0) return;
    closeDrawer();
    if (onCheckout) onCheckout();
  });

  // Renderizar items del carrito
  const renderItems = (state) => {
    itemsCountBadge.textContent = `${state.itemCount} ${state.itemCount === 1 ? 'producto' : 'productos'}`;
    subtotalEl.textContent = formatCurrency(state.subtotal);
    totalEl.textContent = formatCurrency(state.total);

    if (state.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart-view">
          <div class="empty-cart-icon">🛒</div>
          <h3 class="empty-cart-title">Tu carrito está vacío</h3>
          <p class="empty-cart-desc">Navegá por nuestro menú y elegí tus pizzas favoritas recién horneadas.</p>
          <button type="button" class="btn btn-outline" id="empty-cart-browse-btn">Explorar Menú</button>
        </div>
      `;
      itemsContainer.querySelector('#empty-cart-browse-btn')?.addEventListener('click', () => {
        closeDrawer();
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      });
      checkoutTrigger.disabled = true;
      checkoutTrigger.style.opacity = '0.5';
      checkoutTrigger.style.cursor = 'not-allowed';
      return;
    }

    checkoutTrigger.disabled = false;
    checkoutTrigger.style.opacity = '1';
    checkoutTrigger.style.cursor = 'pointer';

    itemsContainer.innerHTML = '';

    state.items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'cart-item-card';

      let detailsHtml = '';
      if (item.selectedGustos && item.selectedGustos.length > 0) {
        detailsHtml += `<div class="cart-item-details cart-item-details-gustos">Gustos: ${item.selectedGustos.join(', ')}</div>`;
      }
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        const addonsText = item.selectedAddons.map(a => `${a.name} (+${formatCurrency(a.price)})`).join(', ');
        detailsHtml += `<div class="cart-item-details">Adicionales: ${addonsText}</div>`;
      }
      if (item.selectedRemovals && item.selectedRemovals.length > 0) {
        detailsHtml += `<div class="cart-item-details">Preferencias: ${item.selectedRemovals.join(', ')}</div>`;
      }
      if (item.observation) {
        detailsHtml += `<div class="cart-item-details cart-item-details-obs">Obs: "${item.observation}"</div>`;
      }

      itemCard.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='/images/pizza_muzzarella.jpg'" />
        <div class="cart-item-info">
          <div class="cart-item-top">
            <h4 class="cart-item-title">${item.name}</h4>
            <button type="button" class="cart-item-remove-btn" title="Eliminar producto" data-id="${item.id}">✕</button>
          </div>
          ${detailsHtml}
          <div class="cart-item-bottom">
            <div class="cart-item-subtotal-group">
              <span class="cart-item-unit-price">${formatCurrency(item.unitPrice)} c/u</span>
              <span class="cart-item-subtotal">${formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
            <div class="cart-item-stepper">
              <button type="button" class="cart-stepper-btn qty-minus" data-id="${item.id}">−</button>
              <span class="cart-stepper-qty">${item.quantity}</span>
              <button type="button" class="cart-stepper-btn qty-plus" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;

      // Handlers de botones del item
      itemCard.querySelector('.cart-item-remove-btn').addEventListener('click', () => {
        cartStore.removeItem(item.id);
      });

      itemCard.querySelector('.qty-minus').addEventListener('click', () => {
        cartStore.updateQuantity(item.id, item.quantity - 1);
      });

      itemCard.querySelector('.qty-plus').addEventListener('click', () => {
        cartStore.updateQuantity(item.id, item.quantity + 1);
      });

      itemsContainer.appendChild(itemCard);
    });
  };

  cartStore.subscribe(renderItems);

  return {
    element: backdrop,
    open: openDrawer,
    close: closeDrawer
  };
}
