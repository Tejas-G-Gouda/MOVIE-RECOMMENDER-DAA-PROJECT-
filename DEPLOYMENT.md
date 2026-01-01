# 🚀 CinemaVerse - Deployment & Customization Guide

## 📦 Deployment Options

### Option 1: Local Development
```bash
# Quick start
python app.py
# Opens at http://localhost:5000
```

### Option 2: Heroku Deployment

1. **Create `Procfile`:**
```
web: gunicorn app:app
```

2. **Create `requirements.txt`:**
```bash
pip freeze > requirements.txt
```

3. **Deploy:**
```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Option 3: Docker Containerization

1. **Create `Dockerfile`:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

2. **Create `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
```

3. **Run:**
```bash
docker-compose up
```

### Option 4: AWS Deployment

1. **Elastic Beanstalk:**
```bash
pip install awsebcli
eb init
eb create cinemaverse-env
eb deploy
```

2. **EC2:**
   - Launch Ubuntu instance
   - Install Python, Flask
   - Clone your repo
   - Run with Gunicorn/Nginx

---

## 🎨 Customization Guide

### 1. Add Custom Genres

**File:** `templates/index.html`

Find the genre select and add:
```html
<select id="genre">
    <option value="">Choose a genre...</option>
    <option value="Sci-Fi">🚀 Sci-Fi</option>
    <option value="Action">💥 Action</option>
    <option value="Sports">⚽ Sports</option>
    <!-- ADD HERE -->
    <option value="Thriller">🔪 Thriller</option>
    <option value="Fantasy">🧙 Fantasy</option>
    <option value="Animation">🎨 Animation</option>
</select>
```

### 2. Change Color Scheme

**File:** `static/style.css`

Edit the CSS variables:
```css
:root {
    --primary: #00d4ff;        /* Change cyan */
    --secondary: #ff006e;      /* Change magenta */
    --accent: #8000ff;         /* Change purple */
    --dark: #0a0e27;           /* Change dark bg */
    --darker: #050812;         /* Change darker bg */
}
```

**Example: Purple & Gold Theme:**
```css
:root {
    --primary: #b19cd9;        /* Light purple */
    --secondary: #ffd700;      /* Gold */
    --accent: #9370db;         /* Medium purple */
    --dark: #2d1b4e;           /* Dark purple */
    --darker: #1a0f2e;         /* Darker purple */
}
```

### 3. Adjust Point Values

**File:** `static/script.js`

Find these functions and modify:
```javascript
// Get recommendations
function getMovies() {
    // ... code ...
    awardPoints(50);  // CHANGE THIS NUMBER
}

// Favorite a movie
function toggleFavorite(title) {
    // ... code ...
    awardPoints(10);  // CHANGE THIS NUMBER
}

// Add to watchlist
function addToWatchlist() {
    // ... code ...
    awardPoints(15);  // CHANGE THIS NUMBER
}

// Rate a movie
function rateMovie() {
    // ... code ...
    awardPoints(20);  // CHANGE THIS NUMBER
}
```

### 4. Customize Achievement Requirements

**File:** `static/script.js`

Find the `checkAchievements` function:
```javascript
function checkAchievements(action) {
    const achievements = [
        { 
            id: 'cinephile', 
            condition: () => gameState.points >= 100,  // CHANGE THIS
            icon: '🎬', 
            name: 'Cinephile' 
        },
        { 
            id: 'lover', 
            condition: () => gameState.favorites.length >= 3,  // CHANGE THIS
            icon: '❤️', 
            name: 'Movie Lover' 
        },
        // ... more achievements ...
    ];
}
```

### 5. Add New Achievements

**In the same function:**
```javascript
const achievements = [
    // ... existing achievements ...
    {
        id: 'speedster',
        condition: () => gameState.points >= 500,
        icon: '⚡',
        name: 'Speed Runner'
    },
    {
        id: 'collector',
        condition: () => gameState.watchlist.length >= 10,
        icon: '📚',
        name: 'Collector'
    }
];
```

Also add badges in **`templates/index.html`**:
```html
<div class="achievement locked" title="Earn 500 points">
    <i class="fas fa-bolt"></i>
    <p>Speedster</p>
</div>
```

### 6. Change Logo & Branding

**File:** `templates/index.html`

```html
<h1 class="logo">
    <i class="fas fa-film"></i> CinemaVerse  <!-- CHANGE THIS -->
</h1>

<p class="tagline">Where Cinema Meets AI Magic</p>  <!-- CHANGE THIS -->
```

### 7. Add More Emojis to Particles

**File:** `static/script.js`

In the `createParticles` function:
```javascript
const emojis = [
    '🎬',   // Movie clapper
    '⭐',   // Star
    '🍿',   // Popcorn
    '🎥',   // Camera
    '🎭',   // Theater masks
    '🎪',   // Circus tent
    '🎞️',   // Film strip
    '🏆',   // Trophy
];
```

### 8. Customize Modal Content

**File:** `static/script.js`

In the `openModal` function:
```javascript
function openModal(title, score) {
    currentMovie = { title, score };
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> Score: ${score}`;
    document.getElementById('modalGenre').innerHTML = `<i class="fas fa-tag"></i> Recommended`;
    // CUSTOMIZE THESE LINES
    document.getElementById('modalDescription').textContent = 'A highly recommended movie based on your preferences!';
}
```

### 9. Adjust Grid Layout

**File:** `static/style.css`

```css
.results-grid,
.watchlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));  /* CHANGE 250px */
    gap: 25px;  /* CHANGE gap */
}
```

**For 2-column layout:**
```css
grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
```

### 10. Modify Header Layout

**File:** `static/style.css`

```css
.header {
    display: flex;
    justify-content: space-between;  /* CHANGE THIS */
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;  /* CHANGE gap */
}
```

---

## 🔧 Advanced Customizations

### Add Backend Database

Replace SQLite integration:
```python
# app.py - Add to imports
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cinemaverse.db'
db = SQLAlchemy(app)

class MovieRating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100))
    movie_title = db.Column(db.String(255))
    rating = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime)
```

### Add User Authentication

```python
from flask_login import LoginManager, UserMixin

login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
```

### Add API Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/recommend', methods=['POST'])
@limiter.limit("10 per minute")
def recommend():
    # ... existing code ...
```

### Add CORS Support

```python
from flask_cors import CORS

CORS(app)  # Enable Cross-Origin requests
```

---

## 📱 Mobile Optimization

### Viewport Settings
Already included in HTML:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Touch-Friendly Buttons
```css
.btn-recommend {
    min-height: 44px;  /* iOS touch target minimum */
    padding: 12px 30px;
}
```

### Mobile Menu Toggle
Add to HTML if needed:
```html
<button id="menuToggle" class="mobile-menu-btn">
    <i class="fas fa-bars"></i>
</button>
```

---

## 🎯 Performance Optimization

### Lazy Loading Images
```javascript
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            imageObserver.unobserve(entry.target);
        }
    });
});
images.forEach(img => imageObserver.observe(img));
```

### Minify CSS & JS for Production
```bash
# Install minifier
npm install -g csso-cli terser

# Minify
csso style.css -o style.min.css
terser script.js -o script.min.js
```

### Enable Caching
```python
@app.after_request
def set_cache(response):
    response.cache_control.max_age = 300
    return response
```

---

## 🐛 Debugging Tips

### Browser Console Logging
```javascript
console.log('GameState:', gameState);
console.table(gameState.watchlist);
console.error('Error message:', error);
```

### Flask Debug Mode
```python
if __name__ == '__main__':
    app.run(debug=True)  # Enables auto-reload and detailed errors
```

### LocalStorage Inspection
1. Open DevTools (F12)
2. Go to "Storage" → "Local Storage"
3. Find "cinemaverseState"
4. View all saved data

---

## 📝 Best Practices

1. ✅ Always backup before major changes
2. ✅ Test in multiple browsers
3. ✅ Keep dependencies updated
4. ✅ Use version control (Git)
5. ✅ Comment your custom code
6. ✅ Test mobile responsiveness
7. ✅ Monitor performance metrics
8. ✅ Document custom features

---

**Need help? Check the README.md or FEATURES.md files!**
