# 📊 Firebase + API Architecture

## Overview

Aplikace používá **hybrid approach**:
- **LineUps (squady)** → Python Backend + SQLite + SoccerData API
- **User Data** → Firebase Firestore
- **Frontend** → Zustand stores (oddělené pro lineups a user data)

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                       │
│  ┌─────────────────┐           ┌──────────────────────┐  │
│  │ lineupStore     │           │ userStore            │  │
│  │ (HTTP Fetch)    │           │ (Firebase SDK)       │  │
│  └────────┬────────┘           └──────────┬───────────┘  │
│           │                               │              │
└───────────┼───────────────────────────────┼──────────────┘
            │                               │
            ↓                               ↓
   ┌─────────────────┐           ┌──────────────────────┐
   │  BACKEND API    │           │   FIREBASE           │
   │  (Flask)        │           │   (Firestore)        │
   │                 │           │                      │
   │ /api/data/*     │           │ users/               │
   │ /api/teams/*    │           │ user_stats/          │
   └────────┬────────┘           │ favorites/           │
            │                    └──────────────────────┘
            ↓
   ┌─────────────────┐
   │  SQLite DB      │
   │  lineups        │
   │  scraped_data   │
   └─────────────────┘
            ↑
            │
   ┌─────────────────┐
   │ SoccerData API  │
   │ (FBref, ESPN)   │
   └─────────────────┘
```

---

## 1️⃣ LINEUP MANAGEMENT (Backend)

### Endpoint: `/api/data/*`

**POST /api/data/save** - Uložit lineup
```typescript
{
  name: "Manchester United",
  coach: "Ten Hag",
  opponent: "Liverpool",
  year: 2024,
  formation: "4-3-3",
  players: [
    { id: 1, position: "GK", name: "de Gea", ... }
  ],
  source: "soccerdata" // nebo "manual"
}
```

**GET /api/data/load** - Načíst všechny lineups
```typescript
Response: { data: Squad[], success: true, ... }
```

**GET /api/data/:id** - Načíst jednotlivý lineup
```typescript
Response: { data: Squad, success: true }
```

### Frontend: `lineupStore.ts`

```typescript
const lineupStore = {
  fetchLineups(),      // GET /api/data/load
  fetchLineupById(),   // GET /api/data/:id
  createLineup(),      // POST /api/data/save
  updateLineup(),      // PUT /api/data/:id
  deleteLineup(),      // DELETE /api/data/:id
  getRandomLineup(),   // In-memory
}
```

**Database**: SQLite (`team_lineups` table)

---

## 2️⃣ USER MANAGEMENT (Firebase)

### Collections

#### `users`
```typescript
interface User {
  id: string;           // Firebase UID
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `user_stats`
```typescript
interface UserStats {
  userId: string;       // Reference ke `users.id`
  totalGames: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  favoriteLeague?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `favorites`
```typescript
interface Favorite {
  userId: string;       // Reference ke `users.id`
  lineupId: string;     // Reference ke `team_lineups.id`
  addedAt: Date;
}
```

### Frontend: `userStore.ts`

```typescript
const userStore = {
  // User data
  currentUser: User | null,
  setCurrentUser(user),
  
  // User statistics
  userStats: UserStats | null,
  fetchUserStats(userId),
  createUserStats(userId),
  updateUserStats(userId, stats),
  
  // Favorites
  favorites: string[],
  fetchFavorites(userId),
  addFavorite(userId, lineupId),
  removeFavorite(userId, lineupId),
  isFavorite(lineupId),
}
```

---

## 3️⃣ DATA IMPORT (SoccerData API)

### Endpoint: `/api/teams/*`

**GET /api/teams/available-leagues**
```json
{
  "success": true,
  "data": [
    "ENG-Premier League",
    "ESP-La Liga",
    ...
  ]
}
```

**GET /api/teams/:league/:season/lineups**
```json
{
  "success": true,
  "data": [
    {
      "team": "Manchester United",
      "opponent": "Liverpool",
      "formation": "4-3-3",
      "players": { "GK": "de Gea", ... }
    },
    ...
  ]
}
```

### Frontend: `ImportLineups.tsx`

User workflow:
1. Vybere ligu
2. Vybere sezónu
3. Vidí dostupné lineups
4. Klikne "Importovat"
5. Lineup se uloží do backendu (`team_lineups`)

---

## 4️⃣ USAGE EXAMPLES

### Načtení lineupů
```typescript
import { useLineupStore } from './store/lineupStore';

const { lineups, fetchLineups, loading } = useLineupStore();

useEffect(() => {
  fetchLineups(); // GET http://localhost:3001/api/data/load
}, []);
```

### Správa uživatele
```typescript
import { useUserStore } from './store/userStore';

const { currentUser, userStats, fetchUserStats } = useUserStore();

useEffect(() => {
  if (userId) {
    fetchUserStats(userId); // Query Firebase
  }
}, [userId]);
```

### Přidání do oblíbených
```typescript
const { addFavorite, isFavorite } = useUserStore();

const handleToggleFavorite = async (lineupId: string) => {
  if (isFavorite(lineupId)) {
    await removeFavorite(userId, lineupId);
  } else {
    await addFavorite(userId, lineupId);
  }
};
```

---

## 5️⃣ ENVIRONMENT SETUP

### `.env` (Frontend)
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### `.env` (Backend)
```
FLASK_ENV=development
DATABASE_URL=sqlite:///flq.db
CORS_ORIGINS=http://localhost:3018
```

---

## 6️⃣ MIGRATION CHECKLIST

- ✅ `lineupStore.ts` - HTTP API (backend)
- ✅ `formationStore.ts` - Static config
- ✅ `userStore.ts` - Firebase (user data)
- ✅ `ImportLineups.tsx` - UI pro import
- ✅ Backend `/api/data/*` - CRUD lineups
- ✅ Backend `/api/teams/*` - SoccerData API
- ⏳ Auth integration (Firebase Auth)
- ⏳ User profile component
- ⏳ Leaderboard (user_stats)
- ⏳ Favorites UI (heart icon)

---

## 7️⃣ SECURITY NOTES

- Firebase rules by měly omezit přístup:
  ```
  match /users/{userId} {
    allow read, write: if request.auth.uid == userId;
  }
  
  match /user_stats/{userId} {
    allow read: if true;
    allow write: if request.auth.uid == userId;
  }
  ```

- Backend `/api/data/*` zatím bez auth (lze přidat později)

---

## Shrnutí

| Komponenta | Technologie | Účel |
|---|---|---|
| **Lineups** | Python Backend + SQLite | Ukládání a správa lineupů |
| **SoccerData** | API backend | Import reálných lineupů |
| **User data** | Firebase | Uživatelské profily a statistiky |
| **Frontend** | React + Zustand | UI a state management |

**Výhody:**
- Lineups offline dostupné (SQLite)
- User data se synchronizuje (Firebase)
- Snadná migrace (oddělené store)
- Snadné horizontální scalování
