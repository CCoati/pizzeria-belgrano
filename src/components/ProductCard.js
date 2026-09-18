import { formatCurrency } from '../utils/formatters.js';

export function createProductCard(product, { onSelect }) {
  const card = document.createElement('article');
  card.className = `product-card ${product.featured ? 'product-card-featured' : ''}`;
  card.id = `product-${product.id}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${product.name}, ${formatCurrency(product.price)}`);

  const isCustomBuilder = product.isCustomBuilder;
  const isPromoBelgrano = product.id === 'promo-belgrano-especial';

  let badgeHtml = '';
  if (product.badge) {
    const badgeClass = isPromoBelgrano ? 'badge-accent' : (product.featured ? 'badge-primary' : 'badge-secondary');
    badgeHtml = `<span class="badge ${badgeClass} product-card-badge">${product.badge}</span>`;
  }

  let itemsHtml = '';
  if (product.items && product.items.length > 0) {
    itemsHtml = `
      <ul class="product-card-items-list">
        ${product.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }

  const priceText = isCustomBuilder ? `${formatCurrency(product.price)}` : formatCurrency(product.price);
  const priceUnit = isCustomBuilder ? '<span class="product-card-price-unit">/ por gusto</span>' : '';
  const actionText = isCustomBuilder ? 'Armar 🛠️' : 'Agregar +';

  card.innerHTML = `
    <div class="product-card-media">
      ${badgeHtml}
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="product-card-img" 
        loading="lazy" 
        onerror="this.src='/images/pizza_muzzarella.jpg'"
      />
    </div>

    <div class="product-card-body">
      <div class="product-card-info">
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        ${itemsHtml}
      </div>

      <div class="product-card-footer">
        <div class="product-card-price-box">
          <span class="product-card-price">${priceText}</span>${priceUnit}
        </div>
        <button type="button" class="product-card-add-btn" aria-label="Seleccionar ${product.name}">
          ${actionText}
        </button>
      </div>
    </div>
  `;

  const handleClick = (e) => {
    e.preventDefault();
    if (onSelect) onSelect(product);
  };

  card.addEventListener('click', handleClick);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  });

  return card;
}
