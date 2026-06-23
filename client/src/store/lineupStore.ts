import { create } from 'zustand';
import { Squad } from '../types';
import { API_ENDPOINTS } from '../config/config';

interface LineupState {
  lineups: Squad[];
  loading: boolean;
  error: string | null;
  fetchLineups: () => Promise<void>;
  fetchLineupById: (id: string) => Promise<Squad | undefined>;
  createLineup: (lineup: Omit<Squad, 'id'>) => Promise<string>;
  updateLineup: (id: string, lineup: Partial<Squad>) => Promise<void>;
  deleteLineup: (id: string) => Promise<void>;
  getRandomLineup: () => Promise<Squad | undefined>;
}

export const useLineupStore = create<LineupState>((set, get) => ({
  lineups: [],
  loading: false,
  error: null,
  
  fetchLineups: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.LOAD_DATA);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      const lineups = result.data || [];
      set({ lineups, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při načítání lineupů';
      set({ error: errorMsg, loading: false });
      console.error('Fetch lineups error:', error);
    }
  },
  
  fetchLineupById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.GET_LINEUP(id));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      const lineup = result.data as Squad;
      set({ loading: false });
      return lineup;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při načítání lineupů';
      set({ error: errorMsg, loading: false });
      console.error('Fetch lineup by id error:', error);
      return undefined;
    }
  },
  
  createLineup: async (lineup) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.SAVE_DATA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lineup),
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      const newLineup = result.data as Squad;
      
      // Přidej nový lineup do state
      set((state) => ({
        lineups: [...state.lineups, newLineup],
        loading: false,
      }));
      
      return newLineup.id;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při vytváření lineupů';
      set({ error: errorMsg, loading: false });
      console.error('Create lineup error:', error);
      throw error;
    }
  },
  
  updateLineup: async (id: string, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_LINEUP(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      const updatedLineup = result.data as Squad;
      
      // Updatuj lineup v state
      set((state) => ({
        lineups: state.lineups.map((l) => (l.id === id ? updatedLineup : l)),
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při aktualizaci lineupů';
      set({ error: errorMsg, loading: false });
      console.error('Update lineup error:', error);
      throw error;
    }
  },
  
  deleteLineup: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LINEUP(id), {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Odeber lineup ze state
      set((state) => ({
        lineups: state.lineups.filter((l) => l.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při mazání lineupů';
      set({ error: errorMsg, loading: false });
      console.error('Delete lineup error:', error);
      throw error;
    }
  },
  
  getRandomLineup: async () => {
    try {
      const { lineups } = get();
      
      // Pokud lineups nejsou načteny, načti je
      if (lineups.length === 0) {
        await get().fetchLineups();
      }
      
      const currentLineups = get().lineups;
      if (currentLineups.length === 0) return undefined;
      
      const randomIndex = Math.floor(Math.random() * currentLineups.length);
      return currentLineups[randomIndex];
    } catch (error) {
      console.error('Get random lineup error:', error);
      return undefined;
    }
  },
}));
