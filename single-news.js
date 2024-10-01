const apiBaseUrl = "https://61924d4daeab5c0017105f1a.mockapi.io/skaet/v1/";
let currentNewsId = null;

// DOM Elements
const singleNewsTitle = document.getElementById("news-title");
const commentsList = document.getElementById("comments-list");
const sliderContainer = document.getElementById("slider-container");
const prevSlideBtn = document.getElementById("prev-slide");
const nextSlideBtn = document.getElementById("next-slide");
let currentSlideIndex = 0;

// Fetch news by ID
async function fetchSingleNews(id) {
  const res = await fetch(`${apiBaseUrl}news/${id}`);
  return res.json();
}

// Fetch and display images in slider
async function displaySingleNews(id) {
  const news = await fetchSingleNews(id);
  singleNewsTitle.innerText = news.title;

  // Fetch images
  const imagesRes = await fetch(`${apiBaseUrl}news/${id}/images`);
  const images = await imagesRes.json();
  sliderContainer.innerHTML = "";

  images.forEach((image) => {
    const imgElement = document.createElement("img");
    imgElement.src = image.image;
    imgElement.className = "slide";
    sliderContainer.appendChild(imgElement);
  });

  // Show the first image by default
  showSlide(0);

  // Add event listeners for slider controls
  prevSlideBtn.onclick = () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      showSlide(currentSlideIndex);
    }
  };

  nextSlideBtn.onclick = () => {
    const slides = document.querySelectorAll(".slide");
    if (currentSlideIndex < slides.length - 1) {
      currentSlideIndex++;
      showSlide(currentSlideIndex);
    }
  };

  // Fetch and display comments
  const commentsRes = await fetch(`${apiBaseUrl}news/${id}/comments`);
  const comments = await commentsRes.json();
  commentsList.innerHTML = ""; // Clear previous comments
  comments.forEach((comment) => {
    const commentItem = document.createElement("li");
    commentItem.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between">
        <p>${comment.comment}</p>
        <button onclick="deleteComment(${id}, ${comment.id})">Delete</button>
      </div>
    `;
    commentsList.appendChild(commentItem);
  });
}

// Function to show the current slide
function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
  });

  // Enable or disable buttons
  prevSlideBtn.disabled = index === 0;
  nextSlideBtn.disabled = index === slides.length - 1;
}

// Handle comment form submission
document
  .getElementById("comment-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const commentInput = document.getElementById("comment-input").value;

    if (!commentInput) {
      alert("Comment cannot be empty");
      return;
    }

    const commentData = {
      newsId: currentNewsId,
      name: "Anonymous",
      comment: commentInput,
    };

    await fetch(`${apiBaseUrl}news/${currentNewsId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });

    alert("Comment added successfully");
    document.getElementById("comment-input").value = "";
    displaySingleNews(currentNewsId);
  });

// Delete comment function
async function deleteComment(newsId, commentId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this comment?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `${apiBaseUrl}news/${newsId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      alert("Comment deleted successfully");
      displaySingleNews(newsId);
    } else {
      throw new Error("Error deleting comment");
    }
  } catch (error) {
    alert(error.message);
  }
}

// Initialize on page load
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentNewsId = urlParams.get("id");
  displaySingleNews(currentNewsId);
};

// Back to News List
document.getElementById("back-to-list").onclick = () => {
  window.location.href = "index.html";
};
