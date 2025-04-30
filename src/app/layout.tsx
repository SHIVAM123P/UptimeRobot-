import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback standard font
import './globals.css';
import Navbar from '@/components/Navbar'; // Keep the import path as is
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Use --font-sans which globals.css might expect
});


export const metadata: Metadata = {
  title: 'AlwaysUp - Website Uptime Monitoring',
  description: 'Simple and reliable website uptime monitoring.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head /> {/* Keep head for potential future use */}
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}> {/* Apply font variable and base styles */}
        <div className="flex min-h-screen w-full flex-col"> {/* Ensure full height */}
           <Navbar/>
           <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mt-16"> {/* Added mt-16 for fixed navbar */}
            {children}
           </main>
        </div>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
