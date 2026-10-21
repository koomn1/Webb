import { describe, expect, it } from "vitest";
import { calculateDiscountAmount, normalizeDiscountCode } from "../src/lib/discount-math";

describe("normalizeDiscountCode", () => {
  it("trims, removes embedded whitespace, and normalizes case", () => {
    expect(normalizeDiscountCode("  summer  sale  ")).toBe("SUMMERSALE");
  });
});

describe("calculateDiscountAmount", () => {
  it("calculates percentage discounts with the same rounding as checkout", () => {
    expect(
      calculateDiscountAmount({ discount_type: "PERCENTAGE", discount_value: 15 }, 650)
    ).toBe(98);
  });

  it("applies a configured maximum discount cap", () => {
    expect(
      calculateDiscountAmount(
        { discount_type: "PERCENTAGE", discount_value: 50, max_discount_amount: 100 },
        1000
      )
    ).toBe(100);
  });

  it("never discounts more than the order subtotal", () => {
    expect(
      calculateDiscountAmount({ discount_type: "FIXED", discount_value: 800 }, 650)
    ).toBe(650);
  });

  it("rejects non-positive or non-finite calculations safely", () => {
    expect(calculateDiscountAmount({ discount_type: "FIXED", discount_value: 50 }, 0)).toBe(0);
    expect(
      calculateDiscountAmount({ discount_type: "PERCENTAGE", discount_value: Number.NaN }, 500)
    ).toBe(0);
  });
});
