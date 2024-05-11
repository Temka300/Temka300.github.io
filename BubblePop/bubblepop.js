const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let bubbles = [];
let score = 0;
let stage = 1;
let gameActive = true;
let stageTimeout;
let animationId;
let timeLeft = 10; // Time left for the current stage in seconds
let countdownTimeout; // Reference to the countdown timeout

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bubbles.forEach(bubble => {
        bubble.x = Math.min(bubble.x, canvas.width - bubble.radius);
        bubble.y = Math.min(bubble.y, canvas.height - bubble.radius);
    });
}

class Bubble {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.draw();
    }
}

// this code is for making rare bug that shows black box on the right side of the screen
document.addEventListener('DOMContentLoaded', function() {
    var panel = document.getElementById('optionsPanel');
    panel.style.right = '-230px'; // Make sure this matches the adjusted CSS
    var toggleButton = document.getElementById('toggleOptions');
    toggleButton.textContent = '>'; // Ensure the toggle button is set to '>'
});


document.getElementById('toggleOptions').addEventListener('click', function() {
    var panel = document.getElementById('optionsPanel');
    if (panel.style.right === '0px') {
        panel.style.right = '-200px'; // Hide the panel
        this.textContent = '>'; // Change button text to "more than" symbol
    } else {
        panel.style.right = '0px'; // Show the panel
        this.textContent = '<'; // Change button text to "less than" symbol
    }
});


document.getElementById('resetOptions').addEventListener('click', function() {
    score = 0;
    stage = 1;
    gameActive = true;
    
    // Cancel any ongoing animations
    cancelAnimationFrame(animationId);

    gameOverScreen.style.display = 'none'; // Hide the game over screen

    setupBubbles();
    resetStageTimer();
    requestAnimationFrame(draw);
});


// Update the setupBubbles function to use the input values for customization
function setupBubbles() {
    const initialBubbleCount = parseInt(document.getElementById('initialBubbles').value) + stage * parseInt(document.getElementById('additionalBubbles').value);
    const minRadius = parseInt(document.getElementById('minRadius').value);
    const maxRadius = parseInt(document.getElementById('maxRadius').value);
    const velocityMultiplier = parseFloat(document.getElementById('velocityMultiplier').value); // Ensure this exists from previous steps
    bubbles = [];
    for (let i = 0; i < initialBubbleCount; i++) {
        let radius = Math.random() * (maxRadius - minRadius) + minRadius;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        let dx = (Math.random() - 0.5) * 4 * velocityMultiplier;
        let dy = (Math.random() - 0.5) * 4 * velocityMultiplier;
        bubbles.push(new Bubble(x, y, radius, color, dx, dy));
    }
}



function endStage() {
    gameActive = false; // Stop game updates
    cancelAnimationFrame(animationId); // Stop the animation
    displayGameOver(`You scored ${score} points and reached stage ${stage}.`);
}

function displayGameOver(message) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.innerText = message;
    gameOverScreen.style.display = 'block'; // Show the game over screen
}

function startGame() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    score = 0;
    stage = 1;
    gameActive = true;
    setupBubbles();
    resetStageTimer();
    requestAnimationFrame(draw);
}



// Update the resetStageTimer function to use the stage time input
function resetStageTimer() {
    clearTimeout(stageTimeout);
    clearTimeout(countdownTimeout);
    timeLeft = parseInt(document.getElementById('stageTime').value); // Get the stage time from input
    stageTimeout = setTimeout(endStage, timeLeft * 1000);
    countdown();
}

function countdown() {
    if (timeLeft > 0) {
        countdownTimeout = setTimeout(() => {
            timeLeft--;
            countdown();
        }, 1000);
    }
}

function drawHUD() {
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Stage: ${stage}`, 20, 30);
    ctx.fillText(`Score: ${score}`, 20, 50);
    ctx.fillText(`Bubbles left: ${bubbles.length}`, 20, 70);
    ctx.fillText(`Time left: ${timeLeft} sec`, 20, 90); // Display the remaining time
}

function draw() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(bubble => bubble.update());
    drawHUD();
    if (bubbles.length === 0 && gameActive) {
        stage++;  // Increment the stage to advance the game
        setupBubbles();  // Setup the next stage with new bubbles
        resetStageTimer();  // Reset the timer for the new stage
    }
    animationId = requestAnimationFrame(draw);
}


function displayStageAdvance() {
    const message = `Great job! Moving to stage ${stage}.`;
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.innerText = message;
    gameOverScreen.style.display = 'block';  // Show the message
    setTimeout(() => {
        gameOverScreen.style.display = 'none';  // Hide the message after a few seconds
    }, 500);  // Hide the advance message after 2 seconds
}


canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    bubbles = bubbles.filter(bubble => {
        const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
        if (distance < bubble.radius) {
            score += 1;
            popBubble(bubble); // Call to animate popping
            return false;
        }
        return true;
    });
});

function popBubble(bubble) {
    const popDuration = 300; // Duration of the pop effect
    const maxRadius = bubble.radius * 1.5;
    let currentRadius = bubble.radius;

    function animatePop() {
        if (currentRadius < maxRadius) {
            currentRadius += 2; // Increase the radius to create a pop effect
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 20, 20, 0.5)'; // Temporary pop color
            ctx.fill();
            ctx.closePath();
            requestAnimationFrame(animatePop);
        } else {
            // Reset the radius for removal or redraw
            bubble.radius = 0;
        }
    }
    requestAnimationFrame(animatePop);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initGame();

function initGame() {
    setupBubbles();
    resetStageTimer();
    draw();
}
