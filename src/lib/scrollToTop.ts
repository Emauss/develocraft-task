// Smoothly scrolls the window to the top, honouring the user's
// reduced-motion preference (falls back to an instant jump).
export const scrollToTop = () => {
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}
