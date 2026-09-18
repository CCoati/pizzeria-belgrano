import businessData from '../data/business.json';

export function createHero() {
  const section = document.createElement('section');
  section.className = 'hero-section';
  section.id = 'hero-section';

  section.innerHTML = `
    <div class="container">
      <div class="hero-center-content">
        <!-- Logo Principal Grande y Centrado -->
        <div class="hero-logo-container">
          <img 
            src="/images/logo.png" 
            alt="${businessData.name}" 
            class="hero-logo-img" 
            loading="eager"
          />
        </div>

        <p class="hero-tagline">“${businessData.tagline}”</p>

        <!-- Píldoras Informativas de Alto Impacto UX/UI -->
        <div class="hero-quick-pills">
          <div class="quick-pill" title="Servicio de delivery disponible">
            <span class="quick-pill-icon">🛵</span>
            <span>Delivery & Take Away</span>
          </div>

          <div class="quick-pill highlight" title="Horario habitual de 19:00 a 00:00 / 01:00 hs">
            <span class="quick-pill-dot"></span>
            <span>Atención desde 19:00 hs</span>
          </div>

          <div class="quick-pill" title="Dirección del local">
            <span class="quick-pill-icon">📍</span>
            <span>${businessData.address}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return section;
}
