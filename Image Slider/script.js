const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const dotsContainer = document.getElementById("dotsContainer");
const imageCounter = document.getElementById("imageCounter");

const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const playPauseText = document.getElementById("playPauseText");

const restartBtn = document.getElementById("restartBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

// Slider Configuration
let currentIndex = 0;
const totalSlides = slides.length;
const slideInterval = 3000;

let autoSlide = null;
let isPlaying = true;

// Touch Navigation Variables
let touchStartX = 0;
let touchEndX = 0;

const swipeThreshold = 50;

// Generate Navigation Dots
function createDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((slide, index) => {

        const dot = document.createElement("button");

        dot.classList.add("dot");

        dot.setAttribute("aria-label", `Go to image ${index + 1}`);

        dot.addEventListener("click", () => {
            showSlide(index);
            restartAutoSlide();
        });

        dotsContainer.appendChild(dot);

    });

}

// ==============================
// 4. Display Current Slide
// ==============================
function showSlide(index) {

    // Handle circular navigation
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    // Update active slide
    slides.forEach((slide, i) => {

        slide.classList.toggle(
            "active",
            i === currentIndex
        );

    });

    // Update navigation dots
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentIndex
        );

        if (i === currentIndex) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }

    });

    // Update image counter
    imageCounter.textContent =
        `${currentIndex + 1} / ${totalSlides}`;

}

// ==============================
// 5. Next Slide
// ==============================

function nextSlide() {

    showSlide(currentIndex + 1);

}

// ==============================
// 6. Previous Slide
// ==============================

function previousSlide() {

    showSlide(currentIndex - 1);

}

// ==============================
// 7. Start Automatic Slideshow
// ==============================

function startAutoSlide() {

    stopAutoSlide();

    autoSlide = setInterval(() => {

        nextSlide();

    }, slideInterval);

    isPlaying = true;

    updatePlayPauseButton();

}

// ==============================
// 8. Stop Automatic Slideshow
// ==============================

function stopAutoSlide() {

    if (autoSlide !== null) {

        clearInterval(autoSlide);

        autoSlide = null;

    }

}

// ==============================
// 9. Restart Automatic Slideshow
// ==============================

function restartAutoSlide() {

    if (isPlaying) {

        startAutoSlide();

    }

}

// ==============================
// 10. Update Play/Pause Button
// ==============================

function updatePlayPauseButton() {

    if (isPlaying) {

        playPauseIcon.innerHTML = "&#10074;&#10074;";

        playPauseText.textContent = "Pause";

    } else {

        playPauseIcon.innerHTML = "&#9654;";

        playPauseText.textContent = "Play";

    }

}

// ==============================
// 11. Play / Pause Slideshow
// ==============================
function togglePlayPause() {

    if (isPlaying) {

        stopAutoSlide();

        isPlaying = false;

    } else {

        startAutoSlide();

    }

    updatePlayPauseButton();

}

// ==============================
// 12. Restart Slider
// ==============================
function restartSlider() {

    showSlide(0);

    startAutoSlide();

}

// ==============================
// 13. Fullscreen Image Viewing
// ==============================
async function toggleFullscreen() {

    try {

        if (!document.fullscreenElement) {

            await slider.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error("Fullscreen error:", error);

    }

}

// ==============================
// 14. Keyboard Navigation
// ==============================
function handleKeyboard(event) {
    // Ignore keyboard navigation while typing
    if (
        event.target.matches("input, textarea, select") ||
        event.target.isContentEditable
    ) {
        return;
    }

    if (event.key === "ArrowRight") {

        nextSlide();

        restartAutoSlide();

    } else if (event.key === "ArrowLeft") {
        previousSlide();
        restartAutoSlide();

    } else if (event.key === " ") {
        event.preventDefault();

        togglePlayPause();
    }
}

// ==============================
// 15. Touch Start Event
// ==============================
function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

// ==============================
// 16. Touch End Event
// ==============================
function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

// ==============================
// 17. Swipe Navigation
// ==============================
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < swipeThreshold) {
        return;
    }
    if (swipeDistance < 0) {
        // Swipe Left: Next Image
        nextSlide();
    } else {
        // Swipe Right: Previous Image
        previousSlide();

    }
    restartAutoSlide();
}

// ==============================
// Event Listeners
// ==============================
// Previous Button
prevBtn.addEventListener("click", () => {

    previousSlide();

    restartAutoSlide();

});

// Next Button
nextBtn.addEventListener("click", () => {

    nextSlide();

    restartAutoSlide();

});

// Play / Pause Button
playPauseBtn.addEventListener(
    "click",
    togglePlayPause
);

// Restart Button
restartBtn.addEventListener(
    "click",
    restartSlider
);

// Fullscreen Button
fullscreenBtn.addEventListener(
    "click",
    toggleFullscreen
);

// Keyboard Events
document.addEventListener(
    "keydown",
    handleKeyboard
);

// Touch Events
slider.addEventListener(
    "touchstart",
    handleTouchStart,
    { passive: true }
);
slider.addEventListener(
    "touchend",
    handleTouchEnd,
    { passive: true }
);

// Initialize Image Slider
function initializeSlider() {
    if (totalSlides === 0) {
        console.error("No slides found!");
        return;
    }
    createDots();
    showSlide(0);
    startAutoSlide();

}
// Start Application
initializeSlider();
