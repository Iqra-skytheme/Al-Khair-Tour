import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

export const metadata = {
  title: "Al-Khair Tours — Makkah & Madinah Ziyarat + Reliable Rides",
  description:
    "Al-Khair Tours offers fixed-price rides between Jeddah, Makkah, and Madinah plus guided Ziyarat packages with verified drivers and English/Urdu/Arabic guides.",
  authors: [{ name: "Al-Khair Tours" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Al-Khair Tours — Makkah & Madinah Ziyarat + Reliable Rides",
    description: "Fixed-price rides & guided Ziyarat tours for pilgrims. Verified drivers, 24/7 support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}
