from flask import Blueprint

def register_blueprints(app):
    """Registruj všechny route blueprinty"""
    from .teams import teams_bp
    from .data import data_bp
    
    app.register_blueprint(teams_bp)
    app.register_blueprint(data_bp)
