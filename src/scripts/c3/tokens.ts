/**
 * Lettura dei design token C.3 (variabili CSS su :root) per il WebGL.
 * Così shader e CSS usano gli stessi colori: nessun valore fisso negli script.
 */
export type RGB = [number, number, number];

/** Converte un colore CSS (#rrggbb, #rgb o rgb()) in [r, g, b] 0–1 */
function parse(value: string): RGB | null {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h =
      hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
  }
  const rgb = v.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const p = rgb[1]
      .split(/[ ,/]+/)
      .filter(Boolean)
      .map(Number);
    return [p[0] / 255, p[1] / 255, p[2] / 255];
  }
  return null;
}

/** Legge un token; se non è risolvibile restituisce il ripiego indicato */
export function token(name: string, fallback: RGB): RGB {
  try {
    return (
      parse(
        getComputedStyle(document.documentElement).getPropertyValue(name),
      ) ?? fallback
    );
  } catch {
    return fallback;
  }
}
