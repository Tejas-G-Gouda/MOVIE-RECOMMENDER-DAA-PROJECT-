// Game State Management
let gameState = {
    favorites: [],
    watchlist: [],
    ratings: {},
    lastAction: null
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
                searchByName();
            }
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('movieModal');
        if (e.target === modal) closeModal();
    });
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

        // (Points/Streak/Badges removed)

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error fetching movies</p></div>';
    }
}

// Search movies by name
async function searchByName() {
    const name = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('result');

    if (!name) {
        resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Please enter a movie name</p></div>';
        return;
    }

    resultsContainer.innerHTML = '<div class="empty-state"><div class="loading"></div><p>Searching...</p></div>';

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(name)}`
        });

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-times-circle"></i><p>Movie not found</p></div>';
            return;
        }

        resultsContainer.innerHTML = '';
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
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-meta"><i class="fas fa-tag"></i> ${displayGenre} &nbsp; <i class="fas fa-globe"></i> ${movie.language}</p>
                </div>
                <div class="movie-score">
                    <i class="fas fa-star" style="color: var(--secondary);"></i>
                    <span class="score-badge">${movie.score}</span>
                </div>
            </div>

            <!-- Back of Card -->
            <div class="movie-card-back">
                <p class="movie-description">Genre: <strong>${displayGenre}</strong></p>
                <p class="movie-description">Language: <strong>${movie.language}</strong></p>
                <p class="movie-description">Click "Details" to see more information and rate this movie.</p>
                <div class="movie-actions">
                    <button class="btn-action btn-details" onclick="openModal('${movie.title}', '${movie.score}', '${movie.language}', '${displayGenre}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-action btn-fav ${isFavorited ? 'active' : ''}" onclick="toggleFavorite('${movie.title}')">
                        <i class="fas fa-heart"></i> ${isFavorited ? 'Favorited' : 'Favorite'}
                    </button>
                </div>
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

// Award Points

// Update Streak
// (Streak functionality removed)

// Check Achievements
// (Achievements / Badges functionality removed)

// Show Achievement Unlock
// (Achievement notification removed)

// Modal Functions
let currentMovie = {};

function openModal(title, score, language = 'Unknown', genre = 'Unknown') {
    currentMovie = { title, score, language, genre };
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> Score: ${score}`;
    document.getElementById('modalGenre').innerHTML = `<i class="fas fa-tag"></i> Genre: ${genre} &nbsp; <i class="fas fa-globe"></i> ${language}`;
    document.getElementById('modalDescription').textContent = 'A highly recommended movie based on your preferences!';
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
    if (!gameState.watchlist.includes(currentMovie.title)) {
        gameState.watchlist.push(currentMovie);
        updateWatchlistUI();
        saveGameState();
        closeModal();
    }
}

function rateMovie() {
    const rating = prompt('Rate this movie (1-10):', '8');
    if (rating && rating >= 1 && rating <= 10) {
        gameState.ratings[currentMovie.title] = rating;
        // Rating saved (points/achievements removed)
        saveGameState();
        alert(`Thank you! You rated "${currentMovie.title}" ${rating}/10`);
    }
}

// Update Watchlist UI
function updateWatchlistUI() {
    const watchlistContainer = document.getElementById('watchlist');
    
    if (gameState.watchlist.length === 0) {
        watchlistContainer.innerHTML = '<div class="empty-state"><p>Your watchlist is empty. Add movies from recommendations!</p></div>';
        return;
    }

    watchlistContainer.innerHTML = gameState.watchlist.map((movie, index) => `
        <div class="watchlist-item">
            <div>
                <h4>${movie.title || movie}</h4>
                <small>Score: ${movie.score || 'N/A'}</small>
            </div>
            <button onclick="removeFromWatchlist(${index})" style="background: var(--secondary);">Remove</button>
        </div>
    `).join('');
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
