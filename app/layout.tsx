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
  metadataBase: new URL("https://blog.minglogue.workers.dev"),
  title: {
    default: "Minglogue",
    template: "%s · Minglogue",
  },
  description:
    "디자이너 밍띠의 IT 공부, 일상, 밍벤토리 그리고 반려햄스터 푸딩이의 기록.",
  authors: [{ name: "Mingddi (밍띠)" }],
  creator: "Mingddi (밍띠)",
  verification: {
    google: "i4V_1VFJOeMBtjfWj9t76I2cv_N8cCRWYF-iYpL0RtI",
  },
  other: {
    "p:domain_verify": "742432cd3d556d84e8545d6f7be07abf",
  },
  keywords: ["Minglogue", "밍글로그", "Mingddi", "밍띠", "Mingventory", "밍벤토리", "개발 블로그", "공부 기록", "IT 공부", "디자인", "Next.js"],
  icons: {
    icon: [{ url: "/favicon-v2.png", type: "image/png", sizes: "32x32" }],
    shortcut: "/favicon-v2.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#171717" }],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Minglogue",
    title: "Minglogue",
    description: "IT공부•일상기록",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Minglogue" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minglogue",
    description: "IT공부•일상기록",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistMono.variable} ${jua.variable}`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var saved=localStorage.getItem('minglogue-theme');var dark=saved?saved==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=dark?'dark':'light';}catch(e){}})();`}
        </Script>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TG54HE2EZG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TG54HE2EZG');
          `}
        </Script>
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
