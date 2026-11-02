"use strict";

const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");

const difficultySelect = document.getElementById("difficulty");
const timerCheckbox = document.getElementById("enableTimer");

const messageElement = document.getElementById("message");
const attemptsElement = document.getElementById("attempts");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const timerElement = document.getElementById("timer");
const rangeElement = document.getElementById("range");
const historyElement = document.getElementById("guessHistory");
const gamesPlayedElement = document.getElementById("gamesPlayed");
const winsElement = document.getElementById("wins");
const lossesElement = document.getElementById("losses");
const gameContainer = document.querySelector(".game-container");

// ==========================================
// GAME CONFIGURATION
// ==========================================
const difficultySettings = {
    easy: {
        min: 1,
        max: 50,
        maxAttempts: 10
    },

    medium: {
        min: 1,
        max: 100,
        maxAttempts: 7
    },

    hard: {
        min: 1,
        max: 200,
        maxAttempts: 5
    }
};
const STORAGE_KEY = "numberGuessingGameStats";


// ==========================================
// GAME STATE
// ==========================================
let targetNumber;
let attemptsLeft;
let maxAttempts;
let score = 0;
let bestScore = 0;
let gamesPlayed = 0;
let wins = 0;
let losses = 0;

let guessHistory = [];
let gameOver = false;
let gameStarted = false;

let minNumber = 1;
let maxNumber = 100;

let elapsedSeconds = 0;
let timerInterval = null;


// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================

// Load saved statistics from LocalStorage.
function loadStats() {
    try {
        const savedStats = localStorage.getItem(STORAGE_KEY);

        if (savedStats) {
            const stats = JSON.parse(savedStats);

            bestScore = Number.isFinite(stats.bestScore)
                ? stats.bestScore
                : 0;

            gamesPlayed = Number.isSafeInteger(stats.gamesPlayed)
                ? stats.gamesPlayed
                : 0;

            wins = Number.isSafeInteger(stats.wins)
                ? stats.wins
                : 0;

            losses = Number.isSafeInteger(stats.losses)
                ? stats.losses
                : 0;
        }
    } catch (error) {
        console.error("Unable to load saved game statistics:", error);
    }
}

// Save statistics to LocalStorage.
function saveStats() {
    const stats = {
        bestScore,
        gamesPlayed,
        wins,
        losses
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error("Unable to save game statistics:", error);
    }
}


// ==========================================
// RANDOM NUMBER GENERATION
// ==========================================
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ==========================================
// TIMER FUNCTIONS
// ==========================================
function startTimer() {
    if (!timerCheckbox.checked || timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(() => {
        elapsedSeconds++;

        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        timerElement.textContent =
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;
    }, 1000);
}


function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    elapsedSeconds = 0;
    timerElement.textContent = timerCheckbox.checked
        ? "00:00"
        : "Off";
}


// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================
function updateUI() {
    attemptsElement.textContent =
        `${attemptsLeft} / ${maxAttempts}`;

    scoreElement.textContent = score;

    bestScoreElement.textContent = bestScore;

    gamesPlayedElement.textContent = gamesPlayed;

    winsElement.textContent = wins;

    lossesElement.textContent = losses;

    rangeElement.textContent =
        `${minNumber} - ${maxNumber}`;
}


function showMessage(message, type = "info") {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
}
function renderGuessHistory() {
    historyElement.replaceChildren();

    guessHistory.forEach((guess) => {
        const listItem = document.createElement("li");

        listItem.textContent = `${guess.value} - ${guess.result}`;

        historyElement.appendChild(listItem);
    });
}


// ==========================================
// SCORE CALCULATION
// ==========================================
function calculateScore() {
    const attemptPoints = attemptsLeft * 100;

    const timePenalty = timerCheckbox.checked
        ? elapsedSeconds * 5
        : 0;

    const timePoints = Math.max(0, 300 - timePenalty);

    return Math.max(0, attemptPoints + timePoints);
}


// ==========================================
// END GAME FUNCTION
// ==========================================
function endGame(isWinner) {
    gameOver = true;

    guessInput.disabled = true;
    guessButton.disabled = true;

    stopTimer();

    gamesPlayed++;

    if (isWinner) {
        wins++;

        score = calculateScore();

        if (score > bestScore) {
            bestScore = score;
            saveStats();
        }
        showMessage(
            `Congratulations! You guessed ${targetNumber} correctly!`,
            "success"
        );

        gameContainer.classList.add("winner");

    } else {
        losses++;

        showMessage(
            `Game Over! The correct number was ${targetNumber}.`,
            "error"
        );
    }
    saveStats();
    updateUI();
}


// ==========================================
// GUESS VALIDATION
// ==========================================
function validateGuess(value) {
    if (value.trim() === "") {
        return {
            valid: false,
            message: "Please enter a number."
        };
    }

    const guess = Number(value);
    if (!Number.isSafeInteger(guess)) {
        return {
            valid: false,
            message: "Please enter a valid whole number."
        };
    }
    if (guess < minNumber || guess > maxNumber) {
        return {
            valid: false,
            message: `Enter a number between ${minNumber} and ${maxNumber}.`
        };
    }
    return {
        valid: true,
        guess
    };
}


// ==========================================
// MAIN GAME LOGIC
// ==========================================

function checkGuess() {
    if (gameOver) {
        return;
    }

    const validation = validateGuess(guessInput.value);

    if (!validation.valid) {
        showMessage(validation.message, "error");
        return;
    }

    const guess = validation.guess;

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    attemptsLeft--;

    let result;

    if (guess === targetNumber) {
        result = "Correct";

        guessHistory.push({
            value: guess,
            result
        });

        renderGuessHistory();

        endGame(true);

    } else if (guess < targetNumber) {
        result = "Too Low";

        showMessage(
            "Too low! Try a higher number.",
            "info"
        );

    } else {
        result = "Too High";

        showMessage(
            "Too high! Try a lower number.",
            "info"
        );
    }

    if (guess !== targetNumber) {
        guessHistory.push({
            value: guess,
            result
        });

        renderGuessHistory();

        if (attemptsLeft === 0) {
            endGame(false);
        }
    }

    updateUI();

    guessInput.value = "";

    if (!gameOver) {
        guessInput.focus();
    }
}


// ==========================================
// START / RESTART GAME
// ==========================================
function startGame() {
    stopTimer();
    const selectedDifficulty = difficultySelect.value;
    const settings = difficultySettings[selectedDifficulty];

    minNumber = settings.min;
    maxNumber = settings.max;
    maxAttempts = settings.maxAttempts;

    targetNumber = generateRandomNumber(
        minNumber,
        maxNumber
    );
    attemptsLeft = maxAttempts;

    score = 0;

    guessHistory = [];

    gameOver = false;
    gameStarted = false;

    elapsedSeconds = 0;

    guessInput.disabled = false;
    guessButton.disabled = false;

    guessInput.min = minNumber;
    guessInput.max = maxNumber;
    guessInput.value = "";

    historyElement.replaceChildren();

    gameContainer.classList.remove("winner");
    resetTimer();
    showMessage(
        `Guess a number between ${minNumber} and ${maxNumber}.`,
        "info"
    );

    updateUI();
    guessInput.focus();
    // Debugging only: remove before production.
    // console.log("Target number:", targetNumber);
}


// ==========================================
// EVENT LISTENERS
// ==========================================

// Submit a guess when the button is clicked.
guessButton.addEventListener("click", checkGuess);


// Submit a guess when Enter is pressed.
guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkGuess();
    }
});


// Restart the game.
restartButton.addEventListener("click", startGame);


// Change difficulty and start a new game.
difficultySelect.addEventListener("change", startGame);


// Update timer display when timer option changes.
timerCheckbox.addEventListener("change", () => {
    if (!gameStarted) {
        resetTimer();
    } else if (timerCheckbox.checked) {
        startTimer();
    } else {
        stopTimer();
        timerElement.textContent = "Off";
    }
});

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

// Load previously saved statistics.
loadStats();

// Start the first game when the page loads.
startGame();
