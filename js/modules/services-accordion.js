export function initServicesAccordion() {
  const container = document.querySelector('[js-services-scroll]');
  if (!container) return;

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

  // Scroll-triggered behavior on desktop
  function onScroll() {
    if (!isDesktop()) return;

    const scrollContainer = container;
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

  window.addEventListener('scroll', onScroll, { passive: true });

  // Handle resize
  window.addEventListener('resize', () => {
    if (!isDesktop()) {
      // Reset to click-only mode
      container.querySelector('.njs-services__scroll-container')?.style.removeProperty('height');
    }
  });
}
