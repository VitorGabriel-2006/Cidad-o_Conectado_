"use client";

import { useEffect, useRef } from "react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { mockBenefits } from "@/data/mockBenefits";
import { getBenefitTimeStatus } from "@/lib/dateUtils";
import { sendMockPushNotification } from "@/lib/notifications";
import { useRenewalStore } from "@/store/useRenewalStore";
import { calculateExpirationDate, getRenewalStatus } from "@/lib/renewals";

export function useNotificationEngine() {
  const { alerts, alertsPaused, notifiedAlerts, markAsNotified } = useApplicationStore();
  const { renewals, markAsNotified: markRenewalNotified } = useRenewalStore();
  const engineRunning = useRef(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined" || engineRunning.current) return;
    engineRunning.current = true;

    const checkAlerts = () => {
      // If paused, don't notify anything
      if (alertsPaused) return;

      alerts.forEach(benefitId => {
        // Skip if already notified
        if (notifiedAlerts.includes(benefitId)) return;

        const benefit = mockBenefits.find(b => b.id === benefitId);
        if (!benefit) return;

        const timeStatus = getBenefitTimeStatus(benefit.enrollmentPeriod);
        
        // If it just opened
        if (timeStatus.status === "Aberto") {
          sendMockPushNotification(
            "Edital Aberto! 🎉",
            `As inscrições para "${benefit.title}" começaram. Não perca o prazo!`,
            window.location.origin + `/beneficios/${benefit.id}`
          );
          markAsNotified(benefit.id);
        }
      });

      // R063: Check Renewals
      renewals.forEach(renewal => {
        if (!renewal.notificationsEnabled) return;

        const benefit = mockBenefits.find(b => b.id === renewal.benefitId);
        if (!benefit) return;

        const expDate = calculateExpirationDate(renewal.lastRenewalDate, renewal.periodicityMonths);
        const status = getRenewalStatus(expDate);

        if (status.threshold && !renewal.notifiedThresholds.includes(status.threshold)) {
          let message = "";
          let title = `Renovação: ${benefit.title}`;

          if (status.threshold === "30days") {
            message = `Faltam 30 dias para a renovação do seu benefício. Organize seus documentos.`;
          } else if (status.threshold === "15days") {
            message = `Atenção: Faltam apenas 15 dias para renovar o benefício!`;
          } else if (status.threshold === "48hours") {
            message = `URGENTE: Faltam menos de 48 horas para o vencimento. Renove agora para não perder o benefício!`;
            title = `⚠️ URGENTE: ${benefit.title}`;
          } else if (status.threshold === "expired") {
            message = `O prazo de renovação do seu benefício expirou.`;
            title = `❌ Prazo Expirado: ${benefit.title}`;
          }

          if (message) {
            // Simulated Push & Email Notification
            sendMockPushNotification(
              title,
              message,
              benefit.providerDetails?.site || window.location.origin + `/beneficios/${benefit.id}`
            );
            // Mark as notified so it doesn't trigger again for this threshold
            markRenewalNotified(renewal.id, status.threshold);
          }
        }
      });
    };

    // Run initially
    checkAlerts();

    // Check periodically (e.g., every 5 minutes in a real app, let's use 1 minute for simulation)
    const interval = setInterval(checkAlerts, 60000);

    return () => {
      clearInterval(interval);
      engineRunning.current = false;
    };
  }, [alerts, alertsPaused, notifiedAlerts, markAsNotified, renewals, markRenewalNotified]);
}
