const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const backToTopButton = document.querySelector(".back-to-top");
const currentPage = document.body.dataset.page || window.location.pathname.split("/").pop().replace(".html", "") || "index";

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.dataset.page === currentPage) link.setAttribute("aria-current", "page");
});

const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme) root.setAttribute("data-theme", storedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  });
}

if (backToTopButton) {
  const syncBackToTop = () => backToTopButton.classList.toggle("is-visible", window.scrollY > 480);
  window.addEventListener("scroll", syncBackToTop, { passive: true });
  syncBackToTop();
  backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Form Placeholder Only";
      button.disabled = true;
    }
  });
});
