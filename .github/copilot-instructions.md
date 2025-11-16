## Purpose

This file gives concise, actionable guidance for AI coding agents working on the Truco_Front repository (React + Create React App).

## Big picture

- Single-page React app bootstrapped with Create React App. Routes are defined in `src/App.js`.
- UI is split into small components in `src/components/` (Home, Dashboard, Game, Board, Card, BoardCard, Contador, auth/*).
- The frontend communicates with a backend API at `http://localhost:3001` via `src/api/games.js` using axios and withCredentials=true.
- Real-time-ish behavior is implemented via polling (setInterval) in `src/components/Game.js` and `src/components/Board.js` rather than websockets in this branch.

## How to run & verify locally

- Start dev server: `npm start` (opens http://localhost:3000)
- Build for production: `npm run build`
- Run tests: `npm test`
- Lint: `npm run lint` and fix: `npm run lint:fix`
- Format: `npm run format` (or `npm run format:check` to verify)

When verifying changes that touch backend calls, ensure a backend running on `http://localhost:3001` (the code assumes this host and port).

## Key files to inspect or edit

- `src/api/games.js` — all backend HTTP calls live here. Update endpoints, headers, or error handling here.
- `src/App.js` — routes and top-level current_player sessionStorage logic.
- `src/components/Game.js` — room view, polling for players/game state, navigation to board.
- `src/components/Board.js` — main game UI: polling, hand normalization, drag-and-drop, deal/drop/reset actions.
- `src/components/Card.js`, `src/components/BoardCard.js` — drag/drop and rendering of individual cards.
- `src/styles/` — CSS for components; mirror classNames when changing markup.

## Project-specific patterns & important gotchas

- **Event-driven polling (NEW)**: Polling is now implemented with exponential backoff, not constant intervals. See below.
- sessionStorage: `current_player` is stored in sessionStorage in `App.js`. Keep this in mind when changing authentication flows.
- Axios options: All requests in `src/api/games.js` use `withCredentials: true` and explicit Accept headers. Preserve these unless backend changes.
- Drag-and-drop: Cards use HTML5 dataTransfer with JSON payloads. See `Card` onDragStart and `Board` handleDrop for how card objects are serialized/deserialized.
- Mixed language: UI strings are in Spanish (e.g., 'Reiniciar cartas', 'Empezar Juego') — preserve language consistency when editing text.
- Error handling: current pattern is to console.log errors and occasionally return early. If adding new flows, keep behavior consistent or update both UI and API functions together.
- Dependencies: project includes `stream-chat` and `stream-chat-react` in package.json but these are not used by the files scanned — double-check before adding features depending on them.

## When you change API shapes or endpoints

1. Update `src/api/games.js` to match the new endpoints/shape.
2. Update callers in `src/components/*` (Game, Board, Dashboard, Home) to handle new shapes.
3. Run `npm start` and exercise the flows (create/join game, start game, drop/deal cards). Use browser console/network tab to validate requests.

## Examples (quick reference)

- To change where the app hits the backend, edit the base URL in `src/api/games.js` or centralize it there.
- To add a route, edit `src/App.js` Routes and add the corresponding component under `src/components/`.
- To change polling behavior, refer to the "Polling best practices" section below.

## Polling best practices

This app uses **event-driven polling with exponential backoff** to reduce API calls while keeping the UI responsive:

**Pattern (implemented in Board.js and Game.js):**
- Poll immediately when component mounts
- Compare fetched data to previous state (JSON.stringify for simple comparison)
- **If state changed**: reset backoff to `INITIAL_POLL_INTERVAL` (e.g., 1000ms)
- **If no change**: increment backoff counter and apply exponential multiplier (e.g., 1s → 1.5s → 2.25s → 3.4s → ... up to max 10s)
- After player actions (deal, drop card, reset), call `resetPollToFast()` to immediately resume fast polling

**Key refs and variables:**
- `pollDelayRef` — tracks current polling interval (dynamically increases)
- `noChangeCountRef` — counts consecutive polls with no state change (used to calculate backoff)
- `lastStateRef` — stores JSON of last known state for comparison
- Constants: `INITIAL_POLL_INTERVAL`, `MAX_POLL_INTERVAL`, `BACKOFF_MULTIPLIER`

**Why this matters:**
- **Before**: 3 simultaneous intervals × 1000ms = 3 API calls/sec per player (wasteful)
- **After**: ~1 API call/sec that slows to ~0.1 calls/sec when idle (efficient)

**Anti-patterns to avoid:**
- ❌ Using constant `setInterval(fetch, 1000)` in every component (causes duplicate intervals if dependencies change)
- ❌ Not clearing intervals on unmount (memory leaks)
- ❌ Polling in response to user input without debouncing (too many requests)
- ✅ Always call `resetPollToFast()` after state-mutating actions (deal, drop, reset)
- ✅ Clean up intervals in useEffect return (stopPolling callback)
- ✅ Use refs for mutable interval IDs, not useState (prevents unnecessary re-renders)

## Tests & linting expectations

- Unit tests: CRA `npm test` is configured; add tests under the existing structure if needed.
- Lint: `npm run lint` uses ESLint; formatting uses Prettier. Keep code consistent with existing style (ESLint extends react-app + prettier).

## If you are editing UI state flows

- Review how `players` are ordered in `Board.js` (`orderedPlayers`) — the code rotates players so the current player is first. Preserve that logic when changing the board layout.
- When adjusting drag/drop or card reset, ensure server-side calls (`DropCard`, `resetPlayerCards`, `DealCards`) remain compatible.
- When adding new actions, remember to call `resetPollToFast()` afterward to ensure quick feedback loop.

## Merge guidance

No existing `.github/copilot-instructions.md` or AGENT.md files were detected in the repo root when this file was created; if you already have a central agent guidance elsewhere, merge the high-level sections above but keep the code-specific examples here.

---
If anything above is unclear, tell me which area you want expanded (e.g., API shapes, polling architecture, test strategy) and I will iterate.
