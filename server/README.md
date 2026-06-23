# FLQ Python Backend

Modernní Python backend pro aplikaci Football Lineup Quizzer postavený na Flask a SoccerData.

## Struktura projektu

```
server/
├── app.py                    # Flask app factory a main entry point
├── config.py                 # Konfigurační třídy (dev, prod, test)
├── models.py                 # SQLAlchemy DB modely
├── requirements.txt          # Python dependencies
├── .env.example              # Příklad environment variables
├── .gitignore               # Git ignore rules
│
├── routes/                   # API endpoints (blueprinty)
│   ├── __init__.py
│   ├── data.py              # Endpoints pro uživatelské lineupy
│   └── teams.py             # Endpoints pro SoccerData (ligy, týmy, zápasy)
│
└── services/                # Business logic
    ├── __init__.py
    └── soccerdata_service.py # SoccerData scraping a caching
```

## Instalace

### 1. Python Virtual Environment

```bash
cd server
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
```

### 2. Instalace dependencies

```bash
pip install -r requirements.txt
```

### 3. Konfigurační soubor

```bash
cp .env.example .env
```

## Spuštění

```bash
python app.py
```

Server běží na `http://localhost:3001`

## API Endpoints

### Health Check

- `GET /health` - Ověř, že server běží

### Uživatelské lineupy (data)

- `POST /api/data/save` - Ulož nový lineup
- `GET /api/data/load` - Načti všechny lineupy
- `GET /api/data/<lineup_id>` - Načti konkrétní lineup
- `PUT /api/data/<lineup_id>` - Aktualizuj lineup
- `DELETE /api/data/<lineup_id>` - Smaž lineup

### SoccerData (teams)

- `GET /api/teams/available-leagues` - Dostupné ligy z FBref
- `GET /api/teams/<league>/<season>/stats` - Statistiky týmů
- `GET /api/teams/<league>/<season>/lineups` - Lineups z zápasů
- `GET /api/teams/<league>/<season>/matches` - Zápasy z ESPN

## Featury

✅ **SQLite Database** - Persistentní uložení dat
✅ **SoccerData Integration** - Automatické stahování dat z FBref, ESPN atd.
✅ **Data Caching** - Inteligentní cache pro snížení počtu requestů
✅ **CORS Support** - Frontend na jiném portu bez problémů
✅ **Environment Config** - dev/prod/test konfigurace
✅ **Error Handling** - Srozumitelné error messages
✅ **Logging** - Detailní logy pro debugging

## Dostupné ligy (FBref)

- Big 5 European Leagues Combined
- ENG-Premier League
- ESP-La Liga
- FRA-Ligue 1
- GER-Bundesliga
- ITA-Serie A
- INT-World Cup
- INT-Women's World Cup

## Sezóny

Formát: `XXYY` (např. `2223` = 2022/23 sezóna)

## Příklad: Stažení dat

```bash
# Dostupné ligy
curl http://localhost:3001/api/teams/available-leagues

# Statistiky Premier League 2022/23
curl http://localhost:3001/api/teams/ENG-Premier%20League/2223/stats

# Lineups z Premier League 2022/23
curl http://localhost:3001/api/teams/ENG-Premier%20League/2223/lineups
```

## Migrace z Node.js backendu

Starý `index.js` je nahrazen tímto Python backendem. API je **kompatibilní** (vrací stejný JSON formát), takže frontend nemusí být změněn.

## Deployment

### Vercel / Railway / Render

```bash
# Vytvoř runtime.txt
echo "python-3.11.0" > runtime.txt

# Vercel: vercel.json
{
  "buildCommand": "pip install -r requirements.txt",
  "outputDirectory": ".",
  "env": {
    "FLASK_ENV": "production",
    "DATABASE_URL": "@your-db-url"
  }
}
```

## Příští kroky

- [ ] Migrace existujících dat z `data.json` do databáze
- [ ] Aktualizace frontend API calls (pokud je potřeba)
- [ ] Testování SoccerData integrací
- [ ] Nastavení production deploymentu
- [ ] Implementace dalších zdrojů (Understat, Sofascore, atd.)

## Troubleshooting

### SoccerData scraping je pomalý

- Přesunuto do backendu, frontend čeká asynchronně
- Prvotní stažení trvá déle, pak je vše cachováno

### Database.db se nezobrazuje

- SQLite se automaticky vytvoří při prvním spuštění
- Viz `flq.db` v server adresáři

### CORS errors

- Zkontroluj `.env` proměnnou `CORS_ORIGINS`
- Měla by obsahovat `http://localhost:3000`

## Resources

- [Flask dokumentace](https://flask.palletsprojects.com/)
- [SQLAlchemy dokumentace](https://docs.sqlalchemy.org/)
- [SoccerData dokumentace](https://soccerdata.readthedocs.io/)
