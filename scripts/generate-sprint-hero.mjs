import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const width = 1920;
const height = 1080;

// SVG con design minimal, premium, europeo
const svgContent = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradiente sfondo neutro -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
    </linearGradient>
    
    <!-- Gradiente per card -->
    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:1" />
    </linearGradient>
    
    <!-- Ombre leggere -->
    <filter id="softShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Accenti moderni -->
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
    </linearGradient>
    
    <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:0.9" />
    </linearGradient>
  </defs>
  
  <!-- Sfondo -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  
  <!-- Spazio negativo ampio a sinistra/centro (per il titolo) -->
  <!-- Elementi grafici posizionati a destra -->
  
  <!-- Card principale con grafico line chart (posizionata a destra) -->
  <g transform="translate(1200, 200)">
    <rect x="0" y="0" width="580" height="320" rx="16" fill="url(#cardGradient)" filter="url(#softShadow)" stroke="#e5e7eb" stroke-width="1"/>
    
    <!-- Header card -->
    <rect x="24" y="24" width="120" height="8" rx="4" fill="#d1d5db" opacity="0.6"/>
    <rect x="24" y="40" width="80" height="6" rx="3" fill="#d1d5db" opacity="0.4"/>
    
    <!-- Line chart astratto -->
    <g transform="translate(40, 80)">
      <!-- Griglia di fondo -->
      <line x1="0" y1="120" x2="500" y2="120" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="90" x2="500" y2="90" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="60" x2="500" y2="60" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="30" x2="500" y2="30" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="0" x2="500" y2="0" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
      
      <!-- Linea di performance ascendente -->
      <path d="M 0,100 L 80,85 L 160,70 L 240,50 L 320,35 L 400,20 L 480,10" 
            fill="none" 
            stroke="url(#accentGradient)" 
            stroke-width="3" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      
      <!-- Punti sulla linea -->
      <circle cx="80" cy="85" r="4" fill="url(#accentGradient)"/>
      <circle cx="240" cy="50" r="4" fill="url(#accentGradient)"/>
      <circle cx="400" cy="20" r="4" fill="url(#accentGradient)"/>
      <circle cx="480" cy="10" r="5" fill="url(#accentGradient)"/>
    </g>
  </g>
  
  <!-- Card con indicatori di performance (sotto la prima card) -->
  <g transform="translate(1200, 560)">
    <rect x="0" y="0" width="280" height="200" rx="16" fill="url(#cardGradient)" filter="url(#softShadow)" stroke="#e5e7eb" stroke-width="1"/>
    
    <!-- Header -->
    <rect x="24" y="24" width="100" height="8" rx="4" fill="#d1d5db" opacity="0.6"/>
    
    <!-- Indicatori circolari di performance -->
    <g transform="translate(60, 70)">
      <!-- Cerchio 1 -->
      <circle cx="0" cy="0" r="35" fill="none" stroke="#e5e7eb" stroke-width="6"/>
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#successGradient)" stroke-width="6" 
              stroke-dasharray="180" stroke-dashoffset="45" transform="rotate(-90)" stroke-linecap="round"/>
      <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system" font-size="18" font-weight="600" fill="#1f2937">85%</text>
    </g>
    
    <!-- Cerchio 2 -->
    <g transform="translate(220, 70)">
      <circle cx="0" cy="0" r="35" fill="none" stroke="#e5e7eb" stroke-width="6"/>
      <circle cx="0" cy="0" r="35" fill="none" stroke="url(#accentGradient)" stroke-width="6" 
              stroke-dasharray="180" stroke-dashoffset="72" transform="rotate(-90)" stroke-linecap="round"/>
      <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system" font-size="18" font-weight="600" fill="#1f2937">60%</text>
    </g>
  </g>
  
  <!-- Card con checkmarks e metriche (a destra della seconda card) -->
  <g transform="translate(1500, 560)">
    <rect x="0" y="0" width="280" height="200" rx="16" fill="url(#cardGradient)" filter="url(#softShadow)" stroke="#e5e7eb" stroke-width="1"/>
    
    <!-- Header -->
    <rect x="24" y="24" width="100" height="8" rx="4" fill="#d1d5db" opacity="0.6"/>
    
    <!-- Checkmarks astratti -->
    <g transform="translate(40, 70)">
      <!-- Checkmark 1 -->
      <circle cx="12" cy="12" r="10" fill="url(#successGradient)" opacity="0.2"/>
      <path d="M 8,12 L 11,15 L 16,8" fill="none" stroke="url(#successGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="6" width="180" height="6" rx="3" fill="#d1d5db" opacity="0.4"/>
      <rect x="30" y="16" width="120" height="4" rx="2" fill="#d1d5db" opacity="0.3"/>
      
      <!-- Checkmark 2 -->
      <g transform="translate(0, 35)">
        <circle cx="12" cy="12" r="10" fill="url(#successGradient)" opacity="0.2"/>
        <path d="M 8,12 L 11,15 L 16,8" fill="none" stroke="url(#successGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="30" y="6" width="180" height="6" rx="3" fill="#d1d5db" opacity="0.4"/>
        <rect x="30" y="16" width="100" height="4" rx="2" fill="#d1d5db" opacity="0.3"/>
      </g>
      
      <!-- Checkmark 3 -->
      <g transform="translate(0, 70)">
        <circle cx="12" cy="12" r="10" fill="url(#successGradient)" opacity="0.2"/>
        <path d="M 8,12 L 11,15 L 16,8" fill="none" stroke="url(#successGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="30" y="6" width="180" height="6" rx="3" fill="#d1d5db" opacity="0.4"/>
        <rect x="30" y="16" width="140" height="4" rx="2" fill="#d1d5db" opacity="0.3"/>
      </g>
    </g>
  </g>
  
  <!-- Funnel stilizzato (in alto a destra, più piccolo) -->
  <g transform="translate(1400, 120)">
    <rect x="0" y="0" width="200" height="60" rx="12" fill="url(#cardGradient)" filter="url(#softShadow)" stroke="#e5e7eb" stroke-width="1"/>
    
    <!-- Funnel astratto -->
    <g transform="translate(20, 20)">
      <!-- Funnel shape -->
      <path d="M 0,0 L 160,0 L 140,20 L 20,20 Z" fill="url(#accentGradient)" opacity="0.3"/>
      <path d="M 20,20 L 140,20 L 120,40 L 40,40 Z" fill="url(#accentGradient)" opacity="0.5"/>
      <path d="M 40,40 L 120,40 L 100,60 L 60,60 Z" fill="url(#accentGradient)" opacity="0.7"/>
      
      <!-- Frecce di conversione -->
      <path d="M 80,5 L 80,15 M 75,12 L 80,15 L 85,12" stroke="url(#successGradient)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 80,25 L 80,35 M 75,32 L 80,35 L 85,32" stroke="url(#successGradient)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  </g>
  
  <!-- Elementi decorativi minimali (linee astratte) -->
  <g opacity="0.3">
    <line x1="200" y1="400" x2="400" y2="380" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
    <line x1="200" y1="450" x2="350" y2="440" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
    <circle cx="200" cy="400" r="3" fill="#6366f1"/>
    <circle cx="400" cy="380" r="3" fill="#6366f1"/>
  </g>
  
  <!-- Indicatori di velocità (freccette astratte) -->
  <g transform="translate(300, 600)" opacity="0.4">
    <path d="M 0,0 L 40,0 M 35,-5 L 40,0 L 35,5" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 0,30 L 50,30 M 45,25 L 50,30 L 45,35" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Converti SVG in PNG e poi in WebP
const outputPath = join(process.cwd(), 'public', 'images', 'sprint-ottimizzazione-hero.webp');

try {
  const buffer = Buffer.from(svgContent);
  
  await sharp(buffer)
    .resize(width, height, {
      fit: 'fill',
      background: { r: 248, g: 249, b: 250, alpha: 1 }
    })
    .webp({ 
      quality: 90,
      effort: 6
    })
    .toFile(outputPath);
  
  console.log(`✅ Immagine hero creata con successo: ${outputPath}`);
  console.log(`   Dimensioni: ${width}x${height}px`);
} catch (error) {
  console.error('❌ Errore durante la creazione dell\'immagine:', error);
  process.exit(1);
}
