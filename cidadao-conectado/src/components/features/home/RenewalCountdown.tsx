"use client";

import { useRenewalStore } from "@/store/useRenewalStore";
import { mockBenefits } from "@/data/mockBenefits";
import { calculateExpirationDate, getRenewalStatus } from "@/lib/renewals";
import { CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function RenewalCountdown() {
  const { renewals } = useRenewalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || renewals.length === 0) return null;

  // Find the closest upcoming renewal
  const upcoming = renewals
    .map(r => {
      const expDate = calculateExpirationDate(r.lastRenewalDate, r.periodicityMonths);
      const status = getRenewalStatus(expDate);
      return { ...r, status, expDate };
    })
    .filter(r => r.status.daysLeft >= 0) // only upcoming
    .sort((a, b) => a.status.daysLeft - b.status.daysLeft)[0];

  if (!upcoming) return null;

  const benefit = mockBenefits.find(b => b.id === upcoming.benefitId);
  if (!benefit) return null;

  const isUrgent = upcoming.status.daysLeft <= 15;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 mb-8 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4 ${
      isUrgent ? 'bg-amber-500/10 border-amber-500/30' : 'bg-primary/5 border-primary/20'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isUrgent ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'}`}>
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">Próxima Renovação</h4>
            <p className={`font-bold text-lg md:text-xl ${isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>
              Faltam {upcoming.status.daysLeft} {upcoming.status.daysLeft === 1 ? 'dia' : 'dias'}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">Para renovar o <strong>{benefit.title}</strong></p>
          </div>
        </div>
        
        <Link href="/perfil" className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
          isUrgent ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}>
          Gerenciar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
