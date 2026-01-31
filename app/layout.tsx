import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./providers/Web3Provider";
import { ToastProvider } from "./providers/ToastProvider";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Auroom - Unlock Cash Keep Your Gold",
  description:
    "Borrow IDR-backed stablecoins instantly using tokenized gold as collateral.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${ibmPlexSans.variable} antialiased`}>
        <Web3Provider>
          <ToastProvider>{children}</ToastProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

