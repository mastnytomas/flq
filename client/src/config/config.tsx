import { Formation } from '../types';

// Development: 'http://localhost:3001'
// Production: 'https://flq-server.onrender.com/'
const SERVER_URL = 'http://localhost:3001';

// API Endpoints
const API_ENDPOINTS = {
  // Data endpoints (uživatelské lineupy)
  SAVE_DATA: `${SERVER_URL}/api/data/save`,
  LOAD_DATA: `${SERVER_URL}/api/data/load`,
  GET_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,
  UPDATE_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,
  DELETE_LINEUP: (id: string) => `${SERVER_URL}/api/data/${id}`,

  // SoccerData endpoints
  AVAILABLE_LEAGUES: `${SERVER_URL}/api/teams/available-leagues`,
  TEAM_STATS: (league: string, season: string) =>
    `${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/stats`,
  TEAM_LINEUPS: (league: string, season: string) =>
    `${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/lineups`,
  TEAM_MATCHES: (league: string, season: string) =>
    `${SERVER_URL}/api/teams/${encodeURIComponent(league)}/${season}/matches`,
};

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

export { API_ENDPOINTS, FORMATIONS, PLAYER_POSITIONS, SERVER_URL };
