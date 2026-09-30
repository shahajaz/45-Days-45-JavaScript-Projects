const time = document.getElementById("time");
const ampm = document.getElementById("ampm");
const date = document.getElementById("date");
const day = document.getElementById("day");
const btn12Hour = document.getElementById("12hr");
const btn24Hour = document.getElementById("24hr");

let is24Hour = false;

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 12-hour format
    if (!is24Hour) {
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) {
            hours = 12;
        }

        ampm.textContent = ampm;
    }


    // 24-hour format
    else {
        ampm.textContent = "";
    }

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");


    // Display time
    time.textContent =
        `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;


    // Display date
    date.textContent =
        now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });


    // Display day
    day.textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long"
        });


    // Update datetime attribute
    date.setAttribute(
        "datetime",
        now.toISOString().split("T")[0]
    );
}


// 12-hour button
btn12Hour.addEventListener("click", function () {
    is24Hour = false;
    btn12Hour.classList.add("active");
    btn24Hour.classList.remove("active");
    btn12Hour.setAttribute("aria-pressed", "true");
    btn24Hour.setAttribute("aria-pressed", "false");
    updateClock();
});


// 24-hour button
btn24Hour.addEventListener("click", function () {
    is24Hour = true;
    btn24Hour.classList.add("active");
    btn12Hour.classList.remove("active");
    btn24Hour.setAttribute("aria-pressed", "true");
    btn12Hour.setAttribute("aria-pressed", "false");

    updateClock();
});

// Run immediately
updateClock();

// Update every second
setInterval(updateClock, 1000);