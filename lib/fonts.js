import { IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";

// Monospace display + labels — the "blueprint" voice.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Body / long-form — a refined grotesk, not Inter/system.
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
