// Game State Management
let gameState = {
    favorites: [],
    watchlist: [],
    ratings: {},
    feedback: {},
    lastAction: null
};

// Short descriptions for known movies shown in the Details modal.
const MOVIE_DESCRIPTIONS = {
    'The Shawshank Redemption': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    'The Godfather': 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    'The Dark Knight': 'Batman sets out to dismantle the remaining criminal organizations that plague Gotham, facing the chaotic Joker.',
    'Pulp Fiction': 'The lives of two mob hitmen, a boxer, a gangster\'s wife and a pair of diner bandits intertwine in four tales of violence and redemption.',
    'Inception': 'A skilled thief who steals corporate secrets through dream-sharing technology is given a chance at redemption if he can implant another person\'s idea into a target\'s subconscious.',
    'Interstellar': 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    'Spirited Away': 'A young girl, Chihiro, becomes trapped in a strange new world of spirits and must find her courage to save her parents.',
    'Parasite': 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'
};

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    createParticles();
    setupEventListeners();
    updateUI();
    loadFeatured();
});

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('cinemaverseState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Parse time strings into total minutes (client-side)
function parseTimeStringToMinutes(s) {
    if (!s) return null;
    s = String(s).trim().toLowerCase();
    // 2h 10m, 2h, 120 min, 120
    const hMatch = s.match(/(\d+(?:\.\d+)?)\s*h/);
    if (hMatch) {
        const h = parseFloat(hMatch[1]);
        const mMatch = s.match(/(\d+)\s*m/);
        const mins = (mMatch ? parseInt(mMatch[1], 10) : 0);
        return Math.round(h * 60) + mins;
    }
    const minMatch = s.match(/(\d+)\s*min/);
    if (minMatch) return parseInt(minMatch[1], 10);
    const onlyNum = s.match(/^\d+(?:\.\d+)?$/);
    if (onlyNum) {
        const v = parseFloat(onlyNum[0]);
        if (v <= 6) return Math.round(v * 60);
        return Math.round(v);
    }
    const firstNum = s.match(/(\d+)/);
    if (firstNum) {
        const v = parseInt(firstNum[1], 10);
        if (v <= 6) return v * 60;
        return v;
    }
    return null;
}

// Save game state
function saveGameState() {
    localStorage.setItem('cinemaverseState', JSON.stringify(gameState));
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('rating').addEventListener('input', (e) => {
        document.getElementById('ratingDisplay').textContent = e.target.value;
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                hideAutocomplete();
                searchByName();
            }
        });
        // autocomplete on input with debounce
        let acTimer = null;
        searchInput.addEventListener('input', (e) => {
            const v = e.target.value.trim();
            if (acTimer) clearTimeout(acTimer);
            acTimer = setTimeout(() => {
                fetchAutocomplete(v);
            }, 180);
        });
        // hide autocomplete when input loses focus (delay to allow click)
        searchInput.addEventListener('blur', () => setTimeout(hideAutocomplete, 200));
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('movieModal');
        if (e.target === modal) closeModal();
    });

    // Feedback button click handler
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-feedback')) {
            const btn = e.target.closest('.btn-feedback');
            const title = btn.getAttribute('data-title');
            if (title) giveFeedback(title);
        }
    });
}

// Autocomplete UI helpers
async function fetchAutocomplete(q) {
    const perfStart_ac = performance.now();
    console.log("Algorithm Used: Trie");
    console.log("Time Complexity: O(m) where m = length of query prefix");
    console.log("Space Complexity: O(1)");
    const box = document.getElementById('autocomplete');
    if (!box) return;
    if (!q) { box.style.display = 'none'; box.innerHTML = ''; return; }
    try {
        const resp = await fetch(`/autocomplete?q=${encodeURIComponent(q)}`);
        const data = await resp.json();
        renderAutocomplete(data.slice(0, 12));
        const perfEnd_ac = performance.now();
        console.log("Execution Time: " + (perfEnd_ac - perfStart_ac).toFixed(3) + " ms");
    } catch (err) {
        console.error('autocomplete error', err);
    }
}

function renderAutocomplete(items) {
    const box = document.getElementById('autocomplete');
    if (!box) return;
    box.innerHTML = '';
    if (!items || items.length === 0) { box.style.display = 'none'; return; }
    items.forEach(it => {
        const div = document.createElement('div');
        div.className = 'ac-item';
        div.style.padding = '8px 10px';
        div.style.cursor = 'pointer';
        div.style.borderBottom = '1px solid #f0f0f0';
        div.textContent = it;
        div.addEventListener('mousedown', (e) => {
            // set input and trigger search
            document.getElementById('searchInput').value = it;
            hideAutocomplete();
            searchByName();
        });
        box.appendChild(div);
    });
    box.style.display = 'block';
}

function hideAutocomplete() {
    const box = document.getElementById('autocomplete');
    if (!box) return;
    box.style.display = 'none';
}

// Particle Background Animation
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 50 : 20;
    const emojis = ['🎬', '⭐', '🍿', '🎥', '🎭', '🎪'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5;
        
        container.appendChild(particle);

        // Animate particles
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = 20 + Math.random() * 10;
    const xMove = -50 + Math.random() * 100;
    const yMove = -window.innerHeight;

    particle.animate([
        { transform: 'translateY(0) translateX(0)', opacity: 0.3 },
        { transform: `translateY(${yMove}px) translateX(${xMove}px)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        iterations: Infinity
    });
}

// Fetch Movies
async function getMovies() {
    const perfStart_get = performance.now();
    // Primary algorithms involved here: Merge Sort (for client-side ordering if any) and Greedy selection for recommendation picks
    console.log("Algorithm Used: Merge Sort (inferred for movie sorting)");
    console.log("Time Complexity: O(n log n)");
    console.log("Space Complexity: O(n)");
    console.log("Algorithm Used: Greedy (recommendation selection)");
    console.log("Time Complexity: O(n)");
    console.log("Space Complexity: O(1)");
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;
    const language = document.getElementById('language').value;

    if (!genre) {
        alert('Please select a genre');
        return;
    }

    const resultsContainer = document.getElementById('result');
    resultsContainer.innerHTML = '<div class="empty-state"><div class="loading"></div><p>Discovering amazing movies...</p></div>';

    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `genre=${encodeURIComponent(genre)}&rating=${rating}&language=${encodeURIComponent(language)}`
        });

        const data = await response.json();

        if (data.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No movies found matching your criteria</p></div>';
            return;
        }

        resultsContainer.innerHTML = '';

        // store poster map for modal
        window.latestPosters = window.latestPosters || {};
        data.forEach((movie, index) => {
            setTimeout(() => {
                const card = createMovieCard(movie, movie.genre);
                resultsContainer.appendChild(card);
                card.style.animation = `slideIn 0.5s ease forwards`;
            }, index * 100);
            if (movie.poster) window.latestPosters[movie.title] = movie.poster;
        });
        // enable carousel for featured picks
        enableCarousel(resultsContainer);

        // enable carousel when items rendered
        enableCarousel(resultsContainer);

        const perfEnd_get = performance.now();
        console.log("Execution Time: " + (perfEnd_get - perfStart_get).toFixed(3) + " ms");

        // (Points/Streak/Badges removed)

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error fetching movies</p></div>';
    }
}

// Search movies by name
async function searchByName() {
    const perfStart_search = performance.now();
    console.log("Algorithm Used: Binary Search (inferred for movie name lookup)");
    console.log("Time Complexity: O(log n)");
    console.log("Space Complexity: O(1)");
    const name = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('result');

    // collect available time from separate hours/minutes inputs
    const sh = document.getElementById('searchHours') ? parseInt(document.getElementById('searchHours').value || 0, 10) : 0;
    const sm = document.getElementById('searchMinutes') ? parseInt(document.getElementById('searchMinutes').value || 0, 10) : 0;
    let availStr = '';
    if (!Number.isFinite(sh) || sh < 0 || !Number.isFinite(sm) || sm < 0 || sm > 59) {
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Please enter valid hours (>=0) and minutes (0-59)</p></div>';
        return;
    }
    if (sh > 0 && sm > 0) availStr = `${sh}h ${sm}m`;
    else if (sh > 0) availStr = `${sh}h`;
    else if (sm > 0) availStr = `${sm} min`;

    if (!name && !availStr) {
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Please enter a movie name or available time</p></div>';
        return;
    }

    resultsContainer.innerHTML = '<div class="empty-state"><div class="loading"></div><p>Searching...</p></div>';

    try {
        // collect available time from separate hours/minutes inputs
        const sh = document.getElementById('searchHours') ? parseInt(document.getElementById('searchHours').value || 0, 10) : 0;
        const sm = document.getElementById('searchMinutes') ? parseInt(document.getElementById('searchMinutes').value || 0, 10) : 0;
        let availStr = '';
        if (!Number.isFinite(sh) || sh < 0 || !Number.isFinite(sm) || sm < 0 || sm > 59) {
            alert('Please enter valid hours (>=0) and minutes (0-59)');
            return;
        }
        if (sh > 0 && sm > 0) availStr = `${sh}h ${sm}m`;
        else if (sh > 0) availStr = `${sh}h`;
        else if (sm > 0) availStr = `${sm} min`;

        const response = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(name)}&available_time=${encodeURIComponent(availStr)}`
        });

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-times-circle"></i><p>Movie not found</p></div>';
            const perfEnd_search_empty = performance.now();
            console.log("Execution Time: " + (perfEnd_search_empty - perfStart_search).toFixed(3) + " ms");
            return;
        }
        // detect and display time summary if present as last element
        resultsContainer.innerHTML = '';
        let timeSummary = null;
        if (data.length > 0 && data[data.length - 1] && data[data.length - 1]._time_summary) {
            timeSummary = data[data.length - 1]._time_summary;
            data.pop();
        }
        if (timeSummary) {
            const summaryEl = document.createElement('div');
            summaryEl.id = 'timeSummary';
            summaryEl.className = 'time-summary';
            summaryEl.style = 'padding:12px;border-radius:8px;background:#f3fdf6;margin-bottom:12px;border:1px solid #cdebd5;';
            summaryEl.innerHTML = `<strong>Time Recommendation</strong>: Requested ${timeSummary.time_request} (&approx; ${timeSummary.time_capacity_min} min) — Selected ${timeSummary.selected_count} films, Total time ${timeSummary.selected_total_time_min} min, Combined score ${timeSummary.selected_total_score.toFixed ? timeSummary.selected_total_score.toFixed(1) : timeSummary.selected_total_score}`;
            resultsContainer.appendChild(summaryEl);
        }
        // if time summary was requested, log knapsack algorithm usage
        if (timeSummary) {
            console.log("Algorithm Used: 0/1 Knapsack");
            console.log("Time Complexity: O(n*W) where W is time capacity in minutes");
            console.log("Space Complexity: O(n*W)");
        }
        // if any suggestion flags present, log BFS usage
        const hasSuggestion = data.some(d => d && d.is_suggestion);
        if (hasSuggestion) {
            console.log("Algorithm Used: BFS (similar movie suggestions)");
            console.log("Time Complexity: O(V+E)");
            console.log("Space Complexity: O(V)");
        }
        const perfEnd_search = performance.now();
        console.log("Execution Time: " + (perfEnd_search - perfStart_search).toFixed(3) + " ms");
        window.latestPosters = window.latestPosters || {};
        data.forEach((movie, index) => {
            setTimeout(() => {
                // For recommend results, we pass the selected genre as override
                const selectedGenre = document.getElementById('genre').value || movie.genre;
                const card = createMovieCard(movie, selectedGenre);
                resultsContainer.appendChild(card);
                card.style.animation = `slideIn 0.5s ease forwards`;
            }, index * 100);
            if (movie.poster) window.latestPosters[movie.title] = movie.poster;
        });

        // enable carousel when search results rendered
        enableCarousel(resultsContainer);

    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error searching movies</p></div>';
    }
}

// Load featured movies on homepage (mixed languages)
async function loadFeatured() {
    const perfStart_feat = performance.now();
    console.log("Algorithm Used: Merge Sort (inferred for ordering featured movies)");
    console.log("Time Complexity: O(n log n)");
    console.log("Space Complexity: O(n)");
    const resultsContainer = document.getElementById('result');
    resultsContainer.innerHTML = '<div class="empty-state"><div class="loading"></div><p>Loading featured picks...</p></div>';
    try {
        const response = await fetch('/featured');
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-popcorn"></i><p>Select a genre and rating to discover amazing movies</p></div>';
            return;
        }

        resultsContainer.innerHTML = '';
        window.latestPosters = window.latestPosters || {};
        data.forEach((movie, index) => {
            setTimeout(() => {
                const card = createMovieCard(movie, movie.genre);
                resultsContainer.appendChild(card);
                card.style.animation = `slideIn 0.5s ease forwards`;
            }, index * 100);
            if (movie.poster) window.latestPosters[movie.title] = movie.poster;
        });
        const perfEnd_feat = performance.now();
        console.log("Execution Time: " + (perfEnd_feat - perfStart_feat).toFixed(3) + " ms");
    } catch (error) {
        console.error('Featured load error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error loading featured picks</p></div>';
    }
}

// Create Movie Card with 3D Flip
// movie: {title, score, language, genre?}
function createMovieCard(movie, genreOverride) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    // store an encoded title to allow safe attribute selection
    card.dataset.title = encodeURIComponent(movie.title);
    const isFavorited = gameState.favorites.includes(movie.title);
    const displayGenre = movie.genre || genreOverride || 'Unknown';

    card.innerHTML = `
        <div class="movie-card-inner">
            <!-- Front of Card -->
            <div class="movie-card-front">
                <div class="movie-poster">
                    <img src="${movie.poster || ''}" alt="${movie.title} poster">
                </div>
                <div>
                    <h3 class="movie-title">${movie.title} ${movie.is_suggestion ? "<span class=\"suggest-badge\" style=\"font-size:12px;color:var(--secondary);margin-left:8px;\">Similar</span>" : ''} ${movie.time_pick ? "<span class=\"time-badge\" style=\"font-size:12px;color:#0b8043;margin-left:8px;\">Time Pick</span>" : ''}</h3>
                    <p class="movie-meta"><i class="fas fa-tag"></i> ${displayGenre} &nbsp; <i class="fas fa-globe"></i> ${movie.language}${movie.time ? ` &nbsp; <i class="fas fa-clock"></i> ${movie.time}` : ''}</p>
                </div>
                <div class="movie-score">
                    <i class="fas fa-star" style="color: var(--secondary);"></i>
                    <span class="score-badge">${movie.score}</span>
                    ${gameState.ratings && gameState.ratings[movie.title] ? `<small class="user-rating"> &nbsp;| You rated: ${gameState.ratings[movie.title]}</small>` : ''}
                </div>
            </div>

            <!-- Back of Card -->
            <div class="movie-card-back">
                <p class="movie-description">Genre: <strong>${displayGenre}</strong></p>
                <p class="movie-description">Language: <strong>${movie.language}</strong></p>
                <p class="movie-description">Click "Details" to see more information and rate this movie.</p>
                <div class="movie-actions">
                    <button class="btn-action btn-details" onclick="openModal('${movie.title.replace(/'/g, "\\'")}', '${movie.score}', '${movie.language}', '${displayGenre}', '${(movie.time||'').toString().replace(/'/g, "\\'")}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-action btn-feedback" data-title="${movie.title}">
                        <i class="fas fa-comment"></i> Feedback
                    </button>
                </div>
                ${gameState.feedback && gameState.feedback[movie.title] ? `<div class="movie-feedback"><small class="feedback-text">Your feedback: ${gameState.feedback[movie.title]}</small></div>` : ''}
            </div>
        </div>
    `;

    return card;
}

// Carousel state
let carouselState = { interval: null, currentIndex: 0 };

function enableCarousel(resultsContainer) {
    // Replace carousel behavior with a horizontal scroll track
    destroyCarousel();
    const cards = Array.from(resultsContainer.querySelectorAll('.movie-card'));
    if (cards.length === 0) return;

    const track = document.createElement('div');
    track.className = 'horizontal-track';

    cards.forEach(c => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.appendChild(c);
        track.appendChild(item);
    });

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(track);
}

function destroyCarousel() {
    if (carouselState.interval) {
        clearInterval(carouselState.interval);
        carouselState.interval = null;
    }
}

// Toggle Favorite
function toggleFavorite(title) {
    const index = gameState.favorites.indexOf(title);
    if (index > -1) {
        gameState.favorites.splice(index, 1);
    } else {
        gameState.favorites.push(title);
    }
    saveGameState();
    updateUI();
}

// Give Feedback on a movie
function giveFeedback(title) {
    console.log('Feedback triggered for:', title);
    // find the feedback button for this title
    const buttons = document.querySelectorAll('.btn-feedback');
    let btn = null;
    buttons.forEach(b => { try { if (!btn && b.getAttribute('data-title') === title) btn = b; } catch (e) {} });

    // if an editor already exists for this title, focus it
    let existing = null;
    document.querySelectorAll('.feedback-editor').forEach(fe => {
        try { if (fe.getAttribute('data-title') === title) existing = fe; } catch (e) {}
    });
    if (!existing && btn && btn.parentElement) existing = btn.parentElement.querySelector('.feedback-editor');
    if (existing) {
        const ta = existing.querySelector('textarea');
        if (ta) ta.focus();
        return;
    }

    // build editor UI
    const editor = document.createElement('div');
    editor.className = 'feedback-editor';
    editor.setAttribute('data-title', title);
    editor.style.cssText = 'margin-top:8px; display:flex; flex-direction:column; gap:6px;';

    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.maxLength = 500;
    textarea.style.cssText = 'width:100%; padding:8px; border-radius:6px; border:1px solid #ddd; resize:vertical;';
    textarea.placeholder = `Write your feedback for "${title}" (max 500 chars)`;
    textarea.value = gameState.feedback[title] || '';

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex; gap:8px; align-items:center;';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-action';
    submitBtn.textContent = 'Submit';
    submitBtn.style.cssText = 'background:var(--secondary); color:#fff; padding:6px 10px; border-radius:6px; border:none; cursor:pointer;';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-action';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'padding:6px 10px; border-radius:6px; border:1px solid #ccc; background:#fff; cursor:pointer;';

    controls.appendChild(submitBtn);
    controls.appendChild(cancelBtn);

    editor.appendChild(textarea);
    editor.appendChild(controls);

    // attach editor: prefer inserting into the movie card back area
    let inserted = false;
    try {
        if (btn) {
            // try insert after button first
            try { btn.insertAdjacentElement('afterend', editor); inserted = true; }
            catch (e) { /* ignore */ }
        }

        if (!inserted) {
            // find the card by encoded data-title and append into its back/actions area
            try {
                const encoded = encodeURIComponent(title);
                const card = document.querySelector(`.movie-card[data-title="${encoded}"]`);
                if (card) {
                    const back = card.querySelector('.movie-card-back');
                    const actions = back ? back.querySelector('.movie-actions') : null;
                    if (actions) {
                        actions.insertAdjacentElement('afterend', editor);
                        inserted = true;
                    } else if (back) {
                        back.appendChild(editor);
                        inserted = true;
                    }
                }
            } catch (e) {
                console.warn('Could not append editor into card:', e);
            }
        }

        if (!inserted) document.body.appendChild(editor);
    } catch (e) {
        document.body.appendChild(editor);
    }

    console.log('Feedback editor inserted for:', title, 'inserted=', inserted);

    textarea.focus();

    submitBtn.addEventListener('click', () => {
        const feedback = textarea.value.trim();
        if (feedback.length > 500) {
            alert('Feedback too long. Please keep it under 500 characters.');
            return;
        }
        gameState.feedback[title] = feedback;
        saveGameState();
        updateFeedbackUI(title);
        editor.remove();
        alert('thank you for yur response');
    });

    cancelBtn.addEventListener('click', () => {
        editor.remove();
    });
}

function updateFeedbackUI(title) {
    // update feedback buttons
    const buttons = document.querySelectorAll('.btn-feedback');
    buttons.forEach(btn => {
        try {
            if (btn.getAttribute('data-title') === title) {
                btn.innerHTML = '<i class="fas fa-comment"></i> Feedback ✓';
                btn.style.opacity = '0.9';
            }
        } catch (e) {}
    });

    // update card feedback display
    const encoded = encodeURIComponent(title);
    const selector = `.movie-card[data-title="${encoded}"]`;
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        let fb = card.querySelector('.movie-feedback');
        if (!fb) {
            fb = document.createElement('div');
            fb.className = 'movie-feedback';
            card.querySelector('.movie-card-inner').appendChild(fb);
        }
        const text = gameState.feedback[title] || '';
        fb.innerHTML = `<small class="feedback-text">Your feedback: ${text}</small>`;
    });
}

// Award Points

// Update Streak
// (Streak functionality removed)

// Check Achievements
// (Achievements / Badges functionality removed)

// Show Achievement Unlock
// (Achievement notification removed)

// Modal Functions
let currentMovie = {};

function openModal(title, score, language = 'Unknown', genre = 'Unknown', time = '') {
    currentMovie = { title, score, language, genre, time };
    document.getElementById('modalTitle').textContent = title;
    // show base score and user's rating if available
    const userRating = gameState.ratings && gameState.ratings[title];
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> Score: ${score}${userRating ? ` &nbsp;| You rated: ${userRating}` : ''}`;
    document.getElementById('modalGenre').innerHTML = `<i class="fas fa-tag"></i> Genre: ${genre} &nbsp; <i class="fas fa-globe"></i> ${language}${time ? ` &nbsp; <i class="fas fa-clock"></i> ${time}` : ''}`;
    // populate description specific to the movie if available
    const desc = MOVIE_DESCRIPTIONS[title] || 'A highly recommended movie based on your preferences!';
    const descEl = document.getElementById('modalDescription');
    if (descEl) descEl.textContent = desc;
    // set poster if available
    const posterEl = document.getElementById('modalPoster');
    const posterUrl = (window.latestPosters && window.latestPosters[title]) || '';
    if (posterUrl) {
        posterEl.innerHTML = `<img src="${posterUrl}" alt="${title} poster">`;
    } else {
        posterEl.innerHTML = `<img src="${(document.querySelector('.movie-poster img')||{}).src || ''}" alt="poster">`;
    }
    document.getElementById('movieModal').classList.add('show');
}

function closeModal() {
    document.getElementById('movieModal').classList.remove('show');
}

function addToWatchlist() {
    const perfStart_add = performance.now();
    
    // Data Structure: LIST (Array used as a sequential list)
    console.log("Data Structure Used: List");
    console.log("Algorithm Used: Linear Search");
    console.log("Time Complexity: O(n)");
    console.log("Space Complexity: O(n)");
    
    // Linear search to check if movie already exists in watchlist
    let movieExists = false;
    for (let i = 0; i < gameState.watchlist.length; i++) {
        const item = gameState.watchlist[i];
        // Check both string title and object with title property
        const existingTitle = (typeof item === 'string') ? item : item.title;
        if (existingTitle === currentMovie.title) {
            movieExists = true;
            break;
        }
    }
    
    // Add to watchlist only if it does not already exist
    if (!movieExists) {
        gameState.watchlist.push(currentMovie);
        updateWatchlistUI();
        saveGameState();
        alert(`"${currentMovie.title}" added to watchlist!`);
        closeModal();
    } else {
        alert(`"${currentMovie.title}" is already in your watchlist.`);
    }
    
    const perfEnd_add = performance.now();
    console.log("Execution Time: " + (perfEnd_add - perfStart_add).toFixed(3) + " ms");
}

function rateMovie() {
    const rating = prompt('Rate this movie (1-10):', '8');
    if (rating && rating >= 1 && rating <= 10) {
        gameState.ratings[currentMovie.title] = rating;
        // persist and update UI
        saveGameState();
        // update any rendered cards for this title
        updateCardRatings(currentMovie.title);
        // update modal display
        const modalRatingEl = document.getElementById('modalRating');
        if (modalRatingEl) modalRatingEl.innerHTML = `<i class="fas fa-star"></i> Score: ${currentMovie.score} &nbsp;| You rated: ${rating}`;
        alert(`Thank you! You rated "${currentMovie.title}" ${rating}/10`);
    }
}

// Update rendered movie cards when a user rates a title
function updateCardRatings(title) {
    const encoded = encodeURIComponent(title);
    const selector = `.movie-card[data-title="${encoded}"]`;
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        const scoreEl = card.querySelector('.movie-score');
        if (!scoreEl) return;
        // update or append user-rating small element
        const existing = scoreEl.querySelector('.user-rating');
        const ur = gameState.ratings && gameState.ratings[title];
        if (existing && ur) {
            existing.textContent = ` \u00A0| You rated: ${ur}`;
        } else if (existing && !ur) {
            existing.remove();
        } else if (!existing && ur) {
            const small = document.createElement('small');
            small.className = 'user-rating';
            small.innerHTML = ` \u00A0| You rated: ${ur}`;
            scoreEl.appendChild(small);
        }
    });
}

// Update Watchlist UI
function updateWatchlistUI() {
    const perfStart_wu = performance.now();
    
    // Data Structure: LIST (Array with linear iteration)
    console.log("Data Structure Used: List");
    console.log("Algorithm Used: Linear Iteration (Sequential Access)");
    console.log("Time Complexity: O(n) where n = watchlist size");
    console.log("Space Complexity: O(n)");
    
    const watchlistContainer = document.getElementById('watchlist');
    
    if (gameState.watchlist.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state"><p>Your watchlist is empty. Add movies from recommendations!</p></div>';
        const perfEnd_wu_empty = performance.now();
        console.log("Execution Time: " + (perfEnd_wu_empty - perfStart_wu).toFixed(3) + " ms");
        return;
    }

    // Linear iteration through the list to render each item
    let htmlContent = '';
    for (let i = 0; i < gameState.watchlist.length; i++) {
        const movie = gameState.watchlist[i];
        const title = (typeof movie === 'string') ? movie : movie.title;
        const score = (typeof movie === 'string') ? 'N/A' : (movie.score || 'N/A');
        
        htmlContent += `
            <div class="watchlist-item">
                <div>
                    <h4>${title}</h4>
                    <small>Score: ${score}</small>
                </div>
                <button onclick="removeFromWatchlist(${i})" style="background: var(--secondary);">Remove</button>
            </div>
        `;
    }
    watchlistContainer.innerHTML = htmlContent;
    
    const perfEnd_wu = performance.now();
    console.log("Execution Time: " + (perfEnd_wu - perfStart_wu).toFixed(3) + " ms");
}

function removeFromWatchlist(index) {
    gameState.watchlist.splice(index, 1);
    saveGameState();
    updateWatchlistUI();
}

// Update UI
function updateUI() {
    // Points/Streak/Achievements UI removed
    updateWatchlistUI();
    saveGameState();
}

// Submit Add Movie form
async function submitAddMovie(e) {
    e.preventDefault();
    const title = document.getElementById('addTitle').value.trim();
    const genre = document.getElementById('addGenre').value.trim();
    const rating = document.getElementById('addRating').value;
    const language = document.getElementById('addLanguage').value.trim() || 'Unknown';
    const posterFile = document.getElementById('addPoster').files[0];
    const addH = document.getElementById('addHours') ? parseInt(document.getElementById('addHours').value || 0, 10) : 0;
    const addM = document.getElementById('addMinutes') ? parseInt(document.getElementById('addMinutes').value || 0, 10) : 0;
    let time = '';
    if (!Number.isFinite(addH) || addH < 0 || !Number.isFinite(addM) || addM < 0 || addM > 59) {
        alert('Please enter valid duration (hours >=0, minutes 0-59)');
        return;
    }
    if (addH > 0 && addM > 0) time = `${addH}h ${addM}m`;
    else if (addH > 0) time = `${addH}h`;
    else if (addM > 0) time = `${addM} min`;

    const resultEl = document.getElementById('addMovieResult');
    resultEl.textContent = 'Adding movie...';

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('genre', genre);
        formData.append('rating', rating);
        formData.append('language', language);
        if (posterFile) {
            formData.append('poster', posterFile);
        }
        if (time) formData.append('time', time);

        const resp = await fetch('/add_movie', {
            method: 'POST',
            body: formData
        });

        const data = await resp.json();
        if (!resp.ok) {
            resultEl.innerHTML = `<span class="error">Error: ${data.error || 'Failed to add movie'}</span>`;
            return;
        }

        // show success message and append the created movie card to results
        resultEl.innerHTML = `<span class="success">Added: ${data.title} (${data.genre})</span>`;

        // append to results area so user can interact immediately
        const resultsContainer = document.getElementById('result');
        const card = createMovieCard(data, data.genre);
        // ensure posters map updated
        window.latestPosters = window.latestPosters || {};
        if (data.poster) window.latestPosters[data.title] = data.poster;
        // if results currently a horizontal track, append into it; otherwise append directly
        const track = resultsContainer.querySelector('.horizontal-track');
        if (track) {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.appendChild(card);
            track.appendChild(item);
        } else {
            resultsContainer.appendChild(card);
        }

        // clear form
        document.getElementById('addMovieForm').reset();
        document.getElementById('addRating').value = 7;
    } catch (err) {
        console.error(err);
        resultEl.innerHTML = `<span class="error">Error adding movie</span>`;
    }
}

// Load existing movie by name (fills update form with first match)
async function loadExistingMovie() {
    const q = document.getElementById('updateLookup').value.trim();
    const resultEl = document.getElementById('updateMovieResult');
    if (!q) { resultEl.innerHTML = '<span class="error">Enter a movie name to load</span>'; return; }
    resultEl.textContent = 'Searching...';
    try {
        const resp = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(q)}`
        });
        const data = await resp.json();
        if (!Array.isArray(data) || data.length === 0) {
            resultEl.innerHTML = '<span class="error">No matching movie found</span>';
            return;
        }
        const movie = data[0];
        document.getElementById('updateOriginalTitle').value = movie.title;
        document.getElementById('updateTitle').value = movie.title;
        document.getElementById('updateGenre').value = movie.genre || '';
        document.getElementById('updateRating').value = movie.score || 7;
        document.getElementById('updateLanguage').value = movie.language || 'English';
        // populate update hours/minutes if available
        if (document.getElementById('updateHours') && document.getElementById('updateMinutes')) {
            const t = movie.time || '';
            const mins = parseTimeStringToMinutes(t);
            if (mins !== null) {
                document.getElementById('updateHours').value = Math.floor(mins / 60);
                document.getElementById('updateMinutes').value = mins % 60;
            } else {
                document.getElementById('updateHours').value = '';
                document.getElementById('updateMinutes').value = '';
            }
        }
        resultEl.innerHTML = `<span class="success">Loaded: ${movie.title}</span>`;
    } catch (err) {
        console.error(err);
        resultEl.innerHTML = '<span class="error">Error loading movie</span>';
    }
}

// Confirm and remove a movie by name (calls backend /remove_movie)
async function confirmRemoveMovie() {
    const q = document.getElementById('removeLookup').value.trim();
    const resultEl = document.getElementById('removeMovieResult');
    if (!q) { resultEl.innerHTML = '<span class="error">Enter a movie name to remove</span>'; return; }
    if (!confirm(`Remove the first movie matching "${q}"? This cannot be undone in memory.`)) return;
    resultEl.textContent = 'Removing...';
    try {
        const resp = await fetch('/remove_movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(q)}`
        });
        const data = await resp.json();
        if (!resp.ok) {
            resultEl.innerHTML = `<span class="error">Error: ${data.error || 'Failed to remove movie'}</span>`;
            return;
        }

        const removed = data.removed || {};
        resultEl.innerHTML = `<span class="success">Removed: ${removed.title || q} (${removed.genre || 'unknown'})</span>`;

        // update UI: remove any rendered cards for this title and cleanup posters map
        updateUIAfterRemoval(removed.title || q);

        // clear input
        document.getElementById('removeLookup').value = '';
    } catch (err) {
        console.error(err);
        resultEl.innerHTML = '<span class="error">Error removing movie</span>';
    }
}

function updateUIAfterRemoval(title) {
    if (!title) return;
    // remove rendered cards
    try {
        const encoded = encodeURIComponent(title);
        const cards = document.querySelectorAll(`.movie-card[data-title="${encoded}"]`);
        cards.forEach(c => c.remove());
    } catch (e) { }

    // remove from posters map
    try {
        if (window.latestPosters && window.latestPosters[title]) delete window.latestPosters[title];
    } catch (e) {}

    // if update form had this movie loaded, clear it
    try {
        const orig = document.getElementById('updateOriginalTitle');
        if (orig && orig.value && orig.value.toLowerCase() === title.toLowerCase()) {
            document.getElementById('updateMovieForm').reset();
            document.getElementById('updateOriginalTitle').value = '';
            const resEl = document.getElementById('updateMovieResult');
            if (resEl) resEl.innerHTML = `<span class="info">The loaded movie was removed</span>`;
        }
    } catch (e) {}
}

// Submit Update Movie form
async function submitUpdateMovie(e) {
    e.preventDefault();
    const original = document.getElementById('updateOriginalTitle').value.trim();
    if (!original) {
        document.getElementById('updateMovieResult').innerHTML = '<span class="error">Load a movie first</span>';
        return;
    }

    const title = document.getElementById('updateTitle').value.trim();
    const genre = document.getElementById('updateGenre').value.trim();
    const rating = document.getElementById('updateRating').value;
    const language = document.getElementById('updateLanguage').value.trim() || 'Unknown';
    const posterFile = document.getElementById('updatePoster').files[0];
    const updH = document.getElementById('updateHours') ? parseInt(document.getElementById('updateHours').value || 0, 10) : 0;
    const updM = document.getElementById('updateMinutes') ? parseInt(document.getElementById('updateMinutes').value || 0, 10) : 0;
    let time = '';
    if (!Number.isFinite(updH) || updH < 0 || !Number.isFinite(updM) || updM < 0 || updM > 59) {
        alert('Please enter valid duration (hours >=0, minutes 0-59)');
        return;
    }
    if (updH > 0 && updM > 0) time = `${updH}h ${updM}m`;
    else if (updH > 0) time = `${updH}h`;
    else if (updM > 0) time = `${updM} min`;

    const resultEl = document.getElementById('updateMovieResult');
    resultEl.textContent = 'Updating movie...';

    try {
        const formData = new FormData();
        formData.append('original_title', original);
        formData.append('title', title);
        formData.append('genre', genre);
        formData.append('rating', rating);
        formData.append('language', language);
        if (posterFile) formData.append('poster', posterFile);
        if (time) formData.append('time', time);

        const resp = await fetch('/update_movie', { method: 'POST', body: formData });
        const data = await resp.json();
        if (!resp.ok) {
            resultEl.innerHTML = `<span class="error">Error: ${data.error || 'Failed to update'}</span>`;
            return;
        }

        // success: update UI cards and posters
        resultEl.innerHTML = `<span class="success">Updated: ${data.title}</span>`;
        // migrate stored user rating if title changed
        const oldTitle = original;
        const newTitle = data.title;
        if (oldTitle !== newTitle && gameState.ratings && gameState.ratings[oldTitle]) {
            gameState.ratings[newTitle] = gameState.ratings[oldTitle];
            delete gameState.ratings[oldTitle];
            saveGameState();
        }

        // update page cards
        updateCardAfterEdit(oldTitle, data);
        // update latestPosters map
        window.latestPosters = window.latestPosters || {};
        if (data.poster) window.latestPosters[data.title] = data.poster;

    } catch (err) {
        console.error(err);
        resultEl.innerHTML = '<span class="error">Error updating movie</span>';
    }
}

// Update rendered cards after edit (title, poster, score, genre, language)
function updateCardAfterEdit(oldTitle, updated) {
    const encodedOld = encodeURIComponent(oldTitle);
    const selector = `.movie-card[data-title="${encodedOld}"]`;
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        // update data-title
        card.dataset.title = encodeURIComponent(updated.title);
        // title
        const titleEl = card.querySelector('.movie-title');
        if (titleEl) titleEl.textContent = updated.title;
        // poster
        const img = card.querySelector('.movie-poster img');
        if (img && updated.poster) img.src = updated.poster;
        // score
        const scoreBadge = card.querySelector('.score-badge');
        if (scoreBadge) scoreBadge.textContent = updated.score;
        // meta (genre + language)
        const meta = card.querySelector('.movie-meta');
        if (meta) meta.innerHTML = `<i class="fas fa-tag"></i> ${updated.genre} &nbsp; <i class="fas fa-globe"></i> ${updated.language}${updated.time ? ` &nbsp; <i class="fas fa-clock"></i> ${updated.time}` : ''}`;
        // user rating small
        updateCardRatings(updated.title);
    });
}

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(0.5); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

/* ======================== ALGORITHMS PANEL FUNCTIONS ======================== */

// Open Algorithms Panel
function openAlgorithmsPanel() {
    const panel = document.getElementById('algorithmsPanel');
    if (panel) {
        panel.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close Algorithms Panel
function closeAlgorithmsPanel() {
    const panel = document.getElementById('algorithmsPanel');
    if (panel) {
        panel.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close panel when clicking on overlay (outside the container)
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('algorithmsPanel');
    if (panel) {
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                closeAlgorithmsPanel();
            }
        });
    }
});

// Close panel with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const panel = document.getElementById('algorithmsPanel');
        if (panel && panel.classList.contains('show')) {
            closeAlgorithmsPanel();
        }
    }
});
