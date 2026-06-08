import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
