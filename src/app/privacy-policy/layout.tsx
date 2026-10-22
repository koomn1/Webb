import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Privacy Policy | سين",
  description: "سياسة الخصوصية واستخدام البيانات في تطبيق وموقع سين.",
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
