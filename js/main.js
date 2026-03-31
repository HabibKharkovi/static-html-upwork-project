import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initHeader } from './modules/header.js';
import { initNavOverlay } from './modules/nav-overlay.js';
import { initTextSplit } from './modules/text-split.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initParallax } from './modules/parallax.js';
import { initServicesAccordion } from './modules/services-accordion.js';

function initApp() {
  initSmoothScroll();
  initHeader();
  initNavOverlay();
  initTextSplit();
  initScrollReveal();
  initParallax();
  initServicesAccordion();
}

// Wait for loader to complete before initializing
if (window.__loaderDone) {
  initApp();
} else {
  window.addEventListener('loaderComplete', initApp, { once: true });
}
