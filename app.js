const apiBaseUrl = "https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/";
let currentPage = 1;
let currentSlideIndex = 0; // Index for the image slider

// DOM Elements
const newsListSection = document.getElementById("news-list");
const newsContainer = document.getElementById("news-container");
const singleNewsSection = document.getElementById("single-news");
const commentsList = document.getElementById("comments-list");
const sliderContainer = document.getElementById("slider-container");
const newsFormSection = document.getElementById("news-form-section");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const prevSlideBtn = document.getElementById("prev-slide");
const nextSlideBtn = document.getElementById("next-slide");

// Fetch paginated news
async function fetchNews(page) {
  const res = await fetch(`${apiBaseUrl}news?page=${page}&limit=10`);
  const data = await res.json();
  return data;
}

//  Display news items
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
    newsItem.onclick = () => viewSingleNews(item.id);
    newsContainer.appendChild(newsItem);
  });
}

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

// Function for viewing single news
async function viewSingleNews(id) {
  newsListSection.classList.add("hidden");
  singleNewsSection.classList.remove("hidden");

  const newsRes = await fetch(`${apiBaseUrl}news/${id}`);
  const news = await newsRes.json();

  document.getElementById("news-title").innerText = news.title;

  // Fetch and display images in slider
  const imagesRes = await fetch(`${apiBaseUrl}news/${id}/images`);
  const images = await imagesRes.json();
  sliderContainer.innerHTML = "";
  currentSlideIndex = 0;

  images.forEach((image) => {
    const imgElement = document.createElement("img");
    imgElement.src = image.image;
    imgElement.className = "slide";
    sliderContainer.appendChild(imgElement);
  });

  // Show the first image by default
  showSlide(currentSlideIndex);

  // Fetch and display comments
  const commentsRes = await fetch(`${apiBaseUrl}news/${id}/comments`);
  const comments = await commentsRes.json();
  commentsList.innerHTML = "";
  comments.forEach((comment) => {
    const commentItem = document.createElement("li");
    commentItem.innerHTML = `<p>${comment.comment}</p>`;
    commentsList.appendChild(commentItem);
  });
}
