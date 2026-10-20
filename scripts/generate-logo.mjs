import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgLogo = `<svg width="700" height="180" viewBox="0 0 700 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF0E6" />
      <stop offset="35%" stop-color="#E4C7A8" />
      <stop offset="70%" stop-color="#D8B28C" />
      <stop offset="100%" stop-color="#C58652" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C58652" stop-opacity="0" />
      <stop offset="50%" stop-color="#E4C7A8" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#C58652" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Left Filigree Ornament -->
  <line x1="80" y1="85" x2="200" y2="85" stroke="url(#lineGrad)" stroke-width="1.2" />
  <circle cx="80" cy="85" r="2.5" fill="#E4C7A8" />
  <circle cx="140" cy="85" r="1.5" fill="#C58652" />

  <!-- Center Monogram / Brand Name -->
  <text x="350" y="98" font-family="'Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif" font-size="72" font-weight="400" letter-spacing="18" fill="url(#goldGrad)" text-anchor="middle">
    SÈN
  </text>

  <!-- Right Filigree Ornament -->
  <line x1="500" y1="85" x2="620" y2="85" stroke="url(#lineGrad)" stroke-width="1.2" />
  <circle cx="620" cy="85" r="2.5" fill="#E4C7A8" />
  <circle cx="560" cy="85" r="1.5" fill="#C58652" />

  <!-- Subtitle: HAUTE PARFUMERIE -->
  <text x="350" y="132" font-family="'Cinzel', 'Arial', sans-serif" font-size="13" font-weight="600" letter-spacing="10" fill="#C58652" text-anchor="middle">
    HAUTE PARFUMERIE
  </text>

  <!-- Bottom Location: PARIS • LE CAIRE -->
  <text x="350" y="154" font-family="'Arial', sans-serif" font-size="9" font-weight="400" letter-spacing="8" fill="#A07855" text-anchor="middle">
    PARIS • LE CAIRE
  </text>
</svg>`;

const publicImagesDir = path.resolve('public', 'images');
fs.writeFileSync(path.join(publicImagesDir, 'sen_logo_gold.svg'), svgLogo, 'utf-8');

// Generate high resolution transparent PNG logo
await sharp(Buffer.from(svgLogo))
  .resize(1400, 360)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicImagesDir, 'sen_logo_transparent.png'));

console.log('✅ Generated sen_logo_transparent.png and sen_logo_gold.svg successfully!');

// Circular Monogram Icon
const svgIcon = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF0E6" />
      <stop offset="45%" stop-color="#E4C7A8" />
      <stop offset="100%" stop-color="#C58652" />
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="118" stroke="url(#iconGold)" stroke-width="1.8" stroke-dasharray="6 3" fill="none" opacity="0.75" />
  <circle cx="128" cy="128" r="108" stroke="url(#iconGold)" stroke-width="1" fill="none" opacity="0.35" />
  
  <!-- Custom S monogram: a single refined stroke keeps the mark legible at favicon size. -->
  <path d="M171 72 C159 56 139 50 117 52 C91 54 78 67 79 84 C80 104 99 111 126 119 C153 127 177 138 176 164 C175 187 153 202 127 204 C103 206 83 198 69 183" stroke="url(#iconGold)" stroke-width="10" stroke-linecap="round" fill="none" />
  <path d="M164 65 C153 56 143 53 132 52" stroke="#FAF0E6" stroke-width="2" stroke-linecap="round" opacity="0.7" />
  <circle cx="128" cy="54" r="3.5" fill="#E4C7A8" />
  <circle cx="128" cy="202" r="3" fill="#C58652" />
</svg>`;

fs.writeFileSync(path.join(publicImagesDir, 'sen_monogram.svg'), svgIcon, 'utf-8');

await sharp(Buffer.from(svgIcon))
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicImagesDir, 'sen_monogram_transparent.png'));

console.log('✅ Generated sen_monogram_transparent.png and sen_monogram.svg successfully!');
