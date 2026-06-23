# ✅ Frontend ↔ Backend Propojení - HOTOVO

## Co bylo změní

### 1. `client/src/store/lineupStore.ts` ✅

**Změna:** Firebase Firestore → HTTP fetch na Python backend

**Nové funkce:**

- `fetchLineups()` → `GET /api/data/load`
- `fetchLineupById(id)` → `GET /api/data/{id}`
- `createLineup(lineup)` → `POST /api/data/save`
- `updateLineup(id, updates)` → `PUT /api/data/{id}` **(NEW)**
- `deleteLineup(id)` → `DELETE /api/data/{id}` **(NEW)**
- `getRandomLineup()` → In-memory select (nevyžaduje fetch)

**Features:**

- ✅ Error handling na všech funkcích
- ✅ Loading state management
- ✅ Automatická aktualizace state po operacích
- ✅ Type-safe s TypeScript

### 2. `client/src/store/formationStore.ts` ✅

**Změna:** Firebase → Statické formace z config

**Logika:**

- Formace jsou hardcoded v `config/config.tsx`
- Store je teď lightweight, jen vrací statické data
- Nemusíme fetchovat z backendu

### 3. `client/src/utils/TransformData.tsx` ✅

**Změna:** Fixed import z `config` na `types`

**Funkce:** Konvertuje Player names na Squad Player objekty

```
{ "CB1": "Sergio Ramos", "CB2": "Pepe" }
    ↓
[
  { id: 1, position: "CB1", name: "Sergio Ramos", guessed: false, ... },
  { id: 2, position: "CB2", name: "Pepe", guessed: false, ... }
]
```

### 4. `client/src/components/TeamListTable.tsx` ✅

**Změna:** Added error message display

**Features:**

- ✅ Alert component pro zobrazení chyb
- ✅ Automatické načítání lineupů
- ✅ Loading state

### 5. `client/src/config/config.tsx` ✅

**Už existuje:** API_ENDPOINTS definované

```typescript
API_ENDPOINTS = {
	SAVE_DATA: "/api/data/save",
	LOAD_DATA: "/api/data/load",
	GET_LINEUP: (id) => `/api/data/{id}`,
	UPDATE_LINEUP: (id) => `/api/data/{id}`,
	DELETE_LINEUP: (id) => `/api/data/{id}`,
	// ... a SoccerData endpoints
};
```

---

## 🔌 Data Flow

### Creating Lineup (POST)

```
User fills form in CreateLineup.tsx
    ↓
handleSave() calls createLineup(cpy)
    ↓
lineupStore POST /api/data/save
    ↓
Python Backend creates TeamLineup in SQLite
    ↓
Returns { success: true, data: Squad }
    ↓
Frontend updates state, shows success modal
```

### Loading Lineups (GET)

```
Home.tsx mounts
    ↓
TeamListTable useEffect → fetchLineups()
    ↓
lineupStore GET /api/data/load
    ↓
Python Backend queries all TeamLineups
    ↓
Returns { data: Squad[] }
    ↓
Frontend renders Table
```

### Getting Random Lineup (GET - optional)

```
User clicks "Random Team"
    ↓
getRandomLineup() → in-memory select
    ↓
Navigates to /guess/:id
    ↓
FieldComponent loads single lineup
```

---

## 🚀 Co se změnilo pro uživatele

**Před:** Data byla ve Firebase, nefungoval offline mode, data byla v cloudu
**Teď:** Data jsou v SQLite na backendu, aplikace má centrální API, snadnější migration

---

## ⚠️ Co není změněno (zatím)

- ❌ Vytváření formací - Zatím statické v config
- ❌ SoccerData import - Zatím není UI komponenta
- ❌ Migration z old Node.js backendu - Pokud chceš

---

## ✅ Checklist - Co tě bude čekat

- [ ] Spustit frontend: `yarn dev` v `/client`
- [ ] Spustit backend: `python app.py` v `/server`
- [ ] Vyzkoušet vytvoření lineupů v `/create-lineup`
- [ ] Ověřit že se lineups načítají na Home
- [ ] Ověřit že Backend má data v SQLite (`flq.db`)

---

## 📊 Architecture teď

```
Frontend (React)
  ├── HomePagepage
  │   └── TeamListTable
  │       ├── useLineupStore.fetchLineups()
  │       └── GET /api/data/load
  │
  ├── CreateLineup
  │   ├── useLineupStore.createLineup()
  │   └── POST /api/data/save
  │
  └── FieldComponent
      └── useLineupStore.fetchLineupById()
          └── GET /api/data/:id

Backend (Python Flask)
  ├── /api/data/load (GET)
  ├── /api/data/save (POST)
  ├── /api/data/:id (GET, PUT, DELETE)
  │
  └── SQLite Database
      └── team_lineups table
```

---

## 🎉 Hotovo!

Frontend a Backend jsou teď propojené! 🎊

**Příští kroky:**

1. Data transformation (SoccerData lineups → Squad format)
2. Import Real Lineups UI komponenta
3. Advanced Statistics View
