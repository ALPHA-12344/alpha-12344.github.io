/* ==========================================================================
   Alpha Diallo: Portfolio JavaScript
   --------------------------------------------------------------------------
   1. Site settings (EDIT THESE: your WhatsApp, email, GitHub)
   2. Fill in contact links
   3. Mobile navigation (hamburger menu)
   4. Header shadow on scroll
   5. Fade-in on scroll
   6. Projects: build cards + filter buttons
   7. Contact form: validation + sending to Formspree
   8. Footer year
   ========================================================================== */


/* ==========================================================================
   1. SITE SETTINGS: change these to your real details
   ========================================================================== */
const SITE = {
  // Full international number, digits only: no "+", spaces or leading 0.
  // Example: 0241234567 in Ghana becomes "233241234567"
  whatsappNumber: "233544257552",
  // How the number is displayed on the page
  whatsappDisplay: "+233 54 425 7552",
  // Message already typed when someone opens WhatsApp from the site
  whatsappMessage: "Hi Alpha, I saw your portfolio and I'd like to talk about a website.",

  email: "mdalpha24@email.com",

  githubUrl: "https://github.com/ALPHA-12344",
  githubDisplay: "github.com/ALPHA-12344",
};


/* ==========================================================================
   2. FILL IN CONTACT LINKS
   Any element with data-link="whatsapp|email|github" gets the right href.
   Any element with data-text="whatsapp|email|github" gets the right text.
   This way you only change your details in ONE place (above).
   ========================================================================== */
const contactLinks = {
  // encodeURIComponent turns spaces and symbols into a URL-safe format
  whatsapp: `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`,
  email: `mailto:${SITE.email}`,
  github: SITE.githubUrl,
};

const contactTexts = {
  whatsapp: SITE.whatsappDisplay,
  email: SITE.email,
  github: SITE.githubDisplay,
};

document.querySelectorAll("[data-link]").forEach((link) => {
  const key = link.dataset.link;
  link.href = contactLinks[key];

  // Open WhatsApp and GitHub in a new tab (not email: that opens the mail app)
  if (key !== "email") {
    link.target = "_blank";
    link.rel = "noopener"; // security best practice for new tabs
  }
});

document.querySelectorAll("[data-text]").forEach((el) => {
  el.textContent = contactTexts[el.dataset.text];
});


/* ==========================================================================
   3. MOBILE NAVIGATION
   ========================================================================== */
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
const navLinks = nav.querySelectorAll("a");
const desktopQuery = window.matchMedia("(min-width: 768px)");

function openNav() {
  nav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  document.body.classList.add("nav-open");
  navLinks[0].focus(); // move keyboard focus into the menu
}

function closeNav(returnFocus = false) {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
  if (returnFocus) navToggle.focus();
}

function isNavOpen() {
  return nav.classList.contains("is-open");
}

// Hamburger button opens/closes the menu
navToggle.addEventListener("click", () => {
  isNavOpen() ? closeNav() : openNav();
});

// Clicking a link closes the menu (the page then scrolls to that section)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isNavOpen()) closeNav();
  });
});

document.addEventListener("keydown", (event) => {
  if (!isNavOpen()) return;

  // Escape key closes the menu
  if (event.key === "Escape") {
    closeNav(true);
    return;
  }

  // Keep Tab inside the open menu (a "focus trap"), so keyboard users
  // don't end up on hidden content behind it
  if (event.key === "Tab") {
    const focusable = [navToggle, ...navLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// If the screen becomes wide (e.g. phone rotated), close the mobile menu
desktopQuery.addEventListener("change", (event) => {
  if (event.matches) closeNav();
});


/* ==========================================================================
   4. HEADER SHADOW ON SCROLL
   ========================================================================== */
const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();


/* ==========================================================================
   5. FADE-IN ON SCROLL
   IntersectionObserver tells us when an element enters the screen,
   then we add "is-visible" and the CSS fades it in.
   ========================================================================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealObserver = null;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
}

// Start watching one element (or show it straight away if animations are off)
function observeReveal(el) {
  if (revealObserver) {
    revealObserver.observe(el);
  } else {
    el.classList.add("is-visible");
  }
}

document.querySelectorAll(".reveal").forEach(observeReveal);


/* ==========================================================================
   6. PROJECTS
   Builds a card for every project in js/projects.js
   ========================================================================== */
const projectsGrid = document.getElementById("projects-grid");
const projectsStatus = document.getElementById("projects-status");
const filterButtons = document.querySelectorAll(".filter-btn");

// Friendly names for each category (shown on the card)
const CATEGORY_LABELS = {
  business: "Business site",
  webapp: "Web app",
};

// Makes text safe to put inside HTML (stops a stray < or " breaking the page)
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

// Featured projects first; otherwise keep the order from projects.js
function sortProjects(list) {
  return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

// Returns the HTML for one project card
function createProjectCard(project) {
  const title = escapeHTML(project.title);

  const badge = project.featured ? `<span class="badge">Featured</span>` : "";

  const tags = (project.tags || [])
    .map((tag) => `<li class="tag">${escapeHTML(tag)}</li>`)
    .join("");

  // Only create a button if its URL is filled in
  const liveButton = project.liveUrl
    ? `<a class="btn btn-primary btn-sm" href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener">
         <svg class="icon" aria-hidden="true"><use href="#i-external"></use></svg>
         Live demo<span class="visually-hidden"> of ${title} (opens in a new tab)</span>
       </a>`
    : "";

  const codeButton = project.githubUrl
    ? `<a class="btn btn-outline btn-sm" href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener">
         <svg class="icon" aria-hidden="true"><use href="#i-code"></use></svg>
         Code<span class="visually-hidden"> for ${title} on GitHub (opens in a new tab)</span>
       </a>`
    : "";

  const links = liveButton || codeButton
    ? `<div class="project-links">${liveButton}${codeButton}</div>`
    : "";

  // width/height + aspect-ratio in CSS stop the layout jumping while the image loads
  return `
    <article class="project-card reveal">
      <div class="project-media">
        <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.imageAlt || project.title)}"
             width="1200" height="750" loading="lazy" decoding="async">
        ${badge}
      </div>
      <div class="project-body">
        <p class="project-category">${escapeHTML(CATEGORY_LABELS[project.category] || project.category)}</p>
        <h3>${title}</h3>
        <p class="project-desc">${escapeHTML(project.description)}</p>
        <ul class="tag-list" aria-label="Technologies used">${tags}</ul>
        ${links}
      </div>
    </article>`;
}

// Shows the projects that match the chosen filter ("all", "business", "webapp")
function renderProjects(filter = "all") {
  if (typeof projects === "undefined") return; // projects.js failed to load

  const visible = sortProjects(projects).filter(
    (project) => filter === "all" || project.category === filter
  );

  projectsGrid.innerHTML = visible.length
    ? visible.map(createProjectCard).join("")
    : `<p class="projects-empty">No projects in this category yet. Check back soon!</p>`;

  projectsStatus.textContent = `Showing ${visible.length} project${visible.length === 1 ? "" : "s"}.`;

  projectsGrid.querySelectorAll(".reveal").forEach(observeReveal);
}

// Filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn === button)));
    renderProjects(button.dataset.filter);
  });
});

renderProjects();


/* ==========================================================================
   7. CONTACT FORM
   Checks each field, shows clear messages, then sends the form to
   Formspree in the background so the visitor stays on the page.
   ========================================================================== */
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');
const submitLabel = submitButton.querySelector(".btn-label");

// One rule per field. Each returns an error message, or "" if the value is OK.
const validators = {
  name(value) {
    if (!value) return "Please enter your name.";
    if (value.length < 2) return "Your name should be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value) return "Please enter your email address.";
    // simple check: something@something.something
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return "Please enter a valid email address, like name@example.com.";
    }
    return "";
  },
  message(value) {
    if (!value) return "Please write a short message.";
    if (value.length < 10) return "Please add a little more detail (at least 10 characters).";
    return "";
  },
};

// Only the fields that have a rule above
const fields = Array.from(form.elements).filter((field) => validators[field.name]);

// Checks one field, shows/hides its error, returns true if valid
function validateField(field) {
  const message = validators[field.name](field.value.trim());
  const errorEl = document.getElementById(`${field.id}-error`);

  errorEl.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status is-${type}`;
}

fields.forEach((field) => {
  // Check when the visitor leaves a field (only if they typed something)
  field.addEventListener("blur", () => {
    if (field.value.trim()) validateField(field);
  });
  // Once a field shows an error, re-check as they type so it clears quickly
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the normal page reload

  // Validate every field and remember the ones with errors
  const invalidFields = fields.filter((field) => !validateField(field));

  if (invalidFields.length > 0) {
    showStatus("Please fix the highlighted fields and try again.", "error");
    invalidFields[0].focus(); // take the visitor to the first problem
    return;
  }

  // Reminder for you: the Formspree ID hasn't been added yet
  if (form.action.includes("YOUR_FORM_ID")) {
    showStatus("The contact form isn't connected yet. Please message me on WhatsApp or by email instead.", "error");
    return;
  }

  submitButton.disabled = true;
  submitLabel.textContent = "Sending…";
  showStatus("", "");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }, // asks Formspree for a JSON reply instead of a page
    });

    if (!response.ok) throw new Error(`Formspree responded with ${response.status}`);

    form.reset();
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
    showStatus("Thank you! Your message has been sent. I'll get back to you soon.", "success");
  } catch (error) {
    console.error(error);
    showStatus("Sorry, your message couldn't be sent. Please try again, or message me on WhatsApp.", "error");
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "Send message";
  }
});


/* ==========================================================================
   8. FOOTER YEAR (updates automatically every year)
   ========================================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
