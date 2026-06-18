// Game Variables
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let secretWord = '';
let guessHistory = []; // tracks results for share grid
const MAX_ROWS = 6;
const MAX_COLS = 5;
let tiles = [];

// Keyboard rows
const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
];

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    buildKeyboard();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('resetBtn').addEventListener('click', resetGame);

    // Modal + hamburger handled by shared.js
});

function initializeGame() {
    createGameBoard();
    resetKeyboard();
    secretWord = getRandomWord();
    guessHistory = [];
    gameOver = false;
    currentRow = 0;
    currentCol = 0;
}

// ── Game board ────────────────────────────────────────────────────────────────
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

// ── On-screen keyboard ────────────────────────────────────────────────────────
function buildKeyboard() {
    const kb = document.getElementById('keyboard');
    kb.innerHTML = '';

    KB_ROWS.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';

        row.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'kb-key';
            btn.textContent = key;
            btn.setAttribute('data-key', key);

            if (key === 'ENTER' || key === '⌫') {
                btn.classList.add('kb-wide');
            }

            btn.addEventListener('click', () => handleVirtualKey(key));
            rowEl.appendChild(btn);
        });

        kb.appendChild(rowEl);
    });
}

function resetKeyboard() {
    // Remove all colour state classes from every key
    document.querySelectorAll('.kb-key').forEach(btn => {
        btn.classList.remove('correct', 'present', 'absent');
    });
}

function updateKeyboard(letter, state) {
    const btn = document.querySelector(`.kb-key[data-key="${letter}"]`);
    if (!btn) return;

    // Never downgrade a green key to yellow/grey
    const priority = { correct: 3, present: 2, absent: 1 };
    const current = ['correct', 'present', 'absent'].find(c => btn.classList.contains(c));
    if (current && priority[current] >= priority[state]) return;

    btn.classList.remove('correct', 'present', 'absent');
    btn.classList.add(state);
}

// ── Input handling ────────────────────────────────────────────────────────────
function handleVirtualKey(key) {
    if (gameOver) return;

    if (key === '⌫') {
        deleteLetter();
    } else if (key === 'ENTER') {
        if (currentCol === MAX_COLS) submitWord();
    } else {
        if (currentCol < MAX_COLS) addLetter(key);
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
        if (currentCol === MAX_COLS) submitWord();
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

// ── Word submission ───────────────────────────────────────────────────────────
async function submitWord() {
    const word = getEnteredWord();

    if (word.length !== MAX_COLS) {
        showMessage('Not enough letters', 'failure');
        return;
    }

    showMessage('Checking...', '');

    const valid = await isValidWord(word);
    if (!valid) {
        showMessage('Not a valid word!', 'failure');
        return;
    }

    showMessage('', '');

    const result = evaluateWord(word);
    guessHistory.push(result); // save for share grid
    currentRow++;
    currentCol = 0;

    // Update keyboard colours after evaluation
    word.split('').forEach((letter, i) => updateKeyboard(letter, result[i]));

    if (word === secretWord) {
        gameOver = true;
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        showMessage(messages[currentRow - 1] || '🎉 You got it!', 'success');
        showShareResult(true);
    } else if (currentRow === MAX_ROWS) {
        gameOver = true;
        showMessage(`The word was: ${secretWord}`, 'failure');
        showShareResult(false);
    }
}

// ── Share result ──────────────────────────────────────────────────────────────
// Encode/decode — same XOR scheme as challenge.html for cross-mode link sharing
function encodeWordForShare(word) {
    const key = [7, 13, 3, 19, 11];
    const bytes = word.toUpperCase().split('').map((c, i) => c.charCodeAt(0) ^ key[i % key.length]);
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function buildShareGrid() {
    return guessHistory.map(row =>
        row.map(r => r === 'correct' ? '🟩' : r === 'present' ? '🟨' : '⬛').join('')
    ).join('\n');
}

function buildShareText(won, showWords = false) {
    const tries   = won ? currentRow : 'X';
    const encoded = encodeWordForShare(secretWord);
    const baseUrl = window.location.href.split('?')[0].replace(/index\.html$/, '');
    const challengeUrl = `${baseUrl}challenge.html?c=${encoded}`;

    let grid;
    if (showWords) {
        // Emoji row + actual guess word side by side
        grid = guessHistory.map(row => {
            const emojis = row.map(r => r === 'correct' ? '🟩' : r === 'present' ? '🟨' : '⬛').join('');
            // Get actual letters from tiles for that row
            const rowIdx = guessHistory.indexOf(row);
            const word   = Array.from({length: MAX_COLS}, (_, c) => tiles[rowIdx * MAX_COLS + c]?.textContent || '').join('');
            return `${emojis}  ${word}`;
        }).join('\n');
    } else {
        grid = buildShareGrid();
    }

    return [
        `🟩 WordForge Solo ${tries}/6`,
        '',
        grid,
        '',
        'Think you can guess my word?',
        `Challenge me: ${challengeUrl}`
    ].join('\n');
}

function showShareResult(won) {
    // Build / show share buttons under the message
    let container = document.getElementById('shareContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'shareContainer';
        container.className = 'share-container';
        const messageEl = document.getElementById('message');
        messageEl.insertAdjacentElement('afterend', container);
    }

    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';

    // Share Result button (emoji only)
    const shareBtn = document.createElement('button');
    shareBtn.className = 'reset-btn';
    shareBtn.style.cssText = 'background:#c8b97a;color:#121213;font-family:"League Spartan",sans-serif;font-weight:700;font-size:13px;padding:10px 16px;border:none;border-radius:4px;cursor:pointer;';
    shareBtn.textContent = '📤 Share Result';
    shareBtn.onclick = () => doShare(buildShareText(won, false), shareBtn, '📤 Share Result');

    // Share + Words button
    const shareWordsBtn = document.createElement('button');
    shareWordsBtn.style.cssText = 'background:transparent;color:#818384;font-family:"League Spartan",sans-serif;font-weight:700;font-size:13px;padding:10px 16px;border:1px solid #3a3a3c;border-radius:4px;cursor:pointer;';
    shareWordsBtn.textContent = '📤 Share + Words';
    shareWordsBtn.onclick = () => doShare(buildShareText(won, true), shareWordsBtn, '📤 Share + Words');

    container.appendChild(shareBtn);
    container.appendChild(shareWordsBtn);
}

function doShare(text, btn, originalLabel) {
    if (navigator.share) {
        navigator.share({ title: 'WordForge Solo', text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied! ✓';
            setTimeout(() => { btn.textContent = originalLabel; }, 2000);
        }).catch(() => showMessage('Copy failed — try manually', 'failure'));
    }
}

function hideShareResult() {
    const container = document.getElementById('shareContainer');
    if (container) container.style.display = 'none';
}

function getEnteredWord() {
    let word = '';
    for (let i = 0; i < MAX_COLS; i++) {
        const tileIndex = (currentRow) * MAX_COLS + i;
        word += tiles[tileIndex].textContent;
    }
    return word;
}

// ── Word evaluation ───────────────────────────────────────────────────────────
function evaluateWord(word) {
    const secretLetters = secretWord.split('');
    const enteredLetters = word.split('');
    const result = new Array(MAX_COLS);

    // First pass: correct positions (green)
    for (let i = 0; i < MAX_COLS; i++) {
        if (enteredLetters[i] === secretLetters[i]) {
            result[i] = 'correct';
            secretLetters[i] = null;
        }
    }

    // Second pass: present / absent
    for (let i = 0; i < MAX_COLS; i++) {
        if (result[i] === 'correct') continue;

        if (secretLetters.includes(enteredLetters[i])) {
            result[i] = 'present';
            secretLetters[secretLetters.indexOf(enteredLetters[i])] = null;
        } else {
            result[i] = 'absent';
        }
    }

    // Apply tile colours
    for (let i = 0; i < MAX_COLS; i++) {
        const tileIndex = (currentRow) * MAX_COLS + i;
        tiles[tileIndex].classList.add(result[i]);
    }

    return result;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showMessage(text, className = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${className}`;

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
    hideShareResult();
    initializeGame();
}