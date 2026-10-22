import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | سين",
  description: "الشروط والأحكام المنظمة لاستخدام وشراء منتجات سين.",
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
