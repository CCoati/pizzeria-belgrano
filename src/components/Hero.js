import businessData from '../data/business.json';
import { checkBusinessStatus } from '../utils/schedule.js';

export function createHero(options = {}) {
  const { onMenuClick } = options;
  const section = document.createElement('section');
  section.className = 'hero-section';
  section.id = 'hero-section';

  const status = checkBusinessStatus();

  section.innerHTML = `
    <!-- Fondo fotográfico de horno a leña con overlay y luz cálida -->
    <div class="hero-bg-wrapper" aria-hidden="true">
      <img 
        src="/images/hero_pizza.jpg" 
        alt="Horno artesanal de Pizzería Belgrano" 
        class="hero-bg-img"
        loading="eager"
      />
      <div class="hero-overlay"></div>
      <div class="hero-warm-glow"></div>
    </div>

    <div class="container hero-container">
      <div class="hero-horizontal-layout">
        <!-- Columna Izquierda: Información de Barrio, Título y Acciones -->
        <div class="hero-info-col">
          <div class="hero-eyebrow-row">
            <span class="hero-status-tag ${status.isOpen ? 'is-open' : 'is-closed'}">
              <span class="status-pulse-dot"></span>
              <span>${status.isOpen ? 'Horno Encendido • ' + status.statusText : 'Atención desde 19:00 hs'}</span>
            </span>
            <span class="hero-badge-pill">
              <span class="badge-icon">🛵</span>
              <span>Delivery sin cargo</span>
            </span>
            <span class="hero-badge-pill hero-badge-address">
              <span class="badge-icon">📍</span>
              <span>La Blanqueada</span>
            </span>
          </div>

          <h1 class="hero-headline">
            Pizzetas al Horno &amp; Fainá Tradicional
          </h1>

          <p class="hero-description">
            Auténtica receta de barrio con masa crocante a la piedra, salsa casera de tomates seleccionados y abundante muzzarella fundida. Del horno directo a su mesa.
          </p>

          <!-- Píldoras de valor horizontales -->
          <div class="hero-pills-row">
            <div class="hero-pill-card" title="Servicio a domicilio y retiro en mostrador">
              <span class="pill-icon">🛵</span>
              <div class="pill-text-group">
                <span class="pill-label">Delivery &amp; Take Away</span>
                <span class="pill-sub">Sin costo de envío</span>
              </div>
            </div>

            <div class="hero-pill-card" title="Horarios de atención habituales">
              <span class="pill-icon">⏱️</span>
              <div class="pill-text-group">
                <span class="pill-label">Horario Nocturno</span>
                <span class="pill-sub">Dom-Jue 19-00h | Vie-Sáb 19-01h</span>
              </div>
            </div>

            <div class="hero-pill-card" title="Ubicación de nuestro local tradicional">
              <span class="pill-icon">📍</span>
              <div class="pill-text-group">
                <span class="pill-label">Belgrano 2881</span>
                <span class="pill-sub">esq. Centenario</span>
              </div>
            </div>
          </div>

          <!-- Botones de Acción Inmediata -->
          <div class="hero-actions-row">
            <button type="button" class="btn-hero-primary" id="hero-menu-cta" title="Ver menú completo y precios">
              <span>Ver la Carta &amp; Precios</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <a 
              href="https://wa.me/${businessData.whatsapp}?text=${encodeURIComponent('¡Hola Pizzería Belgrano! Me gustaría hacer un pedido.')}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-hero-secondary"
              id="hero-whatsapp-cta"
              title="Pedir directamente por WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </div>

        <!-- Columna Derecha: Tarjeta Emblema con Logo y Sellos de Tradición -->
        <div class="hero-badge-col">
          <div class="hero-artisan-card">
            <div class="hero-logo-box">
              <img 
                src="/images/logo.png" 
                alt="${businessData.name}" 
                class="hero-card-logo" 
                loading="eager"
              />
            </div>

            <div class="hero-card-tagline">
              <span class="quote-sign">“</span>${businessData.tagline}<span class="quote-sign">”</span>
            </div>

            <div class="hero-quality-stamps">
              <div class="quality-stamp">
                <span class="stamp-icon">🔥</span>
                <span>Horno a la Piedra</span>
              </div>
              <div class="quality-stamp">
                <span class="stamp-icon">🧀</span>
                <span>Muzzarella Premium</span>
              </div>
              <div class="quality-stamp">
                <span class="stamp-icon">🍕</span>
                <span>Tradición Belgrano</span>
              </div>
            </div>

            <div class="hero-card-bottom-pill">
              <span class="bottom-pill-dot"></span>
              <span>Tomando pedidos para esta noche</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Listener para el botón de ir al menú
  const menuBtn = section.querySelector('#hero-menu-cta');
  if (menuBtn && typeof onMenuClick === 'function') {
    menuBtn.addEventListener('click', onMenuClick);
  }

  return section;
}
