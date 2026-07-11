import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="en">
      <body className="bg-base min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
