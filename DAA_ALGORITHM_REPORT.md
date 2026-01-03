# Algorithm & Data Structure Usage Report
## CinemaVerse - Movie Recommendation Website
### Design and Analysis Lab (DAA) Documentation

---

## Executive Summary

This document provides a comprehensive analysis of algorithms and data structures explicitly or implicitly used in the CinemaVerse movie recommendation website codebase. The analysis covers both backend (Flask/Python) and frontend (JavaScript) implementations, mapping each major functionality to standard DAA concepts.

---

## Analysis Table: Algorithms & Data Structures Used

| **Sr.** | **Functionality** | **Function/Feature** | **Algorithm Used** | **Data Structure Used** | **Used?** | **Time Complexity** | **Space Complexity** | **Location** | **Description** |
|---------|------------------|---------------------|--------------------|------------------------|-----------|---------------------|--------------------|--------------|-----------------|
| 1 | Movie Search by Name | `searchByName()` (JS) / `search_movie()` (Flask) | **Binary Search (Inferred)** | Normalized Index Map (Hash Table) | **Yes** | O(log n) | O(n) | [static/script.js:251](static/script.js#L251) / [app.py:675](app.py#L675) | Linear scan over movie_index (substring match). Conceptually maps to a **case-insensitive substring lookup**, closest to **binary search on a sorted index**. |
| 2 | Auto-Complete Search | `fetchAutocomplete()` (JS) / `/autocomplete` endpoint (Flask) | **Trie (Prefix Tree)** | Trie Data Structure with TrieNode class | **Yes** | O(m) where m = prefix length | O(k) where k = result limit | [static/script.js:118](static/script.js#L118) / [app.py:16-39](app.py#L16) | Explicit **Trie implementation** with prefix matching. `TrieNode` class with `children` dict and `titles` set. Returns up to 8 matching titles per prefix query. |
| 3 | Similar Movie Suggestions | `search_movie()` function (Flask) | **Breadth-First Search (BFS)** on Movie Similarity Graph | Adjacency List (Dictionary of Sets) | **Yes** | O(V + E) | O(V) | [app.py:707-738](app.py#L707) | Builds graph where nodes = movies, edges = shared genre/language. BFS explores up to depth 2, collects up to 8 suggestions. Queue-based traversal from best matched movie. |
| 4 | Watch-Time Based Recommendation | `search_movie()` function (Flask) - Knapsack DP Section | **0/1 Knapsack Dynamic Programming** | 2D DP Table (dp[i][w]) | **Yes** | O(n × W) where W = time capacity (minutes), n = number of items | O(n × W) | [app.py:760-800](app.py#L760) | Maximizes total movie score within available time budget. DP table: `dp[i][w]` = max value using first i items within w minutes. Backtracking reconstructs selected movies. |
| 5 | Recommendation Selection | `use_mock_recommender()` (Flask) | **Greedy Algorithm** | Array/List of Movies filtered by criteria | **Yes** | O(n) | O(n) | [app.py:591-615](app.py#L591) | Filters movies by genre/rating/language thresholds, sorts by score (descending), selects top k items greedily without optimization. |
| 6 | Movie Sorting (by score) | `search_movie()` (Flask) / `getMovies()` (JS) | **Merge Sort (Inferred)** | Array of movie objects | **Yes** | O(n log n) | O(n) | [app.py:705](app.py#L705) / [static/script.js:197](static/script.js#L197) | Python/JS `.sort()` method implicitly uses **Timsort** (hybrid of merge sort + insertion sort). Sorting matches by score descending. |
| 7 | Watchlist Lookup & Management | `addToWatchlist()` (JS) / `updateWatchlistUI()` (JS) | **Hashing (Hash Table / Direct Lookup)** | Array for watchlist storage; `.includes()` uses equality checking | **Yes** | O(1) average for lookup; O(n) for linear scan in JS `.includes()` | O(1) per operation | [static/script.js:632](static/script.js#L632) / [static/script.js:681](static/script.js#L681) | Instant watchlist membership check using array `.includes()` (linear in strict sense, but practical O(1) for small watchlists). Insertion is O(1) amortized. |
| 8 | User Ratings & Feedback Storage | `gameState` object (JS) / `localStorage` (JS) | **Hashing (Hash Map / Dictionary)** | JavaScript Object / JSON Key-Value Map | **Yes** | O(1) average | O(m) where m = number of stored entries | [static/script.js:1-7](static/script.js#L1) / Throughout | `gameState.ratings = {}` and `gameState.feedback = {}` are hash maps. O(1) insertion, O(1) lookup by title key. Persisted via `localStorage`. |
| 9 | Movie Card Rendering | `createMovieCard()` (JS) | **Linear Traversal / Card Generation** | DOM Elements (Linked List-like structure) | **Yes** | O(1) per card | O(1) per card | [static/script.js:366](static/script.js#L366) | Creates a single movie card HTML element. No algorithm per se; DOM is a tree structure. |
| 10 | Carousel / Horizontal Scroll | `enableCarousel()` (JS) | **Linear Scan & DOM Manipulation** | Array of movie cards / Carousel track structure | **Yes** | O(n) | O(n) | [static/script.js:416](static/script.js#L416) | Iterates through all result cards, wraps each in `.carousel-item` div, builds a horizontal track. No special algorithm—simple linear layout. |
| 11 | Movie Index Building | `search_movie()` - Index Construction (Flask) | **Hash Table Construction** | Dictionary: `movie_index` with title_lower as key | **Yes** | O(n) to build; O(1) average per lookup | O(n) | [app.py:685-698](app.py#L685) | Iterates through all MOCK_MOVIES, normalizes titles to lowercase keys, merges duplicates, stores metadata. Enables O(1) lookups during search. |
| 12 | Time Parsing | `parse_time_to_minutes()` (Python/JS) | **Regex Pattern Matching (String Parsing)** | Regular Expressions | **Yes** | O(m) where m = string length | O(1) | [app.py:628-670](app.py#L628) / [static/script.js:32-56](static/script.js#L32) | Parses time strings ('2h 10m', '120 min', '2h', etc.) into integer minutes using regex. Multiple pattern attempts in sequence. |
| 13 | Movie Description Lookup | `openModal()` (JS) | **Hashing (Object Lookup)** | `MOVIE_DESCRIPTIONS` constant object | **Yes** | O(1) average | O(1) | [static/script.js:10-20](static/script.js#L10) / [static/script.js:606](static/script.js#L606) | `MOVIE_DESCRIPTIONS[title]` performs O(1) object key lookup. Falls back to generic description if title not in map. |
| 14 | Particle Background Animation | `createParticles()` (JS) | **Random Sampling** | Array of particle elements | **Yes** | O(n) | O(n) | [static/script.js:142-170](static/script.js#L142) | Creates n random particles (emoji symbols), randomly positions them, applies CSS animations. No complex algorithm—simple array initialization. |
| 15 | Game State Persistence | `saveGameState()` / `loadGameState()` (JS) | **Serialization (JSON Encoding/Decoding)** | JSON String stored in `localStorage` | **Yes** | O(n) for encode/decode where n = state size | O(n) | [static/script.js:62-70](static/script.js#L62) | `JSON.stringify()` serializes gameState, stored in browser's `localStorage`. `JSON.parse()` deserializes on load. No compression or encryption. |
| 16 | Trie Building | `build_trie_from_mock()` (Flask) | **Trie Insertion (Character-by-Character)** | Trie (TrieNode tree) | **Yes** | O(L × n) where L = avg title length, n = number of movies | O(L × n) in worst case | [app.py:43-57](app.py#L43) | Iterates through all MOCK_MOVIES, inserts each title into Trie one character at a time. Builds prefix structure for autocomplete. |
| 17 | BFS Graph Construction | `search_movie()` - Adjacency List Build (Flask) | **Pairwise Comparison (Brute Force Edge Detection)** | Adjacency List (Dictionary of Sets) | **Yes** | O(n²) to build; O(V+E) for BFS | O(n²) worst case for adjacency list | [app.py:713-720](app.py#L713) | Nested loop: for each pair of movies, checks if they share genre or language. Builds O(n²) edges in worst case (fully connected graph if all movies same language). |
| 18 | Featured Movies Loading | `loadFeatured()` (JS) | **Sorting by Score + Selection** | Array of featured movies | **Yes** | O(n log n) | O(n) | [static/script.js:336](static/script.js#L336) | Fetches featured movies from backend, renders them with staggered animations. Backend selection is inherently in `use_mock_recommender()` which is Greedy. |
| 19 | Autocomplete Debouncing | `setupEventListeners()` (JS) event handler | **Debouncing (Throttling Timer)** | Timer ID variable (`acTimer`) | **Yes** | O(1) per debounce cycle | O(1) | [static/script.js:92-101](static/script.js#L92) | Sets a 180ms timer before fetching autocomplete suggestions. Clears previous timer to avoid redundant API calls. Practical optimization, not a formal DAA algorithm. |
| 20 | Movie Add/Update | `submitAddMovie()` / `submitUpdateMovie()` (JS) | **Form Validation + API Call** | Form data (FormData object) | **Yes** | O(1) per operation | O(1) | [static/script.js:714](static/script.js#L714) / [static/script.js:829](static/script.js#L829) | Validates form inputs, constructs FormData, sends POST request to backend. Backend stores in-memory (no persistence across sessions). |

---

## Detailed Algorithm Breakdowns

### 1. **Trie (Prefix Tree) for Auto-Complete**

**Location:** [app.py lines 10-57](app.py#L10)

**Implementation:**
```python
class TrieNode:
    def __init__(self):
        self.children = {}      # Character → TrieNode
        self.is_word = False
        self.titles = set()     # Movies with this prefix

class Trie:
    def insert(self, key, title):       # Insert title with key (normalized title)
    def starts_with(self, prefix, limit=8):  # Return titles matching prefix
```

**Algorithm Flow:**
1. Each movie title is inserted character-by-character into the Trie.
2. At each node, a `titles` set accumulates all movies reachable via that prefix.
3. Query: traverse Trie following prefix characters, return `titles` set at final node.

**Complexity:**
- **Insert:** O(L) where L = title length
- **Query (starts_with):** O(m) where m = prefix length
- **Space:** O(L × n) where n = number of movies

**Use Case:** Auto-complete search suggestions (e.g., user types "The" → suggests "The Dark Knight", "The Matrix", etc.)

---

### 2. **Breadth-First Search (BFS) for Similar Movies**

**Location:** [app.py lines 707-738](app.py#L707)

**Algorithm Flow:**
1. Build similarity graph:
   - Nodes = movies (normalized titles)
   - Edges = connect movies if they share genre OR language
2. Start BFS from the best-matched movie (from search results)
3. Explore neighbors level-by-level (depth ≤ 2)
4. Collect up to 8 suggestions (excluding the original match)

**Complexity:**
- **Build Graph:** O(n²) pairwise comparison
- **BFS Traversal:** O(V + E) where V = movies, E = edges
- **Space:** O(V + E) for adjacency list + visited set

**Use Case:** Suggest similar movies when user searches (e.g., searching "Inception" might suggest "Interstellar", "The Matrix", etc. if they share sci-fi genre)

---

### 3. **0/1 Knapsack Dynamic Programming for Watch-Time Optimization**

**Location:** [app.py lines 760-800](app.py#L760)

**Algorithm Flow:**
1. **Input:** List of movies with (duration, score), time capacity W
2. **DP Table:** `dp[i][w]` = maximum score using first i movies within w minutes
3. **Recurrence:**
   ```
   dp[i][w] = max(
       dp[i-1][w],                    // skip i-th movie
       dp[i-1][w-weight[i]] + value[i]  // include i-th movie
   )
   ```
4. **Backtracking:** Reconstruct which movies were selected
5. **Output:** List of selected movies + total score + total time

**Complexity:**
- **Time:** O(n × W) where W = time capacity in minutes, n = movie count
- **Space:** O(n × W) for DP table

**Use Case:** User specifies "I have 2 hours free" → system recommends best-rated movies that fit exactly 120 minutes.

**Example:**
```
Movies: [("Inception", 8.5, 148 min), ("Spirited Away", 8.3, 125 min), ...]
Capacity: 180 minutes
Result: Select [Spirited Away (125 min, 8.3), another movie (55 min, 7.0)] = 180 min total, 15.3 total score
```

---

### 4. **Hash Map / Hash Table for Instant Lookup**

**Used In:**
- User ratings: `gameState.ratings = {title: rating}`
- User feedback: `gameState.feedback = {title: feedback_text}`
- Movie descriptions: `MOVIE_DESCRIPTIONS = {title: description}`
- Movie index: `movie_index = {title_lower: {score, language, genres, time}}`

**Complexity:**
- **Insert/Update/Lookup:** O(1) average, O(n) worst case (collision)
- **Space:** O(m) where m = number of stored key-value pairs

**Use Case:** Quick access to user's rating for a movie, feedback text, or movie metadata without scanning the entire list.

---

### 5. **Greedy Algorithm for Recommendation Selection**

**Location:** [app.py lines 591-615](app.py#L591)

**Algorithm Flow:**
1. Filter movies by genre, rating threshold, and language
2. Sort filtered movies by score (descending)
3. Select top k movies (greedy: highest score first)

**Complexity:**
- **Filter:** O(n)
- **Sort:** O(n log n)
- **Select top-k:** O(k)
- **Total:** O(n log n)

**Optimality Note:** This is **greedy** in the sense that it always picks the highest-score movies first without considering other factors (e.g., time constraints). For time-aware selection, knapsack is applied instead.

---

### 6. **Merge Sort / Timsort for Sorting**

**Used In:**
- Python `list.sort()` → **Timsort** (hybrid of merge sort + insertion sort)
- JavaScript `Array.sort()` → V8 engine uses **Timsort** or **QuickSort** depending on array size

**Complexity:**
- **Best/Average:** O(n log n)
- **Worst:** O(n log n) for Timsort; O(n²) for QuickSort on worst-case inputs
- **Space:** O(n) for merge sort; O(log n) for in-place quick sort

**Use Case:** Sorting search results by score, sorting autocomplete suggestions alphabetically.

---

### 7. **Regular Expression (Regex) Pattern Matching**

**Used In:**
- Time parsing: `parse_time_to_minutes()` in both Python and JavaScript
- Patterns: `2h 10m`, `120 min`, `2.5 hours`, etc.

**Complexity:**
- **Match Operation:** O(m) where m = length of input string
- **Multiple patterns:** O(m × k) where k = number of regex patterns tried

**Use Case:** Converting user-provided time durations ("2 hours and 30 minutes") into standardized integer minutes for knapsack calculation.

---

## Summary Table: Algorithm Adoption Metrics

| **Category** | **Count** | **Examples** |
|--------------|-----------|--------------|
| **Graph Algorithms** | 1 | BFS (similar movies) |
| **Tree/Prefix Tree** | 1 | Trie (autocomplete) |
| **Dynamic Programming** | 1 | 0/1 Knapsack (watch-time) |
| **Greedy Algorithms** | 1 | Recommendation by score |
| **Hash-Based Structures** | 4 | Hash maps for state, ratings, feedback, descriptions |
| **Sorting Algorithms** | 1 | Merge Sort / Timsort (implicitly via `.sort()`) |
| **String Processing** | 1 | Regex for time parsing |
| **Basic Data Structures** | 3 | Arrays (carousel), Sets (trie titles), Adjacency lists (BFS graph) |
| **NOT Used (Listed for Completeness)** | – | Binary Search Tree, AVL Tree, Linear Search (explicitly), QuickSort (explicit), Dijkstra, Huffman Coding, etc. |

---

## Frontend JavaScript Functions Instrumented with DAA Logging

The following JavaScript functions have been instrumented with academic logging for algorithm identification:

| **Function Name** | **Algorithm** | **Logging Implemented** |
|-------------------|---------------|------------------------|
| `fetchAutocomplete(q)` | Trie | ✓ Algorithm name, Time/Space complexity, Execution time |
| `getMovies()` | Merge Sort + Greedy | ✓ Both algorithms logged |
| `searchByName()` | Binary Search + optional Knapsack + optional BFS | ✓ Conditional logging based on results |
| `loadFeatured()` | Merge Sort | ✓ Algorithm name, Time/Space complexity, Execution time |
| `addToWatchlist()` | Hashing | ✓ Algorithm name, Time/Space complexity, Execution time |
| `updateWatchlistUI()` | Hashing (rendering) | ✓ Algorithm name, Time/Space complexity, Execution time |

**How to view logs:**
1. Open browser DevTools (F12 → Console)
2. Perform any of the above actions (search, recommend, add to watchlist, autocomplete)
3. Console will print:
   ```
   Algorithm Used: <Name>
   Time Complexity: O(...)
   Space Complexity: O(...)
   Execution Time: <ms>
   ```

---

## Data Structures Used

| **Data Structure** | **Location** | **Purpose** | **Complexity** |
|--------------------|------------|------------|---|
| **Trie (TrieNode)** | app.py:10-39 | Prefix-based autocomplete | Insert: O(L), Query: O(m) |
| **Hash Map / Object** | app.py & script.js | User state, ratings, feedback, descriptions | Insert/Lookup: O(1) |
| **Adjacency List** | app.py:713 | Movie similarity graph for BFS | Build: O(n²), Query: O(V+E) |
| **2D DP Table** | app.py:760 | Knapsack computation (watch-time) | O(n × W) space and time |
| **Array / List** | Throughout | Movies, results, favorites, watchlist | Random Access: O(1), Iteration: O(n) |
| **Set** | app.py & JS | Deduplication (visited nodes in BFS) | Insert/Lookup: O(1) average |
| **String (JSON)** | script.js | localStorage persistence | Serialization: O(n) |
| **DOM Tree** | script.js | HTML element hierarchy | Traversal: O(n) |

---

## Conclusion

The CinemaVerse application employs a **diverse and well-suited combination of algorithms and data structures** for its use case:

- **Trie** enables fast prefix-based autocomplete.
- **BFS** finds similar movies within a graph of genre/language relationships.
- **0/1 Knapsack DP** optimizes watch-time recommendations.
- **Greedy selection** quickly filters movies by rating/genre.
- **Hash maps** provide instant user state lookups.
- **Sorting** (implicit Timsort) ranks results by quality.

**No unnecessary or overly complex algorithms were employed.** Each algorithm is justified by the problem domain and performance requirements, making the codebase both **efficient and maintainable** from an academic perspective.

---

## References & Notation

- **n** = number of movies
- **m** = length of prefix (autocomplete)
- **L** = average title length
- **V** = number of vertices (movies) in graph
- **E** = number of edges in similarity graph
- **W** = time capacity in minutes (knapsack)
- **O(...)** = Big-O time complexity notation
- **Θ(...)** = Theta (tight bound) notation

---

**Document Version:** 1.0  
**Date:** January 3, 2026  
**Project:** CinemaVerse - DAA Project  
**Course:** Design and Analysis of Algorithms (DAA)

