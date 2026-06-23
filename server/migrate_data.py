"""
Migration skript pro import starých dat z data.json do SQLite databáze

Spuštění:
  python migrate_data.py
"""

import json
import uuid
from app import create_app, db
from models import TeamLineup

def migrate_data():
    """Migrace dat z data.json do databáze"""

    app = create_app('development')

    with app.app_context():
        # Čti staré data z data.json
        try:
            with open('../server/data.json', 'r', encoding='utf-8') as f:
                old_data = json.load(f)
        except FileNotFoundError:
            print("❌ data.json nebyl nalezen")
            return
        except json.JSONDecodeError:
            print("❌ data.json má špatný JSON formát")
            return

        print(f"📖 Čtení {len(old_data)} lineupů z data.json...")

        # Konvertuj a ulož do databáze
        migrated = 0
        for item in old_data:
            try:
                lineup = TeamLineup(
                    id=item.get('id', str(uuid.uuid4())),
                    name=item.get('name'),
                    coach=item.get('coach'),
                    description=item.get('description'),
                    year=item.get('year'),
                    opponent=item.get('opponent'),
                    formation=item.get('formation'),
                    players=item.get('players', []),
                    source='manual'  # Starší data jsou ručně vytvořená
                )

                db.session.add(lineup)
                migrated += 1

            except Exception as e:
                print(f"⚠️  Chyba při migraci {item.get('name')}: {e}")
                continue

        # Ulož všechna data
        try:
            db.session.commit()
            print(f"✅ Úspěšně migrováno {migrated} lineupů do databáze!")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Chyba při ukládání do databáze: {e}")

if __name__ == '__main__':
    migrate_data()
