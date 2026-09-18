import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOGBanner() {
  const width = 1200;
  const height = 630;

  // Fondo de pizza redimensionado a 1200x630
  const bgBuffer = await sharp('public/images/hero_pizza.jpg')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .blur(1)
    .toBuffer();

  // Logo de la pizzería redimensionado
  const logoBuffer = await sharp('public/images/logo.png')
    .resize(680, null, { fit: 'inside' })
    .toBuffer();

  // Overlay SVG semitransparente oscuro con viñeta y badge inferior
  const overlaySvg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.45)" />
          <stop offset="70%" stop-color="rgba(0,0,0,0.75)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.9)" />
        </radialGradient>
      </defs>
      
      <!-- Fondo oscuro -->
      <rect width="${width}" height="${height}" fill="url(#vignette)" />

      <!-- Borde decorativo -->
      <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="20" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" />

      <!-- Texto inferior con pill -->
      <g transform="translate(${width / 2}, 510)">
        <rect x="-260" y="-24" width="520" height="48" rx="24" fill="#C92A2A" />
        <text x="0" y="8" font-family="'Outfit', 'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
          🍕 MENÚ DIGITAL Y PEDIDOS ONLINE
        </text>
      </g>
    </svg>
  `;

  // Componer imagen final
  await sharp(bgBuffer)
    .composite([
      { input: Buffer.from(overlaySvg), top: 0, left: 0 },
      { input: logoBuffer, top: 120, left: Math.round((width - 680) / 2) }
    ])
    .jpeg({ quality: 90 })
    .toFile('public/images/og_banner.jpg');

  console.log('OG banner generated successfully at public/images/og_banner.jpg');
}

generateOGBanner().catch(console.error);
