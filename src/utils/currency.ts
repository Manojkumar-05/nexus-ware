// Utilities for INR currency formatting and USD->INR conversion

export const DEFAULT_USD_TO_INR_RATE = 83; // approximate; adjust if needed

export function usdToInr(amountInUsd: number, rate: number = DEFAULT_USD_TO_INR_RATE): number {
  if (!isFinite(amountInUsd)) return 0;
  return amountInUsd * rate;
}

export function formatINR(amountInInr: number): string {
  const safeAmount = isFinite(amountInInr) ? amountInInr : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(safeAmount);
}



