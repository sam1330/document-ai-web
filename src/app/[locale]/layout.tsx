import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { CreditProvider } from "@/contexts/CreditContext";
import LocaleLayout from "@/i18n/Provider";
import { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CaptchaProvider } from "@/providers/CaptchaProvider";


const BASE_URL = "https://haku-ai.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Haku – AI-Powered Resume & Job Application Assistant",
    template: "%s | Haku",
  },
  description:
    "Land your dream job with AI-powered resume analysis, ATS optimization, and personalized cover letter generation. Start free with 30 tokens.",
  applicationName: "Haku",
  authors: [{ name: "Haku", url: BASE_URL }],
  keywords: [
    "AI resume analyzer",
    "ATS optimization",
    "resume builder",
    "cover letter generator",
    "job application tracker",
    "career assistant",
    "instant resume grader",
    "resume score checker",
    "ATS-readable PDF",
    "Playwright PDF generator",
    "pixel-perfect resume PDF",
    "recruiter feedback AI",
    "resume analysis free",
    "RAG resume analysis",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Haku",
    title: "Haku – AI-Powered Resume & Job Application Assistant",
    description:
      "Land your dream job with AI-powered resume analysis, ATS optimization, and personalized cover letter generation. Start free with 30 tokens.",
    url: BASE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Haku – AI Resume & Job Application Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@haku_ai",
    title: "Haku – AI-Powered Resume & Job Application Assistant",
    description:
      "Land your dream job with AI-powered resume analysis, ATS optimization, and personalized cover letter generation.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Pre-generate all supported locale routes at build time
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
}: Readonly<{
  children: React.ReactNode;
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
            <CaptchaProvider>
              <CreditProvider>
                {children}
                <Toaster position="top-right" />
              </CreditProvider>
            </CaptchaProvider>
          </AuthProvider>
        </LocaleLayout>
      </body>
    </html>
  );
}

