# Copilot / AI Agent Instructions — CinemaVerse (DAA Project)

Purpose: give an AI coding agent the concise, project-specific knowledge needed to make productive edits.

- **Big picture**: a single-process Flask web app (`app.py`) serves a single-page UI (`templates/index.html`) and static assets (`static/*`). Recommendations come from either a compiled C++ executable (`cpp/recommender.exe`) or an in-Python mock database (`MOCK_MOVIES` in `app.py`). The front-end (Vanilla JS in `static/script.js`) talks to the backend via form-encoded POSTs and JSON GETs.

- **Key files**:
  - `app.py` — server, API routes, `MOCK_MOVIES`, image filename normalization (`norm_key`), C++ integration (`use_cpp_recommender`).
  - `templates/index.html` — single-page UI, controls (`genre`, `rating`, `language`) and modal UI.
  - `static/script.js` — all client logic: fetch calls to `/recommend`, `/search`, `/featured`; localStorage key `cinemaverseState`.
  - `static/style.css` — theming and carousel/3D styles.
  - `static/images/` — poster images; filenames must match the sanitization used in `app.py`.
  - `cpp/recommender.cpp` — optional compiled recommender (example build in README).

- **API shapes & examples (explicit)**:
  - `GET /` → serves `index.html`.
  - `GET /featured` → returns JSON array of featured movie objects: {title, score, language, genre, poster}
  - `GET /languages` → {languages: [...]} (used to populate language select)
  - `POST /recommend` — expects `application/x-www-form-urlencoded` with `genre`, `rating`, `language`. Returns a JSON array of movie objects. Example client call in `static/script.js`:
    ```js
    fetch('/recommend', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:`genre=${encodeURIComponent(genre)}&rating=${rating}&language=${encodeURIComponent(language)}`})
    ```
  - `POST /search` — expects form field `name`, returns JSON array of matches.

- **Important conventions & gotchas**:
  - Poster filename normalization is performed by `app.py`'s `norm_key()` — new posters must be dropped into `static/images/` using sanitized names (see README examples: replace non-alphanumerics with underscores). If no poster is found, the backend returns a placeholder URL.
  - The backend tries C++ (`cpp/recommender.exe`) first. If it isn't present or fails, `use_mock_recommender()` (in-memory `MOCK_MOVIES`) is used as a fallback. To reproduce C++ behavior locally, compile `cpp/recommender.cpp`.
  - Client code expects arrays for `/recommend` and `/search`. If you change these endpoints, keep a consistent array-shaped success response (or update `static/script.js` accordingly).
  - State is client-side only: watchlist/favorites/ratings are saved to localStorage under `cinemaverseState`.

- **Build / run / debug steps (what actually works locally)**:
  1. Create and activate a venv (recommended).
     ```powershell
     python -m venv venv
     venv\Scripts\activate
     ```
  2. Install dependencies:
     ```powershell
     pip install -r requirements.txt
     ```
  3. (Optional) Build C++ recommender (Windows example):
     ```powershell
     g++ cpp\recommender.cpp -o cpp\recommender.exe
     ```
  4. Run server:
     ```powershell
     python app.py
     ```
  5. Open http://localhost:5000

- **When editing code, use these concrete examples**:
  - To add a movie: edit `MOCK_MOVIES` in `app.py` and add a tuple like `('My Movie', 7.5, 'English')` to the appropriate genre list.
  - To add a poster: put `my_movie.jpg` into `static/images/` where `my_movie` is the sanitized title produced by `norm_key()`.
  - To change recommendation logic: prefer updating `use_mock_recommender()` for quick changes; keep the `/recommend` response as an array of objects with `title` and `score` fields (and optionally `poster`, `language`, `genre`).

- **Testing & debugging tips**:
  - The app runs with `debug=True` in `app.py` — use server logs for stack traces and `print()` statements already present (e.g., print when C++ fallback occurs).
  - Front-end fetch errors appear in browser console; server-side errors print to stdout. When `/recommend` returns an error dict, the front-end may assume an array — update client or server consistently.

- **Integration points / external dependencies**:
  - Flask (single dependency in `requirements.txt`).
  - Optional native C++ recommender: `cpp/recommender.exe` invoked via subprocess; must be placed at `cpp/recommender.exe` relative to repo root.
  - No database: all persistent user state is in localStorage; movie data is in-code.

If anything above is unclear or you want the file to cover additional workflows (CI, tests, commit hooks), tell me which area to expand and I'll iterate.
