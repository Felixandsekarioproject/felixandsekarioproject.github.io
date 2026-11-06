import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import ScrollCalm from "@/components/ScrollCalm";

const sans = Source_Sans_3({ variable: "--font-sans", subsets: ["latin"] });
const serif = Source_Serif_4({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Guns in America: The Data",
    template: "%s · Guns in America: The Data",
  },
  description:
    "How many people die from guns in the United States, and how states compare. Every number comes from official CDC data.",
};

export const viewport: Viewport = {
  themeColor: "#faf9fb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <ScrollCalm />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand">
              Guns in America<span className="brand-sub">: The Data</span>
            </Link>
            <nav aria-label="Main">
              <ul>
                <li><Link href="/#map">Map</Link></li>
                <li><Link href="/states/">States</Link></li>
                <li><Link href="/compare/">Compare</Link></li>
                <li><Link href="/laws/">Gun laws</Link></li>
                <li><Link href="/history/">History</Link></li>
                <li><Link href="/disagreements/">Disagreements</Link></li>
                <li><Link href="/judge/">You be the judge</Link></li>
                <li><Link href="/sources/">Sources</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="site-footer">
          <div className="wrap">
            <p>
              A school project. Death numbers come from the U.S. Centers for Disease Control and Prevention (CDC); state gun laws from the RAND State Firearm Law Database; court cases from official Supreme Court opinions. See{" "}
              <Link href="/sources/">sources and methods</Link>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
