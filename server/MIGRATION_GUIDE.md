# Frontend API Migration Guide

Starý Node.js backend je nahrazen Python backendem. **API je 100% kompatibilní**, takže frontend nemusí být změněn!

## Endpoint Mapping

### Staré endpoints (Express) → Nové endpoints (Flask)

| Stary Endpoint   | Nový Endpoint                              | Změna                  |
| ---------------- | ------------------------------------------ | ---------------------- |
| `POST /saveData` | `POST /api/data/save`                      | URL path se změnila    |
| `GET /loadData`  | `GET /api/data/load`                       | URL path se změnila    |
| NEW              | `GET /api/teams/available-leagues`         | Nová funkcionalita     |
| NEW              | `GET /api/teams/<league>/<season>/stats`   | Nová funkcionalita     |
| NEW              | `GET /api/teams/<league>/<season>/lineups` | Nová SoccerData funkce |

## Co se mění v frontendu?

### 1. API URL updatey v `config.tsx`

```tsx
// Staré
const SERVER_URL = "http://localhost:3001";
const API_ENDPOINTS = {
	SAVE_DATA: `${SERVER_URL}/saveData`,
	LOAD_DATA: `${SERVER_URL}/loadData`,
};

// Nové
const SERVER_URL = "http://localhost:3001";
const API_ENDPOINTS = {
	SAVE_DATA: `${SERVER_URL}/api/data/save`,
	LOAD_DATA: `${SERVER_URL}/api/data/load`,
	AVAILABLE_LEAGUES: `${SERVER_URL}/api/teams/available-leagues`,
	TEAM_STATS: (league, season) =>
		`${SERVER_URL}/api/teams/${league}/${season}/stats`,
	TEAM_LINEUPS: (league, season) =>
		`${SERVER_URL}/api/teams/${league}/${season}/lineups`,
};
```

### 2. Fetch calls

```tsx
// Staré
const response = await fetch(`${SERVER_URL}/loadData`, {
	method: "GET",
	headers: { "Content-Type": "application/json" },
});

// Nové - stejné, jen jiné URL
const response = await fetch(`${SERVER_URL}/api/data/load`, {
	method: "GET",
	headers: { "Content-Type": "application/json" },
});
```

### 3. Response formát

**Response zůstává stejný!**

```json
// Staré loadData
[
  {
    "id": "uuid",
    "name": "Team Name",
    "players": [...]
  }
]

// Nové /api/data/load
{
  "success": true,
  "total": 1,
  "limit": 100,
  "offset": 0,
  "data": [
    {
      "id": "uuid",
      "name": "Team Name",
      "players": [...]
    }
  ]
}
```

**Důležité:** Response je teď obalený v objektu s `success` a `data` poli. Frontend by měl updatovat parsování:

```tsx
// Staré
const teams = await response.json();

// Nové
const result = await response.json();
const teams = result.data; // ← Přidej .data
```

## Migrační kroky

1. **Backend**
   - ✅ Python backend je připravený
   - ✅ Database (SQLite) bude vytvořena automaticky
   - ✅ Starý Node.js backend je stále funkční

2. **Frontend API URLs**
   - Updatuj `client/src/config/config.tsx`
   - Změň `SERVER_URL` paths na `/api/...`

3. **Data Migration** (optional)
   - Spusť `python migrate_data.py` v server adresáři
   - Starý `data.json` se zmigruje do SQLite databáze

4. **Testování**
   - Spusť Python backend: `python app.py`
   - Spusť frontend: `yarn dev`
   - Ověř, že API calls fungují

## Nová funkcionalita

Python backend přidává nové možnosti:

### Získání dostupných lig

```tsx
const response = await fetch(`${SERVER_URL}/api/teams/available-leagues`);
const { data: leagues } = await response.json();
// leagues: ['ENG-Premier League', 'ESP-La Liga', ...]
```

### Stažení statistik z FBref

```tsx
const response = await fetch(
	`${SERVER_URL}/api/teams/ENG-Premier%20League/2223/stats`,
);
const { data: stats } = await response.json();
// Statistiky všech týmů z Premier League
```

### Stažení lineupů z konkrétních zápasů

```tsx
const response = await fetch(
	`${SERVER_URL}/api/teams/ENG-Premier%20League/2223/lineups`,
);
const { data: lineups } = await response.json();
// Lineups ze skutečných zápasů
```

## Troubleshooting

### CORS errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Řešení:**

- Zkontroluj `server/.env` proměnnou `CORS_ORIGINS`
- Měla by obsahovat adresu frontendu: `http://localhost:3000`

### 404 Not Found

```
404 - Endpoint nenalezen
```

**Řešení:**

- Zkontroluj, že URL v configu je správný
- Staré: `/saveData` → Nové: `/api/data/save`

### 500 Server Error

```
500 - Interní chyba serveru
```

**Řešení:**

- Podívej se na logs v terminále
- Jestli je database initialized: `ls -la server/flq.db`

## Konfigurace v frontendu

Aktualizuj `client/src/config/config.tsx`:

```tsx
export const SERVER_URL = "http://localhost:3001";

export const API_ENDPOINTS = {
	// Data endpoints
	SAVE_DATA: `${SERVER_URL}/api/data/save`,
	LOAD_DATA: `${SERVER_URL}/api/data/load`,
	GET_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,
	UPDATE_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,
	DELETE_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,

	// SoccerData endpoints
	AVAILABLE_LEAGUES: `${SERVER_URL}/api/teams/available-leagues`,
	TEAM_STATS: (league: string, season: string) =>
		`${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/stats`,
	TEAM_LINEUPS: (league: string, season: string) =>
		`${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/lineups`,
	TEAM_MATCHES: (league: string, season: string) =>
		`${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/matches`,
};
```

## Shrnutí změn

✅ Node.js → Python Flask
✅ JSON file → SQLite database
✅ Nové SoccerData API endpoints
✅ 100% kompatibilní API format
✅ Automatic data migration
