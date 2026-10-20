import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | SÈN Haute Parfumerie",
  description: "الشروط والأحكام المنظمة لاستخدام وشراء منتجات SÈN Haute Parfumerie.",
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
