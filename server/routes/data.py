from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime

from models import db, TeamLineup

data_bp = Blueprint('data', __name__, url_prefix='/api/data')

@data_bp.route('/save', methods=['POST'])
def save_data():
    """
    Ulož nový lineup

    Očekávaný JSON:
    {
        "name": "Team Name",
        "coach": "Coach Name",
        "description": "Description",
        "year": 2023,
        "opponent": "Opponent",
        "formation": "4-3-3",
        "players": [...]
    }
    """
    try:
        data = request.get_json()

        # Validace
        if not data.get('name'):
            return jsonify({'error': 'Název týmu je povinný'}), 400

        # Vytvoř nový lineup
        lineup = TeamLineup(
            id=str(uuid.uuid4()),
            name=data.get('name'),
            coach=data.get('coach'),
            description=data.get('description'),
            year=data.get('year'),
            opponent=data.get('opponent'),
            formation=data.get('formation'),
            players=data.get('players', []),
            source='manual'
        )

        db.session.add(lineup)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Data byla úspěšně uložena',
            'data': lineup.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@data_bp.route('/load', methods=['GET'])
def load_data():
    """
    Načti všechny uložené lineupy

    Query parametry:
    - source: filtr podle zdroje ('manual', 'soccerdata')
    - limit: počet výsledků
    - offset: offset pro pagination
    """
    try:
        # Filtrování
        query = TeamLineup.query

        source = request.args.get('source')
        if source:
            query = query.filter_by(source=source)

        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)

        # Pagination
        total = query.count()
        lineups = query.limit(limit).offset(offset).all()

        return jsonify({
            'success': True,
            'total': total,
            'limit': limit,
            'offset': offset,
            'data': [lineup.to_dict() for lineup in lineups]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_bp.route('/<lineup_id>', methods=['GET'])
def get_lineup(lineup_id):
    """Načti konkrétní lineup"""
    try:
        lineup = TeamLineup.query.filter_by(id=lineup_id).first()

        if not lineup:
            return jsonify({'error': 'Lineup nenalezen'}), 404

        return jsonify({
            'success': True,
            'data': lineup.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_bp.route('/<lineup_id>', methods=['PUT'])
def update_lineup(lineup_id):
    """Aktualizuj lineup"""
    try:
        lineup = TeamLineup.query.filter_by(id=lineup_id).first()

        if not lineup:
            return jsonify({'error': 'Lineup nenalezen'}), 404

        data = request.get_json()

        # Aktualizuj pole
        if 'name' in data:
            lineup.name = data['name']
        if 'coach' in data:
            lineup.coach = data['coach']
        if 'description' in data:
            lineup.description = data['description']
        if 'year' in data:
            lineup.year = data['year']
        if 'opponent' in data:
            lineup.opponent = data['opponent']
        if 'formation' in data:
            lineup.formation = data['formation']
        if 'players' in data:
            lineup.players = data['players']

        lineup.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Lineup byl aktualizován',
            'data': lineup.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@data_bp.route('/<lineup_id>', methods=['DELETE'])
def delete_lineup(lineup_id):
    """Smaž lineup"""
    try:
        lineup = TeamLineup.query.filter_by(id=lineup_id).first()

        if not lineup:
            return jsonify({'error': 'Lineup nenalezen'}), 404

        db.session.delete(lineup)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Lineup byl smazán'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
