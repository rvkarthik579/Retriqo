import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import "./production-landing.css";

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
  title: "Retriqo — Records. Retrieved.",
  description: "Secure, time-locked documentation routed directly to the factory floor. Scan once. Retrieve forever.",
  keywords: "industrial asset management, QR routing, secure archives, Retriqo",
  openGraph: {
    title: "Retriqo — Records. Retrieved.",
    description: "Secure, time-locked documentation routed directly to the factory floor.",
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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(r => r.unregister())
              })
              caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key))
              })
            }
          `
        }} />
      </head>
      <body className={`${GeistSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
