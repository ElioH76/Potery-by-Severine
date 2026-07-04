/* ==========================================================================
   Pottery by Séverine — Galerie
   - Chargement progressif des images (flou → net)
   - Apparition au scroll (stagger)
   - Filtres par catégorie (+ pré-sélection via ?filter= dans l'URL)
   - Lightbox plein écran : clavier (← → Échap), navigation cyclique
   ========================================================================== */
(function () {
  "use strict";

  const grid = document.querySelector(".masonry");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".masonry__item"));
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const emptyState = document.querySelector(".masonry-empty");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------ 1. Chargement progressif (blur-up) ------------------ */
  items.forEach((item) => {
    const img = item.querySelector("img");
    if (!img) return;
    const markLoaded = () => img.classList.add("is-loaded");
    if (img.complete && img.naturalWidth) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    }
  });

  /* ------------------ 2. Reveal au scroll ------------------ */
  let revealObserver = null;
  function observeReveal(el) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      el.classList.add("is-revealed");
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
    }
    revealObserver.observe(el);
  }
  items.forEach(observeReveal);

  /* ------------------ 3. Filtres ------------------ */
  function applyFilter(filter) {
    let visibleCount = 0;
    items.forEach((item) => {
      const cats = (item.dataset.category || "").split(" ");
      const show = filter === "all" || cats.includes(filter);
      if (show) {
        item.classList.remove("is-hidden");
        // Re-jouer l'apparition
        item.classList.remove("is-revealed");
        requestAnimationFrame(() => observeReveal(item));
        visibleCount++;
      } else {
        item.classList.add("is-hidden");
      }
    });
    if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
  }

  function setActiveButton(btn) {
    filterBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      applyFilter(btn.dataset.filter);
    });
  });

  // Pré-sélection depuis l'URL : galerie.html?filter=vases
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("filter");
  if (preset) {
    const match = filterBtns.find((b) => b.dataset.filter === preset);
    if (match) {
      setActiveButton(match);
      applyFilter(preset);
    }
  }

  /* ------------------ 4. Lightbox ------------------ */
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const lbImg = lightbox.querySelector(".lightbox__img");
  const lbCat = lightbox.querySelector(".lightbox__cat");
  const lbName = lightbox.querySelector(".lightbox__name");
  const lbCounter = lightbox.querySelector(".lightbox__counter");
  const btnClose = lightbox.querySelector(".lightbox__close");
  const btnPrev = lightbox.querySelector(".lightbox__prev");
  const btnNext = lightbox.querySelector(".lightbox__next");

  let currentList = []; // items actuellement visibles
  let currentIndex = 0;
  let lastFocused = null;

  function getVisibleItems() {
    return items.filter((it) => !it.classList.contains("is-hidden"));
  }

  function renderSlide(index) {
    const item = currentList[index];
    if (!item) return;
    const img = item.querySelector("img");
    const full = item.dataset.full || img.currentSrc || img.src;
    const name = item.dataset.name || img.alt || "";
    const cat = item.dataset.catLabel || "";

    lbImg.style.opacity = "0";
    const preload = new Image();
    preload.onload = () => {
      lbImg.src = full;
      lbImg.alt = name;
      lbImg.style.opacity = "1";
    };
    preload.src = full;
    // Si l'image est déjà en cache, onload peut ne pas se déclencher à temps
    if (preload.complete) {
      lbImg.src = full;
      lbImg.alt = name;
      lbImg.style.opacity = "1";
    }

    lbCat.textContent = cat;
    lbName.textContent = name;
    lbCounter.textContent = `${index + 1} / ${currentList.length}`;
  }

  function openLightbox(item) {
    currentList = getVisibleItems();
    currentIndex = currentList.indexOf(item);
    if (currentIndex < 0) currentIndex = 0;
    lastFocused = document.activeElement;
    renderSlide(currentIndex);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open"); // bloque le scroll
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    if (lastFocused) lastFocused.focus();
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
    renderSlide(currentIndex);
  }

  // Ouverture au clic / clavier sur les items
  items.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", () => step(-1));
  btnNext.addEventListener("click", () => step(1));

  // Fermer en cliquant sur le fond (hors image et contrôles)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox__stage")) {
      closeLightbox();
    }
  });

  // Navigation clavier
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    switch (e.key) {
      case "Escape": closeLightbox(); break;
      case "ArrowLeft": step(-1); break;
      case "ArrowRight": step(1); break;
    }
  });

  // Support tactile : swipe gauche/droite
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
