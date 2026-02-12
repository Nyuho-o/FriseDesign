    const events = [...document.querySelectorAll(".event")];
    const timeline = document.querySelector(".timeline");
    const mainTitle = document.querySelector(".hero h1");

    const toMs = (timeValue) => {
      if (!timeValue) return 0;
      const value = timeValue.toString().trim();
      if (value.endsWith("ms")) return parseFloat(value);
      if (value.endsWith("s")) return parseFloat(value) * 1000;
      return parseFloat(value) || 0;
    };

    let cascadeStarted = false;
    const startCascade = () => {
      if (cascadeStarted) return;
      cascadeStarted = true;
      events.forEach((event, i) => {
        event.style.setProperty("--cascade-delay", `${i * 140}ms`);
      });
      timeline.classList.add("cascade");
    };

    if (mainTitle) {
      mainTitle.addEventListener("animationend", startCascade, { once: true });
      const computed = getComputedStyle(mainTitle);
      const fallbackDelay = toMs(computed.animationDuration) + toMs(computed.animationDelay) + 120;
      setTimeout(startCascade, fallbackDelay);
    } else {
      startCascade();
    }

    const toggles = document.querySelectorAll(".card-toggle");
    const themeClasses = [
      "theme-art-nouveau",
      "theme-futurisme",
      "theme-art-deco",
      "theme-annees-folles",
      "theme-destijl",
      "theme-bauhaus",
      "theme-constructivisme"
    ];

    const syncThemeWithOpenSection = () => {
      const openCards = [...document.querySelectorAll(".card.open")];
      const activeCard = openCards[openCards.length - 1];
      document.body.classList.remove(...themeClasses);
      const rootStyles = getComputedStyle(document.documentElement);
      const defaultPageFont = rootStyles.getPropertyValue("--font-interface").trim() || "Manrope";
      if (!activeCard) {
        document.body.style.setProperty("--font-page", defaultPageFont);
        return;
      }
      const themeName = activeCard.closest(".event")?.dataset.theme;
      if (themeName) {
        document.body.classList.add(`theme-${themeName}`);
      }
      const activeEvent = activeCard.closest(".event");
      if (activeEvent) {
        const sectionFont = getComputedStyle(activeEvent).getPropertyValue("--section-font").trim();
        if (sectionFont) {
          document.body.style.setProperty("--font-page", sectionFont);
        }
      }
    };

    const toggleSection = (toggle) => {
      const card = toggle.closest(".card");
      const isAlreadyOpen = card.classList.contains("open");

      document.querySelectorAll(".card.open").forEach((openCard) => {
        openCard.classList.remove("open");
        const openToggle = openCard.querySelector(".card-toggle");
        if (openToggle) {
          openToggle.setAttribute("aria-expanded", "false");
        }
      });

      if (!isAlreadyOpen) {
        card.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        toggle.setAttribute("aria-expanded", "false");
      }

      syncThemeWithOpenSection();
    };

    const clickTimers = new WeakMap();
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const existingTimer = clickTimers.get(toggle);
        if (existingTimer) clearTimeout(existingTimer);
        const clickDelayId = setTimeout(() => {
          toggleSection(toggle);
        }, 220);
        clickTimers.set(toggle, clickDelayId);
      });
    });

    const movementTitles = document.querySelectorAll(".card-toggle .title");
    movementTitles.forEach((title) => {
      title.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const toggle = title.closest(".card-toggle");
        if (!toggle) return;
        const pendingTimer = clickTimers.get(toggle);
        if (pendingTimer) clearTimeout(pendingTimer);
        const wikiUrl = title.closest(".event")?.dataset.wiki;
        if (wikiUrl) {
          window.open(wikiUrl, "_blank", "noopener,noreferrer");
        }
      });
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const mediaLinks = document.querySelectorAll(".media-link");
    const factButton = document.getElementById("fact-button");
    const factBox = document.getElementById("fact-box");

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";
    };

    mediaLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const img = link.querySelector("img");
        const caption = link.querySelector(".media-caption");
        if (!img) return;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || "";
        lightboxCaption.textContent = caption ? caption.textContent : "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });

    const designFacts = [
      "L'ecole du Bauhaus a reuni art, artisanat et industrie dans une meme methode de design.",
      "La celebre affiche \"Books!\" de Rodchenko a contribue a definir le langage visuel constructiviste.",
      "De Stijl favorisait des grilles strictes et les couleurs primaires pour atteindre une harmonie visuelle.",
      "L'Art nouveau integrait la typographie directement dans l'illustration ornementale et l'architecture.",
      "La typographie Futura s'est inspiree des principes geometriques des mouvements modernistes.",
      "Un bon systeme de design commence souvent par les espacements et les echelles typographiques.",
      "Le mobilier Bauhaus a valorise l'acier tubulaire pour combiner legerete et production en serie.",
      "Les affiches constructivistes utilisaient de fortes diagonales pour transmettre urgence et mouvement."
    ];

    if (factButton && factBox) {
      let lastFactIndex = -1;
      factButton.addEventListener("click", () => {
        let nextIndex = Math.floor(Math.random() * designFacts.length);
        if (designFacts.length > 1) {
          while (nextIndex === lastFactIndex) {
            nextIndex = Math.floor(Math.random() * designFacts.length);
          }
        }
        lastFactIndex = nextIndex;
        factBox.textContent = designFacts[nextIndex];
      });
    }
