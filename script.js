// Game Variables
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let secretWord = '';
const MAX_ROWS = 5;
const MAX_COLS = 5;
let tiles = [];

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
});

function initializeGame() {
    createGameBoard();
    secretWord = getRandomWord();
    console.log('Secret word:', secretWord); // For debugging - remove in production
    gameOver = false;
    currentRow = 0;
    currentCol = 0;
}

function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    tiles = [];

    for (let i = 0; i < MAX_ROWS * MAX_COLS; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.setAttribute('data-index', i);
        gameBoard.appendChild(tile);
        tiles.push(tile);
    }
}

function handleKeyPress(e) {
    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
        e.preventDefault();
        if (currentCol > 0) {
            currentCol--;
            const tileIndex = currentRow * MAX_COLS + currentCol;
            tiles[tileIndex].textContent = '';
            tiles[tileIndex].classList.remove('filled');
        }
    } else if (key === 'ENTER') {
        e.preventDefault();
        if (currentCol === MAX_COLS) {
            submitWord();
        }
    } else if (/^[A-Z]$/.test(key) && currentCol < MAX_COLS) {
        const tileIndex = currentRow * MAX_COLS + currentCol;
        tiles[tileIndex].textContent = key;
        tiles[tileIndex].classList.add('filled');
        currentCol++;
    }
}

function submitWord() {
    const word = getEnteredWord();

    if (word.length !== MAX_COLS) {
        showMessage('Not enough letters', 'failure');
        return;
    }

    if (!VALID_WORDS.includes(word) && !WORD_LIST.includes(word)) {
        showMessage('Word not in list', 'failure');
        return;
    }

    evaluateWord(word);
    currentRow++;
    currentCol = 0;

    if (word === secretWord) {
        gameOver = true;
        showMessage('🎉 Good job!', 'success');
    } else if (currentRow === MAX_ROWS) {
        gameOver = true;
        showMessage(`Better luck next time! The word was: ${secretWord}`, 'failure');
    }
}

function getEnteredWord() {
    let word = '';
    for (let i = 0; i < MAX_COLS; i++) {
        const tileIndex = currentRow * MAX_COLS + i;
        word += tiles[tileIndex].textContent;
    }
    return word;
}

function evaluateWord(word) {
    const secretLetters = secretWord.split('');
    const enteredLetters = word.split('');
    const result = new Array(MAX_COLS);

    // First pass: mark correct positions (green)
    for (let i = 0; i < MAX_COLS; i++) {
        if (enteredLetters[i] === secretLetters[i]) {
            result[i] = 'correct';
            secretLetters[i] = null; // Mark as used
        }
    }

    // Second pass: mark wrong positions (yellow) and absent letters (grey)
    for (let i = 0; i < MAX_COLS; i++) {
        if (result[i] === 'correct') continue;

        const tileIndex = currentRow * MAX_COLS + i;

        if (secretLetters.includes(enteredLetters[i])) {
            result[i] = 'present';
            // Remove one instance of this letter from secretLetters
            const idx = secretLetters.indexOf(enteredLetters[i]);
            secretLetters[idx] = null;
        } else {
            result[i] = 'absent';
        }
    }

    // Apply styles to tiles
    for (let i = 0; i < MAX_COLS; i++) {
        const tileIndex = currentRow * MAX_COLS + i;
        tiles[tileIndex].classList.add(result[i]);
    }
}

function showMessage(text, className = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${className}`;

    // Clear message after 3 seconds if it's not a game-over message
    if (!gameOver) {
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 3000);
    }
}

function resetGame() {
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
    initializeGame();
}

