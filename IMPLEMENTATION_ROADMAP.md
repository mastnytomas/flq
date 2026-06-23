# 📊 Analýza Projektu FLQ - Aktuální Stav + Roadmap

## 🟢 CO JE HOTOVO

### Backend (Python Flask)
- ✅ Flask aplikace s error handling a logging
- ✅ SQLAlchemy ORM + SQLite databáze
- ✅ CORS nakonfigurovaný
- ✅ Models: `TeamLineup` + `ScrapedData`
- ✅ SoccerData service (FBref, ESPN)
- ✅ API endpoints:
  - `/api/data/save` - POST uživatelský lineup
  - `/api/data/load` - GET všechny lineupy
  - `/api/data/<id>` - GET/PUT/DELETE konkrétní lineup
  - `/api/teams/available-leagues` - GET ligy
  - `/api/teams/<league>/<season>/stats` - GET statistiky
  - `/api/teams/<league>/<season>/lineups` - GET lineups
  - `/api/teams/<league>/<season>/matches` - GET zápasy

### Frontend (React + TypeScript)
- ✅ Home stránka s tabulkou
- ✅ CreateLineup komponenta (vytváření vlastních sestav)
- ✅ FieldComponent (hádání hráčů)
- ✅ CreateFormation komponenta
- ✅ Zustand stores (lineupStore, formationStore)
- ✅ Ant Design UI komponenty

### Funkcionality
- ✅ Hádání lineupů (hangman-like game)
- ✅ Vytváření vlastních sestav
- ✅ Uložení hry do localStorage
- ✅ Export sestavy jako obrázek

---

## 🟡 CO CHYBÍ / NEFUNGUJE SPRÁVNĚ

### Frontend
- ❌ **Firebase Dependency** - Frontend stále používá Firebase místo Python backendu
- ❌ **SoccerData UI** - Nefunguje UI pro stahování lineupů ze SoccerData
- ❌ **Data Source Toggle** - Uživatel nemůže volit mezi "manual" a "SoccerData"
- ❌ **Advanced Stats** - Není UI pro prohlížení xG, passing, shooting stats

### Backend
- ⚠️ **Understat Integration** - Není implementované (jen FBref + ESPN)
- ⚠️ **WhoScored Integration** - Není implementované (potřeba Selenium)
- ⚠️ **Sofascore Integration** - Není implementované
- ⚠️ **Data Transformation** - LineUp data z FBref není transformováno do formátu aplikace

---

## 🚀 NAVRHOVANÉ FUNKCE NA IMPLEMENTACI

### Priority 1 - KRITICKÉ (nutné pro fungování)

#### 1.1 Propojení Frontend ↔ Backend
**Popis:** Frontend opustí Firebase, bude používat Python backend
**Soubory:** 
- `client/src/store/lineupStore.ts` - Přepsat fetch z Firebase na HTTP calls
- `client/src/store/formationStore.ts` - Přepsat fetch
**Práce:** ~2-3 hodiny
**Benefit:** Centrální datový zdroj, snadnější maintenance

#### 1.2 Konverze SoccerData LineUp → Squad format
**Popis:** FBref lineups převést do aplikačního formátu (Squad, Player)
**Komponenty:**
- `server/services/data_transformer.py` - Nový soubor
- Funkce: `fbref_lineup_to_squad()`, `espn_schedule_to_lineup()`
**Práce:** ~3 hodiny
**Benefit:** Uživatelé mohou hádát lineups z reálných zápasů

#### 1.3 Import Real Lineups - Frontend komponenta
**Popis:** UI pro výběr ligy/sezóny a import lineupů ze SoccerData
**Komponenta:** `client/src/components/ImportLineups.tsx`
- Select pro ligu
- Select pro sezónu
- Tabulka s zápasy
- Button "Import as Quiz"
**Práce:** ~3 hodiny
**Benefit:** Uživatelé si importují skutečné lineups do aplikace

---

### Priority 2 - VYSOKÁ (rozšíření funkcionalitly)

#### 2.1 Player Statistics View
**Popis:** UI pro prohlížení hráčových statistik
**Komponenta:** `client/src/components/PlayerStats.tsx`
- Tab v FieldComponent
- Zobrazení: góly, asistence, procento pasů, atd.
**API Endpoint:** `GET /api/teams/<league>/<season>/player-stats`
**Práce:** ~4 hodiny
**Benefit:** Edukativní obsah, lepší UX

#### 2.2 Team Statistics View
**Popis:** Porovnání statistik týmů
**Komponenta:** `client/src/components/TeamComparison.tsx`
- Výběr dvou týmů
- Side-by-side statistiky
**Práce:** ~3 hodiny
**Benefit:** Analytics layer

#### 2.3 Advanced Understat Integration
**Popis:** Stahování xG a pokročilých statistik
**Soubor:** `server/services/soccerdata_service.py` - přidat `get_understat_stats()`
- Expected Goals (xG)
- xG per shot
- xGChain
**Práce:** ~2-3 hodiny
**Poznámka:** Understat možná vyžaduje authentication
**Benefit:** Advanced metrics pro hráče/týmy

---

### Priority 3 - STŘEDNÍ (nice-to-have)

#### 3.1 Sofascore Integration
**Popis:** Přidat Sofascore jako druhý zdroj lineupů
**Soubor:** `server/services/soccerdata_service.py` - přidat `get_sofascore_lineups()`
**Práce:** ~2 hodiny
**Benefit:** Redundance, lepší pokrytí dat

#### 3.2 Player Search & Filter
**Popis:** Vyhledávání hráčů v databázi
**Komponenta:** `client/src/components/PlayerSearch.tsx`
- Autocomplete search
- Filtr podle pozice, týmu
- Zobrazení career stats
**Práce:** ~3 hodiny
**Benefit:** Better discovery

#### 3.3 Leaderboard
**Popis:** Ranking hráčů/týmů podle statistik
**Komponenta:** `client/src/components/Leaderboard.tsx`
- Top scoring teams
- Best pass completion
- Most goals
**Práce:** ~2 hodiny
**Benefit:** Gamification

#### 3.4 Historical Lineup Comparisons
**Popis:** Srovnění jak se měnila sestava v čase
**Komponenta:** `client/src/components/LineupHistory.tsx`
- Timeline vizualizace
- Change tracking
**Práce:** ~4 hodiny
**Benefit:** Advanced analytics

---

### Priority 4 - NÍZKÁ (optimalizace)

#### 4.1 Cache Optimization
**Popis:** Lepší caching strategie, expiry handling
**Soubor:** `server/services/soccerdata_service.py`
**Práce:** ~2 hodiny
**Benefit:** Rychlejší load times, levnější API calls

#### 4.2 WhoScored Event Stream
**Popis:** Event-by-event replay zápasu
**Poznámka:** Vyžaduje Selenium, komplexní scraping
**Práce:** ~6-8 hodin
**Benefit:** Advanced match analysis

#### 4.3 Mobile Optimization
**Popis:** Responsive design pro mobilní zařízení
**Soubory:** `client/src/**/*.tsx` - CSS updates
**Práce:** ~3-4 hodiny
**Benefit:** UX na mobilu

#### 4.4 Dark/Light Theme Toggle
**Popis:** User preference pro téma
**Soubor:** `client/src/App.tsx`
**Práce:** ~1 hodina
**Benefit:** Accessibility

---

## 📋 DOPORUČENÝ POŘADÍ IMPLEMENTACE

### Fáze 1: CORE (1-2 týdny)
1. **1.1** Propojit Frontend ↔ Backend (Firebase → Python)
2. **1.2** Konverze SoccerData formátu
3. **1.3** Import Real Lineups komponenta

### Fáze 2: ENHANCEMENT (1-2 týdny)
4. **2.1** Player Statistics View
5. **2.2** Team Statistics View
6. **2.3** Understat Integration (pokud je dostupné)

### Fáze 3: NICE-TO-HAVE (1 týden)
7. **3.1** Sofascore Integration
8. **3.2** Player Search
9. **3.3** Leaderboard

### Fáze 4: POLISH (dle času)
10. **3.4** Historical Comparisons
11. **4.1** Cache Optimization
12. **4.2** WhoScored (složité)
13. **4.3** Mobile Optimization

---

## 🎯 QUICK WINS (co dělat jako první)

1. **Import Real Lineups** (1.3) - Uživatelé si hned mohou importovat zápasy
2. **Player Stats View** (2.1) - Edukativní obsah
3. **Team Comparison** (2.2) - Analytics

---

## ⚙️ TECHNICAL NOTES

### Stack
- **Frontend:** React 18 + TypeScript + Zustand + Ant Design
- **Backend:** Flask + SQLAlchemy + SoccerData
- **Data:** SQLite local, Pandas for processing

### Performance Considerations
- SoccerData scraping trvá ~10-30s na prvotní stažení
- Cache 7 dní = lepší performance
- Frontend by měl mít loading states

### Security
- CORS nakonfigurován pro localhost:3000
- Production: usar environment variables
- Validace inputs na backendu

---

## 📞 NEXT STEPS

Máš zájem na nějaké z těchto funkcí? Vyberes si prioritu a começnem:

**Option A:** Implementuju **1.1 + 1.2 + 1.3** (Core features)
**Option B:** Konkrétní feature z Priority 2/3
**Option C:** Něco úplně jiného co máš v plánu?
