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
      "theme-constructivisme",
      "theme-style-suisse",
      "theme-constructivisme-suisse",
      "theme-ecole-polonaise"
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

    const peopleData = {
      "alphonse-mucha": { name: "Alphonse Mucha", years: "1860-1939", movement: "Art nouveau", bio: "Illustrateur et affichiste tcheque, figure majeure du style Art nouveau parisien.", keyWork: "Serie d'affiches pour JOB Cigarettes (1896).", link: "https://fr.wikipedia.org/wiki/Alfons_Mucha" },
      "henri-de-toulouse-lautrec": { name: "Henri de Toulouse-Lautrec", years: "1864-1901", movement: "Art nouveau", bio: "Peintre et affichiste francais, pionnier de l'affiche moderne liee aux spectacles parisiens.", keyWork: "Affiches du Moulin Rouge (annees 1890).", link: "https://fr.wikipedia.org/wiki/Henri_de_Toulouse-Lautrec" },
      "fortunato-depero": { name: "Fortunato Depero", years: "1892-1960", movement: "Futurisme italien", bio: "Artiste et designer italien, connu pour ses compositions dynamiques et mecaniques.", keyWork: "Depero Futurista, livre boulonne (1927).", link: "https://fr.wikipedia.org/wiki/Fortunato_Depero" },
      "bruno-munari": { name: "Bruno Munari", years: "1907-1998", movement: "Futurisme italien", bio: "Designer, artiste et theoricien italien, a la frontiere entre experimentation et pedagogie.", keyWork: "Recherches visuelles et livres experimentaux du XXe siecle.", link: "https://fr.wikipedia.org/wiki/Bruno_Munari" },
      "am-cassandre": { name: "A. M. Cassandre", years: "1901-1968", movement: "Art deco", bio: "Affichiste et typographe franco-ukrainien, maitre des affiches geometriques de l'entre-deux-guerres.", keyWork: "Affiche Normandie (1935).", link: "https://fr.wikipedia.org/wiki/Adolphe_Jean-Marie_Mouron" },
      "jean-carlu": { name: "Jean Carlu", years: "1900-1997", movement: "Art deco", bio: "Affichiste francais associe aux formes simplifiees et aux contrastes forts.", keyWork: "Affiches publicitaires et culturelles des annees 1920-1930.", link: "https://fr.wikipedia.org/wiki/Jean_Carlu" },
      "paul-colin": { name: "Paul Colin", years: "1892-1985", movement: "Annees folles", bio: "Affichiste francais celebre pour son travail dans le spectacle, le music-hall et le jazz.", keyWork: "Affiches de La Revue Negre (1925).", link: "https://fr.wikipedia.org/wiki/Paul_Colin" },
      "charles-loupot": { name: "Charles Loupot", years: "1892-1962", movement: "Annees folles", bio: "Affichiste francais au style epure, marque par la force des silhouettes et des aplats.", keyWork: "Affiches publicitaires iconiques des annees 1920-1930.", link: "https://fr.wikipedia.org/wiki/Charles_Loupot" },
      "piet-zwart": { name: "Piet Zwart", years: "1885-1977", movement: "De Stijl", bio: "Designer neerlandais, pionnier de la mise en page moderne basee sur la grille.", keyWork: "Catalogues NKF et compositions typographiques modulaires.", link: "https://fr.wikipedia.org/wiki/Piet_Zwart" },
      "paul-schuitema": { name: "Paul Schuitema", years: "1897-1973", movement: "De Stijl", bio: "Graphiste neerlandais proche des avant-gardes constructives et de la photographie moderne.", keyWork: "Affiches et compositions phototypographiques des annees 1920-1930.", link: "https://en.wikipedia.org/wiki/Paul_Schuitema" },
      "herbert-bayer": { name: "Herbert Bayer", years: "1900-1985", movement: "Bauhaus", bio: "Designer autrichien du Bauhaus, connu pour son alphabet universal et son approche fonctionnelle.", keyWork: "Universal Typeface (1925).", link: "https://fr.wikipedia.org/wiki/Herbert_Bayer" },
      "joost-schmidt": { name: "Joost Schmidt", years: "1893-1948", movement: "Bauhaus", bio: "Graphiste allemand, auteur d'affiches emblematiques de l'ecole du Bauhaus.", keyWork: "Affiche Bauhaus Ausstellung (1923).", link: "https://fr.wikipedia.org/wiki/Joost_Schmidt" },
      "alexander-rodchenko": { name: "Alexander Rodchenko", years: "1891-1956", movement: "Constructivisme russe", bio: "Artiste et designer sovietique, figure cle du photomontage et de l'affiche politique.", keyWork: "Affiche Books! (1924).", link: "https://fr.wikipedia.org/wiki/Alexandre_Rodtchenko" },
      "gustav-klutsis": { name: "Gustav Klutsis", years: "1895-1938", movement: "Constructivisme russe", bio: "Artiste letton de l'avant-garde sovietique, connu pour ses montages propagandistes.", keyWork: "Series d'affiches politiques photomontees (annees 1930).", link: "https://en.wikipedia.org/wiki/Gustav_Klutsis" },
      "josef-muller-brockmann": { name: "Josef Muller-Brockmann", years: "1914-1996", movement: "Style suisse", bio: "Graphiste suisse majeur du style typographique international, connu pour ses grilles rigoureuses et ses affiches de concerts.", keyWork: "Series d'affiches de la Tonhalle de Zurich (annees 1950-1960).", link: "https://fr.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann" },
      "armin-hofmann": { name: "Armin Hofmann", years: "1920-2020", movement: "Style suisse", bio: "Designer et pedagogue suisse, cofondateur d'une approche moderniste basee sur le contraste, la typographie et la composition claire.", keyWork: "Affiches de la Schule fur Gestaltung Basel et enseignement du graphisme moderne.", link: "https://en.wikipedia.org/wiki/Armin_Hofmann" },
      "max-bill": { name: "Max Bill", years: "1908-1994", movement: "Constructivisme suisse", bio: "Artiste, architecte et designer suisse lie a l'art concret, promoteur d'une pensee visuelle rationnelle et systemique.", keyWork: "Affiches et systemes graphiques pour expositions d'art concret.", link: "https://fr.wikipedia.org/wiki/Max_Bill" },
      "richard-paul-lohse": { name: "Richard Paul Lohse", years: "1902-1988", movement: "Constructivisme suisse", bio: "Artiste et graphiste suisse de l'art concret, connu pour ses structures modulaires et ses compositions serielles.", keyWork: "Compositions systematiques et travaux graphiques modulaires (annees 1940-1970).", link: "https://en.wikipedia.org/wiki/Richard_Paul_Lohse" },
      "henryk-tomaszewski": { name: "Henryk Tomaszewski", years: "1914-2005", movement: "Ecole polonaise d'affiche", bio: "Graphiste polonais majeur, precurseur de l'affiche culturelle expressive d'apres-guerre.", keyWork: "Affiches de theatre et de cinema polonaises (annees 1950-1970).", link: "https://fr.wikipedia.org/wiki/Henryk_Tomaszewski_(graphiste)" },
      "jan-lenica": { name: "Jan Lenica", years: "1928-2001", movement: "Ecole polonaise d'affiche", bio: "Affichiste et illustrateur polonais, reconnu pour son style metaphorique et surrealisant.", keyWork: "Affiches de cinema et de theatre, travail graphique international.", link: "https://fr.wikipedia.org/wiki/Jan_Lenica" }
    };

    const personModal = document.getElementById("person-modal");
    const personName = document.getElementById("person-name");
    const personMeta = document.getElementById("person-meta");
    const personBio = document.getElementById("person-bio");
    const personWork = document.getElementById("person-work");
    const personLink = document.getElementById("person-link");
    const personCloseButton = document.getElementById("person-close");
    const figureNames = document.querySelectorAll(".figure-name");

    const closePersonModal = () => {
      if (!personModal) return;
      personModal.classList.remove("open");
      personModal.setAttribute("aria-hidden", "true");
      if (personName) personName.textContent = "";
      if (personMeta) personMeta.textContent = "";
      if (personBio) personBio.textContent = "";
      if (personWork) personWork.textContent = "";
      if (personLink) personLink.href = "#";
    };

    const openPersonModal = (personKey) => {
      const person = peopleData[personKey];
      if (!person || !personModal) return;
      personName.textContent = person.name;
      personMeta.textContent = `${person.years} - ${person.movement}`;
      personBio.textContent = person.bio;
      personWork.textContent = `Oeuvre cle: ${person.keyWork}`;
      personLink.href = person.link;
      personModal.classList.add("open");
      personModal.setAttribute("aria-hidden", "false");
    };

    figureNames.forEach((figure) => {
      figure.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const personKey = figure.dataset.person;
        if (personKey) {
          openPersonModal(personKey);
        }
      });
    });

    if (personCloseButton) {
      personCloseButton.addEventListener("click", closePersonModal);
    }

    if (personModal) {
      personModal.addEventListener("click", (event) => {
        if (event.target === personModal) {
          closePersonModal();
        }
      });
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const mediaLinks = document.querySelectorAll(".media-link");
    const factButton = document.getElementById("fact-button");
    const factBox = document.getElementById("fact-box");
    const copyUrlButton = document.getElementById("copy-url-button");
    const copyOpenSectionButton = document.getElementById("copy-open-section-button");
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

    const hideCursorGlow = () => {
      document.body.classList.remove("has-cursor-glow");
    };

    if (supportsFinePointer) {
      document.addEventListener("mousemove", (event) => {
        document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
        document.body.classList.add("has-cursor-glow");
      }, { passive: true });

      window.addEventListener("mouseout", (event) => {
        if (!event.relatedTarget) {
          hideCursorGlow();
        }
      });

      window.addEventListener("blur", hideCursorGlow);
    }

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
      if (event.key !== "Escape") return;
      if (personModal && personModal.classList.contains("open")) {
        closePersonModal();
        return;
      }
      if (lightbox.classList.contains("open")) {
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

    const copyTextWithFallback = async (text) => {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const hiddenField = document.createElement("textarea");
      hiddenField.value = text;
      hiddenField.setAttribute("readonly", "");
      hiddenField.style.position = "fixed";
      hiddenField.style.top = "-9999px";
      hiddenField.style.left = "-9999px";
      document.body.append(hiddenField);
      hiddenField.focus();
      hiddenField.select();
      const didCopy = document.execCommand("copy");
      hiddenField.remove();
      return didCopy;
    };

    if (copyUrlButton) {
      copyUrlButton.addEventListener("click", async () => {
        const currentUrl = window.location.href;
        const defaultMessage = "Clique sur « Fait aléatoire » pour afficher une anecdote de design.";
        try {
          const copied = await copyTextWithFallback(currentUrl);
          if (!copied) throw new Error("Impossible de copier l'URL");
          copyUrlButton.textContent = "URL copiee";
          if (factBox) {
            factBox.textContent = `URL copiee: ${currentUrl}`;
          }
        } catch (error) {
          console.error("Copie URL impossible:", error);
          copyUrlButton.textContent = "Echec copie";
          if (factBox) {
            factBox.textContent = "Impossible de copier automatiquement. Copie manuelle: " + currentUrl;
          }
        } finally {
          window.setTimeout(() => {
            copyUrlButton.textContent = "Copier URL";
            if (factBox && factBox.textContent.startsWith("URL copiee:")) {
              factBox.textContent = defaultMessage;
            }
          }, 2200);
        }
      });
    }

    const setButtonFeedback = (button, label, delayMs = 1600) => {
      if (!button) return;
      const original = button.dataset.labelOriginal || button.textContent;
      button.dataset.labelOriginal = original;
      button.textContent = label;
      window.setTimeout(() => {
        button.textContent = original;
      }, delayMs);
    };

    const escapeHtml = (value) =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");

    const getSectionPayload = (card) => {
      const content = card.querySelector(".card-content");
      const title = card.querySelector(".title")?.textContent?.trim() || "Section";
      const year = content?.querySelector(".year")?.textContent?.trim() || "";
      const desc = content?.querySelector(".desc")?.textContent?.trim() || "";
      const details = [...(content?.querySelectorAll(".details li") || [])].map((li) => li.textContent.trim());
      const medias = [...(content?.querySelectorAll(".media-link") || [])].map((link) => {
        const img = link.querySelector("img");
        const caption = link.querySelector(".media-caption")?.textContent?.trim() || "";
        const src = img?.getAttribute("src") ? new URL(img.getAttribute("src"), window.location.href).href : "";
        const href = link.getAttribute("href") ? new URL(link.getAttribute("href"), window.location.href).href : src;
        return {
          caption,
          alt: img?.alt?.trim() || caption || "Image",
          src,
          href
        };
      });

      return { content, title, year, desc, details, medias };
    };

    const copySection = async (card, button) => {
      const payload = getSectionPayload(card);
      const plainParts = [
        `# ${payload.title}`,
        payload.year ? `Periode: ${payload.year}` : "",
        payload.desc,
        "",
        "Details:",
        ...payload.details.map((line) => `- ${line}`),
        "",
        "Images:"
      ];
      payload.medias.forEach((media, index) => {
        plainParts.push(
          `${index + 1}. ${media.caption || media.alt}`,
          `   - Source: ${media.href}`,
          `   - Image: ${media.src}`,
          `   - Markdown: ![${media.alt}](${media.src})`
        );
      });
      const plainText = plainParts.filter(Boolean).join("\n");

      const detailsHtml = payload.details.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
      const mediaHtml = payload.medias
        .map(
          (media) => `
            <figure style="margin:0 0 12px;">
              <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt)}" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #d4d4d4;" />
              <figcaption style="font-size:12px;margin-top:6px;">
                ${escapeHtml(media.caption || media.alt)} - <a href="${escapeHtml(media.href)}">${escapeHtml(media.href)}</a>
              </figcaption>
            </figure>
          `
        )
        .join("");
      const htmlText = `
        <article>
          <h2>${escapeHtml(payload.title)}</h2>
          ${payload.year ? `<p><strong>Periode:</strong> ${escapeHtml(payload.year)}</p>` : ""}
          ${payload.desc ? `<p>${escapeHtml(payload.desc)}</p>` : ""}
          <ul>${detailsHtml}</ul>
          <section>${mediaHtml}</section>
        </article>
      `;

      try {
        if (window.ClipboardItem && navigator.clipboard?.write) {
          const item = new ClipboardItem({
            "text/plain": new Blob([plainText], { type: "text/plain" }),
            "text/html": new Blob([htmlText], { type: "text/html" })
          });
          await navigator.clipboard.write([item]);
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(plainText);
        } else {
          throw new Error("Clipboard API indisponible");
        }
        setButtonFeedback(button, "Copiee");
      } catch (error) {
        console.error("Copie section impossible:", error);
        setButtonFeedback(button, "Echec copie");
      }
    };

    if (copyOpenSectionButton) {
      copyOpenSectionButton.addEventListener("click", async () => {
        const openCard = document.querySelector(".card.open");
        if (!openCard) {
          setButtonFeedback(copyOpenSectionButton, "Ouvre une section");
          return;
        }
        await copySection(openCard, copyOpenSectionButton);
      });
    }
