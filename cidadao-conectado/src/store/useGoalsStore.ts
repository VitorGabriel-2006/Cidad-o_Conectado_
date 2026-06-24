import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CitizenshipGoal {
  id: string;
  benefitName: string;
  status: 'pretendido' | 'conquistado';
  protocolImage: string | null;
  updatedAt: string;
}

interface GoalsStore {
  goals: CitizenshipGoal[];
  addGoal: (benefitName: string) => void;
  toggleGoalStatus: (id: string) => void;
  uploadProtocol: (id: string, base64Image: string) => void;
  clearGoals: () => void;
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (benefitName) => set((state) => {
        // Evita duplicatas exatas
        if (state.goals.some(g => g.benefitName === benefitName)) return state;
        
        const newGoal: CitizenshipGoal = {
          id: `goal-${Date.now()}`,
          benefitName,
          status: 'pretendido',
          protocolImage: null,
          updatedAt: new Date().toISOString()
        };
        return { goals: [...state.goals, newGoal] };
      }),
      toggleGoalStatus: (id) => set((state) => ({
        goals: state.goals.map(goal => 
          goal.id === id 
            ? { ...goal, status: goal.status === 'pretendido' ? 'conquistado' : 'pretendido', updatedAt: new Date().toISOString() }
            : goal
        )
      })),
      uploadProtocol: (id, base64Image) => set((state) => ({
        goals: state.goals.map(goal => 
          goal.id === id 
            ? { ...goal, protocolImage: base64Image, updatedAt: new Date().toISOString() }
            : goal
        )
      })),
      clearGoals: () => set({ goals: [] })
    }),
    {
      name: "cidadao-goals-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
