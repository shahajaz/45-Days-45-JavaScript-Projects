const quoteText = document.getElementById("quoteText");
const authorName = document.getElementById("authorName");
const categoryTag = document.getElementById("categoryTag");

const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const categorySelect = document.getElementById("categorySelect");

const totalQuotes = document.getElementById("totalQuotes");
const favoriteCount = document.getElementById("favoriteCount");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const quoteContent = document.getElementById("quoteContent");

// 2. Quotes Database
const quotes = [
    {
        id: 1,
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain",
        category: "Motivation"
    },
    {
        id: 2,
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category: "Motivation"
    },
    {
        id: 3,
        text: "Great things never come from comfort zones.",
        author: "Unknown",
        category: "Success"
    },
    {
        id: 4,
        text: "Success is not final, failure is not fatal.",
        author: "Winston Churchill",
        category: "Success"
    },
    {
        id: 5,
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        category: "Life"
    },
    {
        id: 6,
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein",
        category: "Wisdom"
    },
    {
        id: 7,
        text: "Happiness depends upon ourselves.",
        author: "Aristotle",
        category: "Happiness"
    },
    {
        id: 8,
        text: "Dream big and dare to fail.",
        author: "Norman Vaughan",
        category: "Dreams"
    },
    {
        id: 9,
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt",
        category: "Motivation"
    },
    {
        id: 10,
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
        category: "Motivation"
    },
    {
        id: 11,
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Success"
    },
    {
        id: 12,
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle",
        category: "Wisdom"
    },
    {
        id: 13,
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
        category: "Life"
    },
    {
        id: 14,
        text: "Happiness is not something ready made. It comes from your own actions.",
        author: "Dalai Lama",
        category: "Happiness"
    },
    {
        id: 15,
        text: "All our dreams can come true if we have the courage to pursue them.",
        author: "Walt Disney",
        category: "Dreams"
    },
    {
        id: 16,
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        category: "Motivation"
    },
    {
        id: 17,
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi",
        category: "Success"
    },
    {
        id: 18,
        text: "Turn your wounds into wisdom.",
        author: "Oprah Winfrey",
        category: "Wisdom"
    },
    {
        id: 19,
        text: "Every moment is a fresh beginning.",
        author: "T. S. Eliot",
        category: "Life"
    },
    {
        id: 20,
        text: "If you can dream it, you can do it.",
        author: "Walt Disney",
        category: "Dreams"
    }
];

// 3. Application State
let currentQuote = null;
let previousQuoteId = null;
let favorites = JSON.parse(
    localStorage.getItem("favoriteQuotes") || "[]"
);
let toastTimer;

// 4. Get Filtered Quotes
function getFilteredQuotes() {
    const selectedCategory = categorySelect.value;

    if (selectedCategory === "All") {
        return quotes;
    }
    return quotes.filter(quote => {
        return quote.category === selectedCategory;
    });
}

// 5. Display Random Quote
function generateQuote() {
    const availableQuotes = getFilteredQuotes();
    if (availableQuotes.length === 0) {
        showToast("No quotes available!");
        return;
    }
    let randomQuote;

    if (availableQuotes.length === 1) {
        randomQuote = availableQuotes[0];

    } else {
        const otherQuotes = availableQuotes.filter(quote => {
            return quote.id !== previousQuoteId;
        });
        const randomIndex = Math.floor(
            Math.random() * otherQuotes.length
        );
        randomQuote = otherQuotes[randomIndex];
    }
    currentQuote = randomQuote;
    previousQuoteId = randomQuote.id;

    updateQuoteDisplay();
}

// 6. Update Quote UI
function updateQuoteDisplay() {
    if (!currentQuote) return;

    quoteText.textContent = `"${currentQuote.text}"`;
    authorName.textContent = currentQuote.author;
    categoryTag.textContent = currentQuote.category;
    updateFavoriteButton();

    // Restart animation
    quoteContent.classList.remove("animate");
    void quoteContent.offsetWidth;
    quoteContent.classList.add("animate");
}

// 7. Favorite Quote Functionality
function toggleFavorite() {
    if (!currentQuote) return;

    const isFavorite = favorites.includes(currentQuote.id);
    if (isFavorite) {
        favorites = favorites.filter(id => {
            return id !== currentQuote.id;
        });
        showToast("Removed from favorites!");

    } else {
        favorites.push(currentQuote.id);

        showToast("Added to favorites!");
    }

    // Save favorites in Local Storage
    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );
    updateFavoriteButton();
    updateStatistics();
}

// 8. Update Favorite Button
function updateFavoriteButton() {
    if (!currentQuote) return;

    const isFavorite = favorites.includes(currentQuote.id);

    favoriteBtn.classList.toggle("active", isFavorite);

    favoriteBtn.innerHTML = isFavorite
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';

    favoriteBtn.setAttribute(
        "aria-label",
        isFavorite ? "Remove from favorites" : "Add quote to favorites"
    );

    favoriteBtn.title = isFavorite
        ? "Remove from favorites"
        : "Add to favorites";
}

// 9. Copy Quote Functionality
async function copyQuote() {

    if (!currentQuote) return;

    const textToCopy =
        `"${currentQuote.text}"\n\n- ${currentQuote.author}`;

    try {
        await navigator.clipboard.writeText(textToCopy);

        showToast("Quote copied successfully!");

    } catch (error) {

        showToast("Clipboard access unavailable!");
        console.error("Copy error:", error);
    }
}

// 10. Share Quote Functionality
async function shareQuote() {
    if (!currentQuote) return;
    const shareData = {
        title: "Daily Inspiration",
        text: `"${currentQuote.text}" - ${currentQuote.author}`
    };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Share error:", error);
                showToast("Unable to share quote!");
            }
        }
    } else {

        try {
            await navigator.clipboard.writeText(shareData.text);
            showToast("Sharing unavailable. Quote copied!");

        } catch (error) {
            showToast("Unable to share quote!");
        }
    }
}

// 11. Category Filter
function handleCategoryChange() {
    previousQuoteId = null;
    generateQuote();
}

// 12. Update Statistics
function updateStatistics() {
    totalQuotes.textContent = quotes.length;
    favoriteCount.textContent = favorites.length;
}

// 13. Toast Notification
function showToast(message) {
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}

// 14. Event Listeners
newQuoteBtn.addEventListener("click", generateQuote);

favoriteBtn.addEventListener("click", toggleFavorite);

copyBtn.addEventListener("click", copyQuote);

shareBtn.addEventListener("click", shareQuote);

categorySelect.addEventListener(
    "change",
    handleCategoryChange
);

// 15. Keyboard Support
document.addEventListener("keydown", event => {
    // Generate a new quote using Space
    if (
        event.code === "Space" &&
        event.target.tagName !== "SELECT" &&
        event.target.tagName !== "BUTTON"
    ) {
        event.preventDefault();
        generateQuote();
    }

});


// 16. Initialize Application
function initializeApp() {

    updateStatistics();

    generateQuote();

}
initializeApp();
