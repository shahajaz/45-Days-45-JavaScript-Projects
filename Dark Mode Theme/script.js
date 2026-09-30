

const timeElement = document.getElementById("time");
const ampmElement = document.getElementById("ampm");
const dateElement = document.getElementById("date");
const dayElement = document.getElementById("day");

const btn12Hour = document.getElementById("12hr");
const btn24Hour = document.getElementById("24hr");


// ========================================
// CLOCK FORMAT
// ========================================

let is24Hour = false;


// ========================================
// UPDATE CLOCK
// ========================================

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();


    // ====================================
    // 12-HOUR FORMAT
    // ====================================

    if (!is24Hour) {

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        hours = hours === 0 ? 12 : hours;

        ampmElement.textContent = ampm;
    }


    // ====================================
    // 24-HOUR FORMAT
    // ====================================

    else {

        ampmElement.textContent = "";
    }


    // ====================================
    // FORMAT TIME
    // ====================================

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    timeElement.textContent =
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;


    // ====================================
    // DATE
    // ====================================

    const dateOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    dateElement.textContent =
        now.toLocaleDateString("en-US", dateOptions);


    // ====================================
    // DAY
    // ====================================

    const dayOptions = {
        weekday: "long"
    };

    dayElement.textContent =
        now.toLocaleDateString("en-US", dayOptions);


    // ====================================
    // DATETIME ATTRIBUTE
    // ====================================

    dateElement.setAttribute(
        "datetime",
        now.toISOString().split("T")[0]
    );
}


// ========================================
// 12-HOUR BUTTON
// ========================================

btn12Hour.addEventListener("click", () => {

    is24Hour = false;

    btn12Hour.classList.add("active");
    btn24Hour.classList.remove("active");

    btn12Hour.setAttribute("aria-pressed", "true");
    btn24Hour.setAttribute("aria-pressed", "false");

    updateClock();
});


// ========================================
// 24-HOUR BUTTON
// ========================================

btn24Hour.addEventListener("click", () => {

    is24Hour = true;

    btn24Hour.classList.add("active");
    btn12Hour.classList.remove("active");

    btn24Hour.setAttribute("aria-pressed", "true");
    btn12Hour.setAttribute("aria-pressed", "false");

    updateClock();
});


// ========================================
// INITIAL UPDATE
// ========================================

updateClock();


// ========================================
// UPDATE EVERY SECOND
// ========================================

setInterval(updateClock, 1000);
