export function formatInr(amount: number): string {
  return "\u20B9" + new Intl.NumberFormat("en-IN").format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
