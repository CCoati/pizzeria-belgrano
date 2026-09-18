import { formatCurrency } from '../utils/formatters.js';
import productsData from '../data/products.json';
import { cartStore } from '../state/cartStore.js';
import { showToast } from '../utils/toast.js';

export function createProductModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'product-modal-backdrop';

  let currentProduct = null;
  let quantity = 1;
  let selectedAddons = [];
  let selectedRemovals = [];

  backdrop.innerHTML = `
    <div class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
      <div class="modal-handle-bar">
        <div class="modal-drag-indicator"></div>
      </div>

      <div class="modal-header-hero">
        <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Cerrar modal">✕</button>
        <img src="" alt="" class="modal-hero-img" id="modal-hero-img" />
      </div>

      <div class="modal-body" id="modal-body">
        <div class="modal-product-header">
          <h2 class="modal-product-title" id="modal-product-title"></h2>
          <div class="modal-product-price" id="modal-product-base-price"></div>
          <p class="modal-product-desc" id="modal-product-desc"></p>
        </div>

        <!-- Sección de Adicionales -->
        <div class="modal-options-section" id="modal-addons-section">
          <div class="modal-section-title">
            <span>¿Deseas agregar un adicional?</span>
            <span class="badge badge-accent">Opcional</span>
          </div>
          <div class="options-list" id="modal-addons-list"></div>
        </div>

        <!-- Sección Quitar Ingredientes / Preferencias -->
        <div class="modal-options-section" id="modal-removals-section">
          <div class="modal-section-title">
            <span>Preferencias de preparación</span>
            <span class="badge badge-secondary">Opcional</span>
          </div>
          <div class="options-list" id="modal-removals-list"></div>
        </div>

        <!-- Observaciones -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>Observaciones para la cocina</span>
          </div>
          <textarea 
            class="observation-textarea" 
            id="modal-observation-input" 
            placeholder="Ej: bien caliente, salsa suave, tocar timbre fuerte..." 
            rows="2"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <div class="quantity-stepper">
          <button type="button" class="stepper-btn" id="modal-qty-minus" aria-label="Disminuir cantidad">−</button>
          <span class="stepper-value" id="modal-qty-value">1</span>
          <button type="button" class="stepper-btn" id="modal-qty-plus" aria-label="Aumentar cantidad">+</button>
        </div>

        <button type="button" class="btn btn-primary modal-add-btn" id="modal-submit-btn">
          Agregar al pedido — <span id="modal-total-btn-price">$0</span>
        </button>
      </div>
    </div>
  `;

  const closeBtn = backdrop.querySelector('#modal-close-btn');
  const titleEl = backdrop.querySelector('#modal-product-title');
  const basePriceEl = backdrop.querySelector('#modal-product-base-price');
  const descEl = backdrop.querySelector('#modal-product-desc');
  const imgEl = backdrop.querySelector('#modal-hero-img');
  const addonsListEl = backdrop.querySelector('#modal-addons-list');
  const removalsListEl = backdrop.querySelector('#modal-removals-list');
  const observationInput = backdrop.querySelector('#modal-observation-input');
  const qtyValueEl = backdrop.querySelector('#modal-qty-value');
  const qtyMinusBtn = backdrop.querySelector('#modal-qty-minus');
  const qtyPlusBtn = backdrop.querySelector('#modal-qty-plus');
  const submitBtn = backdrop.querySelector('#modal-submit-btn');
  const totalBtnPrice = backdrop.querySelector('#modal-total-btn-price');

  const calculateUnitTotal = () => {
    if (!currentProduct) return 0;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return currentProduct.price + addonsTotal;
  };

  const updateFooterPrice = () => {
    const unitPrice = calculateUnitTotal();
    const finalTotal = unitPrice * quantity;
    qtyValueEl.textContent = quantity;
    totalBtnPrice.textContent = formatCurrency(finalTotal);
  };

  const closeModal = () => {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  qtyMinusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      updateFooterPrice();
    }
  });

  qtyPlusBtn.addEventListener('click', () => {
    quantity++;
    updateFooterPrice();
  });

  submitBtn.addEventListener('click', () => {
    if (!currentProduct) return;

    const unitPrice = calculateUnitTotal();
    cartStore.addItem({
      productId: currentProduct.id,
      name: currentProduct.name,
      category: currentProduct.category,
      image: currentProduct.image,
      unitPrice: unitPrice,
      quantity: quantity,
      selectedGustos: [],
      selectedAddons: [...selectedAddons],
      selectedRemovals: [...selectedRemovals],
      observation: observationInput.value.trim()
    });

    showToast(`¡${currentProduct.name} agregada! 🍕`);
    closeModal();
  });

  const open = (product) => {
    currentProduct = product;
    quantity = 1;
    selectedAddons = [];
    selectedRemovals = [];
    observationInput.value = '';

    titleEl.textContent = product.name;
    basePriceEl.textContent = formatCurrency(product.price);
    descEl.textContent = product.description;
    imgEl.src = product.image;
    imgEl.alt = product.name;

    // Render Adicionales
    addonsListEl.innerHTML = '';
    const availableAddons = productsData.standardAddons || [];
    availableAddons.forEach(addon => {
      const itemEl = document.createElement('label');
      itemEl.className = 'option-checkbox-label';
      itemEl.innerHTML = `
        <div class="option-checkbox-left">
          <div class="custom-checkbox">✓</div>
          <span class="option-name">${addon.name}</span>
        </div>
        <span class="option-price-tag">+${formatCurrency(addon.price)}</span>
      `;

      itemEl.addEventListener('click', (e) => {
        e.preventDefault();
        const exists = selectedAddons.some(a => a.id === addon.id);
        if (exists) {
          selectedAddons = selectedAddons.filter(a => a.id !== addon.id);
          itemEl.classList.remove('selected');
        } else {
          selectedAddons.push(addon);
          itemEl.classList.add('selected');
        }
        updateFooterPrice();
      });

      addonsListEl.appendChild(itemEl);
    });

    // Render Quitar Ingredientes / Opciones
    removalsListEl.innerHTML = '';
    const availableRemovals = productsData.defaultRemovals || [];
    availableRemovals.forEach(rem => {
      const itemEl = document.createElement('label');
      itemEl.className = 'option-checkbox-label';
      itemEl.innerHTML = `
        <div class="option-checkbox-left">
          <div class="custom-checkbox">✓</div>
          <span class="option-name">${rem}</span>
        </div>
      `;

      itemEl.addEventListener('click', (e) => {
        e.preventDefault();
        const index = selectedRemovals.indexOf(rem);
        if (index > -1) {
          selectedRemovals.splice(index, 1);
          itemEl.classList.remove('selected');
        } else {
          selectedRemovals.push(rem);
          itemEl.classList.add('selected');
        }
      });

      removalsListEl.appendChild(itemEl);
    });

    updateFooterPrice();
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  return {
    element: backdrop,
    open
  };
}
