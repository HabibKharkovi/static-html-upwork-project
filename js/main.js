import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initHeader } from './modules/header.js';
import { initNavOverlay } from './modules/nav-overlay.js';
import { initTextSplit } from './modules/text-split.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initParallax } from './modules/parallax.js';
import { initServicesAccordion } from './modules/services-accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize smooth scroll first
  initSmoothScroll();

  // Header and navigation
  initHeader();
  initNavOverlay();

  // Text splitting must happen before scroll reveal
  initTextSplit();

  // Scroll-based animations
  initScrollReveal();
  initParallax();

  // Interactive components
  initServicesAccordion();
});
