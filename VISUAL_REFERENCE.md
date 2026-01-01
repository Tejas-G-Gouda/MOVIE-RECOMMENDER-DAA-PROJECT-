# 🎨 CinemaVerse - Visual & UX Reference Guide

## 🎮 User Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🎬 CinemaVerse              [⭐ 150] [🔥 5] [🏆 2]              │
│  Where Cinema Meets AI Magic                                    │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                          CONTROL PANEL                           │
│                                                                   │
│  Genre: [Sci-Fi ▼]   Rating: [═════━] 7/10   [🔍 Find Movies] │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                        YOUR ACHIEVEMENTS                         │
│  🎬 🏴 │ ❤️ 🏴 │ 🔥 🏴 │ 👑 🏴 │                                │
│ Cinephile │ Lover │ On Fire │ Master │                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│              🎬 RECOMMENDED FOR YOU                              │
│                                                                   │
│     ┌──────────┐      ┌──────────┐      ┌──────────┐            │
│     │ Inception│      │  Avatar  │      │Interstellar        │
│     │          │      │          │      │          │            │
│     │ ⭐ 8.8   │      │ ⭐ 7.8   │      │ ⭐ 8.6   │            │
│     └──────────┘      └──────────┘      └──────────┘            │
│     [Details][♥]      [Details][♥]      [Details][♥]           │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│              📌 MY WATCHLIST                                     │
│                                                                   │
│  • Inception (8.8)                          [Remove]            │
│  • The Matrix (8.7)                         [Remove]            │
│  • Tenet (7.3)                              [Remove]            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🃏 Movie Card States

### FRONT (Default State)
```
┌─────────────────────┐
│                     │
│   Inception         │
│                     │
│   ⭐ 8.8            │
│                     │
│ Hover to flip ➜     │
└─────────────────────┘
```

### BACK (Hover State - 3D Flip)
```
┌─────────────────────┐
│   Inception         │
│                     │
│   A mind-bending    │
│   sci-fi thriller   │
│   about dreams...   │
│                     │
│ [Details][♥ Fav]   │
└─────────────────────┘
```

---

## 🎮 Gaming Elements

### Points System
```
Action                Points    Cumulative
─────────────────────────────────────────
Get recommendations   +50       50
Favorite movie        +10       60
Add to watchlist      +15       75
Rate a movie          +20       95
Achievement unlock    +100      195
```

### Streak Counter
```
Day 1: Action ✓       Streak: 1
Day 2: Action ✓       Streak: 2
Day 3: No action      Streak: 2
Day 4: Action ✓       Streak: 3
```

### Achievement Progression
```
🎬 Cinephile
   Progress: ████████░░ (100/100 points)
   Status: UNLOCKED ✓

❤️ Movie Lover
   Progress: ██░░░░░░░░ (2/3 favorites)
   Status: Locked (Need 1 more favorite)

🔥 On Fire
   Progress: ██░░░░░░░░ (2/10 day streak)
   Status: Locked (Need 8 more days)

👑 Rating Master
   Progress: ░░░░░░░░░░ (0/5 ratings)
   Status: Locked (Need 5 ratings)
```

---

## 🎨 Color Reference

### Color Palette
```
PRIMARY CYAN         SECONDARY MAGENTA      ACCENT PURPLE
    #00d4ff              #ff006e                #8000ff
   ┌──────┐            ┌──────┐              ┌──────┐
   │      │            │      │              │      │
   │ CYAN │            │ PINK │              │PURPLE│
   │      │            │      │              │      │
   └──────┘            └──────┘              └──────┘
     RGB:              RGB:                 RGB:
     0,212,255         255,0,110            128,0,255

DARK BACKGROUND      DARKER BG
    #0a0e27         #050812
   ┌──────┐         ┌──────┐
   │░░░░░░│         │░░░░░░│
   │░░░░░░│         │░░░░░░│
   │░░░░░░│         │░░░░░░│
   └──────┘         └──────┘
```

### Usage
```
Buttons:          Gradient from cyan → purple
Text Headers:     Gradient from cyan → magenta
Links/Focus:      Cyan primary color
Highlights:       Magenta secondary color
Borders:          Semi-transparent cyan
Backgrounds:      Dark/darker shades
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
```
┌──────────────────────────────────────────────┐
│ Logo [Stats]                                 │
├──────────────────────────────────────────────┤
│ Genre ▼  Rating ───  Find Movies             │
├──────────────────────────────────────────────┤
│    Card 1    Card 2    Card 3    Card 4      │
│    Card 5    Card 6    Card 7    Card 8      │
└──────────────────────────────────────────────┘
Grid: 4 columns (auto-fill, minmax 250px)
```

### Tablet (768-1199px)
```
┌─────────────────────────────────┐
│ Logo                            │
│ Stats display below             │
├─────────────────────────────────┤
│ Genre ▼  Rating ───  Find ✓     │
├─────────────────────────────────┤
│    Card 1    Card 2    Card 3   │
│    Card 4    Card 5    Card 6   │
└─────────────────────────────────┘
Grid: 3 columns
```

### Mobile (<768px)
```
┌────────────────────┐
│ Logo               │
│ Stats (vertical)   │
├────────────────────┤
│ Genre ▼            │
│ Rating ───         │
│ Find Movies ➜      │
├────────────────────┤
│    Card 1          │
│    Card 2          │
│    Card 3          │
└────────────────────┘
Grid: 1-2 columns
```

---

## 🎬 Modal Dialog

### Modal Structure
```
┌──────────────────────────────────────┐
│  Inception                         ✕  │ ← Close button
├──────────────────────────────────────┤
│                                      │
│     ┌──────────────────┐             │
│     │                  │             │
│     │  Poster Area     │             │
│     │  (Gradient BG)   │             │
│     │                  │             │
│     └──────────────────┘             │
│                                      │
│  ⭐ Score: 8.8  🏷️ Recommended      │
│                                      │
│  A mind-bending sci-fi thriller      │
│  that explores the nature of dreams  │
│  and reality...                      │
│                                      │
│  ┌──────────────────┬──────────────┐ │
│  │ Add to Watchlist │ ⭐ Rate      │ │
│  └──────────────────┴──────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

---

## 🎨 Animation Effects

### Card Entrance
```
0%:   Card small, rotated, invisible (scale: 0.8, rotateX: -80deg)
   ↓
50%:  Card growing
   ↓
100%: Card full size, visible, upright (scale: 1, rotateX: 0deg)

Duration: 0.6s
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Card Flip on Hover
```
0°:   Front visible (rotateY: 0deg)
   ↓
90°:  Card edge view
   ↓
180°: Back visible (rotateY: 180deg)

Duration: 0.6s
Easing: ease
```

### Points Floating Animation
```
+50 Points!
   │
   │ rise ↑
   │
   └─ fade out
```

### Achievement Unlock
```
Achievement notification slides in from right
   ↓
Stays visible for 2 seconds
   ↓
Slides out to the right
   ↓
Disappears

Effect: Gold gradient background
Icon: 🏆
```

---

## 🎯 Interactive States

### Button States
```
NORMAL STATE:
┌─────────────┐
│ Find Movies │
└─────────────┘

HOVER STATE:
┌─────────────┐
│ Find Movies │  ← Slightly raised (translateY: -3px)
└─────────────┘  ← Glow increases

ACTIVE STATE:
┌─────────────┐
│ Find Movies │  ← Very slightly raised
└─────────────┘  ← Full glow
```

### Input Field States
```
NORMAL:
[Genre ▼] ← Semi-transparent, cyan border

HOVER:
[Genre ▼] ← More opaque, brighter border

FOCUS:
[Genre ▼] ← Bright cyan, glow effect
```

### Card Favorite States
```
NOT FAVORITED:
┌──────────────────┐
│ [Details][♥ Fav]│  ← Light pink outline
└──────────────────┘

FAVORITED:
┌──────────────────┐
│ [Details][♥]     │  ← Solid magenta background
└──────────────────┘
```

---

## 📐 Spacing & Layout

### Standard Spacing
```
Header padding:      30px
Section gap:         40px
Card gap:            25px
Item padding:        15px
Border radius:       15px (panels), 8px (inputs)
```

### Font Sizes
```
Logo:                2.5em
Section titles:      1.8em
Card titles:         1.4em
Body text:           1em
Labels:              0.9em
Small text:          0.8em
```

### Font Weights
```
Regular:             400
Semi-bold:           600
Bold:                700
```

---

## 🎮 Gaming UI Elements

### Stat Badge
```
┌──────────────────┐
│ ⭐ 150 Points    │
└──────────────────┘
  ↑    ↑
  Icon Value

Styles:
- Cyan border
- Rounded (20px)
- Hover: Scale up, glow
- Floating animation on icon
```

### Achievement Badge

### LOCKED
```
┌────────┐
│   🎬   │
│        │
│Cinephile
└────────┘
Opacity: 50%
Border: Dimmed
```

### UNLOCKED
```
┌────────┐
│   🎬   │
│        │
│Cinephile
└────────┘
Opacity: 100%
Border: Magenta glow
Color: Magenta
```

---

## 🎬 Watchlist Item

```
• Inception (8.8)                    [Remove]
│
├─ Title with score
├─ Action button (red/dark)
└─ Hover: Button brightens
```

---

## 📊 Performance Indicators

### Loading State
```
[Loading animation]
Discovering amazing movies...

Animation: Rotating spinner with cyan border
Duration: Until results load
```

### Empty States
```
Without Results:
┌──────────────────┐
│      🍿          │
│                  │
│ Select a genre   │
│ and rating to    │
│ discover amazing │
│ movies           │
└──────────────────┘

Without Watchlist:
┌──────────────────┐
│ Your watchlist   │
│ is empty. Add    │
│ movies from      │
│ recommendations! │
└──────────────────┘
```

---

## 🔤 Typography Scale

```
Heading 1 (Logo):           2.5em  (40px) - Bold
Heading 2 (Sections):       1.8em  (29px) - Regular
Heading 3 (Subsections):    1.5em  (24px) - Semi-bold
Heading 4 (Card titles):    1.4em  (22px) - Bold
Body text:                  1.0em  (16px) - Regular
Labels:                     0.9em  (14px) - Bold
Small text:                 0.8em  (13px) - Regular
Tiny text:                  0.75em (12px) - Regular
```

---

## 🎨 Effect Combinations

### Neon Glow Button
```
Background:   Linear gradient cyan → purple
Border:       1px solid cyan
Shadow:       0 5px 20px rgba(0, 212, 255, 0.3)
On Hover:     Shadow increases to 0 8px 30px
              Transform: translateY(-3px)
```

### Glassmorphic Panel
```
Background:   rgba(10, 14, 39, 0.5)
Border:       1px solid rgba(0, 212, 255, 0.2)
Backdrop:     blur(10px)
Shadow:       0 8px 32px rgba(0, 212, 255, 0.1)
```

### 3D Perspective Card
```
Perspective:  1000px
Transform:    rotateY(180deg)
Backface:     Hidden
Transition:   0.6s smooth
```

---

This visual reference helps you understand and customize every aspect of CinemaVerse!
