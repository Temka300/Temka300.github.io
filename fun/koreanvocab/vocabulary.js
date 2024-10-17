// DOM elements
const wordDisplay = document.getElementById('word-display');
const answerInput = document.getElementById('answer-input');
const submitNextBtn = document.getElementById('submit-btn'); // Renamed to submitNextBtn to handle both Submit and Next actions
const resultDiv = document.getElementById('result');
const wrongDiv = document.getElementById('wrong');
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

const scoreDisplay = document.getElementById('score');
let score = 0; // Initialize score

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

// Check the answer and handle button change
function checkAnswer() {
    const currentWord = words[currentWordIndex];

    // Ensure currentWord is defined
    if (!currentWord) {
        console.error('currentWord is undefined');
        return;
    }

    const answer = answerInput.value.trim().toLowerCase();
    let correctAnswers = [];

    // Determine the correct answers based on the selected question language
    if (selectedLanguage === 'Korean') {
        // If the question is in Korean, acceptable answers are English and Mongolian
        if (currentWord.English) correctAnswers.push(currentWord.English.toLowerCase());
        if (currentWord.Mongolia) correctAnswers.push(currentWord.Mongolia.toLowerCase());
    } else if (selectedLanguage === 'English') {
        // If the question is in English, acceptable answers are Korean and Mongolian
        if (currentWord.Korean) correctAnswers.push(currentWord.Korean.toLowerCase());
        if (currentWord.Mongolia) correctAnswers.push(currentWord.Mongolia.toLowerCase());
    } else if (selectedLanguage === 'Mongolia') {
        // If the question is in Mongolian, acceptable answers are Korean and English
        if (currentWord.Korean) correctAnswers.push(currentWord.Korean.toLowerCase());
        if (currentWord.English) correctAnswers.push(currentWord.English.toLowerCase());
    }

    // Check if the user's answer matches any of the correct answers
    if (correctAnswers.includes(answer)) {
        resultDiv.textContent = `You did it! English: ${currentWord.English}, Mongolian: ${currentWord.Mongolia}, Japanese: ${currentWord.Japanese}`;
        wrongDiv.textContent = '';
        isCorrectAnswer = true;
        score++; // Increment the score on correct answer
    } else {
        wrongDiv.textContent = `Try again! English: ${currentWord.English}, Mongolian: ${currentWord.Mongolia}, Japanese: ${currentWord.Japanese}`;
        resultDiv.textContent = '';
        isCorrectAnswer = false;
        score = 0; // Reset the score on wrong answer
    }

    // Update the score display
    scoreDisplay.textContent = score;

    // Show the 'Next' button regardless of the result
    submitNextBtn.textContent = 'Next';
}

// Move to the next word and reset the button
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayWord();
    resultDiv.textContent = '';
    wrongDiv.textContent = '';
    answerInput.value = '';
    isCorrectAnswer = false; // Reset the correct answer flag

    // Change the button back to 'Submit'
    submitNextBtn.textContent = 'Submit';
}

// Handle pressing "Enter" key on the answer input
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSubmitNext();
    }
});

// Handle clicking the button
submitNextBtn.addEventListener('click', () => {
    handleSubmitNext();
});

// Function to handle both "Enter" key and button click
function handleSubmitNext() {
    if (submitNextBtn.textContent === 'Submit') {
        checkAnswer(); // If the button says 'Submit', check the answer
    } else if (submitNextBtn.textContent === 'Next') {
        nextWord(); // If the button says 'Next', load the next word
    }
}



// Event listener for language selection change
questionLanguageSelect.addEventListener('change', (e) => {
    selectedLanguage = e.target.value; // Ensure selected language matches JSON keys' case
    displayWord();
});

// Load the JSON data when the page loads
window.onload = loadJSON;
