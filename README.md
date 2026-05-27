# 🟩 Wordle Clone

A browser-based Wordle clone, real-time dictionary validation, and a first-visit how-to-play guide. No backend, no dependencies — pure vanilla JS hosted on GitHub Pages.

🎮 **[Play it live →](https://sa1dasari.github.io/wordle_game.github.io)**

---

## Features

- **Real-time validation** — guesses are checked against the [Free Dictionary API](https://api.dictionaryapi.dev)
- **How to Play modal** — shown automatically on first visit, accessible anytime via the `?` button
- **6 attempts**, colour-coded feedback (green / yellow / grey) matching standard Wordle rules
- **Responsive** — works on desktop and mobile
- **Offline-safe** — if the dictionary API is unreachable, guesses are accepted so the game never breaks

---

## How It Works

### Guess validation
Rather than shipping a 170 KB word list, each guess hits the Free Dictionary API:

```js
async function isValidWord(word) {
    if (ANSWER_WORDS.includes(word.toUpperCase())) return true;
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    return res.ok;
}
```

---

## Project Structure

```
wordle_game.github.io/
├── index.html   # Game layout + How to Play modal markup
├── style.css    # All styles including modal, tile colours, responsive
├── script.js    # Game logic, keyboard handling, modal wiring
└── words.js     # Curated answer list + isValidWord() API helper
```

---


## Tile Colour Rules

| Colour | Meaning |
|--------|---------|
| 🟩 Green | Correct letter, correct position |
| 🟨 Yellow | Correct letter, wrong position |
| ⬜ Grey | Letter not in the word |

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Language | Vanilla JS (ES2020) | No build tooling needed for GitHub Pages |
| Fonts | League Spartan + DM Sans | Clean, bold feel matching the game's personality |
| Dictionary | [Free Dictionary API](https://api.dictionaryapi.dev) | Free, no API key, good English word coverage |
| Hosting | GitHub Pages | Zero-config static hosting |

---