import { create } from 'zustand';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { User, UserStats, Favorite } from '../types';

interface UserState {
  // User data
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  // User stats
  userStats: UserStats | null;

  // Favorites
  favorites: string[]; // Array of lineup IDs

  // Actions
  fetchUserStats: (userId: string) => Promise<void>;
  createUserStats: (userId: string) => Promise<void>;
  updateUserStats: (userId: string, stats: Partial<UserStats>) => Promise<void>;

  // Favorites
  fetchFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, lineupId: string) => Promise<void>;
  removeFavorite: (userId: string, lineupId: string) => Promise<void>;
  isFavorite: (lineupId: string) => boolean;

  // Auth
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  loading: false,
  error: null,
  userStats: null,
  favorites: [],

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  fetchUserStats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'user_stats', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          userStats: {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          } as UserStats,
          loading: false,
        });
      } else {
        set({ userStats: null, loading: false });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při načítání statistik';
      set({ error: errorMsg, loading: false });
      console.error('Fetch user stats error:', error);
    }
  },

  createUserStats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const newStats: UserStats = {
        userId,
        totalGames: 0,
        gamesWon: 0,
        totalScore: 0,
        averageScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = doc(db, 'user_stats', userId);
      await setDoc(docRef, newStats);

      set({ userStats: newStats, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při vytváření statistik';
      set({ error: errorMsg, loading: false });
      console.error('Create user stats error:', error);
      throw error;
    }
  },

  updateUserStats: async (userId: string, stats: Partial<UserStats>) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'user_stats', userId);
      await updateDoc(docRef, {
        ...stats,
        updatedAt: new Date(),
      });

      // Update local state
      const currentStats = get().userStats;
      if (currentStats) {
        set({
          userStats: {
            ...currentStats,
            ...stats,
            updatedAt: new Date(),
          },
          loading: false,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při aktualizaci statistik';
      set({ error: errorMsg, loading: false });
      console.error('Update user stats error:', error);
      throw error;
    }
  },

  fetchFavorites: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'favorites'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const favoriteLineups = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Favorite;
        return data.lineupId;
      });

      set({ favorites: favoriteLineups, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při načítání oblíbených';
      set({ error: errorMsg, loading: false });
      console.error('Fetch favorites error:', error);
    }
  },

  addFavorite: async (userId: string, lineupId: string) => {
    try {
      const favorite: Favorite = {
        userId,
        lineupId,
        addedAt: new Date(),
      };

      const favoriteId = `${userId}_${lineupId}`;
      const docRef = doc(db, 'favorites', favoriteId);
      await setDoc(docRef, favorite);

      // Update local state
      const currentFavorites = get().favorites;
      if (!currentFavorites.includes(lineupId)) {
        set({ favorites: [...currentFavorites, lineupId] });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při přidání do oblíbených';
      set({ error: errorMsg });
      console.error('Add favorite error:', error);
      throw error;
    }
  },

  removeFavorite: async (userId: string, lineupId: string) => {
    try {
      const favoriteId = `${userId}_${lineupId}`;
      const docRef = doc(db, 'favorites', favoriteId);
      await deleteDoc(docRef);

      // Update local state
      const currentFavorites = get().favorites;
      set({ favorites: currentFavorites.filter((id) => id !== lineupId) });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Chyba při odebírání z oblíbených';
      set({ error: errorMsg });
      console.error('Remove favorite error:', error);
      throw error;
    }
  },

  isFavorite: (lineupId: string) => {
    return get().favorites.includes(lineupId);
  },
}));
