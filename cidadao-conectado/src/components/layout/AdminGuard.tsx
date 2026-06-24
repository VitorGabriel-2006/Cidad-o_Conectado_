"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { userAccount } = useProfileStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!userAccount || userAccount.role !== 'admin') {
    return (
      <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-background/60 backdrop-blur-xl border border-rose-200 dark:border-rose-900/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mb-6 ring-1 ring-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-tight text-rose-600 dark:text-rose-400">
            Acesso Negado (403)
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Acesso Restrito: Esta área é exclusiva para a administração do sistema.
          </p>

          <Link href="/">
            <Button variant="outline" className="w-full gap-2 rounded-xl h-11 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
