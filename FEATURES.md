# 🎮 CinemaVerse - Complete Feature Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Game Mechanics](#game-mechanics)
3. [Visual Features](#visual-features)
4. [Advanced Features](#advanced-features)
5. [Tips & Tricks](#tips--tricks)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### First Time Setup
1. Open http://localhost:5000 in your browser
2. You'll see the main interface with all gaming elements
3. Your points, streak, and achievements will be at 0
4. Start by selecting a genre and clicking "Find Movies"

### Interface Overview
```
┌─────────────────────────────────────────────────────┐
│ CinemaVerse Logo    [Points] [Streak] [Achievements]│
├─────────────────────────────────────────────────────┤
│ [Genre ▼] [Rating: 7/10] [Find Movies Button]      │
├─────────────────────────────────────────────────────┤
│ Your Achievements: [Badge] [Badge] [Badge] [Badge]  │
├─────────────────────────────────────────────────────┤
│         ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│         │  Movie1  │  │  Movie2  │  │  Movie3  │   │
│         │          │  │          │  │          │   │
│         │ ★ 8.5    │  │ ★ 7.2    │  │ ★ 9.1    │   │
│         └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────┤
│ My Watchlist:                                       │
│ • Movie Title - [Remove]                           │
│ • Another Film - [Remove]                          │
└─────────────────────────────────────────────────────┘
```

---

## 🎮 Game Mechanics

### Points System

**How to Earn Points:**

| Action | Points | Notes |
|--------|--------|-------|
| Get Recommendations | +50 | Per search query |
| Favorite a Movie | +10 | Click heart on card |
| Add to Watchlist | +15 | From modal details |
| Rate a Movie | +20 | Rate 1-10 in modal |
| Unlock Achievement | +100 | Automatic when conditions met |

**Total Points Tracked:** Visible in top-right header

### Streak System

**How Streaks Work:**
- One action per day increases your streak by 1
- Your streak counter is in the header
- Performing any action (recommendation, favorite, rating) counts
- Streak resets if you skip a day

**Maintain Your Streak:**
```
Day 1: Recommend movies → Streak: 1
Day 2: Favorite a film → Streak: 2
Day 3: (No action) → Streak: 2
Day 4: Rate a movie → Streak: 3 (continues from Day 2)
```

### Achievement Badges

**Unlockable Achievements:**

#### 🎬 Cinephile
- **Requirement:** Earn 100 total points
- **Reward:** +100 points (one-time)
- **Description:** You're a passionate movie enthusiast!

#### ❤️ Movie Lover
- **Requirement:** Favorite 3 movies
- **Reward:** +100 points (one-time)
- **Description:** You know what you like!

#### 🔥 On Fire!
- **Requirement:** Maintain 10-day streak
- **Reward:** +100 points (one-time)
- **Description:** Consistent engagement is your superpower!

#### 👑 Rating Master
- **Requirement:** Rate 5 movies
- **Reward:** +100 points (one-time)
- **Description:** Your reviews matter to the community!

---

## 🎨 Visual Features

### 3D Card Flip Animation

**How It Works:**
1. Each movie appears as a card with a 3D flip effect
2. Front shows: Movie title + Rating score
3. Back shows: Description + Action buttons
4. Hover over any card to see the flip happen

**Card States:**
```
FRONT (Default)          →  BACK (On Hover)
┌──────────────────┐       ┌──────────────────┐
│  Movie Title     │       │ A highly recom-  │
│                  │       │ mended film that │
│  ★ 8.5           │       │ matches your...  │
│                  │  flip  │                  │
│                  │  →     │ [Details][♥Fav] │
└──────────────────┘       └──────────────────┘
```

### Neon Aesthetic

**Color Scheme:**
- **Primary Cyan**: Dominant color (#00d4ff)
- **Secondary Magenta**: Highlights (#ff006e)
- **Accent Purple**: Interactions (#8000ff)
- **Dark Background**: Cyberpunk look

**Glowing Effects:**
- Neon borders on panels
- Title text glow
- Button hover effects
- Achievement unlock notifications

### Particle Background

**Animated Elements:**
- Floating cinema emojis (🎬, ⭐, 🍿, 🎥, 🎭, 🎪)
- Continuous float-up animation
- Creates depth and visual interest
- Responsive to screen size

### Glassmorphism Design

**Frosted Glass Effect:**
- Semi-transparent panels
- Backdrop blur effect
- Visible background underneath
- Professional, modern look

---

## 🎯 Advanced Features

### Watchlist Management

**Add to Watchlist:**
1. Click "Details" on any movie card
2. Modal opens with full information
3. Click "Add to Watchlist" button
4. Movie appears in the watchlist section

**Watchlist Display:**
```
My Watchlist:
─────────────────────────────────
• Inception              [Remove]
• The Matrix            [Remove]
• Interstellar          [Remove]
```

**Remove from Watchlist:**
1. Find the movie in the watchlist section
2. Click the "Remove" button
3. Movie is deleted instantly

### Movie Rating System

**How to Rate:**
1. Click "Details" on any movie card
2. In the modal, click "Rate" button
3. Enter your rating (1-10)
4. Rating is saved automatically (+20 pts)

**Benefits:**
- Earn points for ratings
- Unlock "Rating Master" achievement
- See all your ratings in localStorage

### Modal Details View

**Modal Features:**
```
┌────────────────────────────────┐
│  Movie Title                 ✕  │
├────────────────────────────────┤
│ [Poster Placeholder]           │
│                                │
│ ⭐ Score: 8.5  🏷️ Recommended  │
│                                │
│ A highly recommended movie...  │
│                                │
│ [Add to Watchlist] [★ Rate]   │
└────────────────────────────────┘
```

**Modal Actions:**
- View full title
- See recommendation score
- Read description
- Add to watchlist
- Rate the movie

### Persistent Data Storage

**Saved Information:**
```javascript
{
  points: 250,
  streak: 5,
  achievements: ['cinephile', 'lover'],
  favorites: ['Movie1', 'Movie2'],
  watchlist: [
    { title: 'Movie1', score: 8.5 },
    { title: 'Movie2', score: 7.2 }
  ],
  ratings: {
    'Movie1': 9,
    'Movie2': 7
  },
  lastAction: '2024-01-15'
}
```

**Storage Location:** Browser localStorage
**Privacy:** All data stays on your device
**Persistence:** Survives browser refresh and reopens

---

## 💡 Tips & Tricks

### Maximize Points Efficiently
1. **Get Recommendations First** (+50 pts) - Get the most from one action
2. **Favorite While Looking** (+10 pts each) - Quick point boost
3. **Rate in Modal** (+20 pts each) - More detailed interaction
4. **Build Streak** - Maintain daily interaction for consistency

### Unlock Achievements Faster
```
Goal: Unlock Cinephile (100 pts)
─────────────────────────────
1. Get recommendations (50 pts) → Total: 50
2. Favorite 3 movies (30 pts) → Total: 80
3. Rate 2 movies (40 pts) → Total: 120 ✓
Time: ~5 minutes
```

### Optimize Genre Selection
- **Sci-Fi**: For futuristic/tech enthusiasts
- **Action**: For high-energy entertainment
- **Sports**: For competitive spirit
- **Drama**: For emotional depth
- **Comedy**: For laughs and fun
- **Horror**: For thrills

### Rating Optimization
- Set minimum rating to **7** for quality movies
- Use **8+** for premium selections
- Lower for **discovery mode** exploration
- Adjust based on your preferences

---

## 🔧 Troubleshooting

### Issue: Movies Not Loading

**Solution:**
1. Ensure Flask backend is running (`python app.py`)
2. Check recommender.exe exists in cpp/ folder
3. Verify genre spelling matches C++ input
4. Check browser console for errors (F12)

### Issue: Points Not Saving

**Solution:**
1. Enable localStorage in browser settings
2. Check if not in private/incognito mode
3. Clear cache and reload: Ctrl+Shift+R
4. Try a different browser

### Issue: Modal Won't Open

**Solution:**
1. Click "Details" button again
2. Check if JavaScript is enabled
3. Open console for error messages
4. Refresh page: F5

### Issue: 3D Cards Not Flipping

**Solution:**
1. Update your browser
2. Check CSS loaded: Open DevTools → Network
3. Disable browser extensions
4. Test in different browser

### Issue: Achievements Not Unlocking

**Solution:**
1. Verify points/streaks showing correctly
2. Perform the exact required action
3. Check localStorage: Right-click → Inspect → Storage
4. Achievements unlock automatically - no manual action needed

### Clear Data (Reset Game)

**To Start Fresh:**
1. Open Developer Tools (F12)
2. Go to "Storage" or "Application" tab
3. Find "localStorage"
4. Search for "cinemaverseState"
5. Delete it
6. Refresh page

```javascript
// Or run in console:
localStorage.removeItem('cinemaverseState');
location.reload();
```

---

## 📊 Performance Tips

1. **Reduce Particles** for slower devices
2. **Disable animations** in CSS if needed
3. **Close other tabs** for smooth 3D effects
4. **Use hardware acceleration** in browser settings

---

## 🎓 Learning Resources

### HTML Structure
- 5 main sections: header, control panel, achievements, results, watchlist
- Semantic HTML5 for accessibility
- Responsive grid layouts

### CSS Techniques
- CSS Grid for layouts
- Flexbox for alignment
- 3D transforms for flip effect
- CSS animations for effects
- Custom properties for theming

### JavaScript Features
- Event listeners for interactivity
- localStorage API for persistence
- Fetch API for backend communication
- Dynamic DOM manipulation
- State management pattern

---

**Enjoy your movie discovery journey with CinemaVerse! 🎬✨**

For more info, visit the main README.md
