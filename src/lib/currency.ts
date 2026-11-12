import { CurrencyCode } from '@/types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
  SGD: 'S$',
};

export const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AED: 'en-AE',
  SGD: 'en-SG',
};

/**
 * Convert major currency units (e.g. 1500.50) to integer minor units (paise/cents = 150050)
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert integer minor units back to major floating value (e.g. 150050 -> 1500.50)
 */
export function toMajorUnits(minorUnits: number): number {
  return (minorUnits || 0) / 100;
}

/**
 * Formats minor units into localized currency string (e.g., 500000 INR -> "₹5,000.00")
 */
export function formatCurrency(
  minorUnits: number,
  currency: CurrencyCode = 'INR',
  includeDecimals: boolean = true
): string {
  const major = toMajorUnits(minorUnits);
  const locale = CURRENCY_LOCALES[currency] || 'en-IN';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(major);
}

/**
 * Format compact currency for charts and summary counters (e.g. ₹1.2L, ₹50k, $4.5k)
 */
export function formatCompactCurrency(
  minorUnits: number,
  currency: CurrencyCode = 'INR'
): string {
  const major = toMajorUnits(minorUnits);
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';

  if (currency === 'INR') {
    if (Math.abs(major) >= 10000000) {
      return `${symbol}${(major / 10000000).toFixed(1)} Cr`;
    }
    if (Math.abs(major) >= 100000) {
      return `${symbol}${(major / 100000).toFixed(1)} L`;
    }
    if (Math.abs(major) >= 1000) {
      return `${symbol}${(major / 1000).toFixed(1)} k`;
    }
    return `${symbol}${major.toFixed(0)}`;
  }

  // Standard international compact
  if (Math.abs(major) >= 1000000) {
    return `${symbol}${(major / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(major) >= 1000) {
    return `${symbol}${(major / 1000).toFixed(1)}K`;
  }
  return `${symbol}${major.toFixed(0)}`;
}
