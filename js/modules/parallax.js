export function initParallax() {
  const parallaxSections = document.querySelectorAll('[js-parallax]');
  if (!parallaxSections.length) return;

  const speed = 0.2;
  let ticking = false;

  function updateApproachCircles(windowHeight) {
    const circles = document.querySelectorAll('.njs-approach__circle');
    circles.forEach(circle => {
      const rect = circle.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const overlay = circle.querySelector('.njs-approach__circle-overlay');
        if (overlay) {
          overlay.style.transform = `translate3d(0, ${(progress - 0.5) * 30}px, 0)`;
        }
      }
    });
  }

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    updateApproachCircles(windowHeight);

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

        image.style.transform = `translate3d(0, ${offset}px, 0)`;
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
