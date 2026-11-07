
/* ==========================================
   1. DOM ELEMENTS
========================================== */

const searchForm = document.getElementById("search-form");

const usernameInput = document.getElementById("username-input");

const searchBtn = document.getElementById("search-btn");

const clearBtn = document.getElementById("clear-btn");

const loading = document.getElementById("loading");

const dashboard = document.getElementById("dashboard");

const errorMessage = document.getElementById("error-message");

const errorText = document.getElementById("error-text");

const searchHistory = document.getElementById("search-history");

const clearHistoryBtn = document.getElementById("clear-history-btn");

const recentSubmissions = document.getElementById("recent-submissions");


/* ==========================================
   2. API CONFIGURATION
========================================== */

// LeetCode does not provide a documented public API.
// This is its internal GraphQL endpoint.

const API_URL = "https://leetcode.com/graphql";

// Public CORS proxy required for browser requests.
// Direct browser requests to LeetCode are generally
// blocked by its CORS policy.

const PROXY_URL = "https://proxy.cors.dev/";

// LocalStorage keys

const HISTORY_KEY = "leetcode_recent_searches";

const CACHE_PREFIX = "leetcode_profile_cache_";

const CACHE_DURATION = 30 * 60 * 1000;


/* ==========================================
   3. GRAPHQL QUERY
========================================== */

const PROFILE_QUERY = `
    query profile($username: String!) {

        matchedUser(username: $username) {

            username

            profile {
                realName
                userAvatar
                ranking
                reputation
                countryName
            }

            submitStats {

                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }

                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                }

            }

            userCalendar {
                streak
                totalActiveDays
            }

        }

        userContestRanking(username: $username) {

            rating
            globalRanking
            attendedContestsCount
            topPercentage

        }

        allQuestionsCount {
            difficulty
            count
        }

        recentAcSubmissionList(
            username: $username,
            limit: 5
        ) {
            id
            title
            titleSlug
            timestamp
        }

    }
`;


/* ==========================================
   4. EVENT LISTENERS
========================================== */

// Search form submission

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
        showError("Please enter a LeetCode username.");
        return;
    }

    searchProfile(username);

});


// Clear input

clearBtn.addEventListener("click", function () {

    usernameInput.value = "";

    clearBtn.classList.remove("visible");

    usernameInput.focus();

});


// Show clear button when typing

usernameInput.addEventListener("input", function () {

    clearBtn.classList.toggle(
        "visible",
        usernameInput.value.length > 0
    );

});


// Clear search history

clearHistoryBtn.addEventListener("click", function () {

    localStorage.removeItem(HISTORY_KEY);

    renderSearchHistory();

});


/* ==========================================
   5. FETCH LEETCODE PROFILE
========================================== */

async function fetchLeetCodeProfile(username) {

    const variables = {
        username: username
    };

    const params = new URLSearchParams({

        query: PROFILE_QUERY,

        variables: JSON.stringify(variables)

    });

    const requestURL = `${PROXY_URL}${API_URL}?${params.toString()}`;

    const response = await fetch(requestURL);

    if (!response.ok) {

        throw new Error(
            `API request failed with status ${response.status}.`
        );

    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {

        throw new Error(
            result.errors[0].message || "Unable to fetch profile."
        );

    }

    if (!result.data || !result.data.matchedUser) {

        throw new Error(
            "LeetCode username does not exist."
        );

    }

    return result.data;

}


/* ==========================================
   6. SEARCH PROFILE
========================================== */

async function searchProfile(username) {

    showLoading();

    try {

        const normalizedUsername = username.trim();

        const cacheKey =
            CACHE_PREFIX + normalizedUsername.toLowerCase();

        let data = null;

        // Check cached profile data

        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {

            try {

                const cache = JSON.parse(cachedData);

                const isCacheValid =
                    Date.now() - cache.timestamp < CACHE_DURATION;

                if (isCacheValid) {
                    data = cache.data;
                }

            } catch (error) {

                localStorage.removeItem(cacheKey);

            }

        }

        // Fetch fresh data if cache is unavailable

        if (!data) {

            data = await fetchLeetCodeProfile(normalizedUsername);

            // Save successful response

            try {

                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        timestamp: Date.now(),
                        data: data
                    })
                );

            } catch (error) {

                console.warn("Unable to save profile cache.");

            }

        }

        // Render profile information

        renderProfile(data);

        // Save username in search history

        saveSearchHistory(normalizedUsername);

    } catch (error) {

        console.error("Profile fetching error:", error);

        showError(getFriendlyError(error));

    }

}


/* ==========================================
   7. RENDER PROFILE
========================================== */

function renderProfile(data) {

    const user = data.matchedUser;

    const profile = user.profile || {};

    const contest = data.userContestRanking;

    const calendar = user.userCalendar || {};

    const submitStats = user.submitStats || {};

    const acceptedStats =
        submitStats.acSubmissionNum || [];

    const totalStats =
        submitStats.totalSubmissionNum || [];

    const allQuestions =
        data.allQuestionsCount || [];

    // Display profile

    document.getElementById("profile-name").textContent =
        profile.realName || user.username;

    document.getElementById("profile-username").textContent =
        "@" + user.username;

    document.getElementById("profile-avatar").src =
        profile.userAvatar || "https://placehold.co/200x200?text=User";

    document.getElementById("profile-link").href =
        `https://leetcode.com/u/${encodeURIComponent(user.username)}/`;

    const countryElement =
        document.getElementById("profile-country");

    const countryText =
        countryElement.querySelector("span");

    countryText.textContent =
        profile.countryName || "Country not available";

    // Profile statistics

    setText("global-ranking", formatNumber(profile.ranking));

    setText("reputation", formatNumber(profile.reputation));

    setText(
        "active-days",
        formatNumber(calendar.totalActiveDays)
    );

    setText(
        "current-streak",
        `${formatNumber(calendar.streak)} Days`
    );

    // Problem statistics

    const getStat = (stats, difficulty) => {

        const item = stats.find(
            stat => stat.difficulty === difficulty
        );

        return item ? Number(item.count) || 0 : 0;

    };

    const easySolved = getStat(acceptedStats, "Easy");

    const mediumSolved = getStat(acceptedStats, "Medium");

    const hardSolved = getStat(acceptedStats, "Hard");

    const totalSolved = getStat(acceptedStats, "All");

    const easyTotal = getStat(allQuestions, "Easy");

    const mediumTotal = getStat(allQuestions, "Medium");

    const hardTotal = getStat(allQuestions, "Hard");

    setText("total-solved", formatNumber(totalSolved));

    setText("easy-solved", formatNumber(easySolved));

    setText("medium-solved", formatNumber(mediumSolved));

    setText("hard-solved", formatNumber(hardSolved));

    setText(
        "easy-total",
        `${formatNumber(easyTotal)} total problems`
    );

    setText(
        "medium-total",
        `${formatNumber(mediumTotal)} total problems`
    );

    setText(
        "hard-total",
        `${formatNumber(hardTotal)} total problems`
    );

    // Difficulty progress

    updateProgress(
        "easy",
        easySolved,
        easyTotal
    );

    updateProgress(
        "medium",
        mediumSolved,
        mediumTotal
    );

    updateProgress(
        "hard",
        hardSolved,
        hardTotal
    );

    // Contest statistics

    setText(
        "contest-rating",
        contest
            ? formatNumber(Math.round(contest.rating))
            : "N/A"
    );

    setText(
        "contest-ranking",
        contest
            ? formatNumber(contest.globalRanking)
            : "N/A"
    );

    setText(
        "contests-attended",
        contest
            ? formatNumber(contest.attendedContestsCount)
            : "0"
    );

    setText(
        "top-percentage",
        contest && Number.isFinite(Number(contest.topPercentage))
            ? `${Number(contest.topPercentage).toFixed(2)}%`
            : "N/A"
    );

    // Submission statistics

    const acceptedSubmissions =
        getStat(acceptedStats, "All");

    const totalSubmissions =
        getStat(totalStats, "All");

    const acceptanceRate = totalSubmissions > 0
        ? (acceptedSubmissions / totalSubmissions) * 100
        : 0;

    setText(
        "accepted-submissions",
        formatNumber(acceptedSubmissions)
    );

    setText(
        "total-submissions",
        formatNumber(totalSubmissions)
    );

    setText(
        "acceptance-rate",
        `${acceptanceRate.toFixed(1)}%`
    );

    updateAcceptanceCircle(acceptanceRate);

    // Recent accepted submissions

    renderRecentSubmissions(
        data.recentAcSubmissionList || []
    );

    // Show dashboard

    hideLoading();

    errorMessage.classList.add("hidden");

    dashboard.classList.remove("hidden");

    dashboard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ==========================================
   8. UPDATE PROGRESS BARS
========================================== */

function updateProgress(type, solved, total) {

    const percentage = total > 0
        ? (solved / total) * 100
        : 0;

    const safePercentage = Math.min(
        100,
        Math.max(0, percentage)
    );

    setText(
        `${type}-percentage`,
        `${safePercentage.toFixed(1)}%`
    );

    const progressBar =
        document.getElementById(`${type}-progress`);

    progressBar.style.width =
        `${safePercentage}%`;

}


/* ==========================================
   9. UPDATE ACCEPTANCE CIRCLE
========================================== */

function updateAcceptanceCircle(percentage) {

    const circle =
        document.getElementById("acceptance-circle");

    const safePercentage = Math.min(
        100,
        Math.max(0, percentage)
    );

    const degrees = safePercentage * 3.6;

    circle.style.background = `
        conic-gradient(
            var(--easy) ${degrees}deg,
            var(--surface-light) ${degrees}deg
        )
    `;

}


/* ==========================================
   10. RECENT ACCEPTED SUBMISSIONS
========================================== */

function renderRecentSubmissions(submissions) {

    recentSubmissions.innerHTML = "";

    if (!submissions.length) {

        recentSubmissions.innerHTML = `
            <p class="empty-submissions">
                No recent accepted submissions available.
            </p>
        `;

        return;

    }

    submissions.forEach(submission => {

        const row = document.createElement("div");

        row.className = "submission-row";

        const problemInfo = document.createElement("div");

        problemInfo.className = "problem-info";

        const icon = document.createElement("i");

        icon.className = "fa-solid fa-circle-check";

        const link = document.createElement("a");

        link.href =
            `https://leetcode.com/problems/${encodeURIComponent(submission.titleSlug)}/`;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.textContent = submission.title;

        const date = document.createElement("span");

        date.className = "submission-date";

        date.textContent = formatDate(submission.timestamp);

        problemInfo.append(icon, link);

        row.append(problemInfo, date);

        recentSubmissions.appendChild(row);

    });

}


/* ==========================================
   11. FORMAT DATE
========================================== */

function formatDate(timestamp) {

    const date = new Date(Number(timestamp) * 1000);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


/* ==========================================
   12. FORMAT NUMBERS
========================================== */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
    ) {
        return "N/A";
    }

    return Number(value).toLocaleString("en-IN");

}


/* ==========================================
   13. SET TEXT CONTENT
========================================== */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* ==========================================
   14. LOADING STATE
========================================== */

function showLoading() {

    dashboard.classList.add("hidden");

    errorMessage.classList.add("hidden");

    loading.classList.remove("hidden");

    searchBtn.disabled = true;

    searchBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Searching...
    `;

}


function hideLoading() {

    loading.classList.add("hidden");

    searchBtn.disabled = false;

    searchBtn.innerHTML = `
        <i class="fa-solid fa-search"></i>
        Search Profile
    `;

}


/* ==========================================
   15. ERROR HANDLING
========================================== */

function showError(message) {

    hideLoading();

    dashboard.classList.add("hidden");

    errorMessage.classList.remove("hidden");

    errorText.textContent = message;

}


function getFriendlyError(error) {

    const message = error.message || "";

    if (
        message.toLowerCase().includes("does not exist") ||
        message.toLowerCase().includes("not exist")
    ) {
        return "This LeetCode username does not exist. Please check the spelling.";
    }

    if (
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("network")
    ) {
        return "Network or CORS proxy error. Please check your internet connection and try again.";
    }

    if (message.includes("429")) {

        return "Too many requests. Please wait before searching again.";

    }

    if (message.includes("403")) {

        return "The API request was blocked. Please try again later.";

    }

    if (message.includes("500") || message.includes("502")) {

        return "The API service is temporarily unavailable. Please try again later.";

    }

    return "Unable to fetch this profile. Please verify the username or try again later.";

}


/* ==========================================
   16. SAVE SEARCH HISTORY
========================================== */

function saveSearchHistory(username) {

    let history = getSearchHistory();

    // Remove duplicate username

    history = history.filter(
        item => item.toLowerCase() !== username.toLowerCase()
    );

    // Add latest search first

    history.unshift(username);

    // Keep only latest 5 searches

    history = history.slice(0, 5);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    renderSearchHistory();

}


/* ==========================================
   17. GET SEARCH HISTORY
========================================== */

function getSearchHistory() {

    try {

        const history = JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );

        return Array.isArray(history)
            ? history.filter(item => typeof item === "string")
            : [];

    } catch (error) {

        return [];

    }

}


/* ==========================================
   18. RENDER SEARCH HISTORY
========================================== */

function renderSearchHistory() {

    const history = getSearchHistory();

    searchHistory.innerHTML = "";

    if (!history.length) {

        const empty = document.createElement("p");

        empty.className = "history-empty";

        empty.textContent = "No recent searches yet.";

        searchHistory.appendChild(empty);

        return;

    }

    history.forEach(username => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "history-chip";

        const icon = document.createElement("i");

        icon.className = "fa-solid fa-user";

        const name = document.createElement("span");

        name.textContent = username;

        button.append(icon, name);

        button.addEventListener("click", function () {

            usernameInput.value = username;

            clearBtn.classList.add("visible");

            searchProfile(username);

        });

        searchHistory.appendChild(button);

    });

}


/* ==========================================
   19. INITIALIZE APPLICATION
========================================== */

function initializeApp() {

    renderSearchHistory();

    hideLoading();

    console.log("LeetCode Profile Finder initialized.");

}


// Run application

initializeApp();
