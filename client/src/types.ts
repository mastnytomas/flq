export interface Formation {
  value: string;
  players: string[];
}

export interface Squad {
  coach: string;
  description: string;
  formation: string;
  id: string;
  name: string;
  year: number;
  opponent: string;
  players: Player[];
  source?: 'manual' | 'soccerdata';
}

export interface Player {
  id: number;
  position: string;
  name: string;
  guessed: boolean;
  correctChars: string[];
  wrongChars: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

export interface UserStats {
  userId: string;
  totalGames: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  favoriteLeague?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  userId: string;
  lineupId: string;
  addedAt: Date;
}
