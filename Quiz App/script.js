"use strict";

const questionBank = {
    "JavaScript": [
        {
            question: "Which keyword declares a block-scoped variable that can be reassigned?",
            options: ["const", "let", "static", "define"],
            answer: 1,
            difficulty: "EASY",
            explanation: "`let` creates a block-scoped variable that can be reassigned. `const` is also block-scoped, but cannot be reassigned."
        },

        {
            question: "What does the === operator check in JavaScript?",
            options: ["Value only", "Type only", "Value and type", "Whether values are truthy"],
            answer: 2,
            difficulty: "EASY",
            explanation: "Strict equality compares both value and type without performing type coercion."
        },

        {
            question: "Which array method creates a new array by transforming every element?",
            options: ["forEach()", "filter()", "map()", "reduce()"],
            answer: 2,
            difficulty: "EASY",
            explanation: "`map()` calls a callback for each element and returns a new array containing the callback results."
        },

        {
            question: "What is the result of typeof null?",
            options: ["null", "undefined", "object", "boolean"],
            answer: 2,
            difficulty: "MEDIUM",
            explanation: "Because of a historical JavaScript behavior, typeof null returns the string object."
        },

        {
            question: "Which method converts a JSON string into a JavaScript value?",
            options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "Object.parse()"],
            answer: 1,
            difficulty: "EASY",
            explanation: "JSON.parse() parses JSON text and creates the corresponding JavaScript value."
        },

        {
            question: "What will Boolean([]) return?",
            options: ["false", "true", "undefined", "TypeError"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Arrays are objects, and all objects are truthy in JavaScript, including empty arrays."
        },

        {
            question: "Which statement is used to handle an exception?",
            options: ["if / else", "try / catch", "for / while", "switch / case"],
            answer: 1,
            difficulty: "EASY",
            explanation: "A try block contains code that may throw; a catch block handles the thrown error."
        },

        {
            question: "What does a Promise represent?",
            options: [
                "A loop that runs later",
                "A value that may be available now, later, or never",
                "A synchronous function",
                "A browser event"
            ],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "A Promise represents the eventual completion or failure of an asynchronous operation."
        },

        {
            question: "Which array method returns the first element that matches a condition?",
            options: ["find()", "some()", "includes()", "every()"],
            answer: 0,
            difficulty: "MEDIUM",
            explanation: "find() returns the first matching element, or undefined if no element matches."
        },

        {
            question: "What is a closure in JavaScript?",
            options: [
                "A function with access to its lexical scope",
                "A method that closes a browser tab",
                "A function without parameters",
                "A completed Promise"
            ],
            answer: 0,
            difficulty: "HARD",
            explanation: "A closure is a function bundled with references to its surrounding lexical environment."
        },

        {
            question: "Which keyword pauses execution inside an async function until a Promise settles?",
            options: ["defer", "await", "yield", "pause"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "await pauses the surrounding async function until the Promise settles."
        },

        {
            question: "What does the spread syntax ... do with an array in an array literal?",
            options: [
                "Sorts the array",
                "Expands its iterable elements",
                "Makes it immutable",
                "Converts it to a string"
            ],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Spread syntax expands iterable elements into the surrounding array literal."
        }

    ],

    "HTML & CSS": [

        {
            question: "Which HTML element represents the main content of a document?",
            options: ["<section>", "<main>", "<body-content>", "<content>"],
            answer: 1,
            difficulty: "EASY",
            explanation: "The semantic main element represents the dominant content of the document body."
        },

        {
            question: "Which CSS property controls the space inside an element's border?",
            options: ["margin", "gap", "padding", "outline"],
            answer: 2,
            difficulty: "EASY",
            explanation: "Padding creates space between an element's content and its border."
        },

        {
            question: "Which attribute provides alternative text for an image?",
            options: ["title", "alt", "srcset", "aria-label"],
            answer: 1,
            difficulty: "EASY",
            explanation: "The alt attribute provides a text alternative for an image."
        },

        {
            question: "Which CSS layout system is designed primarily for one-dimensional layouts?",
            options: ["Grid", "Flexbox", "Float", "Position"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Flexbox is designed to distribute and align items along one main axis."
        },

        {
            question: "What does position: fixed position an element relative to by default?",
            options: ["Its parent", "The document flow", "The viewport", "The nearest flex item"],
            answer: 2,
            difficulty: "MEDIUM",
            explanation: "A fixed-position element is positioned relative to the viewport by default."
        },

        {
            question: "Which HTML element is used to connect an external CSS file?",
            options: ["<style>", "<script>", "<link>", "<css>"],
            answer: 2,
            difficulty: "EASY",
            explanation: "A link element with rel stylesheet connects an external stylesheet."
        },

        {
            question: "What is the default box-sizing value in CSS?",
            options: ["border-box", "content-box", "padding-box", "inherit"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "The default is content-box, where declared width and height apply to the content box."
        },

        {
            question: "Which selector has the highest specificity?",
            options: [".menu", "#menu", "nav", "*"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "An ID selector has higher specificity than a class, type, or universal selector."
        },

        {
            question: "Which HTML element is most appropriate for a page's navigation links?",
            options: ["<aside>", "<nav>", "<footer>", "<label>"],
            answer: 1,
            difficulty: "EASY",
            explanation: "The nav element identifies a section containing major navigation links."
        },

        {
            question: "Which CSS unit is relative to the root element's font size?",
            options: ["em", "rem", "vw", "%"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "rem is relative to the computed font size of the root element."
        },

        {
            question: "Which attribute makes a form field mandatory before submission?",
            options: ["validate", "mandatory", "required", "checked"],
            answer: 2,
            difficulty: "EASY",
            explanation: "The required attribute enables native constraint validation for supported form controls."
        },

        {
            question: "What does @media enable in CSS?",
            options: [
                "Database queries",
                "Responsive conditional styling",
                "HTML templating",
                "JavaScript modules"
            ],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Media queries apply CSS rules conditionally based on viewport or device characteristics."
        }

    ],

    "Computer Science": [

        {
            question: "What is the primary function of an operating system?",
            options: [
                "Design websites",
                "Manage hardware and software resources",
                "Compile every program",
                "Create databases"
            ],
            answer: 1,
            difficulty: "EASY",
            explanation: "An operating system manages resources such as CPU, memory, storage, and devices."
        },

        {
            question: "Which data structure follows the LIFO principle?",
            options: ["Queue", "Stack", "Linked list", "Tree"],
            answer: 1,
            difficulty: "EASY",
            explanation: "A stack uses Last In, First Out: the most recently added item is removed first."
        },

        {
            question: "What does CPU stand for?",
            options: [
                "Central Processing Unit",
                "Computer Primary Utility",
                "Core Program Upload",
                "Central Program User"
            ],
            answer: 0,
            difficulty: "EASY",
            explanation: "CPU stands for Central Processing Unit, which executes program instructions."
        },

        {
            question: "Which protocol is commonly used to securely browse websites?",
            options: ["FTP", "HTTP", "HTTPS", "SMTP"],
            answer: 2,
            difficulty: "EASY",
            explanation: "HTTPS is HTTP secured using TLS, providing encryption and server authentication."
        },

        {
            question: "What is the average time complexity of binary search on a sorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Binary search halves the remaining search space on each comparison, giving O(log n) time."
        },

        {
            question: "Which memory is typically volatile?",
            options: ["SSD", "HDD", "RAM", "ROM"],
            answer: 2,
            difficulty: "EASY",
            explanation: "RAM is volatile: its contents are generally lost when power is removed."
        },

        {
            question: "What does SQL primarily help users do?",
            options: [
                "Style web pages",
                "Query and manage relational databases",
                "Route network packets",
                "Compile source code"
            ],
            answer: 1,
            difficulty: "EASY",
            explanation: "SQL is used to define, query, manipulate, and control data in relational databases."
        },

        {
            question: "Which network device forwards packets between different networks?",
            options: ["Hub", "Switch", "Router", "Repeater"],
            answer: 2,
            difficulty: "MEDIUM",
            explanation: "A router forwards packets between networks using network-layer addressing and routing tables."
        },

        {
            question: "In object-oriented programming, what is inheritance?",
            options: [
                "Hiding implementation details",
                "Creating a class based on another class",
                "Running multiple threads",
                "Converting data types"
            ],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "Inheritance lets a class derive and reuse or extend members from another class."
        },

        {
            question: "What is the smallest unit of digital information?",
            options: ["Byte", "Bit", "Kilobyte", "Nibble"],
            answer: 1,
            difficulty: "EASY",
            explanation: "A bit is a binary digit that can represent 0 or 1."
        },

        {
            question: "Which ACID property ensures a transaction is all-or-nothing?",
            options: ["Consistency", "Isolation", "Durability", "Atomicity"],
            answer: 3,
            difficulty: "HARD",
            explanation: "Atomicity ensures that all operations in a transaction succeed together or the transaction is rolled back."
        },

        {
            question: "What is the purpose of DNS?",
            options: [
                "Encrypt files",
                "Translate domain names to IP addresses",
                "Assign MAC addresses",
                "Compress web pages"
            ],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "DNS resolves human-readable domain names to records such as IP addresses."
        }

    ],

    "General Knowledge": [

        {
            question: "Which is the largest planet in our solar system?",
            options: ["Earth", "Saturn", "Jupiter", "Neptune"],
            answer: 2,
            difficulty: "EASY",
            explanation: "Jupiter is the largest planet in our solar system by both mass and diameter."
        },

        {
            question: "What is the capital city of Japan?",
            options: ["Kyoto", "Tokyo", "Osaka", "Hiroshima"],
            answer: 1,
            difficulty: "EASY",
            explanation: "Tokyo is the capital of Japan and its largest metropolitan area."
        },

        {
            question: "Which gas do plants primarily absorb during photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
            answer: 2,
            difficulty: "EASY",
            explanation: "Plants absorb carbon dioxide and use light energy to build sugars during photosynthesis."
        },

        {
            question: "How many sides does a hexagon have?",
            options: ["Five", "Six", "Seven", "Eight"],
            answer: 1,
            difficulty: "EASY",
            explanation: "A hexagon is a polygon with six sides."
        },

        {
            question: "Which ocean is the largest on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            answer: 3,
            difficulty: "EASY",
            explanation: "The Pacific Ocean is the largest and deepest of Earth's ocean basins."
        },

        {
            question: "Who wrote the play Romeo and Juliet?",
            options: [
                "Charles Dickens",
                "William Shakespeare",
                "Jane Austen",
                "Mark Twain"
            ],
            answer: 1,
            difficulty: "EASY",
            explanation: "Romeo and Juliet is a tragedy written by William Shakespeare."
        },

        {
            question: "Which instrument is used to measure atmospheric pressure?",
            options: ["Thermometer", "Barometer", "Hygrometer", "Anemometer"],
            answer: 1,
            difficulty: "MEDIUM",
            explanation: "A barometer measures atmospheric pressure."
        },

        {
            question: "What is the chemical symbol for gold?",
            options: ["Ag", "Gd", "Au", "Go"],
            answer: 2,
            difficulty: "MEDIUM",
            explanation: "Gold's chemical symbol is Au, derived from the Latin word aurum."
        },

        {
            question: "Which continent contains the Sahara Desert?",
            options: ["Asia", "Africa", "Australia", "South America"],
            answer: 1,
            difficulty: "EASY",
            explanation: "The Sahara is a vast hot desert located in North Africa."
        },

        {
            question: "How many players from one team are on the court in basketball during regular play?",
            options: ["Four", "Five", "Six", "Seven"],
            answer: 1,
            difficulty: "EASY",
            explanation: "Each basketball team has five players on the court during regular play."
        },

        {
            question: "What is the process by which liquid water becomes water vapour called?",
            options: ["Condensation", "Freezing", "Evaporation", "Precipitation"],
            answer: 2,
            difficulty: "EASY",
            explanation: "Evaporation is the change of a liquid into a gas at its surface."
        },

        {
            question: "Which is the hardest naturally occurring mineral on the Mohs scale?",
            options: ["Quartz", "Topaz", "Diamond", "Corundum"],
            answer: 2,
            difficulty: "MEDIUM",
            explanation: "Diamond has a Mohs hardness of 10, the highest value on the scale."
        }

    ]

};


/* ==============================
   2. DOM ELEMENT REFERENCES
============================== */

const screens = {

    setup: document.getElementById("setup-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen"),
    review: document.getElementById("review-screen")

};

const elements = {

    categoryGrid: document.getElementById("category-grid"),

    questionCount: document.getElementById("question-count"),

    timeLimit: document.getElementById("time-limit"),

    start: document.getElementById("start-quiz"),

    bestScore: document.getElementById("best-score"),

    questionText: document.getElementById("question-text"),

    answerList: document.getElementById("answer-list"),

    feedback: document.getElementById("answer-feedback"),

    currentNumber: document.getElementById("current-number"),

    totalNumber: document.getElementById("total-number"),

    progressFill: document.getElementById("progress-fill"),

    progressPercent: document.getElementById("progress-percent"),

    questionTag: document.getElementById("question-tag"),

    difficulty: document.getElementById("difficulty-label"),

    categoryLabel: document.getElementById("quiz-category-label"),

    previous: document.getElementById("previous-question"),

    next: document.getElementById("next-question"),

    timerCard: document.getElementById("timer-card"),

    timerValue: document.getElementById("timer-value"),

    timerFill: document.getElementById("timer-fill"),

    timerCaption: document.getElementById("timer-caption"),

    liveScore: document.getElementById("live-score"),

    questionMap: document.getElementById("question-map"),

    answeredCount: document.getElementById("answered-count"),

    finalScore: document.getElementById("final-score"),

    resultScoreFill: document.getElementById("result-score-fill"),

    correctCount: document.getElementById("correct-count"),

    incorrectCount: document.getElementById("incorrect-count"),

    unansweredCount: document.getElementById("unanswered-count"),

    resultHeading: document.getElementById("result-heading"),

    resultSubtitle: document.getElementById("result-subtitle"),

    scoreMessage: document.getElementById("score-message"),

    reviewList: document.getElementById("review-list"),

    toast: document.getElementById("toast"),

    soundToggle: document.getElementById("sound-toggle")

};


/* ==============================
   3. APPLICATION STATE
============================== */

const state = {

    category: "JavaScript",

    questions: [],

    currentIndex: 0,

    answers: [],

    timeLimit: 20,

    secondsLeft: 20,

    timerId: null,

    soundEnabled: false,

    quizFinished: false

};

const LETTERS = ["A", "B", "C", "D"];


/* ==============================
   4. SCREEN MANAGEMENT
============================== */

function showScreen(name) {

    Object.values(screens).forEach(screen => {

        screen.classList.remove("active");

    });

    screens[name].classList.add("active");

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==============================
   5. SHUFFLE QUESTIONS
============================== */

function shuffle(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];

    }

    return copy;

}


/* ==============================
   6. PREPARE QUIZ QUESTIONS
============================== */

function prepareQuestions(category, count) {

    return shuffle(questionBank[category])

        .slice(0, count)

        .map(item => {

            const optionOrder = shuffle(

                item.options.map((text, index) => ({

                    text,

                    isCorrect: index === item.answer

                }))

            );

            return {

                ...item,

                options: optionOrder.map(option => option.text),

                answer: optionOrder.findIndex(option => option.isCorrect)

            };

        });

}


/* ==============================
   7. SELECT CATEGORY
============================== */

function selectCategory(category) {

    state.category = category;

    document.querySelectorAll(".category-card").forEach(card => {

        card.classList.toggle(

            "selected",

            card.dataset.category === category

        );

    });

}


/* ==============================
   8. START QUIZ
============================== */

function startQuiz() {

    const count = Number(elements.questionCount.value);

    state.timeLimit = Number(elements.timeLimit.value);

    state.questions = prepareQuestions(state.category, count);

    state.answers = Array(state.questions.length).fill(null);

    state.currentIndex = 0;

    state.quizFinished = false;

    elements.totalNumber.textContent = state.questions.length;

    showScreen("quiz");

    renderQuestion();

}


/* ==============================
   9. GET CURRENT QUESTION
============================== */

function getCurrentQuestion() {

    return state.questions[state.currentIndex];

}


/* ==============================
   10. RENDER QUESTION
============================== */

function renderQuestion() {

    stopTimer();

    const question = getCurrentQuestion();

    const index = state.currentIndex;

    const savedAnswer = state.answers[index];

    const isAnswered = savedAnswer !== null;

    elements.currentNumber.textContent = String(index + 1).padStart(2, "0");

    elements.questionTag.textContent = `QUESTION ${String(index + 1).padStart(2, "0")}`;

    elements.categoryLabel.textContent = state.category.toUpperCase();

    elements.questionText.textContent = question.question;

    elements.difficulty.textContent = `● ${question.difficulty}`;

    elements.difficulty.style.color =

        question.difficulty === "HARD"

            ? "#df6b75"

            : question.difficulty === "MEDIUM"

                ? "#d49b3c"

                : "#26a77b";


    // Clear previous options

    elements.answerList.innerHTML = "";


    // Render answer options

    question.options.forEach((option, optionIndex) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "answer-option";

        button.innerHTML = `

            <span class="option-letter">${LETTERS[optionIndex]}</span>

            <span class="option-text"></span>

            <i class="option-status fa-solid"></i>

        `;

        button.querySelector(".option-text").textContent = option;

        button.addEventListener("click", () => {

            selectAnswer(optionIndex);

        });


        // Show previously selected answer

        if (isAnswered) {

            button.disabled = true;

            if (optionIndex === question.answer) {

                button.classList.add("correct");

                button.querySelector(".option-status")

                    .classList.add("fa-circle-check");

            }

            if (

                optionIndex === savedAnswer &&

                savedAnswer !== question.answer

            ) {

                button.classList.add("incorrect");

                button.querySelector(".option-status")

                    .classList.add("fa-circle-xmark");

            }

            if (

                optionIndex === savedAnswer &&

                savedAnswer === question.answer

            ) {

                button.classList.add("selected");

            }

        }

        elements.answerList.appendChild(button);

    });


    // Feedback message

    if (isAnswered) {

        const correct = savedAnswer === question.answer;

        elements.feedback.className =

            `answer-feedback ${correct ? "good" : savedAnswer === -1 ? "neutral" : "bad"}`;

        elements.feedback.textContent =

            savedAnswer === -1

                ? "Time is up! " + question.explanation

                : correct

                    ? "Correct! " + question.explanation

                    : "Not quite. " + question.explanation;

    } else {

        elements.feedback.className = "answer-feedback";

        elements.feedback.textContent = "";

    }


    // Navigation buttons

    elements.previous.disabled = index === 0;

    elements.next.disabled = !isAnswered;

    elements.next.innerHTML =

        index === state.questions.length - 1

            ? 'See results <i class="fa-solid fa-flag-checkered"></i>'

            : 'Next question <i class="fa-solid fa-arrow-right"></i>';


    // Progress bar

    const progress = ((index + 1) / state.questions.length) * 100;

    elements.progressFill.style.width = `${progress}%`;

    elements.progressPercent.textContent = `${Math.round(progress)}%`;


    updateScoreAndMap();


    // Timer

    if (!isAnswered) {

        startTimer();

    } else {

        showSavedTimerState();

    }

}


/* ==============================
   11. SELECT ANSWER
============================== */

function selectAnswer(optionIndex) {

    if (state.answers[state.currentIndex] !== null || state.quizFinished) {

        return;

    }

    state.answers[state.currentIndex] = optionIndex;

    stopTimer();

    const isCorrect = optionIndex === getCurrentQuestion().answer;

    playTone(isCorrect ? 660 : 220);

    renderQuestion();

}


/* ==============================
   12. SAVED TIMER STATE
============================== */

function showSavedTimerState() {

    elements.timerCard.classList.remove("warning", "expired");

    if (state.timeLimit === 0) {

        elements.timerValue.innerHTML =

            '<i class="fa-solid fa-infinity"></i>';

        elements.timerFill.style.width = "100%";

        elements.timerCaption.textContent = "No time limit";

        return;

    }

    const answered = state.answers[state.currentIndex] !== null;

    elements.timerValue.innerHTML =

        `${answered ? "✓" : state.timeLimit}<span>${answered ? "" : "s"}</span>`;

    elements.timerFill.style.width = "100%";

    elements.timerCaption.textContent =

        answered ? "Answer submitted" : "Keep your focus!";

}


/* ==============================
   13. START TIMER
============================== */

function startTimer() {

    if (state.timeLimit === 0) {

        showSavedTimerState();

        return;

    }

    state.secondsLeft = state.timeLimit;

    updateTimerDisplay();

    state.timerId = window.setInterval(() => {

        state.secondsLeft--;

        updateTimerDisplay();

        if (state.secondsLeft <= 0) {

            stopTimer();

            timeOutQuestion();

        }

    }, 1000);

}


/* ==============================
   14. UPDATE TIMER DISPLAY
============================== */

function updateTimerDisplay() {

    const percentage =

        (state.secondsLeft / state.timeLimit) * 100;

    elements.timerValue.innerHTML =

        `${state.secondsLeft}<span>s</span>`;

    elements.timerFill.style.width = `${percentage}%`;

    elements.timerCard.classList.toggle(

        "warning",

        state.secondsLeft <= 5 && state.secondsLeft > 0

    );

    elements.timerCard.classList.toggle(

        "expired",

        state.secondsLeft <= 0

    );

    elements.timerCaption.textContent =

        state.secondsLeft <= 5 ? "Hurry up!" : "Keep your focus!";

}


/* ==============================
   15. TIME OUT QUESTION
============================== */

function timeOutQuestion() {

    if (state.answers[state.currentIndex] !== null) {

        return;

    }

    state.answers[state.currentIndex] = -1;

    elements.feedback.className = "answer-feedback neutral";

    elements.feedback.textContent =

        "Time is up! " + getCurrentQuestion().explanation;

    renderQuestion();

    showToast("Time is up — question marked unanswered.");

}


/* ==============================
   16. STOP TIMER
============================== */

function stopTimer() {

    if (state.timerId !== null) {

        window.clearInterval(state.timerId);

        state.timerId = null;

    }

}


/* UPDATE SCORE AND MAP */
function updateScoreAndMap() {
    const correct = state.answers.reduce(
        (total, answer, index) =>
            total +
            (
                answer !== null &&
                answer !== -1 &&
                answer === state.questions[index].answer
                    ? 1
                    : 0
            ),
        0
    );
    const answered = state.answers.filter(
        answer => answer !== null
    ).length;

    // Update score
    elements.liveScore.innerHTML =
        `${correct * 10} <span>pts</span>`;


    // Update answered count
    elements.answeredCount.textContent =
        `${answered}/${state.questions.length}`;

    // Generate question map
    elements.questionMap.innerHTML = "";
    state.questions.forEach((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-item";
        button.textContent = index + 1;
        if (state.answers[index] !== null) {
            button.classList.add("answered");
        }
        if (index === state.currentIndex) {
            button.classList.add("current");
        }
        button.setAttribute(
            "aria-label",
            `Go to question ${index + 1}`
        );

        button.addEventListener("click", () => {
            state.currentIndex = index;
            renderQuestion();
        });
        elements.questionMap.appendChild(button);
    });
}

/* NEXT QUESTION */
function goToNextQuestion() {
    if (state.answers[state.currentIndex] === null) {
        return;
    }
    if (state.currentIndex === state.questions.length - 1) {
        finishQuiz();
    } else {
        state.currentIndex++;
        renderQuestion();
    }
}

/* PREVIOUS QUESTION */
function goToPreviousQuestion() {
    if (state.currentIndex <= 0) {
        return;
    }
    state.currentIndex--;
    renderQuestion();
}

/* FINISH QUIZ */
function finishQuiz() {
    stopTimer();
    state.quizFinished = true;
    const total = state.questions.length;
    const correct = state.answers.reduce(

        (sum, answer, index) =>
            sum +
            (
                answer !== null &&
                answer !== -1 &&
                answer === state.questions[index].answer
                    ? 1
                    : 0
            ),
        0
    );
    const unanswered = state.answers.filter(
        answer => answer === null || answer === -1
    ).length;
    const incorrect = total - correct - unanswered;
    const percentage = Math.round((correct / total) * 100);


    // Final score
    elements.finalScore.innerHTML =
        `${percentage}<span>%</span>`;
    elements.resultScoreFill.style.width = `${percentage}%`;


    // Statistics
    elements.correctCount.textContent = correct;
    elements.incorrectCount.textContent = incorrect;
    elements.unansweredCount.textContent = unanswered;


    // Performance message
    elements.resultHeading.textContent =
        percentage >= 80
            ? "Outstanding work!"
            : percentage >= 50
                ? "Good effort!"
                : "Keep practising!";

    elements.resultSubtitle.textContent =
        `You completed the ${state.category} quiz.`;

    elements.scoreMessage.textContent =
        percentage >= 80
            ? "Excellent knowledge. Keep challenging yourself!"
            : percentage >= 50
                ? "You're making progress. Review the answers to improve."
                : "Every attempt is a learning opportunity. Give it another try!";

    // Save best score
    const bestKey = `quizify-best-${state.category}`;
    const previousBest = Number(
        localStorage.getItem(bestKey) || 0

    );
    if (percentage > previousBest) {
        localStorage.setItem(bestKey, String(percentage));
        showToast("New personal best for " + state.category + "!");

    }
    updateBestScore();
    showScreen("result");
    playTone(percentage >= 50 ? 780 : 300);

}

/* REVIEW ANSWERS */
function renderReview() {
    elements.reviewList.innerHTML = "";
    state.questions.forEach((question, index) => {
        const selected = state.answers[index];
        const correct = selected === question.answer;
        const card = document.createElement("article");
        card.className = "review-card";

        // Question number
        const number = document.createElement("div");
        number.className = "review-number";
        number.textContent =
            `QUESTION ${String(index + 1).padStart(2, "0")} · ${question.difficulty}`;


        // Question title
        const title = document.createElement("h3");
        title.textContent = question.question;

        // User answer
        const yourAnswer = document.createElement("div");
        yourAnswer.className =
            `review-answer ${
                correct
                    ? "is-correct"
                    : selected === -1 || selected === null
                        ? ""
                        : "is-wrong"

            }`;
        yourAnswer.textContent =
            `Your answer: ${
                selected === null || selected === -1
                    ? "Not answered"
                    : question.options[selected]
            }`;

        // Correct answer
        const correctAnswer = document.createElement("div");
        correctAnswer.className = "review-answer is-correct";
        correctAnswer.textContent =
            `Correct answer: ${question.options[question.answer]}`;

        // Explanation
        const explanation = document.createElement("p");
        explanation.className = "review-explanation";
        explanation.textContent = question.explanation;


        // Append elements
        card.append(
            number,
            title,
            yourAnswer,
            correctAnswer,
            explanation
        );
        elements.reviewList.appendChild(card);
    });
}

/* UPDATE BEST SCORE */
function updateBestScore() {
    const best = Number(
        localStorage.getItem(`quizify-best-${state.category}`) || 0
    );
    elements.bestScore.textContent = `${best}%`;
}

/* TOAST NOTIFICATION */
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 2400);
}

/* SOUND EFFECTS */
function playTone(frequency) {
    if (!state.soundEnabled) {
        return;

    }
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = frequency;
        oscillator.type = "sine";
        gain.gain.setValueAtTime(
            0.06,
            context.currentTime
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.12
        );
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.12);
        oscillator.onended = () => context.close();

    } catch (error) {
        // Audio is optional. Quiz functionality remains unaffected.
    }
}

/* RESET TO HOME */
function resetToHome() {
    stopTimer();
    state.quizFinished = false;
    updateBestScore();
    showScreen("setup");
}

/* EVENT LISTENERS */

// Category selection
elements.categoryGrid.addEventListener("click", event => {

    const card = event.target.closest(".category-card");

    if (card) {

        selectCategory(card.dataset.category);
    }
});


// Start quiz
elements.start.addEventListener("click", startQuiz);

// Next question
elements.next.addEventListener("click", goToNextQuestion);

// Previous question
elements.previous.addEventListener("click", goToPreviousQuestion);

// Exit quiz
document.getElementById("exit-quiz").addEventListener("click", () => {
    stopTimer();
    resetToHome();

});

// Restart quiz
document.getElementById("restart-quiz").addEventListener("click", startQuiz);

// Back to home
document.getElementById("back-home").addEventListener("click", resetToHome);

// Review home
document.getElementById("review-home").addEventListener("click", resetToHome);

// Review answers
document.getElementById("review-answers").addEventListener("click", () => {
    renderReview();
    showScreen("review");
});

// Back to results
document.getElementById("back-results").addEventListener("click", () => {
    showScreen("result");
});

// Sound toggle
elements.soundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    elements.soundToggle.innerHTML = state.soundEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
    elements.soundToggle.setAttribute(
        "aria-label",
        state.soundEnabled ? "Mute sound" : "Enable sound"

    );
    showToast(
        state.soundEnabled
            ? "Sound effects enabled."
            : "Sound effects muted."
    );
});
/* INITIALIZE APPLICATION */
updateBestScore();