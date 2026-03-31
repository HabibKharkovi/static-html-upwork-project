export function initParallax() {
  const parallaxSections = document.querySelectorAll('[js-parallax]');
  if (!parallaxSections.length) return;

  const speed = 0.2;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    parallaxSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionHeight = rect.height;

      // Only process if section is in or near viewport
      if (
        scrollY + windowHeight > sectionTop - 200 &&
        scrollY < sectionTop + sectionHeight + 200
      ) {
        const image = section.querySelector('.njs-parallax__image');
        if (!image) return;

        // Calculate how far through the section the scroll is
        const progress =
          (scrollY + windowHeight - sectionTop) /
          (windowHeight + sectionHeight);
        const offset = (progress - 0.5) * sectionHeight * speed;

        // Scale effect: starts at 1.05, reduces to 1.0 as section scrolls through
        const scale = 1.05 - (progress * 0.05);

        image.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`;
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax();
}
