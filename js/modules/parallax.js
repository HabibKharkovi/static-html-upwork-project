export function initParallax() {
  initHeroPin();
  initHeroScrollEffects();
  initParallaxSections();
  initApproachCircles();
  initFooterReveal();
  initWordmarkStagger();
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

function initHeroScrollEffects() {
  const hero = document.querySelector('.njs-hero');
  const heroContent = document.querySelector('.njs-hero__content');
  const headerInner = document.querySelector('.njs-header__inner');
  if (!hero) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 769px)');

  if (!motionOk || !isDesktop.matches) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Hero parallax: move up at 30% of scroll speed
    hero.style.transform = 'translateY(' + (scrollY * -0.3) + 'px)';

    // Hero content fade
    if (heroContent) {
      heroContent.style.opacity = Math.max(0, 1 - (scrollY / 1000));
    }

    // Header row fade
    if (headerInner) {
      headerInner.style.opacity = Math.max(0, 1 - (scrollY / vh));
    }
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

  // Disable on resize to mobile
  isDesktop.addEventListener('change', (e) => {
    if (!e.matches) {
      hero.style.transform = '';
      if (heroContent) heroContent.style.opacity = '';
      if (headerInner) headerInner.style.opacity = '';
      window.removeEventListener('scroll', onScroll);
    }
  });
}

function initParallaxSections() {
  const sections = document.querySelectorAll('[js-parallax]');
  if (!sections.length) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionOk) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const image = section.querySelector('.njs-parallax__image');
      if (!image) return;

      const speed = parseFloat(section.dataset.speed) || 0.5;
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;

      // Only animate when section is near viewport
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = (scrollY - sectionTop) * (1 - speed);
        image.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
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

function initFooterReveal() {
  const wrapper = document.querySelector('.njs-footer-wrapper');
  const footer = document.querySelector('.njs-footer');
  const overlay = document.querySelector('.njs-footer__overlay');

  if (!wrapper || !footer) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 769px)');

  if (!motionOk || !isDesktop.matches) return;

  let ticking = false;

  function update() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight;

    // How far the wrapper top has scrolled past the viewport bottom
    // wrapperRect.top starts positive (below viewport), goes negative (above)
    // We want progress from when wrapper top hits viewport bottom to when it reaches viewport top
    const scrollRange = vh;
    const progress = Math.max(0, Math.min(1, (vh - wrapperRect.top) / scrollRange));

    if (progress > 0) {
      footer.classList.add('is-active');
      // Animate translateY from 100% to 0
      const pct = (1 - progress) * 100;
      footer.style.transform = 'translateY(' + pct + '%)';

      // Animate overlay opacity from 1 to 0
      if (overlay) {
        overlay.style.opacity = 1 - progress;
      }
    } else {
      footer.classList.remove('is-active');
      footer.style.transform = 'translateY(100%)';
      if (overlay) {
        overlay.style.opacity = '1';
      }
    }
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

  isDesktop.addEventListener('change', (e) => {
    if (!e.matches) {
      footer.style.transform = '';
      if (overlay) overlay.style.opacity = '';
      footer.classList.remove('is-active');
    }
  });
}

function initWordmarkStagger() {
  const wordmark = document.querySelector('.njs-hero__wordmark');
  if (!wordmark) return;

  const spans = wordmark.querySelectorAll('.njs-hero__wordmark-text span');
  if (!spans.length) return;

  // Set stagger delays on each span
  spans.forEach((span, i) => {
    span.style.transitionDelay = (i * 0.1) + 's';
  });

  function trigger() {
    wordmark.classList.add('is-animated');
  }

  // Trigger 2000ms after loader completes
  if (window.__loaderDone) {
    setTimeout(trigger, 2000);
  } else {
    window.addEventListener('loaderComplete', () => {
      setTimeout(trigger, 2000);
    });
  }
}
