export function initParallax() {
  initHeroPin();
  initParallaxSections();
  initApproachCircles();
}

function initHeroPin() {
  const hero = document.querySelector('.njs-hero');
  if (!hero) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 769px)');

  if (!motionOk) return;

  let spacer = null;
  let resizeObserver = null;

  function createSpacer() {
    if (spacer) return;
    spacer = document.createElement('div');
    spacer.className = 'njs-hero-spacer';
    spacer.style.height = hero.offsetHeight + 'px';
    hero.after(spacer);

    resizeObserver = new ResizeObserver(() => {
      if (spacer) {
        spacer.style.height = hero.offsetHeight + 'px';
      }
    });
    resizeObserver.observe(hero);
  }

  function removeSpacer() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (spacer) {
      spacer.remove();
      spacer = null;
    }
  }

  function handleBreakpoint(e) {
    if (e.matches) {
      createSpacer();
    } else {
      removeSpacer();
    }
  }

  // Initial check
  handleBreakpoint(isDesktop);

  // Listen for breakpoint changes
  isDesktop.addEventListener('change', handleBreakpoint);
}

function initParallaxSections() {
  const sections = document.querySelectorAll('[js-parallax]');
  if (!sections.length) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionOk) return;

  const isMobile = window.innerWidth <= 768;
  const travel = isMobile ? 150 : 350;

  sections.forEach((section) => {
    const image = section.querySelector('.njs-parallax__image');
    if (!image) return;

    gsap.fromTo(image,
      { y: travel, opacity: 0.5 },
      {
        y: -travel,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

function initApproachCircles() {
  const circles = document.querySelectorAll('.njs-approach__circle');
  if (!circles.length) return;

  let ticking = false;

  function update() {
    const windowHeight = window.innerHeight;
    circles.forEach((circle) => {
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

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}
