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
  players:  Player[];
}

export interface Player {
  id: number;
  position: string;
  name: string;
  guessed: boolean;
}

const PLAYER_POSITIONS: {
  value: string;
  players: Record<string, { top: string; left: string }>;
}[] = [
  {
    value: '4-3-3',
    players: {
      GK: { top: '50%', left: '16%' },
      CB1: { top: '40%', left: '25%' },
      CB2: { top: '60%', left: '25%' },
      LB: { top: '20%', left: '25%' },
      RB: { top: '80%', left: '25%' },
      CM1: { top: '30%', left: '45%' },
      CM2: { top: '50%', left: '45%' },
      CM3: { top: '70%', left: '45%' },
      LW: { top: '20%', left: '72%' },
      ST: { top: '50%', left: '72%' },
      RW: { top: '80%', left: '72%' },
    },
  },
  {
    value: '4-4-2',
    players: {
      GK: { top: '50%', left: '16%' },
      CB1: { top: '40%', left: '25%' },
      CB2: { top: '60%', left: '25%' },
      LB: { top: '20%', left: '25%' },
      RB: { top: '80%', left: '25%' },
      CM1: { top: '40%', left: '45%' },
      CM2: { top: '60%', left: '45%' },
      RM: { top: '80%', left: '45%' },
      LM: { top: '20%', left: '45%' },
      ST1: { top: '40%', left: '72%' },
      ST2: { top: '60%', left: '72%' },
    },
  },
];

const FORMATIONS: Formation[] = [
  {
    value: '4-3-3',
    players: ['GK', 'CB1', 'CB2', 'RB', 'LB', 'CM1', 'CM2', 'CM3', 'LW', 'ST', 'RW'],
  },
  {
    value: '4-4-2',
    players: ['GK', 'CB1', 'CB2', 'RB', 'LB', 'CM1', 'CM2', 'LM', 'RM', 'ST1', 'ST2'],
  },
];

export { FORMATIONS, PLAYER_POSITIONS };
