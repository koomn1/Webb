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
  title: "SÈN Haute Parfumerie | عطور نيش باريسية • Zeste & Aura",
  description:
    "دار SÈN Haute Parfumerie — توليفات عطرية بتركيز 20% زيوت نيش فرنسية نقية مع ميثاق الثقة والأمان وعينة استكشافية 2ml والدفع عند الاستلام.",
  keywords: ["SÈN", "SÈN Parfums", "SÈN Haute Parfumerie", "عطور سِيان", "عطر زيست", "عطر أورا", "Zeste", "Aura", "عطور نيش مصر"],
  icons: {
    icon: "/images/sen_monogram.svg",
    shortcut: "/images/sen_monogram.svg",
    apple: "/images/sen_monogram_transparent.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#0C0B0A] text-[#FAF8F5] antialiased selection:bg-[#C58652]/20 selection:text-[#E4C7A8]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
