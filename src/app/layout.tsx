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
    // Added 'dark' class here to force dark mode
    <html lang="en" className="dark" suppressHydrationWarning><head />
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}> {/* Apply font variable and base styles */}
        <div className="flex min-h-screen w-full flex-col"> {/* Ensure full height */}
           <Navbar/>
           {/* Removed main padding/gap here, handled by page components */}
           <main className="flex flex-1 flex-col mt-16"> {/* Added mt-16 for fixed navbar */}
            {children}
           </main>
        </div>
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
