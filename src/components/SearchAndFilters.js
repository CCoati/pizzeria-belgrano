import productsData from '../data/products.json';

export function createSearchAndFilters({ onSearch, onSelectCategory }) {
  const container = document.createElement('div');
  container.className = 'search-and-filters-area';

  let activeCategory = 'all';

  container.innerHTML = `
    <div class="search-container">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="search" 
          class="search-input" 
          id="product-search-input" 
          placeholder="Buscar muzzarella, fainá, combos, gustos..." 
          aria-label="Buscar productos del menú"
          autocomplete="off"
        />
        <button type="button" class="search-clear-btn" id="search-clear-btn" style="display: none;" title="Borrar búsqueda">
          ✕
        </button>
      </div>
    </div>

    <nav class="categories-nav-wrapper" aria-label="Categorías del menú">
      <div class="container">
        <div class="categories-scroll" id="categories-scroll">
          <button type="button" class="category-tab-btn active" data-category="all">
            <span>✨</span>
            <span>Todo el Menú</span>
          </button>
          ${productsData.categories.map(cat => `
            <button type="button" class="category-tab-btn" data-category="${cat.id}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </nav>
  `;

  const searchInput = container.querySelector('#product-search-input');
  const clearBtn = container.querySelector('#search-clear-btn');
  const categoryButtons = container.querySelectorAll('.category-tab-btn');

  // Buscador
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    clearBtn.style.display = query ? 'flex' : 'none';
    if (onSearch) onSearch(query, activeCategory);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    if (onSearch) onSearch('', activeCategory);
  });

  // Categorías
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;

      // Desplazamiento horizontal para centrar el botón en móviles
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      if (onSelectCategory) {
        onSelectCategory(activeCategory, searchInput.value);
      }
    });
  });

  return {
    element: container,
    setActiveCategory: (catId) => {
      categoryButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.category === catId);
      });
      activeCategory = catId;
    },
    focusSearch: () => {
      searchInput.focus();
    }
  };
}
