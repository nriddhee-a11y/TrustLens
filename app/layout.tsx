import "./globals.css";
import { Providers } from "./providers";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "TrustLens — Can you trust it?",
  description: "Explainable deepfake detection for images, video, and audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-base min-h-screen font-sans text-ink">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <main id="main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
