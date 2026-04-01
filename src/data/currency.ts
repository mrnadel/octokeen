// ============================================================
// Currency Config — Single source of truth for in-app currency
// ============================================================

export const CURRENCY = {
  /** Singular name: "Octoken" */
  name: 'Octoken',
  /** Plural name: "Octokens" */
  plural: 'Octokens',
  /** Path to the currency icon image */
  icon: '/badges/octoken.png',
  /** Label for the shop page */
  shopName: 'Octoken Shop',
} as const;

/** Helper: returns "Octoken" or "Octokens" based on count */
export function currencyLabel(count: number): string {
  return count === 1 ? CURRENCY.name : CURRENCY.plural;
}
