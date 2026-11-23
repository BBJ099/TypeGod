
// TypeGod - Speed Typing Game

const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Great things are done by a series of small things brought together.",
    "Practice makes progress, so keep learning and improving every day.",
    "A journey of a thousand miles begins with a single step.",
    "Believe you can and you are halfway there.",
    "The secret of getting ahead is getting started.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Do not watch the clock; do what it does. Keep going.",
    "Every expert was once a beginner who refused to give up.",
    "Your only limit is the amount of action you are willing to take."
];

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const messageDisplay = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");

const GAME_LENGTH = 60;

let currentQuote = "";
let score = 0;
let streak = 0;
let timeLeft = GAME_LENGTH;
let timerInterval = null;
let gameStarted = false;
let gameOver = false;
let totalTypedCharacters = 0;
let totalCorrectCharacters = 0;
let startTime = null;
let usedQuotes = [];

function chooseQuote() {
    if (usedQuotes.length === quotes.length) {
        usedQuotes = [];
    }

    const availableQuotes = quotes.filter(
        quote => !usedQuotes.includes(quote)
    );

    currentQuote = availableQuotes[
        Math.floor(Math.random() * availableQuotes.length)
    ];

    usedQuotes.push(currentQuote);
    renderQuote();
}

function renderQuote() {
    quoteDisplay.innerHTML = "";

    currentQuote.split("").forEach(character => {
        const span = document.createElement("span");
        span.textContent = character;
        quoteDisplay.appendChild(span);
    });
}

function updateStats() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    timerDisplay.textContent = timeLeft;

    const elapsedSeconds = startTime
        ? Math.max(1, (Date.now() - startTime) / 1000)
        : 0;

    const wordsPerMinute = elapsedSeconds > 0
        ? Math.round(
            (totalCorrectCharacters / 5) /
            (elapsedSeconds / 60)
        )
        : 0;

    wpmDisplay.textContent = wordsPerMinute;

    const accuracy = totalTypedCharacters > 0
        ? Math.round(
            (totalCorrectCharacters / totalTypedCharacters) * 100
        )
        : 100;

    accuracyDisplay.textContent = accuracy + "%";
}

function startGame() {
    if (gameStarted || gameOver) return;

    gameStarted = true;
    startTime = Date.now();

    messageDisplay.textContent =
        "Go! Type the sentence, then press Submit.";

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateQuoteHighlight() {
    const typedText = quoteInput.value;
    const characters = quoteDisplay.querySelectorAll("span");

    characters.forEach((span, index) => {
        span.classList.remove("correct", "incorrect");

        if (index < typedText.length) {
            if (typedText[index] === currentQuote[index]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
        }
    });
}

function calculateCurrentAccuracy() {
    const typedText = quoteInput.value;
    let correct = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentQuote[i]) {
            correct++;
        }
    }

    return {
        typed: typedText.length,
        correct: correct
    };
}

function submitQuote() {
    if (gameOver) return;

    if (!gameStarted) {
        if (quoteInput.value.trim() === "") {
            messageDisplay.textContent = "Start typing first!";
            quoteInput.focus();
            return;
        }

        startGame();
    }

    const typedText = quoteInput.value;

    if (typedText.length === 0) {
        messageDisplay.textContent =
            "Type the sentence before submitting.";
        quoteInput.focus();
        return;
    }

    const result = calculateCurrentAccuracy();

    totalTypedCharacters += result.typed;
    totalCorrectCharacters += result.correct;

    if (typedText === currentQuote) {
        score += currentQuote.length;
        streak++;

        messageDisplay.textContent =
            "Perfect! Nice work. Here's your next sentence.";
    } else {
        score += result.correct;
        streak = 0;

        messageDisplay.textContent =
            `Good try! You got ${result.correct} characters correct. Try the next one.`;
    }

    chooseQuote();
    quoteInput.value = "";

    updateStats();
    quoteInput.focus();
}

function endGame() {
    if (gameOver) return;

    gameOver = true;

    clearInterval(timerInterval);

    timeLeft = 0;
    quoteInput.disabled = true;
    submitBtn.disabled = true;

    updateStats();

    messageDisplay.textContent =
        `Time's up! Final score: ${score}. Your final WPM is ${wpmDisplay.textContent}. Press Restart to play again.`;
}

function restartGame() {
    clearInterval(timerInterval);

    score = 0;
    streak = 0;
    timeLeft = GAME_LENGTH;

    gameStarted = false;
    gameOver = false;

    totalTypedCharacters = 0;
    totalCorrectCharacters = 0;

    startTime = null;
    usedQuotes = [];

    quoteInput.value = "";
    quoteInput.disabled = false;
    submitBtn.disabled = false;

    chooseQuote();
    updateStats();

    messageDisplay.textContent =
        "Type the sentence as fast as you can! The 60-second timer starts when you begin.";

    quoteInput.focus();
}

// Detect typing
quoteInput.addEventListener("input", () => {
    if (gameOver) return;

    if (!gameStarted && quoteInput.value.length > 0) {
        startGame();
    }

    updateQuoteHighlight();
    updateStats();
});

// Button events
submitBtn.addEventListener("click", submitQuote);
restartBtn.addEventListener("click", restartGame);

// Load the game
restartGame();