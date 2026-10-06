import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

// Space Grotesk (SIL Open Font License), zelf gehost: geen verzoeken naar Google (GDPR).
const font = localFont({
  src: "./fonts/SpaceGrotesk-latin.woff2",
  weight: "300 700",
  variable: "--font-sg",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Trengix | We listen, we match.", template: "%s | Trengix" },
  description:
    "Trengix vult niche-profielen in finance, data en IT snel in, omdat we eerst luisteren naar wat je team en je carrière echt nodig hebben.",
  openGraph: { siteName: "Trengix", locale: "nl_BE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#1B17FF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
