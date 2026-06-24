export type RenewalThreshold = "30days" | "15days" | "48hours" | "expired" | null;

export interface RenewalStatus {
  expirationDate: Date;
  daysLeft: number;
  threshold: RenewalThreshold;
}

/**
 * Calculates the exact expiration date given the last renewal and the periodicity.
 */
export function calculateExpirationDate(lastRenewalDate: string, periodicityMonths: number): Date {
  const date = new Date(lastRenewalDate);
  date.setMonth(date.getMonth() + periodicityMonths);
  return date;
}

/**
 * Calculates how many days are left and determines if any notification threshold is crossed.
 */
export function getRenewalStatus(expirationDate: Date | string): RenewalStatus {
  const expDate = new Date(expirationDate);
  const now = new Date();
  
  // Reset times to midnight for accurate day calculation
  const expMidnight = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = expMidnight.getTime() - nowMidnight.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let threshold: RenewalThreshold = null;
  
  if (daysLeft < 0) {
    threshold = "expired";
  } else if (daysLeft <= 2) {
    threshold = "48hours";
  } else if (daysLeft <= 15 && daysLeft > 2) {
    threshold = "15days";
  } else if (daysLeft <= 30 && daysLeft > 15) {
    threshold = "30days";
  }
  
  return {
    expirationDate: expDate,
    daysLeft,
    threshold
  };
}
