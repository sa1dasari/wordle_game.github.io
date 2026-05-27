# 🟩 Wordle Clone

A browser-based Wordle clone with daily shared words, real-time dictionary validation, and a first-visit how-to-play guide. No backend, no dependencies — pure vanilla JS hosted on GitHub Pages.

🎮 **[Play it live →](https://sa1dasari.github.io/wordle_game.github.io/)**

---

## Features

- **Daily word mode** — everyone gets the same word each calendar day, derived deterministically from the date so no server or API is needed
- **Real-time validation** — guesses are checked against the [Free Dictionary API](https://api.dictionaryapi.dev)
- **How to Play modal** — shown automatically on first visit, accessible anytime via the `?` button
- **6 attempts**, colour-coded feedback (green / yellow / grey) matching standard Wordle rules
- **Responsive** — works on desktop and mobile
- **Offline-safe** — if the dictionary API is unreachable, guesses are accepted so the game never breaks

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