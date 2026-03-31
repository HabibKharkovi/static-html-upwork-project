export function initNavOverlay() {
  const toggle = document.querySelector('[js-nav-toggle]');
  const overlay = document.querySelector('[js-nav-overlay]');
  const header = document.querySelector('[js-header]');
  const links = overlay?.querySelectorAll('.njs-nav-overlay__link');

  if (!toggle || !overlay) return;

  let isOpen = false;

  function openNav() {
    isOpen = true;
    overlay.classList.add('is-open');
    toggle.classList.add('is-open');
    header.classList.add('is-nav-open');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
  }

  function closeNav() {
    isOpen = false;
    overlay.classList.remove('is-open');
    toggle.classList.remove('is-open');
    header.classList.remove('is-nav-open');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
  }

  toggle.addEventListener('click', () => {
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close on link click + smooth scroll
  links?.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeNav();
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            if (window.__lenis) {
              window.__lenis.scrollTo(target, { offset: -80 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 300);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });
}
