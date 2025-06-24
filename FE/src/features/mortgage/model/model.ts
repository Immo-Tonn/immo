export function calcMonthly({
  price,
  down,
  rate,
  years,
}: {
  price: number;
  down: number;
  rate: number;
  years: number;
}): number {
  const loan = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}


// WithTilgung
// export function calcMonthlyWithTilgung(
//   price: number,
//   down: number,
//   rate: number,       // годовая процентная ставка, например 3
//   tilgung: number     // годовая ставка погашения, например 2
// ): number {
//   const loan = price - down;
//   const yearlyRate = rate + tilgung;
//   const monthly = (loan * yearlyRate) / 100 / 12;
//   return monthly;
// }
