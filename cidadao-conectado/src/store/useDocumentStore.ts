import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export interface UserDocument {
  id: string;
  name: string;
  expirationDate: string; // ISO string like YYYY-MM-DD
  affectedBenefits: string[]; // Array of benefit IDs
}

interface DocumentStore {
  documents: UserDocument[];
  setDocuments: (docs: UserDocument[]) => void;
  addDocument: (docInfo: UserDocument) => Promise<void>;
  updateDocumentDate: (id: string, expirationDate: string) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      setDocuments: (docs) => set({ documents: docs }),
      
      addDocument: async (docInfo) => {
        const user = auth.currentUser;
        if (!user) {
          toast.info("Faça login para salvar seus documentos.");
          return;
        }
        
        const state = get();
        const newDocs = [...state.documents, docInfo];
        
        try {
          await setDoc(doc(db, 'users', user.uid), { documents: newDocs }, { merge: true });
        } catch (error) {
          console.error("Erro ao adicionar documento:", error);
          toast.error("Erro ao salvar o documento.");
        }
      },
      
      updateDocumentDate: async (id, expirationDate) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const state = get();
        const newDocs = state.documents.map((d) => 
          d.id === id ? { ...d, expirationDate } : d
        );
        
        try {
          await setDoc(doc(db, 'users', user.uid), { documents: newDocs }, { merge: true });
        } catch (error) {
          console.error("Erro ao atualizar data do documento:", error);
          toast.error("Erro ao atualizar a validade.");
        }
      },
      
      removeDocument: async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        
        const state = get();
        const newDocs = state.documents.filter((d) => d.id !== id);
        
        try {
          await setDoc(doc(db, 'users', user.uid), { documents: newDocs }, { merge: true });
        } catch (error) {
          console.error("Erro ao remover documento:", error);
          toast.error("Erro ao remover o documento.");
        }
      },
    }),
    {
      name: "cidadao-documents-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
