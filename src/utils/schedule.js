import businessData from '../data/business.json';

/**
 * Obtiene la hora actual en la zona horaria de Montevideo (Uruguay)
 */
export function getMontevideoDate() {
  try {
    const now = new Date();
    const uyString = now.toLocaleString('en-US', { timeZone: 'America/Montevideo' });
    return new Date(uyString);
  } catch (e) {
    return new Date();
  }
}

/**
 * Verifica si el local se encuentra abierto actualmente según el horario
 * Domingo a Jueves: 19:00 a 00:00 hs
 * Viernes y Sábados: 19:00 a 01:00 hs
 */
export function checkBusinessStatus() {
  const uyDate = getMontevideoDate();
  const day = uyDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado
  const hour = uyDate.getHours();
  const minute = uyDate.getMinutes();
  const currentTimeInMinutes = hour * 60 + minute;

  // Revisar si estamos en la madrugada (ej: entre 00:00 y 01:00 de un Sábado o Domingo que corresponde al turno del Viernes o Sábado noche)
  // Viernes noche (día 5): abre 19:00 hasta 01:00 del Sábado (día 6).
  // Sábado noche (día 6): abre 19:00 hasta 01:00 del Domingo (día 0).
  if (hour >= 0 && hour < 1) {
    // Si hoy es Sábado (day === 6), esta madrugada corresponde al Viernes
    // Si hoy es Domingo (day === 0), esta madrugada corresponde al Sábado
    if (day === 6 || day === 0) {
      return {
        isOpen: true,
        statusText: 'Abierto ahora',
        detailText: 'Cierra a la 01:00 hs',
        badgeClass: 'status-open'
      };
    }
  }

  // Horario estándar que empieza a las 19:00 (1140 minutos)
  const openTimeMinutes = 19 * 60; // 19:00

  // Si es Viernes (5) o Sábado (6)
  if (day === 5 || day === 6) {
    if (currentTimeInMinutes >= openTimeMinutes) {
      return {
        isOpen: true,
        statusText: 'Abierto ahora',
        detailText: 'Cierra a la 01:00 hs',
        badgeClass: 'status-open'
      };
    }
  } else {
    // Domingo a Jueves: 19:00 a 24:00 (00:00)
    if (currentTimeInMinutes >= openTimeMinutes && currentTimeInMinutes < 24 * 60) {
      return {
        isOpen: true,
        statusText: 'Abierto ahora',
        detailText: 'Cierra a las 00:00 hs',
        badgeClass: 'status-open'
      };
    }
  }

  return {
    isOpen: false,
    statusText: 'Cerrado',
    detailText: 'Abrimos hoy a las 19:00 hs',
    badgeClass: 'status-closed'
  };
}
