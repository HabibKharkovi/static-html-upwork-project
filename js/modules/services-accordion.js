export function initServicesAccordion() {
  const container = document.querySelector('[js-services-scroll]');
  if (!container) return;

  const scrollContainer = container.querySelector('.njs-services__scroll-container');
  const items = container.querySelectorAll('[js-service-item]');
  const visuals = container.querySelectorAll('[js-service-visual]');
  const isDesktop = () => window.innerWidth > 991;

  let activeIndex = 0;

  function setActive(index) {
    // Mobile toggle-off: tapping active item deactivates it
    if (!isDesktop() && index === activeIndex && items[index]?.classList.contains('is-active')) {
      items[index].classList.remove('is-active');
      visuals.forEach((v) => v.classList.remove('is-active'));
      activeIndex = -1;
      return;
    }

    if (index === activeIndex && items[index]?.classList.contains('is-active')) return;
    activeIndex = index;

    items.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
    });

    visuals.forEach((visual, i) => {
      visual.classList.toggle('is-active', i === index);
    });
  }

  // Set first item active by default
  setActive(0);

  // Click handling (works on all screen sizes)
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('js-service-item'), 10);
      setActive(index);
    });
  });

  // Set scroll-container height on desktop so sticky has room to ride
  function applyDesktopHeight() {
    if (!scrollContainer) return;
    if (isDesktop()) {
      scrollContainer.style.height = items.length * 100 + 'vh';
    } else {
      scrollContainer.style.removeProperty('height');
    }
  }

  // Scroll-triggered behavior on desktop
  function onScroll() {
    if (!isDesktop() || !scrollContainer) return;

    const rect = scrollContainer.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = scrollContainer.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate scroll progress through the container
    const scrolled = -containerTop;
    const totalScrollable = containerHeight - viewportHeight;

    if (totalScrollable <= 0) return;

    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

    // Map progress to service index
    const serviceCount = items.length;
    const newIndex = Math.min(
      serviceCount - 1,
      Math.floor(progress * serviceCount)
    );

    if (newIndex >= 0) {
      setActive(newIndex);
    }
  }

  // Debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      applyDesktopHeight();
      onScroll();
    }, 150);
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  // Handle bfcache (back/forward navigation)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      applyDesktopHeight();
      onScroll();
    }
  });

  // Init: apply height and evaluate scroll position
  applyDesktopHeight();
  onScroll();
}
