import type { Metadata } from "next";
import { Geist_Mono, Jua } from "next/font/google";
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
  title: {
    default: "PopcornKim's Logs",
    template: "%s · PopcornKim's Logs",
  },
  description:
    "디자이너 팝콘의 코딩 공부, 일상, 포트폴리오 그리고 반려햄스터 푸딩이의 기록.",
  authors: [{ name: "팝콘" }],
  creator: "팝콘",
  keywords: ["개발 블로그", "코딩 기록", "디자인", "Next.js", "팝콘"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "PopcornKim's Logs",
    title: "PopcornKim's Logs",
    description: "궁금해서 파봤고, 까먹기 전에 적어둡니다.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PopcornKim's Logs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PopcornKim's Logs",
    description: "궁금해서 파봤고, 까먹기 전에 적어둡니다.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistMono.variable} ${jua.variable}`}>
        {children}
      </body>
    </html>
  );
}
