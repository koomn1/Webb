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
  <!-- Open S ribbon mark: a refined, uncontained silhouette replaces the circular seal. -->
  <path d="M174 61 C154 45 119 43 94 56 C69 69 67 94 87 108 C101 118 120 121 145 128 C170 135 181 148 174 166 C166 188 137 202 107 199 C89 197 74 190 62 179" stroke="url(#iconGold)" stroke-width="12" stroke-linecap="round" fill="none" />
  <path d="M170 59 C151 45 122 45 101 54" stroke="#FAF0E6" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
  <path d="M73 185 C87 197 105 201 123 199" stroke="#C58652" stroke-width="2" stroke-linecap="round" opacity="0.7" />
  <path d="M128 27 L135 39 L128 51 L121 39 Z" fill="url(#iconGold)" />
  <path d="M128 205 L132 212 L128 219 L124 212 Z" fill="#C58652" opacity="0.8" />
</svg>`;

fs.writeFileSync(path.join(publicImagesDir, 'sen_monogram.svg'), svgIcon, 'utf-8');

await sharp(Buffer.from(svgIcon))
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicImagesDir, 'sen_monogram_transparent.png'));

console.log('✅ Generated sen_monogram_transparent.png and sen_monogram.svg successfully!');
