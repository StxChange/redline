import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redline Collection Appraisals",
  description:
    "Photo-led vintage Hot Wheels Redline collection appraisals with item details, market ranges and comparable sales.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
