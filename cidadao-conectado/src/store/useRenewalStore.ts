import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RenewalThreshold } from "@/lib/renewals";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export interface RenewalItem {
  id: string;
  benefitId: string;
  lastRenewalDate: string; // YYYY-MM-DD
  periodicityMonths: number;
  notificationsEnabled: boolean;
  notifiedThresholds: RenewalThreshold[];
}

interface RenewalStore {
  renewals: RenewalItem[];
  setRenewals: (renewals: RenewalItem[]) => void;
  addRenewal: (item: Omit<RenewalItem, "id" | "notifiedThresholds">) => Promise<void>;
  updateRenewal: (id: string, updates: Partial<RenewalItem>) => Promise<void>;
  removeRenewal: (id: string) => Promise<void>;
  toggleNotifications: (id: string) => Promise<void>;
  markAsNotified: (id: string, threshold: RenewalThreshold) => Promise<void>;
}

export const useRenewalStore = create<RenewalStore>()(
  persist(
    (set, get) => ({
      renewals: [],
      setRenewals: (renewals) => set({ renewals }),

      addRenewal: async (item) => {
        const user = auth.currentUser;
        if (!user) {
          toast.info("Faça login para salvar suas renovações.");
          return;
        }

        const state = get();
        const filtered = state.renewals.filter(r => r.benefitId !== item.benefitId);
        const newItem: RenewalItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          notifiedThresholds: []
        };
        const newRenewals = [...filtered, newItem];

        try {
          await setDoc(doc(db, 'users', user.uid), { renewals: newRenewals }, { merge: true });
        } catch (error) {
          console.error("Erro ao adicionar renovação:", error);
          toast.error("Erro ao salvar renovação.");
        }
      },

      updateRenewal: async (id, updates) => {
        const user = auth.currentUser;
        if (!user) return;

        const state = get();
        const newRenewals = state.renewals.map(r => {
          if (r.id === id) {
            const dateChanged = updates.lastRenewalDate !== undefined && updates.lastRenewalDate !== r.lastRenewalDate;
            const periodicityChanged = updates.periodicityMonths !== undefined && updates.periodicityMonths !== r.periodicityMonths;
            const newThresholds = (dateChanged || periodicityChanged) ? [] : r.notifiedThresholds;
            return { ...r, ...updates, notifiedThresholds: newThresholds };
          }
          return r;
        });

        try {
          await setDoc(doc(db, 'users', user.uid), { renewals: newRenewals }, { merge: true });
        } catch (error) {
          console.error("Erro ao atualizar renovação:", error);
          toast.error("Erro ao atualizar renovação.");
        }
      },

      removeRenewal: async (id) => {
        const user = auth.currentUser;
        if (!user) return;

        const state = get();
        const newRenewals = state.renewals.filter(r => r.id !== id);

        try {
          await setDoc(doc(db, 'users', user.uid), { renewals: newRenewals }, { merge: true });
        } catch (error) {
          console.error("Erro ao remover renovação:", error);
          toast.error("Erro ao remover renovação.");
        }
      },

      toggleNotifications: async (id) => {
        const user = auth.currentUser;
        if (!user) return;

        const state = get();
        const newRenewals = state.renewals.map(r => 
          r.id === id ? { ...r, notificationsEnabled: !r.notificationsEnabled } : r
        );

        try {
          await setDoc(doc(db, 'users', user.uid), { renewals: newRenewals }, { merge: true });
        } catch (error) {
          console.error("Erro ao alternar notificações:", error);
          toast.error("Erro ao alterar notificações.");
        }
      },

      markAsNotified: async (id, threshold) => {
        const user = auth.currentUser;
        if (!user) return;

        const state = get();
        const newRenewals = state.renewals.map(r => {
          if (r.id === id && threshold && !r.notifiedThresholds.includes(threshold)) {
            return { ...r, notifiedThresholds: [...r.notifiedThresholds, threshold] };
          }
          return r;
        });

        try {
          await setDoc(doc(db, 'users', user.uid), { renewals: newRenewals }, { merge: true });
        } catch (error) {
          console.error("Erro ao marcar como notificado:", error);
        }
      }
    }),
    {
      name: "cidadao-renewal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
