let activeToastTimeout = null;

export function showToast(message = '¡Agregado a tu pedido! 🍕', type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  toast.classList.remove('visible');
  void toast.offsetWidth; // force reflow
  toast.classList.add('visible');

  if (activeToastTimeout) {
    clearTimeout(activeToastTimeout);
  }

  activeToastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}
