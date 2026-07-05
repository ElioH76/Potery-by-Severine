/* ==========================================================================
   Pottery by Séverine — Système de motion
   - Typographie cinétique : titres révélés mot par mot (masque)
   - Accroches révélées mot à mot (fondu)
   - Révélation « rideau » des images ([data-curtain])
   - Reveal générique ([data-reveal]) + parallaxe douce
   - Trait du parcours savoir-faire qui se dessine

   Révélation pilotée par la POSITION au scroll (getBoundingClientRect) plutôt
   que par IntersectionObserver : robuste dans tous les environnements
   (y compris les panneaux de preview), et dégradé accessible sous
   prefers-reduced-motion (le CSS y remplace les mouvements par un fondu).
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ======================================================================
     Registre de révélation au scroll
     ====================================================================== */
  const items = [];
  function register(el, onReveal) {
    items.push({ el: el, cb: onReveal });
  }
  function addVisible(el) { el.classList.add("is-visible"); }

  function check() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const rect = it.el.getBoundingClientRect();
      // Déclenche quand le haut de l'élément franchit 90 % de la hauteur d'écran
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        (it.cb || addVisible)(it.el);
        items.splice(i, 1);
      }
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => { check(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("load", check);

  /* ======================================================================
     1. Découpe du texte en mots (préserve <em>, <br>, etc.)
     ====================================================================== */
  function splitWords(root) {
    const build = (node, out) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (part === "") return;
            if (/^\s+$/.test(part)) {
              out.appendChild(document.createTextNode(part));
            } else {
              const word = document.createElement("span");
              word.className = "word";
              const inner = document.createElement("span");
              inner.className = "word__i";
              inner.textContent = part;
              word.appendChild(inner);
              out.appendChild(word);
            }
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === "BR") {
            out.appendChild(document.createElement("br"));
          } else {
            const clone = child.cloneNode(false); // préserve <em> & sa mise en forme
            build(child, clone);
            out.appendChild(clone);
          }
        }
      });
    };
    const frag = document.createDocumentFragment();
    build(root, frag);
    root.innerHTML = "";
    root.appendChild(frag);
  }

  function setupSplit(el, mode, step, maxDelay) {
    el.removeAttribute("data-reveal");
    el.removeAttribute("data-delay");
    el.setAttribute("data-anim", mode);
    splitWords(el);
    el.querySelectorAll(".word__i").forEach((inner, i) => {
      inner.style.transitionDelay = Math.min(i * step, maxDelay).toFixed(3) + "s";
    });
    register(el);
  }

  // Titres serif de section : révélation mot par mot derrière un masque.
  // (Le titre du hero garde son entrée « fade-in-up » propre, sans doublon.)
  document
    .querySelectorAll(".section__title, .gallery-hero .display")
    .forEach((el) => setupSplit(el, "title", 0.055, 0.6));

  // Accroches : apparition mot à mot, plus rapide et plus discrète
  document
    .querySelectorAll(".section__head .lead, .gallery-hero .lead")
    .forEach((el) => setupSplit(el, "lead", 0.014, 0.45));

  /* ======================================================================
     2. Reveal générique + rideaux d'images
     ====================================================================== */
  document.querySelectorAll("[data-reveal]").forEach((el) => register(el));
  document.querySelectorAll("[data-curtain]").forEach((el) => register(el));

  /* ======================================================================
     3. Trait du parcours savoir-faire qui se dessine
     ====================================================================== */
  const process = document.querySelector(".process");
  if (process) register(process, (el) => el.classList.add("is-drawn"));

  /* ======================================================================
     4. Parallaxe douce (hero + [data-parallax]) — désactivée en reduced-motion
     ====================================================================== */
  if (!reduceMotion) {
    const heroImg = document.querySelector(".hero__media img");
    const parallaxEls = document.querySelectorAll("[data-parallax]");
    let pTicking = false;

    function applyParallax() {
      const y = window.scrollY;
      if (heroImg) {
        const offset = Math.min(y * 0.18, 160);
        heroImg.style.transform = `scale(1.08) translateY(${offset}px)`;
      }
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${(-distance * speed).toFixed(1)}px)`;
      });
      pTicking = false;
    }
    window.addEventListener("scroll", () => {
      if (!pTicking) { window.requestAnimationFrame(applyParallax); pTicking = true; }
    }, { passive: true });
    applyParallax();
  }

  /* Première passe : révèle ce qui est déjà visible au chargement. */
  check();
})();
