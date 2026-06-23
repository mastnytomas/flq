import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from models import db
from routes import register_blueprints

# Configuruj logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """Application factory"""
    
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    # Vytvoř Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Inicializuj databázi
    db.init_app(app)
    
    # Nastav CORS
    CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))
    
    # Registruj blueprinty (routes)
    register_blueprints(app)
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'environment': config_name
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint nenalezen'}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        logger.error(f'Server error: {error}')
        return jsonify({'error': 'Interní chyba serveru'}), 500
    
    # Vytvoř database tables
    with app.app_context():
        db.create_all()
        logger.info('Database tables created')
    
    logger.info(f'Flask app vytvořena s konfigurací: {config_name}')
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 3001))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config['DEBUG']
    )
