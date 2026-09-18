import { formatCurrency } from '../utils/formatters.js';
import productsData from '../data/products.json';
import { cartStore } from '../state/cartStore.js';
import { showToast } from '../utils/toast.js';

export function createBuildYourOwnModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'build-your-own-modal-backdrop';

  let selectedGustos = ['Jamón', 'Morrón']; // Selección sugerida por defecto
  let selectedAddons = [];
  let quantity = 1;
  const pricePerGusto = productsData.armaTuPizzetaConfig.pricePerGusto || 70;
  const allGustos = productsData.armaTuPizzetaConfig.gustos || [];

  backdrop.innerHTML = `
    <div class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="byo-modal-title">
      <div class="modal-handle-bar">
        <div class="modal-drag-indicator"></div>
      </div>

      <div class="modal-header-hero">
        <button type="button" class="modal-close-btn" id="byo-modal-close-btn" aria-label="Cerrar personalizador">✕</button>
        <img src="/images/arma_tu_pizzeta.jpg" alt="Armá tu pizzeta" class="modal-hero-img" />
      </div>

      <div class="modal-body">
        <div class="modal-product-header">
          <div class="badge badge-accent" style="margin-bottom: 8px;">Personalizable</div>
          <h2 class="modal-product-title" id="byo-modal-title">Armá tu pizzeta</h2>
          <div class="modal-product-price" id="byo-calculated-price">$0</div>
          <p class="modal-product-desc">
            Elegí tus ingredientes preferidos recién cortados. <strong>$70 cada gusto</strong> sobre una base dorada y crocante con salsa casera y muzzarella fundida.
          </p>
        </div>

        <!-- Selector de Gustos -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>Seleccioná tus gustos ($70 c/u)</span>
            <span class="badge badge-primary" id="byo-gustos-count">0 seleccionados</span>
          </div>
          <p class="modal-section-subtitle">Tocá para sumar o quitar gustos a tu combinación:</p>
          <div class="gustos-picker-grid" id="byo-gustos-grid"></div>
        </div>

        <!-- Adicionales opcionales -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>¿Deseas acompañar con fainá?</span>
            <span class="badge badge-secondary">Opcional</span>
          </div>
          <div class="options-list" id="byo-addons-list"></div>
        </div>

        <!-- Observaciones -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>Observaciones especiales</span>
          </div>
          <textarea 
            class="observation-textarea" 
            id="byo-observation-input" 
            placeholder="Ej: aceitunas separadas, orégano suave, etc." 
            rows="2"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <div class="quantity-stepper">
          <button type="button" class="stepper-btn" id="byo-qty-minus" aria-label="Disminuir cantidad">−</button>
          <span class="stepper-value" id="byo-qty-value">1</span>
          <button type="button" class="stepper-btn" id="byo-qty-plus" aria-label="Aumentar cantidad">+</button>
        </div>

        <button type="button" class="btn btn-primary modal-add-btn" id="byo-submit-btn">
          Agregar al pedido — <span id="byo-total-btn-price">$0</span>
        </button>
      </div>
    </div>
  `;

  const closeBtn = backdrop.querySelector('#byo-modal-close-btn');
  const gustosGrid = backdrop.querySelector('#byo-gustos-grid');
  const gustosCountBadge = backdrop.querySelector('#byo-gustos-count');
  const calculatedPriceEl = backdrop.querySelector('#byo-calculated-price');
  const totalBtnPrice = backdrop.querySelector('#byo-total-btn-price');
  const addonsListEl = backdrop.querySelector('#byo-addons-list');
  const observationInput = backdrop.querySelector('#byo-observation-input');
  const qtyValueEl = backdrop.querySelector('#byo-qty-value');
  const qtyMinusBtn = backdrop.querySelector('#byo-qty-minus');
  const qtyPlusBtn = backdrop.querySelector('#byo-qty-plus');
  const submitBtn = backdrop.querySelector('#byo-submit-btn');

  const calculateUnitTotal = () => {
    const gustosTotal = selectedGustos.length * pricePerGusto;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return gustosTotal + addonsTotal;
  };

  const updateUI = () => {
    const unitTotal = calculateUnitTotal();
    const finalTotal = unitTotal * quantity;

    gustosCountBadge.textContent = `${selectedGustos.length} ${selectedGustos.length === 1 ? 'gusto' : 'gustos'}`;
    calculatedPriceEl.textContent = formatCurrency(unitTotal);
    totalBtnPrice.textContent = formatCurrency(finalTotal);
    qtyValueEl.textContent = quantity;

    // Si no seleccionó ningún gusto, deshabilitar o pedir selección
    if (selectedGustos.length === 0) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
      totalBtnPrice.textContent = 'Elegí al menos 1 gusto';
    } else {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      totalBtnPrice.textContent = formatCurrency(finalTotal);
    }
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
      updateUI();
    }
  });

  qtyPlusBtn.addEventListener('click', () => {
    quantity++;
    updateUI();
  });

  submitBtn.addEventListener('click', () => {
    if (selectedGustos.length === 0) return;

    const unitPrice = calculateUnitTotal();
    cartStore.addItem({
      productId: 'arma-tu-pizzeta-custom',
      name: `Armá tu pizzeta (${selectedGustos.length} gustos)`,
      category: 'arma-tu-pizzeta',
      image: '/images/arma_tu_pizzeta.jpg',
      unitPrice: unitPrice,
      quantity: quantity,
      selectedGustos: [...selectedGustos],
      selectedAddons: [...selectedAddons],
      selectedRemovals: [],
      observation: observationInput.value.trim()
    });

    showToast('¡Tu pizzeta armada se agregó al pedido! 🍕');
    closeModal();
  });

  const renderGustosChips = () => {
    gustosGrid.innerHTML = '';
    allGustos.forEach(gusto => {
      const isSelected = selectedGustos.includes(gusto);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `gusto-chip ${isSelected ? 'selected' : ''}`;
      chip.innerHTML = `
        <span>${gusto}</span>
        <span class="gusto-chip-check">✓</span>
      `;

      chip.addEventListener('click', () => {
        const index = selectedGustos.indexOf(gusto);
        if (index > -1) {
          selectedGustos.splice(index, 1);
          chip.classList.remove('selected');
        } else {
          selectedGustos.push(gusto);
          chip.classList.add('selected');
        }
        updateUI();
      });

      gustosGrid.appendChild(chip);
    });
  };

  const renderAddons = () => {
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
        updateUI();
      });

      addonsListEl.appendChild(itemEl);
    });
  };

  const open = () => {
    selectedGustos = ['Jamón', 'Morrón']; // Default amigable
    selectedAddons = [];
    quantity = 1;
    observationInput.value = '';

    renderGustosChips();
    renderAddons();
    updateUI();

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  return {
    element: backdrop,
    open
  };
}
