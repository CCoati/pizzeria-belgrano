import { formatCurrency } from './formatters.js';
import businessData from '../data/business.json';

/**
 * Genera el texto del pedido y el enlace de WhatsApp con una estructura clara y ordenada
 */
export function generateWhatsAppOrder({
  customerName,
  phone,
  orderType, // 'delivery' | 'pickup'
  address = '',
  doorNumber = '',
  apartment = '',
  neighborhood = '',
  reference = '',
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
  paymentMethod, // 'cash' | 'pos'
  cashAmount = 0,
  change = 0
}) {
  const isDelivery = orderType === 'delivery';
  const lines = [];

  lines.push('🍕 *PIZZERÍA BELGRANO — NUEVO PEDIDO* 🍕');
  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push('👤 *DATOS DEL CLIENTE*');
  lines.push(`• *Nombre:* ${customerName.trim()}`);
  lines.push(`• *Teléfono:* ${phone.trim()}`);
  lines.push(`• *Modalidad:* ${isDelivery ? '🛵 Delivery' : '🏪 Retiro en el local'}`);

  if (isDelivery) {
    lines.push('');
    lines.push('📍 *DIRECCIÓN DE ENTREGA*');
    let addressLine = address.trim();
    if (doorNumber.trim()) addressLine += ` N° ${doorNumber.trim()}`;
    if (apartment.trim()) addressLine += ` (Apto: ${apartment.trim()})`;
    lines.push(`• *Dirección:* ${addressLine}`);

    if (neighborhood.trim()) {
      lines.push(`• *Barrio:* ${neighborhood.trim()}`);
    }

    if (reference.trim()) {
      lines.push(`• *Referencia:* ${reference.trim()}`);
    }
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📋 *DETALLE DEL PEDIDO*');
  lines.push('');

  items.forEach((item, index) => {
    const itemTotalFormatted = formatCurrency(item.unitPrice * item.quantity);
    lines.push(`• *${item.quantity}x ${item.name}* — ${itemTotalFormatted}`);

    // Si tiene gustos seleccionados (Armá tu pizzeta)
    if (item.selectedGustos && item.selectedGustos.length > 0) {
      lines.push(`   ↳ *Gustos:* ${item.selectedGustos.join(', ')}`);
    }

    // Si tiene adicionales seleccionados
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const addonsText = item.selectedAddons.map(a => `${a.name} (+${formatCurrency(a.price)})`).join(', ');
      lines.push(`   ↳ *Adicionales:* ${addonsText}`);
    }

    // Si quitó ingredientes
    if (item.selectedRemovals && item.selectedRemovals.length > 0) {
      lines.push(`   ↳ *Preferencias:* ${item.selectedRemovals.join(', ')}`);
    }

    // Si tiene observación específica
    if (item.observation && item.observation.trim()) {
      lines.push(`   ↳ *Obs:* ${item.observation.trim()}`);
    }

    if (index < items.length - 1) {
      lines.push('');
    }
  });

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push('💰 *TOTAL DEL PEDIDO*');
  lines.push(`• *Subtotal:* ${formatCurrency(subtotal)}`);
  if (isDelivery) {
    lines.push('• *Envío:* A coordinar según zona');
  }
  lines.push(`• *TOTAL:* *${formatCurrency(total)}*`);
  lines.push('');

  lines.push('💳 *FORMA DE PAGO*');
  if (paymentMethod === 'cash') {
    lines.push('• *Método:* Efectivo');
    const cashNum = Number(cashAmount);
    if (cashNum > 0) {
      lines.push(`• *Paga con:* ${formatCurrency(cashNum)}`);
      if (change > 0) {
        lines.push(`• *Cambio a llevar:* *${formatCurrency(change)}*`);
      } else {
        lines.push('• *Cambio:* Monto exacto (no precisa)');
      }
    }
  } else {
    lines.push('• *Método:* Solicitar POS (pago con tarjeta)');
  }
  lines.push('━━━━━━━━━━━━━━━━━━━━━');

  const fullMessage = lines.join('\n');
  const encodedMessage = encodeURIComponent(fullMessage);
  const whatsappNumber = businessData.whatsapp || '59892884951';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return {
    messageText: fullMessage,
    whatsappUrl
  };
}

