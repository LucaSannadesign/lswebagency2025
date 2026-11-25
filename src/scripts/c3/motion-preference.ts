/** The Vercel design preview is explicitly intended to demonstrate motion.
 * On the public custom domain, honor the operating-system preference.
 * An explicit play/pause choice always wins in either environment.
 */
export function previewAutoplay(): boolean {
  return /^lswebagency2025(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(location.hostname);
}
