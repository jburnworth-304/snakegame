// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameSpeed = 100;
let gameLoopId = null;

// Display initial high score
document.getElementById('highScore').textContent = highScore;

// Buttons
document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);

// Keyboard controls
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if (!gameRunning) return;
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
}

function newGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 100;
    
    document.getElementById('score').textContent = score;
    document.getElementById('restartBtn').disabled = false;
    
    generateFood();
    gameRunning = true;
    
    if (gameLoopId) clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, gameSpeed);
}

function restartGame() {
    if (gameLoopId) clearInterval(gameLoopId);
    gameRunning = false;
    newGame();
}

function gameLoop() {
    if (!gameRunning) return;
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
        gameSpeed = Math.max(50, gameSpeed - 1);
        if (gameLoopId) clearInterval(gameLoopId);
        gameLoopId = setInterval(gameLoop, gameSpeed);
    } else {
        snake.pop();
    }
    draw();
}

function generateFood() {
    let newFood;
    let foodOnSnake;
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            foodOnSnake = true;
        }
    } while (foodOnSnake);
    food = newFood;
}

function draw() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#1a0a2a');
    gradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 153, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ff99';
            ctx.shadowColor = '#00ff99';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#00cc77';
            ctx.shadowColor = 'rgba(0, 255, 153, 0.5)';
            ctx.shadowBlur = 5;
        }
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
    
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
}

function endGame() {
    gameRunning = false;
    if (gameLoopId) clearInterval(gameLoopId);
    document.getElementById('restartBtn').disabled = true;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        alert(`🎉 NEW HIGH SCORE! 🎉\n\nYour Score: ${score}\nHigh Score: ${highScore}`);
    } else {
        alert(`💀 GAME OVER!\n\nYour Score: ${score}\nHigh Score: ${highScore}`);
    }
    draw();
}

draw();
