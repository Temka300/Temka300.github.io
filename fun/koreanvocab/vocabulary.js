// DOM elements
const wordDisplay = document.getElementById('word-display');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const wrongDiv = document.getElementById('wrong');
const nextBtn = document.getElementById('next-btn');
const questionLanguageSelect = document.getElementById('question-language');

let words = []; // This will hold the words from the JSON file
let currentWordIndex = 0;
let selectedLanguage = 'Korean'; // Ensure the case matches with the JSON file keys
let isCorrectAnswer = false; // To track whether the answer is correct or not

// Fetch JSON data from the server
function loadJSON() {
    fetch('koreanvocab.json') // Ensure this path is correct relative to your project structure
        .then(response => response.json())
        .then(data => {
            words = data.words;
            shuffleWords(); // Shuffle words for random order
            displayWord(); // Display the first word once the data is loaded
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}

// Function to shuffle the words array (Fisher-Yates Shuffle)
function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

// Update the word on the screen based on the selected language
function displayWord() {
    if (words.length > 0) {
        const currentWord = words[currentWordIndex];
        console.log("Current Word:", currentWord);
        if (currentWord && currentWord[selectedLanguage]) {
            wordDisplay.textContent = currentWord[selectedLanguage];
        } else {
            console.error("Selected language or current word is not available.");
        }
    } else {
        console.error("Words array is empty.");
    }
}

// Check the answer
function checkAnswer() {
    const currentWord = words[currentWordIndex];
    
    // Ensure currentWord is defined
    if (!currentWord) {
        console.error('currentWord is undefined');
        return;
    }

    const answer = answerInput.value.trim().toLowerCase();
    let correctAnswer;

    // Determine the correct answer based on the selected question language
    if (selectedLanguage === 'Korean') {
        correctAnswer = currentWord.English?.toLowerCase(); // Capitalized to match JSON
    } else if (selectedLanguage === 'English') {
        correctAnswer = currentWord.Korean?.toLowerCase();
    } else if (selectedLanguage === 'Mongolia') {
        correctAnswer = currentWord.English?.toLowerCase();
    }

    if (correctAnswer && answer === correctAnswer) {
        resultDiv.textContent = `You did it! English: ${currentWord.English}, Mongolian: ${currentWord.Mongolia}, Japanese: ${currentWord.Japanese}`;
        wrongDiv.textContent = '';
        nextBtn.style.display = 'block'; // Show next button
        isCorrectAnswer = true; // Mark the answer as correct
    } else {
        wrongDiv.textContent = 'Try again!';
        resultDiv.textContent = '';
        isCorrectAnswer = false; // Mark the answer as incorrect
    }
}

// Move to the next word
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayWord();
    resultDiv.textContent = '';
    wrongDiv.textContent = '';
    answerInput.value = '';
    nextBtn.style.display = 'none';
    isCorrectAnswer = false; // Reset the correct answer flag
}

// Event listeners
submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextWord);
questionLanguageSelect.addEventListener('change', (e) => {
    selectedLanguage = e.target.value; // Ensure selected language matches JSON keys' case
    displayWord();
});

// Add event listener for "Enter" key
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!isCorrectAnswer) {
            checkAnswer(); // Simulate submit if answer is not correct
        } else {
            nextWord(); // Simulate next button if the answer was correct
        }
    }
});

// Load the JSON data when the page loads
window.onload = loadJSON;
