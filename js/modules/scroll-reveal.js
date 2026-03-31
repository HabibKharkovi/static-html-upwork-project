export function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '[js-text-split], .njs-reveal, [js-reveal]'
  );
  const staggerContainers = document.querySelectorAll('[js-stagger]');

  // Reveal text and generic elements
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Stagger children reveal
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.njs-stagger-item');
          items.forEach((item, i) => {
            item.style.setProperty('--item-index', i);
            item.classList.add('is-revealed');
          });
          staggerObserver.unobserve(entry.target);
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
