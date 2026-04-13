import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { CreditProvider } from "@/contexts/CreditContext";
import LocaleLayout from "@/i18n/Provider";
import { Metadata } from "next";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Haku - AI-Powered Resume & Job Application Assistant",
  description: "Transform your job search with AI-powered resume analysis, optimization, and personalized cover letter generation.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale || "en"} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleLayout messages={messages} locale={locale}>
          <AuthProvider>
            <CreditProvider>
              {children}
              <Toaster position="top-right" />
            </CreditProvider>
          </AuthProvider>
        </LocaleLayout>
      </body>
    </html>
  );
}
