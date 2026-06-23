import { create } from 'zustand';
import { Formation } from '../types';
import { FORMATIONS } from '../config/config';

interface FormationState {
  formations: Formation[];
  loading: boolean;
  error: string | null;
  fetchFormations: () => Promise<void>;
}

export const useFormationStore = create<FormationState>((set) => ({
  formations: FORMATIONS,
  loading: false,
  error: null,

  fetchFormations: async () => {
    // Formace jsou statické v config.tsx, jen je načteme
    set({
      formations: FORMATIONS,
      loading: false,
      error: null,
    });
  },
}));
