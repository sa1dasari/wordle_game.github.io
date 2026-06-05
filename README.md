# Wordle

A browser-based Wordle clone with daily shared words, real-time dictionary validation, and a multiplayer Duel Mode. Features a dark theme and a first-visit how-to-play guide. Pure vanilla JS with optional backend support.

🎮 **[Play it live →](https://sa1dasari.github.io/wordle_game.github.io/)**

---

## Features

### Solo Mode
- **Daily word mode** — everyone gets the same word each calendar day, derived deterministically from the date so no server needed
- **Real-time validation** — guesses are checked against the [Free Dictionary API](https://api.dictionaryapi.dev)
- **How to Play modal** — shown automatically on first visit, accessible anytime via the `?` button
- **6 attempts**, colour-coded feedback (green / yellow / grey) matching standard Wordle rules

### Challenge Mode
- **Custom words** — create a challenge by setting any 5-letter word
- **Easy sharing** — share via short 5-digit code (same device) or encoded link (cross-device)
- **Share options** — send challenges via WhatsApp, Text, Gmail, or native share
- **6 guesses** — friends get 6 attempts to solve your custom word
- **Persistent codes** — codes stored locally; links work anywhere

### Duel Mode
- **Real-time multiplayer** — play turn-based matches against other players
- **Room codes** — create and join rooms with 4-letter codes
- **Shared game board** — watch your opponent's guesses in real-time
- **Turn indicators** — clear UI showing whose turn it is
- **Unlimited guesses per player** — focus on winning, not counting down

### General
- **Dark theme** — modern dark mode for comfortable gameplay
- **Responsive** — works on desktop and mobile
- **Offline-safe** — Solo and Challenge modes never break even if API is unreachable

---

## Project Structure

```
wordle_game.github.io/
├── index.html       # Solo mode: daily shared word with How to Play modal
├── challenge.html   # Challenge mode: create custom word challenges & share
├── duel.html        # Duel mode: multiplayer real-time matches with Socket.io
├── style.css        # Shared styles: dark theme, tiles, keyboard, responsive
├── script.js        # Solo mode game logic and UI handlers
├── words.js         # Curated answer list + isValidWord() API helper
├── server.js        # Express backend for Duel Mode (optional)
├── package.json     # Node.js dependencies and config
└── Procfile         # Heroku/Railway deployment config
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
| Styling | Vanilla CSS with CSS variables | Dark theme with consistent color palette |
| Fonts | League Spartan + DM Sans | Clean, bold feel matching the game's personality |
| Dictionary | [Free Dictionary API](https://api.dictionaryapi.dev) | Free, no API key, good English word coverage |
| Multiplayer | Node.js + Express + Socket.io | Real-time bidirectional communication for Duel Mode |
| Hosting | GitHub Pages (single player) / Railway (Duel backend) | Zero-config static + cloud backend |

---