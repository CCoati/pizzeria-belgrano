import { checkBusinessStatus } from '../utils/schedule.js';
import { cartStore } from '../state/cartStore.js';

export function createHeader({ onCartClick }) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.id = 'site-header';

  const updateHeaderStatus = () => {
    const status = checkBusinessStatus();
    const statusEl = header.querySelector('.business-status-pill');
    if (statusEl) {
      statusEl.className = `business-status-pill ${status.badgeClass}`;
      statusEl.innerHTML = `
        <span class="status-indicator"></span>
        <span>${status.statusText}</span>
      `;
      statusEl.title = status.detailText;
    }
  };

  header.innerHTML = `
    <div class="container header-container">
      <a href="#" class="header-brand" title="Pizzería Belgrano - Inicio">
        <img src="/images/logo.png" alt="Pizzería Belgrano" class="header-logo-img" />
      </a>

      <div class="header-center">
        <div class="business-status-pill status-open" title="Horario de atención">
          <span class="status-indicator"></span>
          <span>Abierto ahora</span>
        </div>
        <div class="header-hours-info">
          <div><strong>Envíos sin cargo</strong></div>
          <span>Dom a Jue 19-00h | Vie y Sáb 19-01h</span>
        </div>
      </div>

      <div class="header-actions">
        <button type="button" class="cart-btn-header" id="header-cart-btn" aria-label="Ver carrito de compras">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-label">Pedido</span>
          <span class="cart-badge" id="header-cart-badge">0</span>
        </button>
      </div>
    </div>
  `;

  // Listener para abrir carrito
  header.querySelector('#header-cart-btn').addEventListener('click', onCartClick);

  // Suscribirse a cambios en el carrito
  cartStore.subscribe(state => {
    const badge = header.querySelector('#header-cart-badge');
    if (badge) {
      const oldCount = parseInt(badge.textContent, 10);
      badge.textContent = state.itemCount;
      if (oldCount !== state.itemCount) {
        badge.classList.remove('bump');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('bump');
      }
    }
  });

  // Chequeo inicial y periódico de horarios
  updateHeaderStatus();
  setInterval(updateHeaderStatus, 60000);

  return header;
}
