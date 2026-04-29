import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Deli Oracle",
  description: "He's seen it all. He doesn't care. But he's got the answers.",
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
