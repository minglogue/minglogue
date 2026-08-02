import type { Metadata } from "next";
import { Geist_Mono, Jua } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const jua = Jua({
  weight: "400",
  variable: "--font-accent",
  preload: false,
  fallback: ["Apple SD Gothic Neo", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minglogue.popcornkim58.workers.dev"),
  title: {
    default: "Minglogue",
    template: "%s · Minglogue",
  },
  description:
    "디자이너 밍띠의 코딩 공부, 일상, 밍벤토리 그리고 반려햄스터 푸딩이의 기록.",
  authors: [{ name: "Mingddi (밍띠)" }],
  creator: "Mingddi (밍띠)",
  verification: {
    google: "i4V_1VFJOeMBtjfWj9t76I2cv_N8cCRWYF-iYpL0RtI",
  },
  keywords: ["Minglogue", "밍글로그", "Mingddi", "밍띠", "Mingventory", "밍벤토리", "개발 블로그", "코딩 기록", "디자인", "Next.js"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Minglogue",
    title: "Minglogue",
    description: "구조가 궁금해서, 직접 분해해 봅니다.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Minglogue" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minglogue",
    description: "구조가 궁금해서, 직접 분해해 봅니다.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistMono.variable} ${jua.variable}`}>
        {children}
        <Script
          id="cloudflare-web-analytics"
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"7e8f0dc18db3493fa16da3fd08c0cc83"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
