const apiBaseUrl = "https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/";
let currentPage = 1;

// DOM Elements
const newsListSection = document.getElementById("news-list");
const newsContainer = document.getElementById("news-container");
const newsFormSection = document.getElementById("news-form-section");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const newsForm = document.getElementById("news-form");

// Fetch paginated news
async function fetchNews(page) {
  const res = await fetch(`${apiBaseUrl}news?page=${page}&limit=10`);
  return res.json();
}

// Display news items
async function displayNews(page) {
  newsContainer.innerHTML = "";
  const news = await fetchNews(page);

  news.forEach((item) => {
    const newsItem = document.createElement("div");
    newsItem.className = "news-item";
    newsItem.innerHTML = `
      <h3>${item.title}</h3>
      <p>Author: ${item.author}</p>
    `;
    newsItem.onclick = () =>
      (window.location.href = `single-news.html?id=${item.id}`);
    newsContainer.appendChild(newsItem);
  });
}

// Handle news form submission
newsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = document.getElementById("news-author").value;
  const title = document.getElementById("news-title").value;
  const url = document.getElementById("news-url").value;

  const newsData = { author, title, url };

  try {
    const res = await fetch(`${apiBaseUrl}news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsData),
    });

    if (res.ok) {
      alert("News item added successfully");
      newsForm.reset(); // Clear form fields
      displayNews(currentPage); // Refresh news list
    } else {
      throw new Error("Error adding news item");
    }
  } catch (error) {
    alert(error.message);
  }
});

// Pagination buttons
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    displayNews(currentPage);
  }
};

nextBtn.onclick = () => {
  currentPage++;
  displayNews(currentPage);
};

// Initialize news list on page load
window.onload = () => {
  displayNews(currentPage);
};

// Back to News List from the form
document.getElementById("back-to-list-form").onclick = () => {
  newsFormSection.classList.add("hidden");
  newsListSection.classList.remove("hidden");
};
