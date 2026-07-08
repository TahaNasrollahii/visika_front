import type { Metadata } from "next";
import "@fontsource/estedad/400.css";
import "@fontsource/estedad/500.css";
import "@fontsource/estedad/700.css";
import "@fontsource/estedad/800.css";
import "@fontsource/estedad/900.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vizika | فروشگاه اینترنتی ویزیکا",
  description: "سوپرمارکت آنلاین با محصولات تازه و ارسال سریع",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        <Toaster position="top-center" richColors dir="rtl" toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
