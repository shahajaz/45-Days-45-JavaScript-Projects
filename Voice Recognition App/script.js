const micButton = document.getElementById("micButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const micWrapper = document.getElementById("micWrapper");
const micHeading = document.getElementById("micHeading");
const micDescription = document.getElementById("micDescription");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const recordingTime = document.getElementById("recordingTime");

const languageSelect = document.getElementById("languageSelect");
const continuousToggle = document.getElementById("continuousToggle");

const transcription = document.getElementById("transcription");
const interimText = document.getElementById("interimText");
const wordCount = document.getElementById("wordCount");

const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const clearButton = document.getElementById("clearButton");

const themeToggle = document.getElementById("themeToggle");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistoryButton");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* SPEECH RECOGNITION SETUP */
const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

let finalTranscript = "";
let baseTranscript = "";

let startTime = null;
let timerInterval = null;
let toastTimeout = null;

let history = [];

const HISTORY_KEY = "voiceflow_history";
const THEME_KEY = "voiceflow_theme";


/* INITIALIZATION */
function initializeApp() {
    loadTheme();
    loadHistory();
    updateWordCount();

    if (!SpeechRecognition) {
        showError(
            "Speech recognition is not supported by this browser. Please try Chrome or Edge."
        );

        startButton.disabled = true;
        micButton.disabled = true;
        statusText.textContent = "Browser not supported";

        micHeading.textContent = "Unsupported Browser";
        micDescription.textContent =
            "Please use a browser that supports the Web Speech API.";

        return;
    }

    recognition = new SpeechRecognition();

    recognition.lang = languageSelect.value;
    recognition.continuous = continuousToggle.checked;
    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    configureRecognitionEvents();
}


/* SPEECH RECOGNITION EVENTS */
function configureRecognitionEvents() {

    // Recognition starts
    recognition.onstart = () => {
        isListening = true;

        startTime = Date.now();

        updateUI("listening");
        startTimer();

        hideError();

        baseTranscript = transcription.value.trim();
        finalTranscript = "";
        interimText.textContent = "";

        languageSelect.disabled = true;
        continuousToggle.disabled = true;
    };

    // Recognition receives speech results
    recognition.onresult = (event) => {

        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {

            const transcriptText =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += transcriptText + " ";
            } else {
                interimTranscript += transcriptText;
            }
        }

        const completeTranscript = [
            baseTranscript,
            finalTranscript.trim()
        ]
            .filter(Boolean)
            .join(" ");

        transcription.value = completeTranscript;

        interimText.textContent = interimTranscript
            ? `Listening: ${interimTranscript}`
            : "";

        updateWordCount();
    };

    // Recognition errors
    recognition.onerror = (event) => {

        const errorMessages = {
            "not-allowed":
                "Microphone permission denied. Please allow microphone access.",

            "service-not-allowed":
                "Speech recognition service is not allowed.",

            "audio-capture":
                "No microphone was detected on your device.",

            "no-speech":
                "No speech was detected. Please try speaking again.",

            "network":
                "Network error. Please check your internet connection.",

            "language-not-supported":
                "The selected language is not supported.",

            "aborted":
                "Speech recognition was interrupted."
        };

        if (event.error === "aborted") {
            return;
        }

        showError(
            errorMessages[event.error] ||
            `Speech recognition error: ${event.error}`
        );
    };


    // Recognition ends
    recognition.onend = () => {

        const wasListening = isListening;

        isListening = false;

        stopTimer();

        updateUI("ready");

        languageSelect.disabled = false;
        continuousToggle.disabled = false;

        interimText.textContent = "";

        if (wasListening && transcription.value.trim()) {
            saveToHistory(transcription.value.trim());
        }
    };
}


/* START RECOGNITION */
function startRecognition() {
    if (!recognition || isListening) {
        return;
    }

    hideError();

    recognition.lang = languageSelect.value;
    recognition.continuous = continuousToggle.checked;
    recognition.interimResults = true;

    try {
        recognition.start();
    } catch (error) {
        showError(
            "Unable to start recognition. Please try again."
        );
    }
}


/* STOP RECOGNITION */
function stopRecognition() {

    if (!recognition || !isListening) {
        return;
    }

    recognition.stop();
}


/*  UPDATE USER INTERFACE */
function updateUI(state) {

    if (state === "listening") {

        micWrapper.classList.add("listening");
        statusDot.classList.add("active");
        statusDot.classList.remove("processing");

        statusText.textContent = "Listening...";

        micHeading.textContent = "Listening to You";
        micDescription.textContent =
            "Speak clearly. Your words will appear below.";

        micButton.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';

        micButton.setAttribute(
            "aria-label",
            "Microphone is active"
        );

        startButton.disabled = true;
        stopButton.disabled = false;

    } else {

        micWrapper.classList.remove("listening");
        statusDot.classList.remove("active", "processing");

        statusText.textContent = "Ready to listen";

        micHeading.textContent = "Ready to Listen?";
        micDescription.textContent =
            "Click the microphone and start speaking.";

        micButton.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';

        micButton.setAttribute(
            "aria-label",
            "Start voice recognition"
        );

        startButton.disabled = false;
        stopButton.disabled = true;
    }
}


/* RECORDING TIMER */
function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {

        if (!startTime) return;

        const elapsedSeconds = Math.floor(
            (Date.now() - startTime) / 1000
        );

        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        recordingTime.innerHTML = `
            <i class="fa-regular fa-clock"></i>
            ${String(minutes).padStart(2, "0")}:
            ${String(seconds).padStart(2, "0")}
        `;

    }, 1000);
}


function stopTimer(){
    clearInterval(timerInterval);

    timerInterval = null;
    startTime = null;

    recordingTime.innerHTML = `
        <i class="fa-regular fa-clock"></i>
        00:00
    `;
}


/*  WORD COUNT */
function updateWordCount() {
    const text = transcription.value.trim();

    const words = text
        ? text.split(/\s+/).length
        : 0;

    wordCount.textContent =
        `${words} ${words === 1 ? "word" : "words"}`;
}


/* COPY TRANSCRIPTION */
async function copyTranscription() {
    const text = transcription.value.trim();

    if (!text) {
        showToast("Nothing to copy!");
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        showToast("Text copied successfully!");

    } catch (error) {

        // Fallback for browsers without Clipboard API access
        transcription.select();

        const copied = document.execCommand("copy");

        transcription.setSelectionRange(
            transcription.value.length,
            transcription.value.length
        );

        showToast(
            copied
                ? "Text copied successfully!"
                : "Unable to copy text."
        );
    }
}


/* DOWNLOAD TRANSCRIPTION */
function downloadTranscription() {

    const text = transcription.value.trim();

    if (!text) {
        showToast("Nothing to download!");
        return;
    }

    const blob = new Blob(
        [text],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        `voice-transcription-${Date.now()}.txt`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    showToast("Transcription downloaded!");
}


/* CLEAR TRANSCRIPTION */
function clearTranscription() {

    if (isListening) {
        stopRecognition();
    }

    transcription.value = "";

    baseTranscript = "";
    finalTranscript = "";

    interimText.textContent = "";

    updateWordCount();

    hideError();

    showToast("Transcription cleared!");
}


/* TRANSCRIPTION HISTORY */
function loadHistory() {
    try {
        const savedHistory = localStorage.getItem(HISTORY_KEY);

        history = savedHistory
            ? JSON.parse(savedHistory)
            : [];

        if (!Array.isArray(history)) {
            history = [];
        }

    } catch (error) {
        history = [];
    }

    renderHistory();
}


function saveToHistory(text) {

    if (!text) return;

    // Avoid saving an identical consecutive transcription
    if (history.length > 0 && history[0].text === text) {
        return;
    }

    const entry = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleString()
    };

    history.unshift(entry);

    // Keep only the latest 10 records
    history = history.slice(0, 10);

    try {
        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(history)
        );
    } catch (error) {
        showToast("Unable to save history.");
    }

    renderHistory();
}


function renderHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                No saved transcriptions yet.
            </p>
        `;

        return;
    }

    history.forEach((entry) => {

        const item = document.createElement("div");

        item.className = "history-item";

        const content = document.createElement("div");
        content.className = "history-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = entry.text.length > 100
            ? entry.text.substring(0, 100) + "..."
            : entry.text;

        const date = document.createElement("span");
        date.textContent = entry.date;

        content.appendChild(paragraph);
        content.appendChild(date);

        const loadButton = document.createElement("button");

        loadButton.className = "history-load";
        loadButton.innerHTML =
            '<i class="fa-solid fa-arrow-up-right-from-square"></i>';

        loadButton.setAttribute(
            "aria-label",
            "Load saved transcription"
        );

        loadButton.title = "Load transcription";

        loadButton.addEventListener("click", () => {

            if (isListening) {
                stopRecognition();
            }

            transcription.value = entry.text;

            baseTranscript = "";
            finalTranscript = "";

            updateWordCount();

            showToast("Transcription loaded!");
        });

        item.appendChild(content);
        item.appendChild(loadButton);

        historyList.appendChild(item);
    });
}


/* CLEAR HISTORY */
function clearHistory() {
    if (history.length === 0) {
        showToast("History is already empty!");
        return;
    }
    const confirmed = confirm(
        "Are you sure you want to delete all transcription history?"
    );

    if (!confirmed) return;

    history = [];

    localStorage.removeItem(HISTORY_KEY);

    renderHistory();

    showToast("History cleared!");
}


/* DARK MODE / LIGHT MODE */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme
        ? savedTheme === "dark"
        : prefersDark;
    document.body.classList.toggle("dark-mode", useDark);
    updateThemeIcon();
}


function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

    localStorage.setItem(THEME_KEY, theme);

    updateThemeIcon();
}


function updateThemeIcon() {

    const isDark =
        document.body.classList.contains("dark-mode");

    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}


/* ERROR HANDLING */

function showError(message) {

    errorText.textContent = message;

    errorMessage.classList.add("show");
}


function hideError() {

    errorMessage.classList.remove("show");

    errorText.textContent = "";
}


/* TOAST NOTIFICATION */
function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* EVENT LISTENERS */
// Start recognition
startButton.addEventListener(
    "click",
    startRecognition
);

// Microphone button
micButton.addEventListener("click", () => {

    if (isListening) {
        stopRecognition();
    } else {
        startRecognition();
    }
});

// Stop recognition
stopButton.addEventListener(
    "click",
    stopRecognition
);

// Language selection
languageSelect.addEventListener("change", () => {

    if (recognition) {
        recognition.lang = languageSelect.value;
    }
});

// Continuous mode
continuousToggle.addEventListener("change", () => {

    if (recognition) {
        recognition.continuous = continuousToggle.checked;
    }
});

// Update word count when the user edits text
transcription.addEventListener(
    "input",
    updateWordCount
);

// Copy
copyButton.addEventListener(
    "click",
    copyTranscription
);

// Download
downloadButton.addEventListener(
    "click",
    downloadTranscription
);

// Clear transcription
clearButton.addEventListener(
    "click",
    clearTranscription
);

// Dark / Light mode
themeToggle.addEventListener(
    "click",
    toggleTheme
);

// Clear history
clearHistoryButton.addEventListener(
    "click",
    clearHistory
);


/* START APPLICATION */
initializeApp();

console.log("VoiceFlow Application Initialized!");
