// Helper functions for calculator formatting

export function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtInt(n: number): string {
  return n.toLocaleString('en-US');
}
