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
  title: "سين | عطور نيش مستوحاة من مدارس العطور الفرنسية • Zeste & Aura",
  description:
    "دار سين — عطور Eau de Parfum Intense بتركيز 20% مستوحاة من مدارس العطور الفرنسية، مع عينة استكشافية 2ml وميثاق الثقة والدفع عند الاستلام.",
  keywords: ["سين", "سين", "سين", "عطور سين", "عطر زيست", "عطر أورا", "Zeste", "Aura", "عطور نيش مصر"],
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
