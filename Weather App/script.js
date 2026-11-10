const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherContent = document.getElementById("weatherContent");
const welcomeMessage = document.getElementById("welcomeMessage");
const loading = document.getElementById("loading");
const statusMessage = document.getElementById("statusMessage");

const unitToggle = document.getElementById("unitToggle");
const refreshBtn = document.getElementById("refreshBtn");
const locationBtn = document.getElementById("locationBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");
const recentList = document.getElementById("recentList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const forecastList = document.getElementById("forecastList");

// Calendar elements
const calendarBtn = document.getElementById("calendarBtn");
const calendarPopup = document.getElementById("calendarPopup");
const closeCalendarBtn = document.getElementById("closeCalendarBtn");
const calendarDates = document.getElementById("calendarDates");


//=== APPLICATION STATE
let currentCity = null;
let currentWeatherData = null;
let temperatureUnit = localStorage.getItem("weatherUnit") || "C";

let favorites = JSON.parse( localStorage.getItem("weatherFavorites") || "[]"
);
let recentSearches = JSON.parse( localStorage.getItem("weatherRecent") || "[]"
);
let requestId = 0;


//=== API CONFIGURATION
const GEOCODING_API ="https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API ="https://api.open-meteo.com/v1/forecast";

//=== WEATHER CODE MAPPING
function getWeatherInfo(code, isDay = true) {
    const weatherConditions = {
        0: {
            description: "Clear sky",
            icon: isDay ? "fa-sun" : "fa-moon",
            theme: "clear"
        },
        1: {
            description: "Mainly clear",
            icon: isDay ? "fa-sun" : "fa-moon",
            theme: "clear"
        },
        2: {
            description: "Partly cloudy",
            icon: "fa-cloud-sun",
            theme: "cloudy"
        },
        3: {
            description: "Overcast",
            icon: "fa-cloud",
            theme: "cloudy"
        },
        45: {
            description: "Fog",
            icon: "fa-smog",
            theme: "cloudy"
        },
        48: {
            description: "Depositing rime fog",
            icon: "fa-smog",
            theme: "cloudy"
        },
        51: {
            description: "Light drizzle",
            icon: "fa-cloud-rain",
            theme: "rainy"
        },
        53: {
            description: "Moderate drizzle",
            icon: "fa-cloud-rain",
            theme: "rainy"
        },
        55: {
            description: "Dense drizzle",
            icon: "fa-cloud-showers-heavy",
            theme: "rainy"
        },
        56: {
            description: "Light freezing drizzle",
            icon: "fa-cloud-rain",
            theme: "snowy"
        },
        57: {
            description: "Dense freezing drizzle",
            icon: "fa-cloud-rain",
            theme: "snowy"
        },
        61: {
            description: "Slight rain",
            icon: "fa-cloud-rain",
            theme: "rainy"
        },
        63: {
            description: "Moderate rain",
            icon: "fa-cloud-rain",
            theme: "rainy"
        },
        65: {
            description: "Heavy rain",
            icon: "fa-cloud-showers-heavy",
            theme: "rainy"
        },
        66: {
            description: "Light freezing rain",
            icon: "fa-cloud-rain",
            theme: "snowy"
        },
        67: {
            description: "Heavy freezing rain",
            icon: "fa-cloud-showers-heavy",
            theme: "snowy"
        },
        71: {
            description: "Slight snowfall",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        73: {
            description: "Moderate snowfall",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        75: {
            description: "Heavy snowfall",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        77: {
            description: "Snow grains",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        80: {
            description: "Slight rain showers",
            icon: "fa-cloud-rain",
            theme: "rainy"
        },
        81: {
            description: "Moderate rain showers",
            icon: "fa-cloud-showers-heavy",
            theme: "rainy"
        },
        82: {
            description: "Violent rain showers",
            icon: "fa-cloud-showers-heavy",
            theme: "rainy"
        },
        85: {
            description: "Slight snow showers",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        86: {
            description: "Heavy snow showers",
            icon: "fa-snowflake",
            theme: "snowy"
        },
        95: {
            description: "Thunderstorm",
            icon: "fa-cloud-bolt",
            theme: "stormy"
        },
        96: {
            description: "Thunderstorm with hail",
            icon: "fa-cloud-bolt",
            theme: "stormy"
        },
        99: {
            description: "Heavy thunderstorm with hail",
            icon: "fa-cloud-bolt",
            theme: "stormy"
        }
    };
    return weatherConditions[code] || {
        description: "Unknown weather",
        icon: "fa-cloud",
        theme: "cloudy"
    };
}

//=== FETCH API DATA
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `API request failed (${response.status})`
        );
    }
    return await response.json();
}

//=== CITY SEARCH
async function searchCity(city) {
    if (!city.trim()) {
        showMessage(
            "Please enter a city name.",
            "error"
        );
        return;
    }
    const id = ++requestId;
    setLoading(true);
    clearMessage();
    try {
        const params = new URLSearchParams({
            name: city.trim(),
            count: 10,
            language: "en",
            format: "json"
        });
        const data = await fetchJSON(
            `${GEOCODING_API}?${params}`
        );

        if (id !== requestId) return;
        if (!data.results || data.results.length === 0) {
            throw new Error(
                "City not found. Please check the spelling."
            );
        }

        const cityData = data.results[0];
        await loadWeather(
            cityData.latitude,
            cityData.longitude,
            {
                name: cityData.name,
                country: cityData.country || "",
                admin1: cityData.admin1 || ""
            },
            id
        );
    } catch (error) {
        if (id !== requestId) return;
        showMessage(error.message, "error");

        if (!currentWeatherData) {
            welcomeMessage.classList.remove("hidden");
        }
    } finally {
        if (id === requestId) {
            setLoading(false);
        }
    }
}


//==== LOAD WEATHER DATA
async function loadWeather(latitude, longitude, location, id) {
    const params = new URLSearchParams({

        latitude,
        longitude,

        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "weather_code",
            "pressure_msl",
            "wind_speed_10m",
            "wind_direction_10m"
        ].join(","),

        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset"
        ].join(","),

        timezone: "auto",
        forecast_days: 6,

        temperature_unit: "celsius",
        wind_speed_unit: "kmh"

    });

    const data = await fetchJSON(
        `${WEATHER_API}?${params}`
    );
    if (id !== requestId) return;
    if (!data.current || !data.daily) {
        throw new Error(
            "Weather information is unavailable."
        );
    }
    currentCity = {
        ...location,
        latitude,
        longitude,
        timezone: data.timezone
    };
    currentWeatherData = data;
    displayWeather(data);
    saveRecentSearch(currentCity);
    renderFavorites();
    renderRecentSearches();
    welcomeMessage.classList.add("hidden");
    weatherContent.classList.remove("hidden");

    showMessage(
        `Weather updated for ${location.name}.`,
        "success"
    );
}


//== TEMPERATURE CONVERSION
function convertTemperature(celsius) {
    if (temperatureUnit === "F") {
        return (celsius * 9 / 5) + 32;
    }
    return celsius;
}

function formatTemperature(value) {
    const converted = convertTemperature(value);
    return `${Math.round(converted)}°${temperatureUnit}`;
}

function toggleTemperatureUnit() {
    temperatureUnit =
        temperatureUnit === "C" ? "F" : "C";
    localStorage.setItem(
        "weatherUnit",
        temperatureUnit
    );
    unitToggle.textContent = `°${temperatureUnit}`;
    if (currentWeatherData) {
        displayWeather(currentWeatherData);

        // Refresh calendar temperatures if it is open
        if (calendarPopup && !calendarPopup.classList.contains("hidden")) {
            renderCalendar();
        }
    }
}


//== DISPLAY CURRENT WEATHER
function displayWeather(data) {
    const current = data.current;
    const daily = data.daily;
    const weather = getWeatherInfo(
        current.weather_code,
        current.is_day === 1
    );

    // City information
    const cityParts = [
        currentCity.name,
        currentCity.admin1,
        currentCity.country
    ].filter(Boolean);

    document.getElementById("cityName").textContent =
        [...new Set(cityParts)].join(", ");

    // Temperature
    document.getElementById("temperature").textContent =
        formatTemperature(current.temperature_2m);

    document.getElementById("feelsLike").textContent =
        formatTemperature(current.apparent_temperature);

    // Weather description
    document.getElementById("weatherDescription").textContent =
        weather.description;

    document.getElementById("weatherIcon").innerHTML =
        `<i class="fa-solid ${weather.icon}"></i>`;

    // Weather details
    document.getElementById("humidity").textContent =
        `${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    document.getElementById("pressure").textContent =
        `${Math.round(current.pressure_msl)} hPa`;

    document.getElementById("windDirection").textContent =
        getWindDirection(current.wind_direction_10m);

    // Sunrise and sunset
    document.getElementById("sunrise").textContent =
        formatLocalTime(daily.sunrise[0], data.timezone);

    document.getElementById("sunset").textContent =
        formatLocalTime(daily.sunset[0], data.timezone);

    // Local date and time
    document.getElementById("localDate").textContent =
        formatLocalDate(current.time, data.timezone);

    // Dynamic theme
    updateWeatherTheme(weather.theme);

    // Favorite button
    updateFavoriteButton();

    // Forecast
    displayForecast(daily);
}


//== WIND DIRECTION
function getWindDirection(degrees) {
    const directions = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return `${directions[index]} (${Math.round(degrees)}°)`;
}

// === LOCAL DATE AND TIME
// CORRECTED IMPLEMENTATION
function formatLocalTime(dateTime, timezone) {
    const localTime = new Date(`${dateTime}Z`);
    return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    }).format(localTime);
}

function formatLocalDate(dateTime, timezone) {
    const localDate = new Date(`${dateTime}Z`);
    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    }).format(localDate);
}


//== FIVE-DAY FORECAST
function displayForecast(daily) {
    forecastList.innerHTML = "";

    // Skip today and display the next five days
    for (let i = 1; i < Math.min(6, daily.time.length); i++) {
        const date = new Date(
            `${daily.time[i]}T12:00:00Z`
        );
        const dayName = new Intl.DateTimeFormat("en", {
            weekday: "short",
            timeZone: "UTC"
        }).format(date);

        const weather = getWeatherInfo(
            daily.weather_code[i]
        );
        const maxTemp = formatTemperature(
            daily.temperature_2m_max[i]
        );
        const minTemp = formatTemperature(
            daily.temperature_2m_min[i]
        );
        const forecastCard = document.createElement("div");
        forecastCard.className = "forecast-item";

        const day = document.createElement("p");
        day.className = "forecast-day";
        day.textContent = dayName;

        const icon = document.createElement("div");
        icon.className = "forecast-icon";

        const iconElement = document.createElement("i");
        iconElement.className =
            `fa-solid ${weather.icon}`;

        icon.appendChild(iconElement);

        const description = document.createElement("p");
        description.className = "forecast-description";
        description.textContent = weather.description;

        const high = document.createElement("p");
        high.className = "forecast-temp";
        high.textContent = maxTemp;

        const low = document.createElement("p");
        low.className = "forecast-low";
        low.textContent = `Low ${minTemp}`;
        forecastCard.append(
            day,
            icon,
            description,
            high,
            low
        );
        forecastList.appendChild(forecastCard);
    }
}


//== DYNAMIC WEATHER THEME
function updateWeatherTheme(theme) {
    document.body.classList.remove(
        "theme-clear",
        "theme-cloudy",
        "theme-rainy",
        "theme-snowy",
        "theme-stormy"
    );
    document.body.classList.add(
        `theme-${theme}`
    );
}


//== FAVORITES - LOCAL STORAGE
function saveFavorites() {
    localStorage.setItem(
        "weatherFavorites",
        JSON.stringify(favorites)
    );
}

function toggleFavorite() {
    if (!currentCity) return;
    const exists = favorites.some(
        city =>
            city.latitude === currentCity.latitude &&
            city.longitude === currentCity.longitude
    );

    if (exists) {
        favorites = favorites.filter(
            city =>
                city.latitude !== currentCity.latitude ||
                city.longitude !== currentCity.longitude
        );
        showMessage(
            "Removed from favorites.",
            "success"
        );

    } else {
        favorites.push(currentCity);
        showMessage(
            "Added to favorites.",
            "success"
        );
    } 
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (!currentCity) return;
    const isFavorite = favorites.some(
        city =>
            city.latitude === currentCity.latitude &&
            city.longitude === currentCity.longitude

    );
    favoriteBtn.innerHTML = isFavorite
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
}

//== RENDER FAVORITES
function renderFavorites() {
    favoritesList.innerHTML = "";
    if (favorites.length === 0) {
        favoritesList.innerHTML =
            '<p class="empty-message">No favorite cities yet.</p>';
        return;
    }

    favorites.forEach((city, index) => {
        const chip = createCityChip(
            city,
            index,
            true
        );
        favoritesList.appendChild(chip);
    });
}

// RECENT SEARCHES
function saveRecentSearch(city) {
    recentSearches = recentSearches.filter(
        item =>
            item.latitude !== city.latitude ||
            item.longitude !== city.longitude
    );
    recentSearches.unshift(city);

    // Keep only last five searches
    recentSearches = recentSearches.slice(0, 5);
    localStorage.setItem(
        "weatherRecent",
        JSON.stringify(recentSearches)
    );
}

function renderRecentSearches() {
    recentList.innerHTML = "";
    if (recentSearches.length === 0) {
        recentList.innerHTML =
            '<p class="empty-message">No recent searches.</p>';
        return;
    }

    recentSearches.forEach((city, index) => {
        const chip = createCityChip(
            city,
            index,
            false
        );
        recentList.appendChild(chip);
    });
}

//== CREATE CITY CHIP
function createCityChip(city, index, isFavorite) {
    const chip = document.createElement("div");
    chip.className = "city-chip";
    const nameButton = document.createElement("button");
    nameButton.className = "city-name-btn";
    nameButton.textContent = [
        city.name,
        city.country
    ].filter(Boolean).join(", ");

    nameButton.addEventListener("click", () => {
        loadSavedCity(city);
    });

    chip.appendChild(nameButton);
    if (isFavorite) {
        const removeButton = document.createElement("button");
        removeButton.className = "remove-city";
        removeButton.title = "Remove favorite";
        removeButton.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

        removeButton.addEventListener("click", () => {
            favorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
            updateFavoriteButton();
        });
        chip.appendChild(removeButton);
    }
    return chip;
}


//== LOAD SAVED CITY
async function loadSavedCity(city) {
    const id = ++requestId;
    setLoading(true);
    clearMessage();

    try {
        await loadWeather(
            city.latitude,
            city.longitude,
            city,
            id
        );

    } catch (error) {
        if (id === requestId) {
            showMessage(
                error.message,
                "error"
            );
        }

    } finally {
        if (id === requestId) {
            setLoading(false);
        }
    }
}

// CLEAR SEARCH HISTORY
function clearRecentSearches() {
    recentSearches = [];
    localStorage.removeItem("weatherRecent");
    renderRecentSearches();
    showMessage(
        "Recent searches cleared.",
        "success"
    );
}


//== GEOLOCATION ==
// CORRECTED IMPLEMENTATION
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showMessage(
            "Geolocation is not supported by your browser.",
            "error"
        );
        return;
    }
    setLoading(true);
    clearMessage();
    const id = ++requestId;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            if (id !== requestId) return;
            const { latitude, longitude } = position.coords;
            try {
                await loadWeather(
                    latitude,
                    longitude,
                    {
                        name: "My Location",
                        country: "",
                        admin1: ""
                    },
                    id
                );

            } catch (error) {
                if (id === requestId) {
                    showMessage(
                        error.message,
                        "error"
                    );
                }
            } finally {
                if (id === requestId) {
                    setLoading(false);
                }
            }
        },

        (error) => {
            if (id !== requestId) return;
            const messages = {
                1: "Location permission denied.",
                2: "Current location is unavailable.",
                3: "Location request timed out."

            };
            showMessage(
                messages[error.code] ||
                "Unable to retrieve location.",
                "error"
            );
            setLoading(false);

        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}


// REFRESH WEATHER
function refreshWeather() {
    if (!currentCity) {
        showMessage(
            "Search for a city before refreshing.",
            "error"
        );
        return;
    }
    loadSavedCity(currentCity);
}

// LOADING STATE
function setLoading(isLoading) {
    loading.classList.toggle(
        "active",
        isLoading
    );
    searchBtn.disabled = isLoading;
    locationBtn.disabled = isLoading;
    refreshBtn.disabled = isLoading;

    searchBtn.innerHTML = isLoading
        ? '<i class="fa-solid fa-spinner fa-spin"></i>'
        : '<i class="fa-solid fa-magnifying-glass"></i><span>Search</span>';
}

// STATUS MESSAGES
function showMessage(message, type){
    statusMessage.textContent = message;
    statusMessage.className =
        `status-message ${type}`;
}
function clearMessage(){
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}


//== EVENT LISTENERS

// Search form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchCity(cityInput.value);
});


// Temperature conversion
unitToggle.addEventListener(
    "click",
    toggleTemperatureUnit
);

// Refresh weather
refreshBtn.addEventListener(
    "click",
    refreshWeather
);

// Current location
locationBtn.addEventListener(
    "click",
    getCurrentLocation
);

// Favorites
favoriteBtn.addEventListener(
    "click",
    toggleFavorite
);

// Clear recent searches
clearHistoryBtn.addEventListener(
    "click",
    clearRecentSearches
);


// FORECAST CALENDAR
function renderCalendar() {
    if (!currentWeatherData || !currentWeatherData.daily) {
        showMessage(
            "Please load weather data first.",
            "error"
        );
        return;
    }

    if (!calendarPopup || !calendarDates || !calendarBtn) {
        showMessage(
            "Calendar elements are missing from index.html.",
            "error"
        );

        return;
    }
    const daily = currentWeatherData.daily;
    calendarDates.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
        const date = new Date(
            `${daily.time[i]}T12:00:00Z`
        );

        const dayName = new Intl.DateTimeFormat("en", {
            weekday: "long",
            timeZone: "UTC"
        }).format(date);

        const formattedDate = new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "short",
            timeZone: "UTC"
        }).format(date);

        const weather = getWeatherInfo(
            daily.weather_code[i]
        );

        const maxTemp = formatTemperature(
            daily.temperature_2m_max[i]
        );

        const minTemp = formatTemperature(
            daily.temperature_2m_min[i]
        );

        const item = document.createElement("div");

        item.className = "calendar-date";

        const day = document.createElement("strong");
        day.textContent = dayName;

        const dateText = document.createElement("span");
        dateText.textContent = formattedDate;

        const icon = document.createElement("i");
        icon.className = `fa-solid ${weather.icon}`;
        icon.setAttribute("aria-hidden", "true");

        const condition = document.createElement("span");

        condition.className = "calendar-condition";
        condition.textContent = weather.description;

        const temperature = document.createElement("span");

        temperature.className = "calendar-temperature";

        temperature.textContent =
            `High: ${maxTemp} | Low: ${minTemp}`;

        item.append(
            day,
            dateText,
            icon,
            condition,
            temperature
        );
        calendarDates.appendChild(item);
    }
    calendarPopup.classList.remove("hidden");
    calendarBtn.setAttribute("aria-expanded", "true");
}

// CLOSE FORECAST CALENDAR
function closeCalendar(){
    if (!calendarPopup || !calendarBtn) return;
    calendarPopup.classList.add("hidden");
    calendarBtn.setAttribute("aria-expanded", "false");
}

// CALENDAR EVENT LISTENERS
if (calendarBtn){
    calendarBtn.addEventListener(
        "click",
        renderCalendar
    );
}
if (closeCalendarBtn){
    closeCalendarBtn.addEventListener(
        "click",
        closeCalendar
    );
}


// APPLICATION INITIALIZATION
function initializeApp() {
    unitToggle.textContent = `°${temperatureUnit}`;
    renderFavorites();
    renderRecentSearches();
    // Load default city
    searchCity("Mumbai");
}
initializeApp();
