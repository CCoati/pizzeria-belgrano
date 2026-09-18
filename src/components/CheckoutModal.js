import { formatCurrency } from '../utils/formatters.js';
import { cartStore } from '../state/cartStore.js';
import { generateWhatsAppOrder } from '../utils/whatsapp.js';

export function createCheckoutModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'checkout-modal-backdrop';
  backdrop.id = 'checkout-modal-backdrop';

  let orderType = 'delivery'; // 'delivery' | 'pickup'
  let paymentMethod = 'cash'; // 'cash' | 'pos'
  let currentTotal = 0;

  backdrop.innerHTML = `
    <div class="checkout-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div class="modal-handle-bar">
        <div class="modal-drag-indicator"></div>
      </div>

      <div class="checkout-header">
        <div class="checkout-title-wrap">
          <span style="font-size: 1.4rem;">📋</span>
          <h2 class="checkout-title" id="checkout-title">Finalizar Pedido</h2>
        </div>
        <button type="button" class="cart-drawer-close" id="checkout-close-btn" aria-label="Cerrar checkout">✕</button>
      </div>

      <form class="checkout-body" id="checkout-form" novalidate>
        <!-- Modalidad: Delivery o Retiro en el Local -->
        <div class="form-section">
          <label class="form-label">Modalidad de entrega <span class="required-star">*</span></label>
          <div class="order-type-tabs">
            <button type="button" class="order-type-tab-btn active" id="tab-delivery" data-type="delivery">
              <span>🛵</span>
              <span>Delivery</span>
            </button>
            <button type="button" class="order-type-tab-btn" id="tab-pickup" data-type="pickup">
              <span>🏪</span>
              <span>Retiro en el local</span>
            </button>
          </div>
        </div>

        <!-- Datos del Cliente -->
        <div class="form-section">
          <h3 class="form-section-title">
            <span>👤</span>
            <span>Tus datos de contacto</span>
          </h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="checkout-name">Nombre y Apellido <span class="required-star">*</span></label>
              <input 
                type="text" 
                id="checkout-name" 
                class="form-input" 
                placeholder="Ej: Marcelo Suárez" 
                required 
                autocomplete="name"
              />
              <span class="form-error-hint" id="err-name" style="display: none;">Por favor ingresá tu nombre</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-phone">Teléfono / Celular <span class="required-star">*</span></label>
              <input 
                type="tel" 
                id="checkout-phone" 
                class="form-input" 
                placeholder="Ej: 099 123 456" 
                required 
                autocomplete="tel"
              />
              <span class="form-error-hint" id="err-phone" style="display: none;">Por favor ingresá tu teléfono</span>
            </div>
          </div>
        </div>

        <!-- Datos de Entrega (Solo para Delivery) -->
        <div class="form-section" id="delivery-fields-section">
          <h3 class="form-section-title">
            <span>📍</span>
            <span>Dirección de entrega</span>
          </h3>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="checkout-address">Calle / Dirección <span class="required-star">*</span></label>
              <input 
                type="text" 
                id="checkout-address" 
                class="form-input" 
                placeholder="Ej: Av. 8 de Octubre" 
                autocomplete="street-address"
              />
              <span class="form-error-hint" id="err-address" style="display: none;">Ingresá la calle de entrega</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-door-number">Número de puerta <span class="required-star">*</span></label>
              <input 
                type="text" 
                id="checkout-door-number" 
                class="form-input" 
                placeholder="Ej: 2881" 
              />
              <span class="form-error-hint" id="err-door" style="display: none;">Ingresá el número de puerta</span>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="checkout-apartment">Apartamento / Torre (opcional)</label>
              <input 
                type="text" 
                id="checkout-apartment" 
                class="form-input" 
                placeholder="Ej: Apto 302, Torre B" 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-neighborhood">Barrio <span class="required-star">*</span></label>
              <input 
                type="text" 
                id="checkout-neighborhood" 
                class="form-input" 
                placeholder="Ej: La Blanqueada / Belgrano / Cordón" 
              />
              <span class="form-error-hint" id="err-neighborhood" style="display: none;">Ingresá el barrio</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="checkout-reference">Referencia u observaciones del domicilio</label>
            <input 
              type="text" 
              id="checkout-reference" 
              class="form-input" 
              placeholder="Ej: Entre calles, casa con rejas negras, timbre rojo..." 
            />
          </div>
        </div>

        <!-- Métodos de Pago: Solo Efectivo y Solicitar POS -->
        <div class="form-section">
          <h3 class="form-section-title">
            <span>💳</span>
            <span>Forma de pago</span>
          </h3>

          <div class="payment-methods-grid">
            <div class="payment-card-option selected" id="payment-opt-cash" data-method="cash">
              <span class="payment-icon">💵</span>
              <div class="payment-title">Efectivo</div>
              <div class="payment-desc">Abonar al repartidor o en mostrador</div>
            </div>

            <div class="payment-card-option" id="payment-opt-pos" data-method="pos">
              <span class="payment-icon">💳</span>
              <div class="payment-title">Solicitar POS</div>
              <div class="payment-desc">Tarjetas de débito o crédito</div>
            </div>
          </div>

          <!-- Caja de cálculo de cambio para efectivo -->
          <div class="cash-change-box" id="cash-change-box">
            <div class="form-group">
              <label class="form-label" for="checkout-cash-amount">
                ¿Con cuánto vas a pagar? <span class="required-star">*</span>
              </label>
              <input 
                type="number" 
                id="checkout-cash-amount" 
                class="form-input" 
                placeholder="Ingresá el monto con el que vas a abonar" 
                min="0"
                step="50"
              />
            </div>

            <div class="change-result-pill" id="change-result-pill">
              <span>Tu cambio / vuelto:</span>
              <span class="change-result-amount" id="change-display-amount">$0</span>
            </div>
            <div class="change-warning" id="change-warning" style="display: none;">
              El monto ingresado es menor al total del pedido.
            </div>
          </div>

          <!-- Información si selecciona POS -->
          <div class="pos-info-box" id="pos-info-box" style="display: none;">
            <span>ℹ️</span>
            <span>El cadete llevará el dispositivo POS inalámbrico para que pagues con tu tarjeta cómodamente al recibir el pedido.</span>
          </div>
        </div>
      </form>

      <div class="checkout-footer">
        <div class="checkout-summary-mini">
          <span>Total a abonar:</span>
          <strong style="font-size: 1.25rem; color: var(--color-primary); font-family: var(--font-heading);" id="checkout-footer-total">$0</strong>
        </div>

        <button type="button" class="btn btn-whatsapp checkout-submit-btn" id="checkout-send-whatsapp-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z"/>
          </svg>
          <span>Enviar Pedido por WhatsApp</span>
        </button>
      </div>
    </div>
  `;

  const closeBtn = backdrop.querySelector('#checkout-close-btn');
  const tabDelivery = backdrop.querySelector('#tab-delivery');
  const tabPickup = backdrop.querySelector('#tab-pickup');
  const deliveryFieldsSection = backdrop.querySelector('#delivery-fields-section');
  const paymentCashOpt = backdrop.querySelector('#payment-opt-cash');
  const paymentPosOpt = backdrop.querySelector('#payment-opt-pos');
  const cashChangeBox = backdrop.querySelector('#cash-change-box');
  const posInfoBox = backdrop.querySelector('#pos-info-box');
  const cashAmountInput = backdrop.querySelector('#checkout-cash-amount');
  const changeDisplayEl = backdrop.querySelector('#change-display-amount');
  const changeWarningEl = backdrop.querySelector('#change-warning');
  const footerTotalEl = backdrop.querySelector('#checkout-footer-total');
  const sendWhatsAppBtn = backdrop.querySelector('#checkout-send-whatsapp-btn');

  // Input elements for validation
  const nameInput = backdrop.querySelector('#checkout-name');
  const phoneInput = backdrop.querySelector('#checkout-phone');
  const addressInput = backdrop.querySelector('#checkout-address');
  const doorInput = backdrop.querySelector('#checkout-door-number');
  const aptInput = backdrop.querySelector('#checkout-apartment');
  const neighborhoodInput = backdrop.querySelector('#checkout-neighborhood');
  const refInput = backdrop.querySelector('#checkout-reference');

  // Errors
  const errName = backdrop.querySelector('#err-name');
  const errPhone = backdrop.querySelector('#err-phone');
  const errAddress = backdrop.querySelector('#err-address');
  const errDoor = backdrop.querySelector('#err-door');
  const errNeighborhood = backdrop.querySelector('#err-neighborhood');

  const closeModal = () => {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Selector de modalidad
  tabDelivery.addEventListener('click', () => {
    orderType = 'delivery';
    tabDelivery.classList.add('active');
    tabPickup.classList.remove('active');
    deliveryFieldsSection.style.display = 'flex';
  });

  tabPickup.addEventListener('click', () => {
    orderType = 'pickup';
    tabPickup.classList.add('active');
    tabDelivery.classList.remove('active');
    deliveryFieldsSection.style.display = 'none';
  });

  // Selector de pago
  paymentCashOpt.addEventListener('click', () => {
    paymentMethod = 'cash';
    paymentCashOpt.classList.add('selected');
    paymentPosOpt.classList.remove('selected');
    cashChangeBox.style.display = 'flex';
    posInfoBox.style.display = 'none';
    calculateChange();
  });

  paymentPosOpt.addEventListener('click', () => {
    paymentMethod = 'pos';
    paymentPosOpt.classList.add('selected');
    paymentCashOpt.classList.remove('selected');
    cashChangeBox.style.display = 'none';
    posInfoBox.style.display = 'flex';
  });

  // Cálculo de cambio de efectivo
  const calculateChange = () => {
    const rawVal = cashAmountInput.value;
    if (!rawVal) {
      changeDisplayEl.textContent = '$0';
      changeWarningEl.style.display = 'none';
      return 0;
    }

    const payWith = Number(rawVal);
    if (isNaN(payWith)) return 0;

    if (payWith < currentTotal) {
      changeWarningEl.style.display = 'block';
      changeDisplayEl.textContent = '$0';
      return 0;
    }

    changeWarningEl.style.display = 'none';
    const change = payWith - currentTotal;
    changeDisplayEl.textContent = formatCurrency(change);
    return change;
  };

  cashAmountInput.addEventListener('input', calculateChange);

  // Validación y envío
  sendWhatsAppBtn.addEventListener('click', () => {
    let isValid = true;

    // Validar Nombre
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      errName.style.display = 'block';
      isValid = false;
    } else {
      nameInput.classList.remove('error');
      errName.style.display = 'none';
    }

    // Validar Teléfono
    if (!phoneInput.value.trim()) {
      phoneInput.classList.add('error');
      errPhone.style.display = 'block';
      isValid = false;
    } else {
      phoneInput.classList.remove('error');
      errPhone.style.display = 'none';
    }

    // Si es Delivery, validar dirección
    if (orderType === 'delivery') {
      if (!addressInput.value.trim()) {
        addressInput.classList.add('error');
        errAddress.style.display = 'block';
        isValid = false;
      } else {
        addressInput.classList.remove('error');
        errAddress.style.display = 'none';
      }

      if (!doorInput.value.trim()) {
        doorInput.classList.add('error');
        errDoor.style.display = 'block';
        isValid = false;
      } else {
        doorInput.classList.remove('error');
        errDoor.style.display = 'none';
      }

      if (!neighborhoodInput.value.trim()) {
        neighborhoodInput.classList.add('error');
        errNeighborhood.style.display = 'block';
        isValid = false;
      } else {
        neighborhoodInput.classList.remove('error');
        errNeighborhood.style.display = 'none';
      }
    }

    // Si es Efectivo, validar que monto a pagar sea >= total
    let cashPayAmount = currentTotal;
    let changeAmount = 0;
    if (paymentMethod === 'cash') {
      const enteredAmount = Number(cashAmountInput.value);
      if (!enteredAmount || enteredAmount < currentTotal) {
        cashAmountInput.classList.add('error');
        changeWarningEl.style.display = 'block';
        isValid = false;
      } else {
        cashAmountInput.classList.remove('error');
        changeWarningEl.style.display = 'none';
        cashPayAmount = enteredAmount;
        changeAmount = enteredAmount - currentTotal;
      }
    }

    if (!isValid) {
      // Scroll al primer error
      const firstError = backdrop.querySelector('.form-input.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Generar el mensaje de WhatsApp con formato exacto
    const cartState = cartStore.getState();
    const orderData = {
      customerName: nameInput.value,
      phone: phoneInput.value,
      orderType,
      address: addressInput.value,
      doorNumber: doorInput.value,
      apartment: aptInput.value,
      neighborhood: neighborhoodInput.value,
      reference: refInput.value,
      items: cartState.items,
      subtotal: cartState.subtotal,
      deliveryFee: cartState.deliveryFee,
      total: cartState.total,
      paymentMethod,
      cashAmount: cashPayAmount,
      change: changeAmount
    };

    const { whatsappUrl } = generateWhatsAppOrder(orderData);

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Cerrar modal
    closeModal();
  });

  const open = () => {
    const state = cartStore.getState();
    currentTotal = state.total;
    footerTotalEl.textContent = formatCurrency(currentTotal);

    // Inicializar monto si está vacío
    if (!cashAmountInput.value) {
      cashAmountInput.value = currentTotal;
    }

    calculateChange();

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  return {
    element: backdrop,
    open
  };
}
