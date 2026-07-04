/* ==========================================================================
   Pottery by Séverine — Animations au scroll
   - Reveal via IntersectionObserver (fade / slide / zoom, avec stagger)
   - Parallaxe douce (hero + éléments [data-parallax])
   Respecte prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------- 1. Reveal au scroll ---------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Pas d'animation : on affiche tout immédiatement.
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // une seule fois
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------- 2. Parallaxe douce ---------------------- */
  if (!reduceMotion) {
    const heroImg = document.querySelector(".hero__media img");
    const parallaxEls = document.querySelectorAll("[data-parallax]");
    let ticking = false;

    function applyParallax() {
      const y = window.scrollY;

      // Hero : léger zoom-out / translation vers le bas
      if (heroImg) {
        const offset = Math.min(y * 0.18, 160);
        heroImg.style.transform = `scale(1.08) translateY(${offset}px)`;
      }

      // Éléments décoratifs avec vitesse personnalisée
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const distance = (rect.top + rect.height / 2) - viewportCenter;
        el.style.transform = `translateY(${(-distance * speed).toFixed(1)}px)`;
      });

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    applyParallax();
  }
})();
