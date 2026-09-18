import businessData from '../data/business.json';

const CART_STORAGE_KEY = 'pizzeria_belgrano_cart_v1';

class CartStore {
  constructor() {
    this.items = this.loadFromStorage();
    this.listeners = new Set();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      // Ignore storage errors
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Disparar inmediatamente con estado actual
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveToStorage();
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  getState() {
    return {
      items: [...this.items],
      itemCount: this.getItemCount(),
      subtotal: this.getSubtotal(),
      deliveryFee: businessData.deliveryFee || 0,
      total: this.getTotal()
    };
  }

  addItem(config) {
    const {
      productId,
      name,
      category,
      image,
      unitPrice,
      quantity = 1,
      selectedGustos = [],
      selectedAddons = [],
      selectedRemovals = [],
      observation = ''
    } = config;

    // Buscar si ya existe un item idéntico (mismas opciones y observaciones)
    const existingIndex = this.items.findIndex(item => {
      if (item.productId !== productId) return false;
      if (item.unitPrice !== unitPrice) return false;
      if (item.observation.trim() !== observation.trim()) return false;
      if (JSON.stringify(item.selectedGustos.sort()) !== JSON.stringify([...selectedGustos].sort())) return false;
      if (JSON.stringify(item.selectedRemovals.sort()) !== JSON.stringify([...selectedRemovals].sort())) return false;
      
      const itemAddonIds = item.selectedAddons.map(a => a.id).sort();
      const newAddonIds = selectedAddons.map(a => a.id).sort();
      return JSON.stringify(itemAddonIds) === JSON.stringify(newAddonIds);
    });

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      const cartItemId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      this.items.push({
        id: cartItemId,
        productId,
        name,
        category,
        image,
        unitPrice,
        quantity,
        selectedGustos,
        selectedAddons,
        selectedRemovals,
        observation
      });
    }

    this.notify();
  }

  updateQuantity(cartItemId, newQty) {
    const target = this.items.find(i => i.id === cartItemId);
    if (!target) return;

    if (newQty <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    target.quantity = newQty;
    this.notify();
  }

  removeItem(cartItemId) {
    this.items = this.items.filter(i => i.id !== cartItemId);
    this.notify();
  }

  clearCart() {
    this.items = [];
    this.notify();
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const deliveryFee = businessData.deliveryFee || 0;
    return subtotal > 0 ? subtotal + deliveryFee : 0;
  }
}

export const cartStore = new CartStore();
