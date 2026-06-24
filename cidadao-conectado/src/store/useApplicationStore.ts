import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { useProfileStore } from "./useProfileStore";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface ApplicationStore {
  // Key: benefitId, Value: array de stepIds concluídos
  completedSteps: Record<string, string[]>;
  favorites: string[];
  alerts: string[];
  alertsPaused: boolean;
  notifiedAlerts: string[];
  toggleStep: (benefitId: string, stepId: string) => void;
  setFavorites: (favs: string[]) => void;
  toggleFavorite: (benefitId: string) => Promise<void>;
  toggleAlert: (benefitId: string) => void;
  togglePauseAlerts: () => void;
  markAsNotified: (benefitId: string) => void;
  getCompletedSteps: (benefitId: string) => string[];
  getProgress: (benefitId: string, totalSteps: number) => number;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      completedSteps: {},
      favorites: [],
      alerts: [],
      alertsPaused: false,
      notifiedAlerts: [],
      
      toggleStep: (benefitId, stepId) => set((state) => {
        const currentSteps = state.completedSteps[benefitId] || [];
        const hasStep = currentSteps.includes(stepId);
        
        let newSteps;
        if (hasStep) {
          // Remove if exists
          newSteps = currentSteps.filter(id => id !== stepId);
        } else {
          // Add if doesn't exist
          newSteps = [...currentSteps, stepId];
        }
        
        return {
          completedSteps: {
            ...state.completedSteps,
            [benefitId]: newSteps
          }
        };
      }),
      
      setFavorites: (favs) => set({ favorites: favs }),
      
      toggleFavorite: async (benefitId) => {
        const user = auth.currentUser;
        if (!user) {
          toast.info("Crie uma conta ou faça login para salvar seus favoritos.");
          return;
        }
        
        try {
          const userRef = doc(db, 'users', user.uid);
          const state = get();
          const isFavorite = state.favorites.includes(benefitId);
          
          await setDoc(userRef, {
            favorites: isFavorite ? arrayRemove(benefitId) : arrayUnion(benefitId)
          }, { merge: true });
          
          // O estado local será atualizado pelo Listener onSnapshot no AuthProvider
        } catch (error) {
          console.error("Erro ao favoritar:", error);
          toast.error("Erro ao salvar o favorito. Tente novamente.");
        }
      },
      
      toggleAlert: (benefitId) => set((state) => {
        const hasAlert = state.alerts.includes(benefitId);
        return {
          alerts: hasAlert
            ? state.alerts.filter((id) => id !== benefitId)
            : [...state.alerts, benefitId],
        };
      }),

      togglePauseAlerts: () => set((state) => ({
        alertsPaused: !state.alertsPaused
      })),

      markAsNotified: (benefitId) => set((state) => {
        if (!state.notifiedAlerts.includes(benefitId)) {
          return { notifiedAlerts: [...state.notifiedAlerts, benefitId] };
        }
        return state;
      }),
      
      getCompletedSteps: (benefitId) => {
        return get().completedSteps[benefitId] || [];
      },
      
      getProgress: (benefitId, totalSteps) => {
        if (totalSteps === 0) return 0;
        const completed = get().completedSteps[benefitId] || [];
        return Math.round((completed.length / totalSteps) * 100);
      }
    }),
    {
      name: "cidadao-application-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
