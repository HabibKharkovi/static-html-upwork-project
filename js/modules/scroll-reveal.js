export function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '[js-text-split], .njs-reveal, [js-reveal]'
  );
  const staggerContainers = document.querySelectorAll('[js-stagger]');

  // Hero word-by-word stagger: set delays before observer fires
  const heroTitle = document.querySelector('.njs-hero__title');
  if (heroTitle) {
    const heroWords = heroTitle.querySelectorAll('.njs-hero__word');
    heroWords.forEach((word, i) => {
      word.style.transitionDelay = `${i * 0.06}s`;
    });
  }

  // Hero elements use once-only reveal (fixed position, always in viewport)
  const heroSection = document.querySelector('.njs-hero');

  // Reveal text and generic elements — replay on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          // Don't remove from hero elements (they're fixed and always visible)
          if (!heroSection || !heroSection.contains(entry.target)) {
            entry.target.classList.remove('is-revealed');
          }
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Stagger children reveal — replay on scroll
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.njs-stagger-item');
          items.forEach((item, i) => {
            item.style.setProperty('--item-index', i);
            item.classList.add('is-revealed');
          });
        } else {
          const items = entry.target.querySelectorAll('.njs-stagger-item');
          items.forEach((item) => {
            item.classList.remove('is-revealed');
          });
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  staggerContainers.forEach((el) => staggerObserver.observe(el));
}
