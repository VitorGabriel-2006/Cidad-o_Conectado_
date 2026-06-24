export type DocumentStatus = 'valid' | 'attention' | 'expired';

export function calculateDocumentStatus(expirationDate: string): DocumentStatus {
  if (!expirationDate) return 'valid';
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const expiration = new Date(expirationDate);
  // Ensure we compare just dates without timezone shifts affecting the current day
  const targetDate = new Date(expiration.getTime() + Math.abs(expiration.getTimezoneOffset() * 60000));
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= 30) {
    return 'attention';
  } else {
    return 'valid';
  }
}
