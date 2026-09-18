/**
 * Utilidad para compartir la web por WhatsApp o mediante el diálogo nativo del dispositivo
 */
export function shareMenuWeb() {
  const currentUrl = window.location.origin + window.location.pathname;
  
  const shareText = `🍕 *Pizzería Belgrano — Del horno a su mesa* 🍕\n\nMirá nuestro menú digital interactivo, armá tu pizzeta y hacé tu pedido directo:\n👉 ${currentUrl}\n\n🛵 Delivery & Retiro\n🕒 Dom a Jue: 19 a 00h | Vie y Sáb: 19 a 01h\n📍 Belgrano 2881 esq. Centenario`;

  if (navigator.share) {
    navigator.share({
      title: 'Pizzería Belgrano — Menú Digital',
      text: shareText,
      url: currentUrl
    }).catch(() => {
      // Si el usuario cancela o falla, fallback a WhatsApp
      openWhatsAppShare(shareText);
    });
  } else {
    openWhatsAppShare(shareText);
  }
}

function openWhatsAppShare(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
