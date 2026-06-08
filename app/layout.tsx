import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Project QR — Industrial Asset Management",
  description: "Replace paper-based inspection reports with QR-linked digital reports. Secure, instant, and always accessible.",
  keywords: "industrial asset management, QR codes, inspection reports, factory management, digital reports",
  openGraph: {
    title: "Project QR — Industrial Asset Management",
    description: "Replace paper-based inspection reports with QR-linked digital reports.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
