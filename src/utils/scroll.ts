/**
 * Smoothly scrolls to a target DOM element with an offset.
 * Useful when there is a fixed navigation bar at the top of the page.
 * 
 * @param targetId The selector target ID (e.g. '#about', '#projects')
 * @param offset The offset in pixels to subtract from the target position (default: 80)
 */
export const smoothScrollTo = (targetId: string, offset = 80) => {
  const el = document.querySelector(targetId);
  if (el) {
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
