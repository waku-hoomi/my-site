import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haomin Zhang",
  description: "Cloud Computing & AI Infrastructure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}