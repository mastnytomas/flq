import { create } from 'zustand';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { Squad } from '../types';

interface LineupState {
  lineups: Squad[];
  loading: boolean;
  fetchLineups: () => Promise<void>;
  fetchLineupById: (id: string) => Promise<Squad | undefined>;
  createLineup: (lineup: Omit<Squad, 'id'>) => Promise<string>;
  getRandomLineup: () => Promise<Squad | undefined>;
}

export const useLineupStore = create<LineupState>((set) => ({
  lineups: [],
  loading: false,
  fetchLineups: async () => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, 'lineups'));
    const lineups = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    set({ lineups, loading: false });
  },
  fetchLineupById: async (id: string) => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, 'lineups'));
    const doc = snapshot.docs.find((d: any) => d.id === id);
    set({ loading: false });
    return doc ? ({ id: doc.id, ...doc.data() } as Squad) : undefined;
  },
  createLineup: async (lineup) => {
    const docRef = await addDoc(collection(db, 'lineups'), lineup);
    return docRef.id;
  },
  getRandomLineup: async () => {
    const snapshot = await getDocs(collection(db, 'lineups'));
    const lineups = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    if (lineups.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * lineups.length);
    return lineups[randomIndex];
  },
}));
