// lib/money.ts
export function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}
