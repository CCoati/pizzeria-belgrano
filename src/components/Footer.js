import businessData from '../data/business.json';
import { shareMenuWeb } from '../utils/share.js';

export function createFooter({ onOrderClick }) {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'contacto';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/images/logo.png" alt="Pizzería Belgrano" class="footer-logo" />
          <p class="footer-tagline">“${businessData.tagline}”</p>
          <p class="footer-desc">
            Pizzería artesanal tradicional con sabor de barrio. Horneamos cada pizzeta y fainá con ingredientes frescos y seleccionados para brindarte la mejor experiencia en cada bocado.
          </p>
          <div style="margin-top: 8px;">
            <span class="footer-badge-delivery">🛵 Envíos a Domicilio</span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Horarios de Atención</h4>
          <ul class="footer-list">
            <li class="footer-list-item">
              <span class="footer-icon">📅</span>
              <div>
                <strong>Domingo a Jueves:</strong><br>
                19:00 a 00:00 hs
              </div>
            </li>
            <li class="footer-list-item">
              <span class="footer-icon">🍕</span>
              <div>
                <strong>Viernes y Sábados:</strong><br>
                19:00 a 01:00 hs
              </div>
            </li>
          </ul>
        </div>

        <div class="footer-col footer-cta-col">
          <h4 class="footer-heading">Contacto & Pedidos</h4>
          <ul class="footer-list">
            <li class="footer-list-item">
              <span class="footer-icon">📍</span>
              <div>${businessData.address}</div>
            </li>
            <li class="footer-list-item">
              <span class="footer-icon">📞</span>
              <div>Tel: ${businessData.phone} / Cel: ${businessData.mobile}</div>
            </li>
            <li class="footer-list-item">
              <span class="footer-icon">💬</span>
              <div>WhatsApp: +598 2481 3859</div>
            </li>
          </ul>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            <button type="button" class="btn btn-primary" id="footer-order-btn">
              Hacer pedido ahora
            </button>
            <button type="button" class="btn btn-whatsapp" id="footer-share-btn">
              <span>📲 Compartir Menú por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© ${new Date().getFullYear()} Pizzería Belgrano — Todos los derechos reservados.</div>
        <div>Hecho con ❤️ para los amantes de la buena pizza.</div>
      </div>
    </div>
  `;

  footer.querySelector('#footer-order-btn').addEventListener('click', () => {
    if (onOrderClick) onOrderClick();
  });

  footer.querySelector('#footer-share-btn').addEventListener('click', shareMenuWeb);

  return footer;
}
