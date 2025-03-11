import type { Metadata } from "next";
import { LanguageProvider } from "./components/languageContext";
import Header from "./components/header";
import Footer from "./components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "mttalento - Talent Management",
  description:
    "mttalento is a premier talent management company operating in the USA and Mexico. Made in USA and Mexico.",
  keywords: ["talent management", "USA", "Mexico", "mttalento"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LanguageProvider>
        <body className="Gill_Sans">
          <Header />
          {children}
          <Footer />
        </body>
      </LanguageProvider>
    </html>
  );
}
