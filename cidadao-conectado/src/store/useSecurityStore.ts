import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Session {
  id: string;
  deviceModel: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  deviceModel: string;
  status: "Sucesso" | "Falha";
}

interface SecurityStore {
  activeSessions: Session[];
  accessLogs: AccessLog[];
  failedLoginAttempts: number;
  incrementFailedAttempts: () => void;
  resetFailedAttempts: () => void;
  revokeSession: (id: string) => void;
  revokeAllOtherSessions: () => void;
}

const mockSessions: Session[] = [
  {
    id: "sess-01",
    deviceModel: "Chrome no Windows",
    ipAddress: "192.168.1.15",
    location: "Lagarto, SE",
    lastActive: "Agora mesmo",
    isCurrentDevice: true,
  },
  {
    id: "sess-02",
    deviceModel: "Safari no iPhone",
    ipAddress: "172.20.10.4",
    location: "Aracaju, SE",
    lastActive: "Ontem, 14:30",
    isCurrentDevice: false,
  },
  {
    id: "sess-03",
    deviceModel: "Firefox no Linux",
    ipAddress: "189.120.44.21",
    location: "São Paulo, SP",
    lastActive: "Hoje, 03:15",
    isCurrentDevice: false,
  }
];

const mockLogs: AccessLog[] = [
  { id: "log-1", timestamp: "19/06/2026 15:30", ipAddress: "192.168.1.15", deviceModel: "Chrome no Windows", status: "Sucesso" },
  { id: "log-2", timestamp: "19/06/2026 03:15", ipAddress: "189.120.44.21", deviceModel: "Firefox no Linux", status: "Sucesso" },
  { id: "log-3", timestamp: "18/06/2026 14:30", ipAddress: "172.20.10.4", deviceModel: "Safari no iPhone", status: "Sucesso" },
  { id: "log-4", timestamp: "17/06/2026 21:05", ipAddress: "45.10.22.1", deviceModel: "Chrome no Android", status: "Falha" },
];

export const useSecurityStore = create<SecurityStore>()(
  persist(
    (set) => ({
      activeSessions: mockSessions,
      accessLogs: mockLogs,
      failedLoginAttempts: 0,
      
      incrementFailedAttempts: () => set((state) => ({ 
        failedLoginAttempts: state.failedLoginAttempts + 1 
      })),
      
      resetFailedAttempts: () => set({ failedLoginAttempts: 0 }),
      
      revokeSession: (id) => set((state) => ({
        activeSessions: state.activeSessions.filter(session => session.id !== id)
      })),
      
      revokeAllOtherSessions: () => set((state) => ({
        activeSessions: state.activeSessions.filter(session => session.isCurrentDevice)
      }))
    }),
    {
      name: "cidadao-security-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
