"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useProfileStore } from "@/store/useProfileStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useDocumentStore } from "@/store/useDocumentStore";
import { useRenewalStore } from "@/store/useRenewalStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUserAccount = useProfileStore((state) => state.setUserAccount);
  const setIsEmailVerified = useProfileStore((state) => state.setIsEmailVerified);
  const setFavorites = useApplicationStore((state) => state.setFavorites);
  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const setRenewals = useRenewalStore((state) => state.setRenewals);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Assume default name or extract from email if display name is null
        const name = user.displayName || user.email?.split('@')[0] || "Usuário";
        const email = user.email || "";
        const role = email === 'admin@ifs.edu.br' ? 'admin' : 'user';

        setUserAccount({
          name,
          email,
          role,
        });
        
        setIsEmailVerified(user.emailVerified);

        unsubscribeSnapshot = onSnapshot(
          doc(db, 'users', user.uid), 
          (document) => {
            if (document.exists()) {
              const data = document.data();
              setFavorites(data.favorites || []);
              setDocuments(data.documents || []);
              setRenewals(data.renewals || []);
            } else {
              setFavorites([]);
              setDocuments([]);
              setRenewals([]);
            }
          },
          (error) => {
            console.error("Erro de permissão no Firestore (Listener):", error.message);
          }
        );
      } else {
        setUserAccount(null);
        setIsEmailVerified(false);
        setFavorites([]);
        setDocuments([]);
        setRenewals([]);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [setUserAccount, setIsEmailVerified, setFavorites, setDocuments, setRenewals]);

  return <>{children}</>;
}
