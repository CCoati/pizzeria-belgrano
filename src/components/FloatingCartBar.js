import { formatCurrency } from '../utils/formatters.js';
import { cartStore } from '../state/cartStore.js';

export function createFloatingCartBar({ onClick }) {
  const bar = document.createElement('aside');
  bar.className = 'floating-cart-bar';
  bar.id = 'floating-cart-bar';
  bar.setAttribute('aria-label', 'Barra flotante del carrito');

  bar.innerHTML = `
    <div class="floating-cart-info">
      <div class="floating-cart-icon-wrapper">
        🛒
        <span class="floating-cart-count" id="floating-cart-count">0</span>
      </div>
      <div>
        <div class="floating-cart-text-total">Total del pedido</div>
        <div class="floating-cart-total-amount" id="floating-cart-total">$0</div>
      </div>
    </div>

    <button type="button" class="btn btn-primary floating-cart-btn" id="floating-cart-btn">
      <span>Ver pedido</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

  const countEl = bar.querySelector('#floating-cart-count');
  const totalEl = bar.querySelector('#floating-cart-total');
  const actionBtn = bar.querySelector('#floating-cart-btn');

  const handleClick = () => {
    if (onClick) onClick();
  };

  bar.addEventListener('click', handleClick);
  actionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleClick();
  });

  cartStore.subscribe(state => {
    countEl.textContent = state.itemCount;
    totalEl.textContent = formatCurrency(state.total);

    if (state.itemCount > 0) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  });

  return bar;
}
