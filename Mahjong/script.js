// Variables to store game state
let score = 0; // Current score
let highScore = 0; // Highest score achieved
let timeLeft = 0; // Time left in seconds
let timerInterval; // Interval for the game timer
let boardSize = 6; // Initial board size

// Array of symbols for tiles
let allSymbols = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];

// Select symbols based on board size
symbols = allSymbols.slice(0,boardSize);

// Event listeners for game start and restart buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn-congrats').addEventListener('click', startGame);
document.getElementById('restart-btn-game-over').addEventListener('click', startGame);

// Function to start the game
function startGame() {
    resetScore(); // Reset score
    boardSize = parseInt(document.getElementById('board-size').value); // Update board size
    timeLeft = parseInt(document.getElementById('timer-value').value) * 60; // Update time left
    clearInterval(timerInterval); // Clear any existing timer interval
    document.getElementById('game-board').style.display = 'grid'; // Show game board
    document.getElementById('game-board').innerHTML = ''; // Clear game board content
    symbols = allSymbols.slice(0,boardSize); // Select symbols based on updated board size
    renderGameBoard(); // Render the game board
    updateTime(); // Update the timer display
    // Set up timer interval to update time left and check for game end
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTime();
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            showGameOverScreen();
        }
    }, 1000);
    // Hide congratulations and game over screens
    document.getElementById('congratulations-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
}

// Function to create tiles for the game board
function createTiles() {
    const allSymbols = symbols.concat(symbols); // Duplicate symbols for pairs
    const shuffledSymbols = allSymbols.sort(() => Math.random() - 0.5); // Shuffle symbols
    const tiles = shuffledSymbols.map(symbol => ({
        symbol,
        matched: false
    }));
    return tiles;
}

// Function to render the game board
function renderGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.gridTemplateColumns = `repeat(9, 65px)`; // Adjust grid columns based on board size
    gameBoard.innerHTML = '';

    const tiles = createTiles(); // Create tiles for the game board
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.dataset.index = index;
        tileElement.style.width = '60px';
        tileElement.style.height = '80px';
        tileElement.style.backgroundColor = randomColor(); // Assign random color to tiles
        tileElement.style.backgroundImage = `url('images/${tile.symbol}.png')`; // Set symbol image for tiles
        tileElement.style.backgroundSize = `contain`;
        tileElement.addEventListener('click', () => {
            if (!tile.matched && !tileElement.classList.contains('selected')) {
                tileElement.classList.add('selected');
                tile.matched = true;
                tile.removed = false;
                checkForMatches(tiles); // Check for matching tiles
            }
        });
        gameBoard.appendChild(tileElement);
    });
}

// Function to check for matching tiles
function checkForMatches(tiles) {
    const selectedTiles = tiles.filter(tile => tile.matched);
    if (selectedTiles.length === 2) {
        const [firstTile, secondTile] = selectedTiles;
        if (firstTile.symbol === secondTile.symbol) {
            setTimeout(() => {
                selectedTiles.forEach(tile => {
                    const tileElement = document.querySelector(`.tile[data-index="${tiles.indexOf(tile)}"]`);
                    tileElement.classList.add('matched');
                    tiles[tiles.indexOf(tile)].matched = false; // Update matched status
                    tiles[tiles.indexOf(tile)].removed = true; // Update matched status
                    tileElement.classList.remove('selected');
                });
                updateScore(10); // Increase score if match is found
                if (isGameFinished(tiles)) {
                    showCongratulationsScreen(); // Show congratulations screen if game is finished
                }
            }, 500);
        } else {
            setTimeout(() => {
                selectedTiles.forEach(tile => {
                    tiles[tiles.indexOf(tile)].matched = false; // Update matched status
                    const tileElement = document.querySelector(`.tile[data-index="${tiles.indexOf(tile)}"]`);
                    tileElement.classList.remove('selected');
                });
                updateScore(-5); // Decrease score if no match is found
            }, 500);
        }
    }
}

// Function to check if the game is finished
function isGameFinished(tiles) {
    return tiles.every(tile => tile.removed);
}

// Function to generate a random color
function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to update the score
function updateScore(points) {
    score += points;
    if (score < 0) {
        score = 0; // Prevent score from going negative
    }
    if(score >= highScore){
        highScore = score; // Update high score if current score is higher
    }
    document.getElementById('score').textContent = score; // Update score display
    document.getElementById('high-score').textContent = highScore; // Update high score display
}

// Function to reset the score
function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
}

// Function to show the congratulations screen
function showCongratulationsScreen() {
    document.getElementById('congratulations-screen').style.display = 'flex';
}

// Function to show the game over screen
function showGameOverScreen() {
    document.getElementById('game-over-screen').style.display = 'flex';
}

// Function to update the timer display
function updateTime() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    document.getElementById('time').textContent = `${minutes}:${seconds}`;
}
