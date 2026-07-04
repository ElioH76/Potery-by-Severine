/* ==========================================================================
   Pottery by Séverine — Script principal
   - Header : état "verre" au scroll
   - Menu mobile (hamburger) accessible
   - Scroll doux sur les ancres
   - Indication automatique de la section active (scroll-spy)
   - Formulaire de contact (validation + retour visuel, sans backend)
   - Année du footer
   ========================================================================== */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const body = document.body;

  /* ----------------------- 1. Header au scroll ----------------------- */
  const SCROLL_THRESHOLD = 40;
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------------------- 2. Menu mobile ----------------------- */
  function openMenu() {
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
  }
  function closeMenu() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
    // Fermer le menu au clic sur un lien
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });
    // Fermer avec Échap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu();
    });
  }

  /* ----------------------- 3. Scroll doux (ancres) ----------------------- */
  // On gère uniquement les ancres internes commençant par « # »
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 2;
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  });

  /* ----------------------- 4. Scroll-spy ----------------------- */
  // Associe chaque lien d'ancre à sa section pour marquer l'onglet actif.
  const spyLinks = navLinks.filter((l) => l.getAttribute("href").startsWith("#"));
  const sections = spyLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            spyLinks.forEach((link) =>
              link.classList.toggle("is-active", link.getAttribute("href") === id)
            );
          }
        });
      },
      { threshold: 0.2, rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => spyObserver.observe(s));
  }

  /* ----------------------- 5. Formulaire de contact ----------------------- */
  const form = document.querySelector(".form");
  if (form) {
    const feedback = form.querySelector(".form__feedback");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = (form.querySelector("#name") || {}).value || "";
      const firstName = name.trim().split(" ")[0];
      if (feedback) {
        feedback.textContent = `Merci ${firstName} — votre message a bien été noté. Séverine vous répondra très prochainement.`;
        feedback.classList.add("is-visible");
      }
      form.reset();
      // Petit défilement pour montrer le retour visuel
      if (feedback) {
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ----------------------- 6. Année du footer ----------------------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
