import businessData from '../data/business.json';

export function createHero({ onMenuClick, onOrderClick }) {
  const section = document.createElement('section');
  section.className = 'hero-section';
  section.id = 'hero-section';

  section.innerHTML = `
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge-group">
          <span class="badge badge-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            Envíos sin cargo
          </span>
          <span class="badge badge-accent">
            🔥 Pizzetas artesanales
          </span>
        </div>

        <div class="hero-brand-wrap">
          <img src="/images/logo.png" alt="${businessData.name}" class="hero-logo-mobile" />
          <h1 class="hero-title">${businessData.name}</h1>
        </div>
        <p class="hero-tagline">“${businessData.tagline}”</p>
        
        <p class="hero-description">
          El auténtico sabor de la pizza de barrio hecha con pasión. Elegí tus gustos favoritos, armá tu pizzeta o disfrutá nuestras promociones familiares directamente en tu casa.
        </p>

        <div class="hero-buttons">
          <button type="button" class="btn btn-primary btn-large" id="hero-btn-order">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Hacer pedido
          </button>
          <button type="button" class="btn btn-outline btn-large" id="hero-btn-menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            Ver menú
          </button>
        </div>

        <!-- Tarjeta destacada de Información del Negocio -->
        <div class="business-info-card">
          <div class="info-item">
            <div class="info-icon">🛵</div>
            <div class="info-text">
              <strong>Envíos a Domicilio</strong>
              <span>Sin cargo en nuestra zona de reparto</span>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">🕒</div>
            <div class="info-text">
              <strong>Horarios de Atención</strong>
              <span>Dom a Jue: 19:00 – 00:00 hs<br>Vie y Sáb: 19:00 – 01:00 hs</span>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-media">
        <div class="hero-media-wrapper">
          <img 
            src="/images/hero_pizza.jpg" 
            alt="Pizza artesanal recién horneada Pizzería Belgrano" 
            class="hero-media-img"
            loading="eager"
          />
          <div class="hero-media-badge">
            <div>
              <div class="hero-badge-title">Directo del Horno de Barro</div>
              <div class="hero-badge-subtitle">Pizzetas crocantes y muzzarella al punto</div>
            </div>
            <span style="font-size: 1.6rem;">🍕</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  section.querySelector('#hero-btn-menu').addEventListener('click', () => {
    if (onMenuClick) onMenuClick();
  });

  section.querySelector('#hero-btn-order').addEventListener('click', () => {
    if (onOrderClick) onOrderClick();
  });

  return section;
}
