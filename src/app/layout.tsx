import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Histamine Calculator",
  description: "Track your histamine intake and tolerance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <Link className="mr-6 flex items-center space-x-2" href="/">
                <span className="hidden font-bold sm:inline-block">
                  🧬 Histamine Calculator
                </span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <nav className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
                <Link href="/foods" className="text-sm font-medium hover:underline">Foods</Link>
                <Link href="/meal/new" className="text-sm font-medium hover:underline">New Meal</Link>
                <Link href="/logs" className="text-sm font-medium hover:underline">Logs</Link>
              </nav>
            </div>
          </div>
        </nav>
        <main className="container mx-auto py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
