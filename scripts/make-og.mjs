import { access, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const logoPath = join(projectRoot, 'public/images/logo-ls-webdesignagency-2025.svg');
const fontPath = join(projectRoot, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const outputPath = join(projectRoot, 'public/images/default-og-image.jpg');

const escapeMarkup = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function renderText(text, { size, weight = 400, color = '#211831', width = 0, align = 'left' }) {
  return sharp({
    text: {
      text: `<span weight="${weight}" foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `Inter ${size}`,
      fontfile: fontPath,
      ...(width > 0 ? { width } : {}),
      align,
      rgba: true,
    },
  })
    .png()
    .toBuffer();
}

async function renderGradientText(text, { size, weight = 800 }) {
  const { data: mask, info } = await sharp({
    text: {
      text: `<span weight="${weight}">${escapeMarkup(text)}</span>`,
      font: `Inter ${size}`,
      fontfile: fontPath,
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });

  const gradient = Buffer.from(`
    <svg width="${info.width}" height="${info.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#7628E8"/>
          <stop offset="0.5" stop-color="#A253DA"/>
          <stop offset="1" stop-color="#E72AAE"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand)"/>
    </svg>
  `);

  return sharp(gradient).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

const background = Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7628E8"/>
        <stop offset="0.52" stop-color="#A253DA"/>
        <stop offset="1" stop-color="#E72AAE"/>
      </linearGradient>
      <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7628E8"/>
        <stop offset="0.52" stop-color="#A253DA"/>
        <stop offset="1" stop-color="#E72AAE"/>
      </linearGradient>
      <radialGradient id="violetGlow">
        <stop offset="0" stop-color="#7628E8" stop-opacity=".18"/>
        <stop offset="1" stop-color="#7628E8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="magentaGlow">
        <stop offset="0" stop-color="#E72AAE" stop-opacity=".18"/>
        <stop offset="1" stop-color="#E72AAE" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#DED3EA" stroke-width="1"/>
      </pattern>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#211831" flood-opacity=".13"/>
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#211831" flood-opacity=".06"/>
      </filter>
    </defs>

    <rect width="1200" height="630" fill="#F5F0FB"/>
    <circle cx="278" cy="248" r="330" fill="url(#violetGlow)"/>
    <circle cx="1038" cy="330" r="360" fill="url(#magentaGlow)"/>
    <rect x="690" y="0" width="510" height="630" fill="url(#grid)" opacity=".62"/>
    <path d="M0 0H10V630H0Z" fill="url(#brand)"/>

    <path d="M1060 -44C1100 80 1187 118 1248 126" fill="none" stroke="url(#brand)" stroke-width="34" stroke-linecap="round" opacity=".12"/>
    <path d="M780 622C905 544 1047 581 1230 478" fill="none" stroke="url(#brand)" stroke-width="22" stroke-linecap="round" opacity=".1"/>

    <g filter="url(#shadow)">
      <rect x="764" y="116" width="376" height="420" rx="25" fill="#FFFFFF" fill-opacity=".9" stroke="#DED3EA" stroke-width="1.5"/>
    </g>
    <circle cx="804" cy="151" r="6" fill="#10B981"/>
    <rect x="788" y="207" width="328" height="1" fill="#DED3EA"/>

    <rect x="807" y="239" width="3" height="214" rx="2" fill="url(#flow)"/>
    <g>
      <circle cx="808.5" cy="255" r="12" fill="#FFFFFF" stroke="#DED3EA"/>
      <circle cx="808.5" cy="255" r="6" fill="#7628E8"/>
      <circle cx="808.5" cy="319" r="12" fill="#FFFFFF" stroke="#DED3EA"/>
      <circle cx="808.5" cy="319" r="6" fill="#943FDF"/>
      <circle cx="808.5" cy="383" r="12" fill="#FFFFFF" stroke="#DED3EA"/>
      <circle cx="808.5" cy="383" r="6" fill="#BA49CF"/>
      <circle cx="808.5" cy="447" r="12" fill="#FFFFFF" stroke="#DED3EA"/>
      <circle cx="808.5" cy="447" r="6" fill="#E72AAE"/>
    </g>

    <g fill="#F5F0FB" stroke="#DED3EA">
      <rect x="1028" y="243" width="68" height="24" rx="8"/>
      <rect x="1028" y="307" width="68" height="24" rx="8"/>
      <rect x="1028" y="371" width="68" height="24" rx="8"/>
      <rect x="1028" y="435" width="68" height="24" rx="8"/>
    </g>
    <g fill="#7628E8" opacity=".72">
      <rect x="1042" y="253" width="40" height="4" rx="2"/>
      <rect x="1042" y="317" width="31" height="4" rx="2"/>
      <rect x="1042" y="381" width="22" height="4" rx="2"/>
      <rect x="1042" y="445" width="30" height="4" rx="2"/>
    </g>

    <rect x="788" y="478" width="328" height="1" fill="#DED3EA"/>
    <g>
      <rect x="788" y="496" width="82" height="25" rx="8" fill="#7628E8" fill-opacity=".07" stroke="#DED3EA"/>
      <circle cx="802" cy="508.5" r="3" fill="#7628E8"/>
      <rect x="881" y="496" width="82" height="25" rx="8" fill="#A253DA" fill-opacity=".07" stroke="#DED3EA"/>
      <circle cx="895" cy="508.5" r="3" fill="#A253DA"/>
      <rect x="974" y="496" width="104" height="25" rx="8" fill="#E72AAE" fill-opacity=".07" stroke="#DED3EA"/>
      <circle cx="988" cy="508.5" r="3" fill="#E72AAE"/>
    </g>
  </svg>
`);

async function main() {
  await Promise.all([access(logoPath), access(fontPath)]);
  await mkdir(dirname(outputPath), { recursive: true });

  const logo = await sharp(logoPath).resize({ width: 350 }).png().toBuffer();
  const layers = [
    { input: logo, left: 70, top: 56 },
    { input: await renderText('WEB AGENCY A SASSARI  ·  PROGETTI IN TUTTA ITALIA', { size: 14, weight: 650, color: '#5E566B' }), left: 73, top: 150 },
    { input: await renderText('Siti web strategici', { size: 55, weight: 800 }), left: 69, top: 192 },
    { input: await renderText('che generano', { size: 55, weight: 800 }), left: 69, top: 256 },
    { input: await renderGradientText('opportunità', { size: 62, weight: 800 }), left: 69, top: 317 },
    { input: await renderText('SEO, moduli e automazioni leggere', { size: 23, weight: 600, color: '#211831' }), left: 73, top: 418 },
    { input: await renderText('per imprese e professionisti.', { size: 22, weight: 400, color: '#5E566B' }), left: 73, top: 455 },
    { input: await renderText('lswebagency.com', { size: 17, weight: 650, color: '#7628E8' }), left: 73, top: 550 },

    { input: await renderText('Dalla visita al contatto', { size: 18, weight: 700 }), left: 822, top: 137 },
    { input: await renderText('Un percorso digitale misurabile', { size: 12, weight: 450, color: '#5E566B' }), left: 788, top: 173 },
    { input: await renderText('Visite qualificate', { size: 16, weight: 650 }), left: 837, top: 242 },
    { input: await renderText('Landing efficace', { size: 16, weight: 650 }), left: 837, top: 306 },
    { input: await renderText('Richiesta acquisita', { size: 16, weight: 650 }), left: 837, top: 370 },
    { input: await renderText('Follow-up ordinato', { size: 16, weight: 650 }), left: 837, top: 434 },
    { input: await renderText('SEO', { size: 11, weight: 600, color: '#5E566B' }), left: 812, top: 500 },
    { input: await renderText('FORM', { size: 11, weight: 600, color: '#5E566B' }), left: 905, top: 500 },
    { input: await renderText('AUTOMAZIONI', { size: 10, weight: 600, color: '#5E566B' }), left: 998, top: 501 },
  ];

  const info = await sharp(background)
    .composite(layers)
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4', progressive: true, mozjpeg: true })
    .toFile(outputPath);

  const outputStat = await stat(outputPath);
  console.log(`Generated ${outputPath}`);
  console.log(`${info.width}x${info.height} ${info.format}, ${outputStat.size} bytes`);
}

await main();
