import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PopcornLim's Logs",
    template: "%s · PopcornLim's Logs",
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
    siteName: "PopcornLim's Logs",
    title: "PopcornLim's Logs",
    description: "귀여운 화면 뒤에는 단단한 기록이 있습니다.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PopcornLim's Logs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PopcornLim's Logs",
    description: "귀여운 화면 뒤에는 단단한 기록이 있습니다.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
