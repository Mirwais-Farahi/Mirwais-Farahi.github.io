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

const articleCards = Array.from(document.querySelectorAll("[data-article-card]"));
const articleSearch = document.querySelector("[data-article-search]");
const articleType = document.querySelector("[data-article-type]");
const articleStatus = document.querySelector("[data-article-status]");
const articleCategoryButtons = Array.from(document.querySelectorAll("[data-article-category]"));
const articleCount = document.querySelector("[data-article-count]");
const articleEmpty = document.querySelector("[data-article-empty]");

if (articleCards.length) {
  let activeCategory = "all";

  const syncArticleFilters = () => {
    const query = (articleSearch?.value || "").trim().toLowerCase();
    const type = articleType?.value || "all";
    const status = articleStatus?.value || "all";
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const category = card.dataset.category || "";
      const cardType = card.dataset.type || "";
      const cardStatus = card.dataset.status || "";
      const keywords = `${card.textContent || ""} ${card.dataset.keywords || ""}`.toLowerCase();
      const matchesCategory = activeCategory === "all" || category.includes(activeCategory);
      const matchesType = type === "all" || cardType === type;
      const matchesStatus = status === "all" || cardStatus === status;
      const matchesQuery = !query || keywords.includes(query);
      const isVisible = matchesCategory && matchesType && matchesStatus && matchesQuery;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (articleCount) articleCount.textContent = `${visibleCount} ${visibleCount === 1 ? "article" : "articles"}`;
    if (articleEmpty) articleEmpty.hidden = visibleCount !== 0;
  };

  articleCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.articleCategory || "all";
      articleCategoryButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      syncArticleFilters();
    });
  });

  articleSearch?.addEventListener("input", syncArticleFilters);
  articleType?.addEventListener("change", syncArticleFilters);
  articleStatus?.addEventListener("change", syncArticleFilters);
  syncArticleFilters();
}
