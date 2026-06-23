"""
Příklady use casů a requestů pro testování API
"""

# 1. Zdravotní check
curl http://localhost:3001/health

# 2. Načti dostupné ligy
curl http://localhost:3001/api/teams/available-leagues

# 3. Stáhni statistiky Premier League (sezóna 2022/23)
curl "http://localhost:3001/api/teams/ENG-Premier%20League/2223/stats"

# 4. Stáhni lineups z Premier League
curl "http://localhost:3001/api/teams/ENG-Premier%20League/2223/lineups"

# 5. Stáhni zápasy z ESPN
curl "http://localhost:3001/api/teams/ENG-Premier%20League/2223/matches"

# 6. Ulož nový lineup
curl -X POST http://localhost:3001/api/data/save \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manchester United",
    "coach": "Erik ten Hag",
    "description": "Classic Man United formation",
    "year": 2023,
    "opponent": "Liverpool",
    "formation": "4-3-3",
    "players": [
      {"id": "1", "name": "De Gea", "position": "GK"},
      {"id": "2", "name": "Wan-Bissaka", "position": "RB"}
    ]
  }'

# 7. Načti všechny lineupy
curl http://localhost:3001/api/data/load

# 8. Načti konkrétní lineup
curl http://localhost:3001/api/data/<lineup_id>

# 9. Aktualizuj lineup
curl -X PUT http://localhost:3001/api/data/<lineup_id> \
  -H "Content-Type: application/json" \
  -d '{
    "coach": "New Coach",
    "formation": "4-2-3-1"
  }'

# 10. Smaž lineup
curl -X DELETE http://localhost:3001/api/data/<lineup_id>
