import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export interface ProfileData {
  age: string;
  gender: string;
  race: string;
  education: string;
  totalFamilyIncome: string;
  familyMembers: string;
  perCapitaIncome: number;
  individualIncome: string;
  occupation: "CLT" | "Autônomo" | "MEI" | "Desempregado" | "Aposentado" | "Outro" | "";
  isStudent: boolean;
  isPregnant: boolean;
  isPcD: boolean;
  pcdType?: string;
  cidCode?: string;
  consents?: {
    terms: boolean;
    privacy: boolean;
    notifications: boolean;
  };
  consentTimestamp?: string | null;
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

interface ProfileStore {
  profile: ProfileData | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  userAccount: UserAccount | null;
  setUserAccount: (account: UserAccount | null) => void;
  setIsEmailVerified: (status: boolean) => void;
  setProfile: (data: ProfileData) => void;
  clearProfile: () => void;
  updateConsent: (type: "terms" | "privacy" | "notifications", value: boolean) => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isAuthenticated: false,
      isEmailVerified: false,
      userAccount: null,
      setIsEmailVerified: (status) => set({ isEmailVerified: status }),
      setUserAccount: (account) => set({ 
        isAuthenticated: !!account, 
        userAccount: account 
      }),
      setProfile: (data) => set({ profile: data }),
      clearProfile: () => set({ profile: null }),
      updateConsent: (type, value) =>
        set((state) => {
          const currentProfile = state.profile || ({} as ProfileData);
          return {
            profile: {
              ...currentProfile,
              consents: {
                ...(currentProfile.consents || { terms: false, privacy: false, notifications: false }),
                [type]: value,
              },
              consentTimestamp: new Date().toISOString(),
            },
          };
        }),
      logout: async () => {
        try {
          await signOut(auth);
        } catch (e) {
          console.error(e);
        }
        set({ isAuthenticated: false, isEmailVerified: false, userAccount: null });
        window.location.href = "/";
      },
      deleteAccount: async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            await user.delete();
          }
        } catch (e) {
          console.error(e);
        }
        sessionStorage.removeItem("cidadao-profile-storage");
        set({ profile: null, isAuthenticated: false, isEmailVerified: false, userAccount: null });
        window.location.href = "/";
      },
    }),
    {
      name: "cidadao-profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
