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
}

export interface Player {
  id: number;
  position: string;
  name: string;
  guessed: boolean;
  correctChars: string[];
  wrongChars: string[];
}
