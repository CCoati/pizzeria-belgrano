# 🍕 Pizzería Belgrano — Web Delivery App

> *"Del horno a su mesa"*

Aplicación web moderna, responsive y mobile-first para **Pizzería Belgrano**. Permite a los clientes explorar el menú, personalizar sus pedidos, armar su pizzeta a medida y enviar el pedido formateado directamente por WhatsApp.

---

## 🚀 Características

- 📱 **Mobile-First & Ultra Responsive:** Optimizada especialmente para dispositivos móviles, con acceso inmediato al menú y navegación por categorías sticky.
- 🍕 **Catálogo Completo:** Pizzetas artesanales, gustos especiales, combos familiares y la gran Promoción Belgrano.
- 🛠️ **Armá tu Pizzeta:** Personalizador interactivo para seleccionar entre 14 ingredientes a $70 cada gusto con cálculo dinámico en tiempo real.
- 🛒 **Carrito & Modales:** Opciones para agregar adicionales (fainá común, fainá con muzzarella, extra muzza), quitar ingredientes ("sin orégano", "sin aceitunas") y sumar observaciones para la cocina.
- 💵 **Checkout Inteligente:**
  - Selección entre **Delivery** y **Retiro en el local**.
  - Métodos de pago exclusivos: **Efectivo** (con cálculo automático de cambio/vuelto en vivo) y **Solicitar POS**.
- 💬 **Integración con WhatsApp:** Generación automática del pedido estructurado con formato enriquecido para `wa.me/59824813859`.
- 🕒 **Horarios en Vivo:** Detección en tiempo real de apertura y cierre del local según la hora de Montevideo.
- 📦 **100% Client-Side:** Los productos y configuraciones se administran desde archivos JSON locales sin necesidad de backend o base de datos.

---

## 🛠️ Tecnologías

- [Vite](https://vitejs.dev/)
- JavaScript Moderno (ES Modules)
- Vanilla CSS (Design Tokens & CSS Variables)
- Google Fonts (*Outfit* & *Plus Jakarta Sans*)

---

## 💻 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/CCoati/pizzeria-belgrano.git
   cd pizzeria-belgrano
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   La carpeta `dist/` quedará lista para ser desplegada en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).
