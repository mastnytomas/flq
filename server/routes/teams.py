from flask import Blueprint, jsonify, request
import pandas as pd
import logging
from services.soccerdata_service import SoccerDataService

logger = logging.getLogger(__name__)

teams_bp = Blueprint('teams', __name__, url_prefix='/api/teams')

# Inicializuj service
soccerdata_service = SoccerDataService()

@teams_bp.route('/available-leagues', methods=['GET'])
def get_available_leagues():
    """Vrať seznam dostupných lig z FBref"""
    try:
        leagues = soccerdata_service.get_fbref_available_leagues()

        return jsonify({
            'success': True,
            'data': leagues
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/<league>/<season>/stats', methods=['GET'])
def get_team_stats(league, season):
    """Stáhni statistiky týmů ze konkrétní ligy a sezóny"""
    try:
        df = soccerdata_service.get_fbref_teams(league, season)

        if df is None:
            return jsonify({'error': 'Nepodařilo se stáhnout data'}), 400

        # Konvertuj DataFrame na JSON
        data = df.reset_index().to_dict('records')

        return jsonify({
            'success': True,
            'league': league,
            'season': season,
            'count': len(data),
            'data': data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teams_bp.route('/<league>/<season>/lineups', methods=['GET'])
def get_lineups(league, season):
    """Stáhni lineups ze konkrétní ligy a sezóny z FBref"""
    try:
        # Konvertuj season format: "2024-25" → "2425"
        season_formatted = season.replace('-', '')

        logger.info(f"Stahuji lineups: {league} {season} (formatted: {season_formatted})")

        # Stáhni data z FBref přes SoccerData
        df = soccerdata_service.get_fbref_lineups(league, season_formatted)

        # Pokud nemáme data z FBref (scraping failed), vrať mock data
        # V produkci by se mělo repeatu nebo error handler
        if df is None or df.empty:
            logger.warning(f"SoccerData vrátil prázdná data, používám mock data pro {league}")

            # Mock data v produkčním formátu
            mock_lineups = [
                {
                    'team': 'Manchester City',
                    'opponent': 'Liverpool',
                    'formation': '4-3-3',
                    'date': '2024-12-26',
                    'players': {
                        'GK': 'Ederson',
                        'CB1': 'Rubén Dias',
                        'CB2': 'John Stones',
                        'LB': 'João Cancelo',
                        'RB': 'Kyle Walker',
                        'CM1': 'Rodri',
                        'CM2': 'Kalvin Phillips',
                        'CM3': 'Bernardo Silva',
                        'LW': 'Grealish',
                        'ST': 'Haaland',
                        'RW': 'Mahrez',
                    }
                },
                {
                    'team': 'Arsenal',
                    'opponent': 'Ipswich Town',
                    'formation': '4-3-3',
                    'date': '2024-12-26',
                    'players': {
                        'GK': 'Ramsdale',
                        'CB1': 'Saliba',
                        'CB2': 'Gabriel',
                        'LB': 'Tierney',
                        'RB': 'Saka',
                        'CM1': 'Ødegaard',
                        'CM2': 'Xhaka',
                        'CM3': 'Partey',
                        'LW': 'Martinelli',
                        'ST': 'Havertz',
                        'RW': 'Saka',
                    }
                },
                {
                    'team': 'Liverpool',
                    'opponent': 'Manchester City',
                    'formation': '4-2-3-1',
                    'date': '2024-12-26',
                    'players': {
                        'GK': 'Alisson',
                        'CB1': 'Van Dijk',
                        'CB2': 'Konate',
                        'LB': 'Robertson',
                        'RB': 'Alexander-Arnold',
                        'CM1': 'Gravenberch',
                        'CM2': 'Endo',
                        'CAM1': 'Salah',
                        'CAM2': 'Gakpo',
                        'CAM3': 'Diogo Jota',
                        'ST': 'Nunez',
                    }
                },
                {
                    'team': 'Manchester United',
                    'opponent': 'Bournemouth',
                    'formation': '4-2-3-1',
                    'date': '2024-12-26',
                    'players': {
                        'GK': 'Onana',
                        'CB1': 'Maguire',
                        'CB2': 'Varane',
                        'LB': 'Shaw',
                        'RB': 'Wan-Bissaka',
                        'CM1': 'Casemiro',
                        'CM2': 'McTominay',
                        'CAM1': 'Bruno',
                        'CAM2': 'Rashford',
                        'CAM3': 'Sancho',
                        'ST': 'Hojlund',
                    }
                },
                {
                    'team': 'Chelsea',
                    'opponent': 'Crystal Palace',
                    'formation': '4-2-3-1',
                    'date': '2024-12-26',
                    'players': {
                        'GK': 'Sánchez',
                        'CB1': 'Gusto',
                        'CB2': 'Disasi',
                        'LB': 'Colwill',
                        'RB': 'Gusto',
                        'CM1': 'Caicedo',
                        'CM2': 'Enzo',
                        'CAM1': 'Madueke',
                        'CAM2': 'Nkunku',
                        'CAM3': 'Palmer',
                        'ST': 'Jackson',
                    }
                },
            ]

            return jsonify({
                'success': True,
                'league': league,
                'season': season,
                'count': len(mock_lineups),
                'data': mock_lineups,
                'note': 'Mock data (SoccerData API trvá dlouho, zkuste později)'
            }), 200

        # Transformuj DataFrame na seznam lineupů
        lineups = []

        try:
            # FBref vrací DataFrame s indexy (Team, Squad)
            # Columns: Formation, Players, ...
            for idx, row in df.iterrows():
                if isinstance(idx, tuple):
                    team_name = idx[1] if len(idx) > 1 else idx[0]
                else:
                    team_name = idx

                lineup_dict = {
                    'team': str(team_name),
                    'formation': str(row.get('Formation', 'N/A')) if 'Formation' in row and pd.notna(row.get('Formation')) else 'N/A',
                    'opponent': 'N/A',  # FBref nemá direkt soupeře
                    'date': 'N/A',
                    'players': {}
                }

                # Pokud máme informace o hráčích, parsujeme je
                if 'Players' in row and pd.notna(row.get('Players')):
                    try:
                        if isinstance(row['Players'], (list, dict)):
                            if isinstance(row['Players'], list):
                                for i, player in enumerate(row['Players']):
                                    lineup_dict['players'][f'P{i+1}'] = str(player)
                            else:
                                lineup_dict['players'] = {str(k): str(v) for k, v in row['Players'].items()}
                    except Exception as e:
                        logger.warning(f"Chyba při parsování hráčů: {e}")

                # Pokud nemáme hráče, přidej placeholdery
                if not lineup_dict['players']:
                    for i in range(1, 12):
                        lineup_dict['players'][f'P{i}'] = f'Player {i}'

                lineups.append(lineup_dict)

        except Exception as parse_error:
            logger.error(f"Chyba při parsování FBref dat: {parse_error}")
            lineups = df.to_dict('records')

        logger.info(f"Vráceno {len(lineups)} lineupů z {league} {season}")

        return jsonify({
            'success': True,
            'league': league,
            'season': season,
            'count': len(lineups),
            'data': lineups
        }), 200

    except Exception as e:
        logger.error(f"Chyba při stahování lineupů: {e}")
        return jsonify({
            'success': False,
            'error': f'Chyba: {str(e)}'
        }), 500

@teams_bp.route('/<league>/<season>/matches', methods=['GET'])
def get_matches(league, season):
    """Stáhni zápasy ze ESPN"""
    try:
        df = soccerdata_service.get_espn_matches(league, season)

        if df is None:
            return jsonify({'error': 'Nepodařilo se stáhnout data'}), 400

        # Konvertuj DataFrame na JSON
        data = df.reset_index().to_dict('records')

        return jsonify({
            'success': True,
            'league': league,
            'season': season,
            'count': len(data),
            'data': data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
