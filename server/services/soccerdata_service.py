import os
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import pandas as pd

try:
    import soccerdata as sd
except ImportError:
    sd = None

from models import db, ScrapedData

logger = logging.getLogger(__name__)

class SoccerDataService:
    """Service pro práci se SoccerData knihovnou"""

    CACHE_EXPIRY_DAYS = 7  # Cache platí 7 dní

    def __init__(self, cache_dir: Optional[str] = None):
        if sd is None:
            raise RuntimeError("SoccerData není nainstalován. Spusť: pip install soccerdata")

        self.cache_dir = cache_dir or os.getenv('SOCCERDATA_DIR', './soccerdata_cache')
        os.makedirs(self.cache_dir, exist_ok=True)

    def get_fbref_teams(self, league: str, season: str) -> Optional[pd.DataFrame]:
        """
        Stáhni seznam týmů z FBref

        Args:
            league: Liga (např. 'ENG-Premier League')
            season: Sezóna (např. '2223')

        Returns:
            DataFrame s týmy nebo None
        """
        try:
            # Zkontroluj cache
            cached = self._get_cached_data('fbref', league, season, 'teams')
            if cached is not None:
                logger.info(f"Vrací cachovaná data pro {league} {season}")
                return cached

            # Stáhni z FBref
            logger.info(f"Stahuji týmy z FBref: {league} {season}")
            fbref = sd.FBref(
                leagues=[league],
                seasons=[season],
                data_dir=self.cache_dir
            )

            # Čti data
            teams_data = fbref.read_team_season_stats(stat_type='shooting')

            # Cache data
            self._cache_data('fbref', league, season, 'teams', teams_data)

            logger.info(f"Úspěšně staženo {len(teams_data)} týmů")
            return teams_data

        except Exception as e:
            logger.error(f"Chyba při stahování FBref dat: {e}")
            return None

    def get_fbref_lineups(self, league: str, season: str) -> Optional[pd.DataFrame]:
        """
        Stáhni lineups z FBref

        Args:
            league: Liga (např. 'ENG-Premier League')
            season: Sezóna (např. '2223')

        Returns:
            DataFrame s lineupem nebo None
        """
        try:
            cached = self._get_cached_data('fbref', league, season, 'lineups')
            if cached is not None:
                logger.info(f"Vrací cachovaná lineups pro {league} {season}")
                return cached

            logger.info(f"Stahuji lineups z FBref: {league} {season}")
            fbref = sd.FBref(
                leagues=[league],
                seasons=[season],
                data_dir=self.cache_dir
            )

            lineups = fbref.read_lineup()

            self._cache_data('fbref', league, season, 'lineups', lineups)

            logger.info(f"Úspěšně staženo {len(lineups)} lineupů")
            return lineups

        except Exception as e:
            logger.error(f"Chyba při stahování lineupů: {e}")
            return None

    def get_fbref_available_leagues(self) -> List[str]:
        """Vrať seznam dostupných lig na FBref"""
        if sd is None:
            return []

        try:
            return sd.FBref.available_leagues()
        except Exception as e:
            logger.error(f"Chyba při načítání dostupných lig: {e}")
            return []

    def get_espn_matches(self, league: str, season: str) -> Optional[pd.DataFrame]:
        """
        Stáhni zápasy z ESPN

        Args:
            league: Liga (např. 'ENG-Premier League')
            season: Sezóna (např. '2223')

        Returns:
            DataFrame se zápasy nebo None
        """
        try:
            cached = self._get_cached_data('espn', league, season, 'matches')
            if cached is not None:
                logger.info(f"Vrací cachovaná ESPN data pro {league} {season}")
                return cached

            logger.info(f"Stahuji zápasy z ESPN: {league} {season}")
            espn = sd.ESPN(
                leagues=[league],
                seasons=[season],
                data_dir=self.cache_dir
            )

            matches = espn.read_schedule()

            self._cache_data('espn', league, season, 'matches', matches)

            logger.info(f"Úspěšně staženo {len(matches)} zápasů")
            return matches

        except Exception as e:
            logger.error(f"Chyba při stahování ESPN dat: {e}")
            return None

    def _get_cached_data(self, source: str, league: str, season: str, data_type: str) -> Optional[pd.DataFrame]:
        """Načti data z cache"""
        try:
            cached = ScrapedData.query.filter_by(
                source=source,
                league=league,
                season=season,
                data_type=data_type
            ).first()

            if cached and (cached.expires_at is None or cached.expires_at > datetime.utcnow()):
                logger.debug(f"Cache hit: {source} {league} {season} {data_type}")
                return pd.DataFrame(cached.data)
            elif cached:
                # Smaž starou cache
                db.session.delete(cached)
                db.session.commit()
                logger.debug(f"Cache expired: {source} {league} {season} {data_type}")

            return None
        except Exception as e:
            logger.warning(f"Chyba při čtení cache: {e}")
            return None

    def _cache_data(self, source: str, league: str, season: str, data_type: str, data: pd.DataFrame):
        """Ulož data do cache"""
        try:
            # Konvertuj DataFrame na seznam slovníků
            data_dict = data.to_dict('records') if isinstance(data, pd.DataFrame) else data

            cached = ScrapedData(
                source=source,
                league=league,
                season=season,
                data_type=data_type,
                data=data_dict,
                expires_at=datetime.utcnow() + timedelta(days=self.CACHE_EXPIRY_DAYS)
            )

            db.session.merge(cached)
            db.session.commit()
            logger.debug(f"Data cachováno: {source} {league} {season} {data_type}")
        except Exception as e:
            logger.warning(f"Chyba při cachování: {e}")
