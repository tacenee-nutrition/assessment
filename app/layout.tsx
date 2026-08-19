import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const assetBase = process.env.GITHUB_PAGES === "true" ? "/assessment" : "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://athlete-nutrition-intake.pinedogsoup.chatgpt.site"),
  title: "个人营养咨询信息采集",
  description: "根据运动表现或日常健康目标，建立更适合你的个人营养档案。",
  openGraph: {
    type: "website",
    title: "个人营养档案",
    description: "从运动表现提升或日常健康管理开始，建立更适合你的营养档案。",
    images: [{ url: `${assetBase}/og.png`, width: 1659, height: 948, alt: "个人营养档案：运动表现提升与日常健康管理" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人营养档案",
    description: "从运动表现提升或日常健康管理开始，建立更适合你的营养档案。",
    images: [`${assetBase}/og.png`],
  },
  icons: {
    icon: `${assetBase}/favicon.svg`,
    shortcut: `${assetBase}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
