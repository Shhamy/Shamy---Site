window.addEventListener("load", () => {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
});

document.querySelectorAll(".booking-form, .newsletter-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.parentElement.querySelector(".form-status");
    const submitButton = form.querySelector("button[type='submit']");
    const originalLabel = submitButton.textContent;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    if (status) {
      status.hidden = true;
      status.className = "form-status";
      status.textContent = "";
    }

    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Le formulaire n'a pas pu être envoyé.");
      }

      window.location.href = new URL("merci.html", window.location.href).href;
    } catch (error) {
      if (status) {
        status.innerHTML =
          'Le formulaire n&rsquo;a pas pu partir automatiquement. Essayez depuis le site publié sur GitHub Pages, ou écrivez directement à <a href="mailto:Shamynpro@gmail.com">Shamynpro@gmail.com</a>.';
        status.classList.add("is-error");
        status.hidden = false;
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
});

const animatedElements = document.querySelectorAll(
  ".section-heading, .event-feature, .secondary-events article, .bio-copy, .bio-stats span, .pro-grid article, .media-card, .contact-panel, .social-card, .proof-layout"
);

animatedElements.forEach((element) => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

animatedElements.forEach((element) => revealObserver.observe(element));

const highlightSection = (target) => {
  target.classList.remove("section-flash");
  void target.offsetWidth;
  target.classList.add("section-flash");
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.hash);

    if (!target) {
      return;
    }

    window.setTimeout(() => highlightSection(target), 520);
  });
});

const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
const pageName = window.location.pathname.split("/").pop() || "index.html";
const sectionLinks = navLinks.filter((link) => link.hash && link.pathname.endsWith(pageName));
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

const setActiveNav = (activeHref) => {
  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const isSamePageLink = link.pathname.endsWith(pageName) && link.hash;
    const normalizedHref = isSamePageLink ? link.hash : linkHref;

    link.classList.toggle("is-active", normalizedHref === activeHref);
  });
};

if (pageName === "pro.html") {
  setActiveNav("pro.html");
} else if (pageName === "medias.html") {
  setActiveNav("medias.html");
} else if (observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveNav(`#${visibleEntry.target.id}`);
      }
    },
    {
      rootMargin: "-34% 0px -50% 0px",
      threshold: [0.12, 0.28, 0.5]
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));

  if (window.location.hash) {
    setActiveNav(window.location.hash);
  } else {
    setActiveNav("#bio");
  }
}
