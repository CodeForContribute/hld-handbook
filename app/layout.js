import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { mono, sans } from "@/lib/fonts";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import ReadingProgress from "@/components/ReadingProgress";
import { getNav, getSearchIndex } from "@/lib/content";

export const metadata = {
  metadataBase: new URL("https://hld-handbook.onrender.com"),
  title: {
    default: "The HLD Handbook — High-Level / System Design",
    template: "%s · The HLD Handbook",
  },
  description:
    "A blueprint for designing systems at scale. Original, comprehensive High-Level Design content: building-block concepts and end-to-end case studies for interviews and real-world engineering.",
  openGraph: {
    title: "The HLD Handbook",
    description: "Design at scale — concepts and case studies for High-Level Design.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  const nav = getNav();
  const searchIndex = getSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning className={`${mono.variable} ${sans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ReadingProgress />
        <div className="app">
          <TopBar />
          <div className="layout">
            <Sidebar nav={nav} />
            <main className="content">{children}</main>
          </div>
          <footer className="footer">
            ◇ THE HLD HANDBOOK · designed as a blueprint for systems at scale ·
            original content, drawn from first principles
          </footer>
        </div>
        <CommandPalette index={searchIndex} />
      </body>
    </html>
  );
}
