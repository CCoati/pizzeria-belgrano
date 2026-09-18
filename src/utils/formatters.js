/**
 * Formateador de precios en Pesos Uruguayos (UYU)
 * Ejemplos: 350 -> "$350", 1500 -> "$1.500"
 */
export function formatCurrency(amount) {
  const numeric = Math.round(Number(amount) || 0);
  const formatted = new Intl.NumberFormat('es-UY', {
    maximumFractionDigits: 0
  }).format(numeric);
  return `$${formatted}`;
}

/**
 * Limpia y normaliza texto para búsquedas sin acentos
 */
export function normalizeText(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
