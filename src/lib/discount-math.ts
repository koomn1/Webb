export interface DiscountTerms {
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  max_discount_amount?: number | null;
}

export function normalizeDiscountCode(value: string): string {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function calculateDiscountAmount(
  discount: DiscountTerms,
  subtotal: number
): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  if (!Number.isFinite(discount.discount_value) || discount.discount_value <= 0) return 0;

  const rawAmount =
    discount.discount_type === "PERCENTAGE"
      ? Math.round((subtotal * Math.min(discount.discount_value, 100)) / 100)
      : Math.min(subtotal, discount.discount_value);

  const cappedAmount =
    discount.max_discount_amount != null && Number.isFinite(discount.max_discount_amount)
      ? Math.min(rawAmount, Math.max(0, discount.max_discount_amount))
      : rawAmount;

  return Math.min(subtotal, Math.max(0, cappedAmount));
}
