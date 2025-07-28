import { create } from 'zustand';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Formation } from '../types';

interface FormationState {
  formations: Formation[];
  loading: boolean;
  fetchFormations: () => Promise<void>;
  createFormation: (formation: Omit<Formation, 'id'>) => Promise<string>;
}

export const useFormationStore = create<FormationState>((set) => ({
  formations: [],
  loading: false,
  fetchFormations: async () => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, 'formations'));
    const formations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    set({ formations, loading: false });
  },
  createFormation: async (formation) => {
    const docRef = await addDoc(collection(db, 'formations'), formation);
    return docRef.id;
  },
}));
