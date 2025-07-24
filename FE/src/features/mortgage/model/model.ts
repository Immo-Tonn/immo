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
