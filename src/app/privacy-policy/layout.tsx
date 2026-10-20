import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Privacy Policy | SÈN Haute Parfumerie",
  description: "سياسة الخصوصية واستخدام البيانات في تطبيق وموقع SÈN Haute Parfumerie.",
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
