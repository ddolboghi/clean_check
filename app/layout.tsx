import "./globals.css";
import localFont from "next/font/local";
import { Metadata, Viewport } from "next";
import InstallPromptWrapper from "@/components/InstallPromptWrapper";

const pretendard = localFont({
  src: "../public/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "뷰잉",
  description: "작은 습관으로 지키는 나의 피부",
  manifest: "/manifest.ts",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <InstallPromptWrapper>{children}</InstallPromptWrapper>
      </body>
    </html>
  );
}
