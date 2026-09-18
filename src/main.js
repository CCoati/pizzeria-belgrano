import './styles/variables.css';
import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/menu.css';
import './styles/modal.css';
import './styles/cart.css';
import './styles/checkout.css';
import './styles/footer.css';

import productsData from './data/products.json';
import { normalizeText } from './utils/formatters.js';

import { createHeader } from './components/Header.js';
import { createHero } from './components/Hero.js';
import { createSearchAndFilters } from './components/SearchAndFilters.js';
import { createProductCard } from './components/ProductCard.js';
import { createProductModal } from './components/ProductModal.js';
import { createBuildYourOwnModal } from './components/BuildYourOwnModal.js';
import { createCartDrawer } from './components/CartDrawer.js';
import { createFloatingCartBar } from './components/FloatingCartBar.js';
import { createCheckoutModal } from './components/CheckoutModal.js';
import { createFooter } from './components/Footer.js';

const app = document.getElementById('app');

// Instanciar Modales y Drawers
const productModal = createProductModal();
const buildYourOwnModal = createBuildYourOwnModal();
const checkoutModal = createCheckoutModal();

const cartDrawer = createCartDrawer({
  onCheckout: () => {
    checkoutModal.open();
  }
});

const floatingCartBar = createFloatingCartBar({
  onClick: () => {
    cartDrawer.open();
  }
});

// Callback para cuando se selecciona un producto
const handleSelectProduct = (product) => {
  if (product.isCustomBuilder) {
    buildYourOwnModal.open();
  } else {
    productModal.open(product);
  }
};

// Crear Header
const header = createHeader({
  onCartClick: () => {
    cartDrawer.open();
  }
});

// Scroll al menú
const scrollToMenu = () => {
  const menuEl = document.getElementById('menu-section');
  if (menuEl) {
    menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Crear Hero
const hero = createHero({
  onMenuClick: scrollToMenu,
  onOrderClick: scrollToMenu
});

// Crear Contenedor del Menú
const menuSection = document.createElement('section');
menuSection.className = 'menu-section';
menuSection.id = 'menu-section';

const menuContainer = document.createElement('div');
menuContainer.className = 'container';

const productsContentArea = document.createElement('div');
productsContentArea.id = 'products-content-area';

// Renderizado del Menú (filtrado y agrupado por categorías)
let currentFilter = 'all';
let currentQuery = '';

const renderMenu = () => {
  productsContentArea.innerHTML = '';
  const queryNormalized = normalizeText(currentQuery);

  let filteredProducts = productsData.products.filter(p => {
    // Filtro por categoría
    if (currentFilter !== 'all' && p.category !== currentFilter) {
      return false;
    }

    // Filtro por texto
    if (queryNormalized) {
      const matchName = normalizeText(p.name).includes(queryNormalized);
      const matchDesc = normalizeText(p.description).includes(queryNormalized);
      const matchCat = normalizeText(p.categoryName).includes(queryNormalized);
      const matchItems = p.items ? p.items.some(i => normalizeText(i).includes(queryNormalized)) : false;
      return matchName || matchDesc || matchCat || matchItems;
    }

    return true;
  });

  if (filteredProducts.length === 0) {
    productsContentArea.innerHTML = `
      <div class="empty-search-state">
        <div class="empty-search-icon">🔍</div>
        <h3 class="empty-search-title">No encontramos productos</h3>
        <p class="empty-search-text">No hay coincidencias para "<strong>${currentQuery}</strong>". Probá buscando "muzzarella", "combos" o "gustos".</p>
      </div>
    `;
    return;
  }

  // Agrupar por categoría en el orden oficial
  productsData.categories.forEach(cat => {
    const categoryProducts = filteredProducts.filter(p => p.category === cat.id);
    if (categoryProducts.length === 0) return;

    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';
    groupEl.id = `cat-${cat.id}`;

    groupEl.innerHTML = `
      <div class="category-header">
        <h2 class="category-title">
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
        </h2>
        <span class="category-count">${categoryProducts.length} ${categoryProducts.length === 1 ? 'opción' : 'opciones'}</span>
      </div>
    `;

    const gridEl = document.createElement('div');
    gridEl.className = 'products-grid';

    categoryProducts.forEach(prod => {
      const card = createProductCard(prod, {
        onSelect: handleSelectProduct
      });
      gridEl.appendChild(card);
    });

    groupEl.appendChild(gridEl);
    productsContentArea.appendChild(groupEl);
  });
};

// Crear Barra de Búsqueda y Filtros
const searchAndFilters = createSearchAndFilters({
  onSearch: (query, catId) => {
    currentQuery = query;
    currentFilter = catId;
    renderMenu();
  },
  onSelectCategory: (catId, query) => {
    currentFilter = catId;
    currentQuery = query;
    renderMenu();

    if (catId !== 'all') {
      const targetSection = document.getElementById(`cat-${catId}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});

menuContainer.appendChild(searchAndFilters.element);
menuContainer.appendChild(productsContentArea);
menuSection.appendChild(menuContainer);

// Crear Footer
const footer = createFooter({
  onOrderClick: scrollToMenu
});

// Montar todo en la aplicación
app.appendChild(header);
app.appendChild(hero);
app.appendChild(menuSection);
app.appendChild(footer);

// Montar elementos flotantes y modales
document.body.appendChild(productModal.element);
document.body.appendChild(buildYourOwnModal.element);
document.body.appendChild(cartDrawer.element);
document.body.appendChild(floatingCartBar);
document.body.appendChild(checkoutModal.element);

// Render inicial del catálogo
renderMenu();
