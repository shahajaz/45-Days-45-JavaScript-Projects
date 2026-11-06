const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");

const profileSection = document.getElementById("profileSection");
const loadingSection = document.getElementById("loadingSection");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");

const recentSection = document.getElementById("recentSection");
const recentList = document.getElementById("recentList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const repositoriesGrid = document.getElementById("repositoriesGrid");

/* API CONFIGURATION */
const GITHUB_API = "https://api.github.com";
const HISTORY_KEY = "github_recent_searches";
const MAX_HISTORY = 5;
const PER_PAGE = 100;


/* APPLICATION STATE */
let recentSearches = loadSearchHistory();
let searchController = null;

/* CHECK REQUIRED HTML ELEMENT */
const requiredElements = {
    searchForm,
    usernameInput,
    searchBtn,
    profileSection,
    loadingSection,
    emptyState,
    message,
    recentSection,
    recentList,
    clearHistoryBtn,
    repositoriesGrid
};
for (const [name, element] of Object.entries(requiredElements)) {
    if (!element) {
        throw new Error(
            `HTML element not found: ${name}. Check your HTML IDs.`
        );
    }
}

/* SEARCH FORM EVENT */
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();

    if (!username) {
        showMessage(
            "Please enter a GitHub username.",
            "error"
        );
        usernameInput.focus();
        return;
    }
    await searchUser(username);
});

/* SEARCH GITHUB USER */
async function searchUser(username) {
    // Cancel any previous search
    if (searchController) {
        searchController.abort();
    }
    searchController = new AbortController();
    const currentController = searchController;
    const signal = currentController.signal;
    hideMessage();
    showLoading(true);

    try {
        /* Fetch GitHub Profile */
        const user = await fetchGitHubData(
            `${GITHUB_API}/users/${encodeURIComponent(username)}`,
            signal
        );

        /* Fetch Public Repositories */
        const repositories = await fetchGitHubData(
            `${GITHUB_API}/users/${encodeURIComponent(user.login)}/repos?sort=updated&direction=desc&per_page=${PER_PAGE}`,
            signal
        );

        // Calculate total public stars across fetched repositories
        const totalStars = repositories.reduce(
            (total, repo) => total + repo.stargazers_count,
            0
        );

        /* Display Profile */
        displayProfile(user, totalStars);

        /* Display Repositories */
        displayRepositories(repositories);

        /* Save Search History */
        saveSearch(user);

        /* Display Results */
        profileSection.hidden = false;
        emptyState.hidden = true;
        /* Scroll to Profile */

        profileSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {
        // Ignore intentionally cancelled requests
        if (error.name === "AbortError") {
            return;
        }
        profileSection.hidden = true;
        emptyState.hidden = true;
        showMessage(error.message, "error");
    } finally {
        // Only the latest request can change the loading state
        if (searchController === currentController) {
            showLoading(false);
            searchController = null;
        }
    }
}

/* FETCH GITHUB API DATA */
async function fetchGitHubData(url, signal) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github+json"
        },
        signal
    });

    /* User Not Found */
    if (response.status === 404) {
        throw new Error(
            "GitHub user not found. Please check the username."
        );
    }

    /* API Rate Limit */
    if (response.status === 403 || response.status === 429) {
        const resetTime = response.headers.get(
            "X-RateLimit-Reset"
        );
        let errorMessage = "GitHub API rate limit exceeded.";
        if (resetTime) {
            const resetDate = new Date(
                Number(resetTime) * 1000
            );
            errorMessage +=
                ` Try again after ${resetDate.toLocaleTimeString()}.`;
        } else {
            errorMessage += " Please try again later.";
        }
        throw new Error(errorMessage);
    }
    /* Other API Errors */
    if (!response.ok) {
        throw new Error(
            `GitHub API Error: ${response.status} ${response.statusText}`
        );
    }
    /* Convert Response to JSON */
    return await response.json();
}

/* DISPLAY USER PROFILE */
function displayProfile(user, totalStars) {

    /* Avatar */
    const avatar = document.getElementById("avatar");
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login}'s GitHub avatar`;


    /* Name */
    document.getElementById("name").textContent =
        user.name || user.login;

    /* Username */
    const username = document.getElementById("username");
    username.textContent = `@${user.login}`;
    username.href = user.html_url;


    /* GitHub Profile Link */
    document.getElementById("githubLink").href =
        user.html_url;

    /* Bio */
    document.getElementById("bio").textContent =
        user.bio || "This developer hasn't added a bio yet.";

    /* Account Creation Date */
    const createdDate = new Date(user.created_at);
    document.getElementById("joinedDate").textContent =
        `Joined GitHub on ${createdDate.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )}`;


    /* Company */
    setText(
        "company",
        user.company,
        "companyItem"
    );

    /* Location */
    setText(
        "location",
        user.location,
        "locationItem"
    );

    /* Blog / Website */
    const blogItem = document.getElementById("blogItem");
    const blog = document.getElementById("blog");
    const blogUrl = normalizeUrl(user.blog);
    if (blogUrl) {
        blog.href = blogUrl;
        blog.textContent = user.blog;
        blogItem.hidden = false;
    } else {
        blogItem.hidden = true;
    }

    /* Twitter */
    const twitterItem = document.getElementById("twitterItem");
    const twitter = document.getElementById("twitter");
    if (user.twitter_username) {
        twitter.href =
            `https://twitter.com/${encodeURIComponent(user.twitter_username)}`;
        twitter.textContent =
            `@${user.twitter_username}`;
        twitterItem.hidden = false;
    } else {
        twitterItem.hidden = true;
    }

    /* Email */
    const emailItem = document.getElementById("emailItem");
    const email = document.getElementById("email");
    if (user.email) {
        email.href = `mailto:${user.email}`;
        email.textContent = user.email;
        emailItem.hidden = false;

    } else {
        emailItem.hidden = true;
    }

    /* Statistics */
    document.getElementById("reposCount").textContent =
        formatNumber(user.public_repos);

    document.getElementById("followersCount").textContent =
        formatNumber(user.followers);

    document.getElementById("followingCount").textContent =
        formatNumber(user.following);

    document.getElementById("starsCount").textContent =
        formatNumber(totalStars);
}

/* HELPER: SET TEXT CONTENT */
function setText(elementId, value, containerId) {
    const element = document.getElementById(elementId);
    const container = document.getElementById(containerId);
    if (value) {
        element.textContent = value;
        container.hidden = false;
    } else {
        element.textContent = "";
        container.hidden = true;
    }
}

/*  HELPER: NORMALIZE URL */
function normalizeUrl(value) {
    if (!value) {
        return null;
    }
    try {
        const url = new URL(
            value.startsWith("http://") ||
            value.startsWith("https://")
                ? value
                : `https://${value}`
        );
        if (!["http:", "https:"].includes(url.protocol)) {
            return null;
        }
        return url.href;
    } catch {
        return null;
    }
}

/* FORMAT NUMBERS */
function formatNumber(number) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number || 0);
}

/* DISPLAY REPOSITORIES */
function displayRepositories(repositories) {
    // Clear previous repositories
    repositoriesGrid.innerHTML = "";

    // Sort repositories by stars (descending)
    const sortedRepositories = [...repositories].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
    );

    // Show top 6 repositories
    const popularRepositories = sortedRepositories.slice(0, 6);

    // Repository count
    document.getElementById("repoLabel").textContent =
        `${repositories.length} repositories`;

    // Empty repository state
    if (popularRepositories.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "repo-description";
        emptyMessage.textContent =
            "This developer has no public repositories.";
        repositoriesGrid.appendChild(emptyMessage);
        return;
    }

    // Generate Repository Cards
    popularRepositories.forEach((repo) => {
        const repoCard = document.createElement("article");
        repoCard.className = "repo-card";

        /* Repository Title */
        const title = document.createElement("div");
        title.className = "repo-title";
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
        repoLink.rel = "noopener noreferrer";
        repoLink.textContent = repo.name;
        title.appendChild(repoLink);

        /* Repository Description */
        const description = document.createElement("p");
        description.className = "repo-description";
        description.textContent =
            repo.description || "No description provided.";

        /* Repository Metadata */
        const metadata = document.createElement("div");
        metadata.className = "repo-meta";

        /* Programming Language */
        if (repo.language) {
            const language = document.createElement("span");
            const languageDot = document.createElement("span");
            languageDot.className = "language-dot";
            language.appendChild(languageDot);
            language.appendChild(
                document.createTextNode(repo.language)
            );
            metadata.appendChild(language);
        }
        /* Stars */
        metadata.appendChild(
            createMetaItem(
                "fa-solid fa-star",
                formatNumber(repo.stargazers_count)
            )
        );
        /* Forks */
        metadata.appendChild(
            createMetaItem(
                "fa-solid fa-code-fork",
                formatNumber(repo.forks_count)
            )
        );
        /* Last Updated */
        const updatedDate = new Date(repo.updated_at);
        metadata.appendChild(
            createMetaItem(
                "fa-regular fa-clock",
                updatedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })
            )
        );
        /* Append Elements */
        repoCard.append(
            title,
            description,
            metadata
        );
        repositoriesGrid.appendChild(repoCard);
    });
}

/* CREATE REPOSITORY META ITEM */
function createMetaItem(iconClass, value) {
    const element = document.createElement("span");
    const icon = document.createElement("i");
    icon.className = iconClass;
    const text = document.createTextNode(` ${value}`);
    element.append(icon, text);
    return element;
}

/* SAVE SEARCH HISTORY */
function saveSearch(user) {
    // Remove existing entry for the same username
    recentSearches = recentSearches.filter(
        item => item.login.toLowerCase() !== user.login.toLowerCase()
    );
    // Add current user to the beginning
    recentSearches.unshift({
        login: user.login,
        avatar: user.avatar_url
    });
    // Keep only latest 5 searches
    recentSearches = recentSearches.slice(0, MAX_HISTORY);
    // Save to LocalStorage
    try {
        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(recentSearches)
        );
    } catch (error) {
        console.warn(
            "Unable to save search history:",
            error
        );
    }
    // Update UI
    renderSearchHistory();
}

/* LOAD SEARCH HISTORY */
function loadSearchHistory() {
    try {
        const savedHistory = JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );
        if (!Array.isArray(savedHistory)) {
            return [];
        }
        return savedHistory
            .filter(item =>
                item &&
                typeof item.login === "string" &&
                typeof item.avatar === "string"
            )
            .slice(0, MAX_HISTORY);
    } catch {
        return [];
    }
}

/* RENDER SEARCH HISTORY */
function renderSearchHistory() {
    recentList.innerHTML = "";
    recentSection.hidden = recentSearches.length === 0;
    recentSearches.forEach((user) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "recent-item";

        /* Avatar */
        const avatar = document.createElement("img");
        avatar.src = user.avatar;
        avatar.alt = "";

        /* Username */
        const username = document.createElement("span");
        username.textContent = user.login;

        /* Append Elements */
        button.append(
            avatar,
            username
        );
        /* Search Previous User */
        button.addEventListener("click", async () => {
            usernameInput.value = user.login;
            await searchUser(user.login);
        });
        recentList.appendChild(button);
    });
}

/* CLEAR SEARCH HISTORY */
clearHistoryBtn.addEventListener("click", () => {
    recentSearches = [];
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.warn(
            "Unable to clear search history:",
            error
        );
    }
    renderSearchHistory();
});

/* LOADING STATE */
function showLoading(isLoading) {
    loadingSection.hidden = !isLoading;
    searchBtn.disabled = isLoading;
    searchBtn.innerHTML = isLoading
        ? `<i class="fa-solid fa-spinner fa-spin"></i> Searching`
        : `<i class="fa-solid fa-magnifying-glass"></i> Search`;
    if (isLoading) {
        profileSection.hidden = true;
        emptyState.hidden = true;
    }
}

/* DISPLAY MESSAGE */
function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = `message ${type}`;
    message.hidden = false;
}

/* HIDE MESSAGE */
function hideMessage() {
    message.hidden = true;
    message.textContent = "";
}

/* INITIALIZE APPLICATION */
function init() {
    renderSearchHistory();
    usernameInput.focus();
}
// Start Application
init();
