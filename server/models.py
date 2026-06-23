from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.sqlite import JSON

db = SQLAlchemy()

class TeamLineup(db.Model):
    """Model pro týmové sestavy"""
    __tablename__ = 'team_lineups'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    coach = db.Column(db.String(255))
    description = db.Column(db.Text)
    year = db.Column(db.Integer)
    opponent = db.Column(db.String(255))
    formation = db.Column(db.String(50))
    
    # JSON pole pro hráče
    players = db.Column(JSON, nullable=False, default=list)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    source = db.Column(db.String(50), default='manual')  # 'manual', 'soccerdata', atd.
    
    def to_dict(self):
        """Konvertuj model na dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'coach': self.coach,
            'description': self.description,
            'year': self.year,
            'opponent': self.opponent,
            'formation': self.formation,
            'players': self.players,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'source': self.source
        }

class ScrapedData(db.Model):
    """Model pro cachované data ze SoccerData"""
    __tablename__ = 'scraped_data'
    
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(50), nullable=False)  # 'fbref', 'espn', atd.
    league = db.Column(db.String(100), nullable=False)
    season = db.Column(db.String(10), nullable=False)
    data_type = db.Column(db.String(50), nullable=False)  # 'lineup', 'stats', atd.
    data = db.Column(JSON, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)  # Pro cache invalidaci
    
    __table_args__ = (
        db.UniqueConstraint('source', 'league', 'season', 'data_type', name='uq_scraped_data'),
    )
