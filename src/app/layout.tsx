import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SÈN Parfums | عطور نيش فاخرة • Zeste & Aura",
  description:
    "اكتشف عطور SÈN الفاخرة — Zeste الرجالي المنعش و Aura النسائي الساحر مع الضمان الذهبي والدفع عند الاستلام.",
  keywords: ["SÈN", "SÈN Parfums", "عطور سِيان", "عطر زيست", "عطر أورا", "Zeste", "Aura", "عطور مصرية فاخرة"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#08080A] text-[#FCFBFA] antialiased selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
