const year = document.querySelector("#year");
const filterButtons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".portfolio-card");
const themeToggle = document.querySelector(".theme-toggle");
const searchTrigger = document.querySelector(".search-trigger");

year.textContent = new Date().getFullYear();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "Dark" : "Light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
});

const modal = document.createElement("div");
modal.className = "search-modal";
modal.innerHTML = `
  <div class="search-box" role="dialog" aria-modal="true" aria-label="Search portfolio">
    <input type="search" placeholder="Search projects, services, tools..." aria-label="Search projects">
    <div class="search-results"></div>
  </div>
`;
document.body.appendChild(modal);

const searchInput = modal.querySelector("input");
const searchResults = modal.querySelector(".search-results");
const searchableItems = Array.from(document.querySelectorAll(".portfolio-card")).map((card) => ({
  title: card.querySelector("h3").textContent,
  text: card.textContent.replace(/\s+/g, " ").trim(),
  href: "#portfolio",
}));

function renderResults(query = "") {
  const normalized = query.trim().toLowerCase();
  const results = searchableItems.filter((item) => item.text.toLowerCase().includes(normalized)).slice(0, 6);

  searchResults.innerHTML = results
    .map((item) => `<a href="${item.href}">${item.title}</a>`)
    .join("");
}

function openSearch() {
  modal.classList.add("open");
  renderResults();
  searchInput.value = "";
  searchInput.focus();
}

function closeSearch() {
  modal.classList.remove("open");
}

searchTrigger.addEventListener("click", openSearch);
searchInput.addEventListener("input", () => renderResults(searchInput.value));
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeSearch();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }

  if (event.key === "Escape") {
    closeSearch();
  }
});
