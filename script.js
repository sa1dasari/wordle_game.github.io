// Game Variables
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let secretWord = '';
const MAX_ROWS = 6;   // standard Wordle allows 6 guesses
const MAX_COLS = 5;
let tiles = [];

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('resetBtn').addEventListener('click', resetGame);

    // How to Play modal
    const overlay  = document.getElementById('modalOverlay');
    const helpBtn  = document.getElementById('helpBtn');
    const closeBtn = document.getElementById('modalClose');

    const openModal  = () => overlay.classList.add('open');
    const closeModal = () => overlay.classList.remove('open');

    helpBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(); // click backdrop to dismiss
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Show modal automatically on first visit
    if (!localStorage.getItem('wordleRulesSeen')) {
        openModal();
        localStorage.setItem('wordleRulesSeen', '1');
    }
});

function initializeGame() {
    createGameBoard();
    secretWord = getRandomWord();
    console.log('Secret word:', secretWord); // Remove before production
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
        deleteLetter();
    } else if (key === 'ENTER') {
        e.preventDefault();
        if (currentCol === MAX_COLS) {
            submitWord();  // async — no need to await at event handler level
        }
    } else if (/^[A-Z]$/.test(key) && currentCol < MAX_COLS) {
        addLetter(key);
    }
}

function addLetter(key) {
    const tileIndex = currentRow * MAX_COLS + currentCol;
    tiles[tileIndex].textContent = key;
    tiles[tileIndex].classList.add('filled');
    currentCol++;
}

function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const tileIndex = currentRow * MAX_COLS + currentCol;
        tiles[tileIndex].textContent = '';
        tiles[tileIndex].classList.remove('filled');
    }
}

async function submitWord() {
    const word = getEnteredWord();

    if (word.length !== MAX_COLS) {
        showMessage('Not enough letters', 'failure');
        return;
    }

    // Show a subtle loading state while the API checks the word
    showMessage('Checking...', '');

    const valid = await isValidWord(word);
    if (!valid) {
        showMessage('Not a valid word!', 'failure');
        return;
    }

    // Clear the checking message before showing result
    showMessage('', '');

    evaluateWord(word);
    const attemptIndex = currentRow; // capture BEFORE incrementing
    currentRow++;
    currentCol = 0;

    if (word === secretWord) {
        gameOver = true;
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        showMessage(messages[attemptIndex] || '🎉 You got it!', 'success');
    } else if (currentRow === MAX_ROWS) {
        gameOver = true;
        showMessage(`The word was: ${secretWord}`, 'failure');
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
            secretLetters[i] = null; // Mark as used so it won't match again
        }
    }

    // Second pass: mark wrong positions (yellow) and absent letters (grey)
    for (let i = 0; i < MAX_COLS; i++) {
        if (result[i] === 'correct') continue;

        if (secretLetters.includes(enteredLetters[i])) {
            result[i] = 'present';
            secretLetters[secretLetters.indexOf(enteredLetters[i])] = null;
        } else {
            result[i] = 'absent';
        }
    }

    // Apply colour classes to tiles
    for (let i = 0; i < MAX_COLS; i++) {
        const tileIndex = currentRow * MAX_COLS + i;
        tiles[tileIndex].classList.add(result[i]);
    }
}

function showMessage(text, className = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${className}`;

    // Auto-clear transient messages (not game-over ones)
    if (!gameOver && text !== '' && className !== '') {
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