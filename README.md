# CinemaVerse 🎬 — 3D AI Movie Recommender

A beautiful, interactive movie recommender app with 3D flip cards, horizontal scrolling carousel, multi-language support, and curated film selections. Built with Flask + Vanilla JS + CSS3.

## Features

✨ **Visual Design**
- CinemaVerse branding with gradient logo and glow animations
- 3D flip cards with hover effects
- Horizontal scroll carousel with promo images
- Particle background animations
- Responsive mobile-first design

🎯 **Core Functionality**
- **Genre-based recommendations** (Sci-Fi, Action, Sports, Drama, Comedy, Horror)
- **Rating filters** (0-10 scale with slider)
- **Multi-language support** (English, Hindi, Kannada, Tamil, Telugu, Malayalam, and more)
- **Search by movie name** with inline results
- **Featured picks** curated homepage carousel (12 top movies)
- **Watchlist & Favorites** with localStorage persistence
- **Modal details** with full movie info and rating system

🌍 **Internationalization**
- 100+ movies across multiple languages
- Latest Indian regional films (Kannada, Hindi, Tamil, Telugu, Malayalam)
- Mix of classic and recent releases

## Tech Stack

- **Backend:** Python Flask
- **Frontend:** HTML5 + Vanilla JavaScript + CSS3
- **Data:** Mock movie database (easily extensible)
- **Storage:** Browser localStorage for user state
- **Styling:** CSS3 gradients, animations, 3D transforms

## Project Structure

```
DAA Project/
├── app.py                 # Flask backend, routes, recommendation logic
├── templates/
│   └── index.html        # Main UI template
├── static/
│   ├── script.js         # Game mechanics, carousel, API calls
│   ├── style.css         # Theming and animations
│   └── images/           # Movie posters (JPG/PNG)
└── cpp/
    └── recommender.exe   # Optional C++ recommender (fallback to mock DB)
```

## Setup & Installation

### Requirements
- Python 3.7+
- Flask
- No additional dependencies (uses standard library + Flask)

### Install & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CinemaVerse.git
   cd CinemaVerse
   ```

2. **Create a virtual environment** (optional but recommended)
   ```bash
   python -m venv venv
   # Activate venv:
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Flask**
   ```bash
   pip install flask
   ```

4. **Run the app**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## Usage

### Homepage
- Browse **featured curated picks** in the horizontal scroll carousel
- Each card shows title, genre, language, and rating
- Click a card to flip and see details + action buttons

### Find Movies by Genre
1. Select a **genre** from the dropdown
2. Adjust the **minimum rating** slider (0-10)
3. Pick a **language** (or "All Languages")
4. Click **"Find Movies"** button
5. Results appear in a horizontal scroll strip

### Search by Name
- Use the **header search input** (top-right)
- Type a movie name (partial matches supported)
- Press Enter or click Search
- Results display inline with "Movie not found" if empty

### Watchlist & Favorites
- Click **"Details"** on any card to open the modal
- Choose **"Add to Watchlist"** or **"Rate"** the movie
- Favorite a movie with the **heart button**
- View your **watchlist** at the bottom (persists via localStorage)

## API Endpoints

- `GET /` — Serve main HTML page
- `POST /recommend` — Recommend movies by genre, rating, language
  - Params: `genre`, `rating`, `language`
  - Returns: JSON array of movies
- `POST /search` — Search movies by name
  - Params: `name`
  - Returns: JSON array of matches
- `GET /featured` — Fetch curated featured picks + top-by-language
  - Returns: JSON array of 12 featured movies with posters
- `GET /languages` — Get available languages
  - Returns: JSON array of language strings

## Movie Database

Movies are stored in `app.py` as a `MOCK_MOVIES` dictionary:
```python
MOCK_MOVIES = {
    'Sci-Fi': [
        ('Inception', 8.8, 'English'),
        ('Oppenheimer', 8.5, 'English'),
        # ... more movies
    ],
    # ... other genres
}
```

Each entry is a tuple: `(title, score, language)`

### Adding Movies
Edit `app.py` and add entries to the appropriate genre list, or create a new genre key.

### Adding Posters
1. Place image files in `static/images/`
2. Name them using this pattern: `<sanitized_title>.(jpg|png|jpeg|webp)`
   - Example: `oppenheimer.jpg`, `spider_man_no_way_home.jpg`
   - Replace non-alphanumeric characters with underscores
3. The backend will auto-match local images to featured titles; falls back to placeholders if not found

## Customization

### Change Colors
Edit CSS variables in `static/style.css`:
```css
:root {
    --primary: #00d4ff;      /* Cyan */
    --secondary: #ff006e;    /* Pink */
    --accent: #8000ff;       /* Purple */
    --dark: #0a0e27;         /* Dark blue */
}
```

### Adjust Carousel Scroll
In `static/style.css`, modify `.horizontal-track`:
```css
.horizontal-track {
    gap: 20px;              /* Space between cards */
    padding: 20px 12px;     /* Padding around track */
    /* ... */
}
```

### Add/Remove Languages
Update the `<select id="language">` in `templates/index.html` and ensure movie entries have matching language tags.

## Future Enhancements

- 🎥 Real posters & trailers from TMDB API
- 🔍 Autocomplete search suggestions
- 🎬 Advanced filters (year, actor, runtime, director)
- 👤 User accounts with cloud sync
- 📊 Collaborative filtering recommendations
- ♿ Enhanced accessibility (WCAG 2.1)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT License — feel free to use and modify.

## Contributing

Fork, commit, and submit a pull request! Issues and feature requests welcome.

---

**Enjoy exploring CinemaVerse!** 🚀🍿
   ```bash
   cd cpp
   # Use your C++ compiler to create recommender.exe
   g++ recommender.cpp -o recommender.exe
   ```

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Open in Browser**
   ```
   http://localhost:5000
   ```

## 🎮 How to Play

1. **Select a Genre** - Choose from Sci-Fi, Action, Sports, Drama, Comedy, Horror
2. **Set Minimum Rating** - Slide to your preferred quality threshold (0-10)
3. **Get Recommendations** - Click "Find Movies" to discover films
4. **Interact with Results**:
   - **Hover** to flip cards and see options
   - **Favorite** to mark movies you like (+10 pts)
   - **Details** to view full info and rate (+20 pts)
5. **Manage Watchlist** - Build your personal watchlist
6. **Earn Points** - Unlock achievements for engagement

## 📊 Scoring System

| Action | Points |
|--------|--------|
| Get Recommendations | 50 |
| Favorite a Movie | 10 |
| Add to Watchlist | 15 |
| Rate a Movie | 20 |
| Unlock Achievement | 100 |

## 🏗️ Project Structure

```
DAA Project/
├── app.py                 # Flask backend
├── cpp/
│   ├── recommender.cpp    # C++ recommendation algorithm
│   └── recommender.exe    # Compiled executable
├── static/
│   ├── style.css         # Modern styling with 3D effects
│   └── script.js         # Interactive features & gamification
└── templates/
    └── index.html        # Main UI with game elements
```

## 🎨 Color Scheme

- **Primary Cyan**: `#00d4ff` - Main accent color
- **Secondary Magenta**: `#ff006e` - Highlight accent
- **Accent Purple**: `#8000ff` - Interactive elements
- **Dark Background**: `#0a0e27` - Main background
- **Darker Background**: `#050812` - Secondary background

## 🔧 Customization

### Add New Genres
Edit `templates/index.html` - Add options to the genre select:
```html
<option value="YourGenre">🎥 Your Genre</option>
```

### Adjust Points
Edit `static/script.js` - Modify the award values in functions like `awardPoints(50)`

### Change Colors
Edit `static/style.css` - Update CSS variables in `:root`:
```css
:root {
    --primary: #00d4ff;
    --secondary: #ff006e;
    /* ... */
}
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚙️ Technical Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Algorithm**: C++ (for movie recommendations)
- **Storage**: Browser localStorage
- **Design**: CSS Grid, Flexbox, CSS Animations

## 🎯 Future Enhancements

- [ ] User authentication & cloud sync
- [ ] Social sharing features
- [ ] Advanced filtering (year, director, cast)
- [ ] AI-powered personalization
- [ ] Backend database integration
- [ ] Leaderboard system
- [ ] Dark/Light theme toggle
- [ ] Soundtrack recommendations

## 📄 License

This project is free to use and modify.

## 👨‍💻 Author

Created with ❤️ for movie lovers and gamers

---

**Enjoy discovering amazing movies with CinemaVerse! 🎬✨**
