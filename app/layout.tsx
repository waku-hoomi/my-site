import type { Metadata } from "next";
import VinylPlayer from "./_components/vinyl-player";
import "./globals.css";

export const metadata: Metadata = {
  title: "Armin's Blog",
  description: "AI Product Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <VinylPlayer />
      </body>
    </html>
  );
}
