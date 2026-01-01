# ⚡ CinemaVerse - Quick Start Guide

## 🚀 30-Second Setup (Windows)

1. **Open PowerShell** in the project folder
2. **Run:** `python app.py`
3. **Open:** `http://localhost:5000`
4. **Done!** 🎉

---

## 📋 System Requirements

- ✅ Python 3.7+
- ✅ Windows/Mac/Linux
- ✅ Modern web browser
- ✅ C++ recommender.exe compiled

---

## 🎮 First Time User Guide

### Step 1: Select Genre
```
Click the genre dropdown
Select: Sci-Fi, Action, Sports, Drama, Comedy, or Horror
```

### Step 2: Choose Rating
```
Drag the slider from 0 to 10
Example: Set to 7 for movies rated 7/10 or higher
```

### Step 3: Get Recommendations
```
Click "🔍 Find Movies"
Wait for results to load (2-3 seconds)
```

### Step 4: Explore Results
```
Hover over any movie card to flip it
Click "Details" to see more info
Click "♥ Fav" to add to favorites
```

### Step 5: Build Your Watchlist
```
Click "Details" on any movie
Click "Add to Watchlist"
See it appear in the watchlist section
```

### Step 6: Rate & Earn Points
```
In the modal, click "⭐ Rate"
Enter rating (1-10)
Earn +20 points!
```

---

## 🎮 Earning Points

### Easy Points (Quick Start)
```
1. Get recommendations      → +50 pts
2. Favorite 2 movies        → +20 pts
3. Rate 1 movie             → +20 pts
────────────────────────────────
Total in 5 minutes: 90 points!
```

### Unlock First Achievement
```
🎬 Cinephile
Need: 100 points
Time: ~10-15 minutes of play

Strategy:
- Search 2x (100 pts)
- Favorite some movies (10-20 pts)
- Boom! Achievement unlocked!
```

---

## 📊 Understanding the Dashboard

### Top Stats Bar
```
⭐ 150 Points    🔥 5 Streak    🏆 2 Achievements
│                │              │
│                │              └─ Number of unlocked badges
│                └──────────────── Days in a row you've played
└──────────────────────────────── Total points earned
```

### Achievement Badges
```
🎬 Cinephile (Locked/Unlocked)
  Requirement: 100 points
  Status: Shows progress

❤️ Movie Lover
  Requirement: 3 favorite movies
  
🔥 On Fire
  Requirement: 10 day streak
  
👑 Rating Master
  Requirement: 5 movie ratings
```

---

## 🎯 Game Tips

### Pro Tip #1: Daily Streak
- **Play every day** to build your streak
- You need **ONE action per day**
- Any action counts (recommend, favorite, rate)
- Unlock "On Fire" achievement at 10 days

### Pro Tip #2: Maximize Achievement Progress
```
Day 1: Get 50 pts (recommend) → Need 50 more for Cinephile
Day 1: Favorite 1 movie → Need 2 more for Movie Lover
Day 1: Rate 1 movie → Need 4 more for Rating Master
Day 2: (Next day) Perform 1 action → Streak: 2
```

### Pro Tip #3: Quick Points
```
Fastest way to 100 points:
1. Get recommendations (50 pts)
2. Favorite 5 movies (50 pts) = 100 pts total!
Time: 5 minutes
```

### Pro Tip #4: Watchlist Strategy
- Add movies you **actually want to watch**
- Use it as a **personal movie queue**
- Check it before scrolling other sites
- Remove completed watches

---

## ⌨️ Keyboard Shortcuts (Coming Soon)

```
(When implemented)
Ctrl+R  → Get recommendations
Ctrl+W  → Toggle watchlist
Ctrl+S  → Show statistics
Ctrl+?  → Help menu
ESC     → Close modal
```

---

## 🐛 Troubleshooting

### Issue: "Cannot load localhost:5000"
**Solution:**
```
1. Make sure Python is installed:
   python --version

2. Make sure Flask is installed:
   pip install flask

3. Run app.py again:
   python app.py

4. Open fresh browser: Ctrl+Shift+R
```

### Issue: "recommender.exe not found"
**Solution:**
```
1. Compile the C++ file:
   g++ cpp/recommender.cpp -o cpp/recommender.exe

2. Verify file exists:
   dir cpp/recommender.exe

3. Restart Flask:
   python app.py
```

### Issue: "No movies shown"
**Solution:**
```
1. Make sure genre is selected
2. Click "Find Movies" button
3. Wait 2-3 seconds for results
4. Check browser console for errors (F12)
5. Verify recommender.exe works
```

### Issue: "Points not saving"
**Solution:**
```
1. Not in incognito mode? ✓
2. Browser allows localStorage? ✓
3. Hard refresh: Ctrl+Shift+R
4. Clear cache and reload

Or reset:
- Open F12 → Storage → Local Storage
- Find "cinemaverseState"
- Delete it and refresh
```

---

## 📱 Mobile Usage

### Best Experience
- Use **landscape mode** for cards
- **Portrait mode** still works (1 column)
- Touch to flip cards
- Tap "Details" to open modal

### Mobile Tips
- Buttons are touch-optimized (44px minimum)
- Scroll smoothly to explore
- Modal is fully responsive
- Stats visible on top (sticky)

---

## 🎨 Customization Quickstart

### Change Colors
1. Open `static/style.css`
2. Find `:root { --primary: #00d4ff;`
3. Change `#00d4ff` to your color
4. Refresh browser

### Add Genres
1. Open `templates/index.html`
2. Find `<select id="genre">`
3. Add: `<option value="Your Genre">🎥 Your Genre</option>`
4. Update recommender to handle new genre

### Change Point Values
1. Open `static/script.js`
2. Find `awardPoints(50)` in getMovies
3. Change 50 to your value
4. Changes apply immediately

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Full setup & overview |
| FEATURES.md | Complete feature guide |
| DEPLOYMENT.md | Advanced customization |
| VISUAL_REFERENCE.md | UI/UX reference |
| TRANSFORMATION.md | Before/after summary |

---

## ✅ Checklist Before Playing

- [ ] Python installed and working
- [ ] Flask installed (`pip install flask`)
- [ ] recommender.exe compiled and in cpp/ folder
- [ ] app.py running (`python app.py`)
- [ ] Browser at `http://localhost:5000`
- [ ] Page loads without errors
- [ ] Can select genre
- [ ] Can get recommendations

---

## 🎬 Sample Play Session

### Timeline: 15 Minutes
```
0:00 - Open http://localhost:5000
0:15 - Select "Sci-Fi" genre
0:30 - Set rating to 7.5
0:45 - Click "Find Movies" → Results load!
1:00 - Hover cards and flip them
2:00 - Favorite 3 movies (+30 pts, total: 30)
3:00 - Click "Details" on one movie
3:30 - Rate it 9/10 (+20 pts, total: 50)
4:00 - Add to watchlist (+15 pts, total: 65)
4:30 - Try different genre
6:00 - Get recommendations again (+50 pts, total: 115)
6:30 - Check achievements - see "Cinephile" unlocked!
7:00 - Explore watchlist
7:30 - Total: 115 points, Cinephile badge earned!
```

---

## 🚀 Next Steps

1. **Play the game** - Earn points and achievements
2. **Explore features** - Try all functionality
3. **Build watchlist** - Save movies you like
4. **Maintain streak** - Come back daily
5. **Unlock achievements** - Complete all goals
6. **Customize** - Make it your own

---

## 💬 Need Help?

- Check **FEATURES.md** for detailed explanations
- Check **DEPLOYMENT.md** for customization
- Check **VISUAL_REFERENCE.md** for UI/UX details
- Check **TRANSFORMATION.md** for what changed

---

## 🎉 You're Ready!

**Start playing CinemaVerse now!**

```
python app.py
→ http://localhost:5000
→ Select genre
→ Get recommendations
→ Earn points
→ Unlock achievements
→ Build your watchlist

Enjoy! 🍿✨
```

---

**Version 1.0 - CinemaVerse 3D Movie Recommender**

Created with ❤️ for movie lovers and gamers
