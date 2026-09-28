import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Several components each ask GSAP's ScrollTrigger to re-measure the page
// once their own layout settles (after mount, after a resize, once fonts
// finish loading, etc.). Every one of those requests is legitimate on its
// own — but ScrollTrigger.refresh() recomputes EVERY trigger registered
// anywhere on the page, not just the caller's. Profiling on a real phone
// showed these requests landing in the same short window right after the
// intro screen unmounts and the whole site mounts at once, so the page
// was paying for that full, expensive recomputation several times back to
// back (an 865ms "forced reflow" in DevTools).
//
// This coalesces every request inside a short window into a single actual
// refresh call, keeping the same "wait for things to settle, then
// re-measure" behaviour each caller wanted, without the redundant cost.
//
// It also waits for scrolling to stop: refresh() measures by jumping the
// page to the top and back, which cancels an in-flight native smooth scroll
// (e.g. HomePage's scrollIntoView to #about, stuck halfway) or a touch fling.
let pendingTimer = null;
let pendingForce = false;
let lastScrollAt = 0;

window.addEventListener('scroll', () => { lastScrollAt = performance.now(); }, { passive: true });

function flush() {
  if (performance.now() - lastScrollAt < 150) {
    pendingTimer = setTimeout(flush, 150);
    return;
  }
  pendingTimer = null;
  const useForce = pendingForce;
  pendingForce = false;
  ScrollTrigger.refresh(useForce);
}

export function requestScrollRefresh(force = false) {
  pendingForce = pendingForce || force;
  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = setTimeout(flush, 120);
}