import type { Metadata } from "next";
import { Libre_Bodoni, Public_Sans } from "next/font/google";
import VinylPlayer from "./_components/vinyl-player";
import "./globals.css";

const headingFont = Libre_Bodoni({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

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
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        {children}
        <VinylPlayer />
      </body>
    </html>
  );
}
