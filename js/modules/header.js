export function initHeader() {
  const header = document.querySelector('[js-header]');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;
  const threshold = 5;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      // Add/remove scrolled state for backdrop blur
      if (currentScrollY > 50) {
        header.classList.add('njs-header--scrolled');
      } else {
        header.classList.remove('njs-header--scrolled');
      }

      // Hide/show based on scroll direction
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.classList.add('njs-header--hidden');
        } else {
          header.classList.remove('njs-header--hidden');
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
