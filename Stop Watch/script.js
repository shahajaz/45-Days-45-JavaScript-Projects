const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const millisecondsElement = document.getElementById("milliseconds");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

const startIcon = document.getElementById("startIcon");
const startText = document.getElementById("startText");

const lapList = document.getElementById("lapList");
const lapCount = document.getElementById("lapCount");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* STOPWATCH STATE */
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let animationFrameId = null;
let lastLapTime = 0;
let laps = [];
const STORAGE_KEY = "precisionStopwatchLaps";

/* TIME FORMATTING */
function formatTime(time) {
    const totalMilliseconds = Math.max(0, Math.floor(time));
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor(
        (totalMilliseconds % 3600000) / 60000
    );
    const seconds = Math.floor(
        (totalMilliseconds % 60000) / 1000
    );
    const milliseconds = totalMilliseconds % 1000;
    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
        String(milliseconds).padStart(3, "0")
    ];
}

/* UPDATE TIMER DISPLAY */
function updateDisplay(time) {
    const [
        hours,
        minutes,
        seconds,
        milliseconds
    ] = formatTime(time);
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;
    millisecondsElement.textContent = milliseconds;
}

/* TIMER ENGINE */
function updateTimer() {
    if (!isRunning) return;
    elapsedTime = performance.now() - startTime;
    updateDisplay(elapsedTime);
    animationFrameId = requestAnimationFrame(updateTimer);
}

/* START / RESUME STOPWATCH */
function startStopwatch() {
    if (isRunning) {
        pauseStopwatch();
        return;
    }
    startTime = performance.now() - elapsedTime;
    isRunning = true;

    statusText.textContent = "Running";
    statusDot.className = "status-dot running";

    startIcon.className = "fa-solid fa-pause";
    startText.textContent = "Pause";

    resetBtn.disabled = true;
    lapBtn.disabled = false;
    updateTimer();
}

/* PAUSE STOPWATCH */
function pauseStopwatch() {
    if (!isRunning) return;
    elapsedTime = performance.now() - startTime;
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    updateDisplay(elapsedTime);
    statusText.textContent = "Paused";
    statusDot.className = "status-dot paused";
    startIcon.className = "fa-solid fa-play";
    startText.textContent = "Resume";
    resetBtn.disabled = false;
    lapBtn.disabled = true;
}

/* RESET STOPWATCH */
function resetStopwatch() {
    if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
    }
    elapsedTime = 0;
    startTime = 0;
    lastLapTime = 0;
    laps = [];
    updateDisplay(0);
    startIcon.className = "fa-solid fa-play";
    startText.textContent = "Start";
    statusText.textContent = "Ready";
    statusDot.className = "status-dot";
    resetBtn.disabled = true;
    lapBtn.disabled = true;
    renderLaps();
    saveLaps();
    showToast("Stopwatch reset successfully!");
}

/* RECORD LAP */
function recordLap() {
    if (!isRunning) return;
    const currentTime = performance.now() - startTime;
    const lapDuration = currentTime - lastLapTime;
    const lap = {
        number: laps.length + 1,
        lapTime: Math.floor(lapDuration),
        totalTime: Math.floor(currentTime),
        timestamp: Date.now()
    };
    laps.unshift(lap);
    lastLapTime = currentTime;
    renderLaps();
    saveLaps();
    showToast(`Lap ${lap.number} recorded!`);
}

/* RENDER LAP HISTORY */
function renderLaps() {
    lapCount.textContent =
        `${laps.length} ${laps.length === 1 ? "lap" : "laps"} recorded`;
    copyBtn.disabled = laps.length === 0;
    clearBtn.disabled = laps.length === 0;
    if (laps.length === 0){
        lapList.innerHTML = `
            <tr class="empty-row">
                <td colspan="4">
                    <div class="empty-state">
                        <i class="fa-solid fa-stopwatch"></i>
                        <p>No laps recorded yet</p>
                        <span>Start the stopwatch and press Lap to record your first lap.</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const lapDurations = laps.map(lap => lap.lapTime);
    const fastestLap = Math.min(...lapDurations);
    const slowestLap = Math.max(...lapDurations);
    lapList.innerHTML = laps.map(lap => {
        let performanceClass = "";
        let performanceText = "Normal";
        if (fastestLap !== slowestLap &&
            lap.lapTime === fastestLap) {
            performanceClass = "fastest";
            performanceText = "Fastest";
        }
        else if (fastestLap !== slowestLap &&
            lap.lapTime === slowestLap){
            performanceClass = "slowest";
            performanceText = "Slowest";
        }
        const lapTime = formatTime(lap.lapTime);
        const totalTime = formatTime(lap.totalTime);
        return `
            <tr>
                <td class="lap-number">#${lap.number}</td>
                <td class="${performanceClass}">
                    ${lapTime[0]}:${lapTime[1]}:${lapTime[2]}.${lapTime[3]}
                </td>
                <td>
                    ${totalTime[0]}:${totalTime[1]}:${totalTime[2]}.${totalTime[3]}
                </td>
                <td>
                    <span class="performance ${
                        performanceText === "Slowest" ? "slower" : ""
                    }">
                        ${performanceText}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

/* SAVE LAPS TO LOCAL STORAGE */
function saveLaps() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(laps)
        );
        document.getElementById("storageStatus").textContent =
            "LocalStorage enabled";
    } catch (error){
        document.getElementById("storageStatus").textContent =
            "Storage unavailable";
        console.error("Unable to save lap history:", error);
    }
}

/* LOAD LAPS FROM LOCAL STORAGE */
function loadLaps() {
    try {
        const savedLaps = localStorage.getItem(STORAGE_KEY);
        if (savedLaps){
            const parsedLaps = JSON.parse(savedLaps);
            if(
                Array.isArray(parsedLaps) &&
                parsedLaps.every(lap =>
                    Number.isInteger(lap.number) &&
                    Number.isFinite(lap.lapTime) &&
                    Number.isFinite(lap.totalTime) &&
                    lap.lapTime >= 0 &&
                    lap.totalTime >= 0
                )
            ) {
                laps = parsedLaps;

                renderLaps();
            }
        }
    } catch (error) {
        console.error("Unable to load lap history:", error);
        laps = [];
        renderLaps();
    }
}

/* =====================================
   13. CLEAR LAP HISTORY */
function clearLaps() {
    if (laps.length === 0) return;
    const confirmed = confirm(
        "Are you sure you want to clear all lap records?"
    );
    if (!confirmed) return;
    laps = [];
    lastLapTime = isRunning
        ? performance.now() - startTime
        : elapsedTime;
    renderLaps();
    saveLaps();
    showToast("Lap history cleared!");
}

/* COPY LAP TIMES */
async function copyLapTimes() {
    if (laps.length === 0) return;
    const header = "Lap\tLap Time\tTotal Time";
    const rows = laps.map(lap => {
        const lapTime = formatTime(lap.lapTime);
        const totalTime = formatTime(lap.totalTime);
        return [
            `Lap ${lap.number}`,
            `${lapTime[0]}:${lapTime[1]}:${lapTime[2]}.${lapTime[3]}`,
            `${totalTime[0]}:${totalTime[1]}:${totalTime[2]}.${totalTime[3]}`
        ].join("\t");

    });
    const text = [header, ...rows].join("\n");
    try {
        await navigator.clipboard.writeText(text);
        showToast("Lap times copied to clipboard!");
    } catch (error) {
        console.error("Clipboard operation failed:", error);
        showToast("Unable to copy. Check browser permissions.");
    }
}

/* TOAST NOTIFICATION */
let toastTimeout;
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* KEYBOARD SHORTCUTS */
document.addEventListener("keydown", event =>{
    // Avoid triggering shortcuts while typing.
    if (
        event.target.matches("input, textarea, select") ||
        event.target.isContentEditable ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
    ) {
        return;
    }
    switch (event.code){
        case "Space":
            event.preventDefault();

            startStopwatch();
            break;
        case "KeyL":
            if (isRunning){
                recordLap();
            }
            break;

        case "KeyR":
            if (!isRunning){
                resetStopwatch();
            }
            break;
    }
});

/* EVENT LISTENERS */
startBtn.addEventListener("click", startStopwatch);
resetBtn.addEventListener("click", resetStopwatch);
lapBtn.addEventListener("click", recordLap);
copyBtn.addEventListener("click", copyLapTimes);
clearBtn.addEventListener("click", clearLaps);

/* INITIALIZE APPLICATION */
function initializeStopwatch() {
    updateDisplay(0);
    loadLaps();
    statusText.textContent = "Ready";
    console.log("Stopwatch application initialized!");
}
initializeStopwatch();
