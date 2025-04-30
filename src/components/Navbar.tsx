
import Link from 'next/link';
import { Menu, Package2, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils'; // Import cn utility
// Removed user dropdown imports as they are replaced by a simple login button for now
// import { CircleUser, Settings, LifeBuoy, LogOut } from 'lucide-react';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const navLinks = [
    { href: '/', label: 'Home' }, // Changed Dashboard to Home
    { href: '/about', label: 'About' },
    // { href: '/docs', label: 'Docs' }, // Added Docs (placeholder)
    { href: '/pricing', label: 'Pricing' },
    // { href: '/blog', label: 'Blog' }, // Added Blog (placeholder)
  ];

  // TODO: Get active pathname for active link styling
  const pathname = '/'; // Placeholder

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Left side: Logo and Desktop Navigation */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-foreground whitespace-nowrap mr-4" // Use foreground for logo text
        >
          {/* Placeholder SVG similar to Amplifresh logo */}
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="hsl(var(--primary))"/>
            <path d="M50 15L80.8 32.5V67.5L50 85L19.2 67.5V32.5L50 15Z" fill="hsl(var(--background))"/>
            <path d="M50 25L72.15 37.5V62.5L50 75L27.85 62.5V37.5L50 25Z" fill="hsl(var(--primary))"/>
          </svg>
          <span className="font-bold">AlwaysUp</span>
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
               pathname === link.href ? "text-foreground font-medium" : "text-foreground/60" // Adjusted active/inactive colors
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation Trigger */}
       <Sheet>
         <SheetTrigger asChild>
           <Button
             variant="ghost" // Use ghost variant for mobile trigger
             size="icon"
             className="shrink-0 md:hidden text-foreground/70 hover:text-foreground" // Match text colors
             aria-label="Toggle navigation menu"
           >
             <Menu className="h-5 w-5" />
             <span className="sr-only">Toggle navigation menu</span>
           </Button>
         </SheetTrigger>
         <SheetContent side="left" className="flex flex-col bg-background border-border/50"> {/* Match background and border */}
            <nav className="grid gap-4 text-base font-medium mt-4"> {/* Adjusted gap and text size */}
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4" // Match text color
              >
                 <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="hsl(var(--primary))"/>
                    <path d="M50 15L80.8 32.5V67.5L50 85L19.2 67.5V32.5L50 15Z" fill="hsl(var(--background))"/>
                    <path d="M50 25L72.15 37.5V62.5L50 75L27.85 62.5V37.5L50 25Z" fill="hsl(var(--primary))"/>
                 </svg>
                <span className="font-bold">AlwaysUp</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80 py-2", // Add padding
                    pathname === link.href ? "text-foreground font-medium" : "text-foreground/60" // Match active/inactive colors
                  )}
                  // onClick={() => closeSheet()} // Consider closing sheet on navigation
                >
                  {link.label}
                </Link>
              ))}
                 {/* Add Log in button to mobile sheet */}
                 <Button
                    variant="outline" // Use outline style like image
                    className="mt-4 w-full justify-center border-foreground/30 text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                    asChild
                  >
                    <Link href="#">
                        Log in <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                 </Button>
            </nav>
          </SheetContent>
       </Sheet>


      {/* Right side items (Log in Button) */}
      <div className="hidden md:flex items-center gap-4">
        <Button
            variant="outline" // Use outline style like image
            className="border-foreground/30 text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
            asChild
        >
            <Link href="#"> {/* Placeholder Link */}
                Log in <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
        {/* Removed Dropdown Menu */}
      </div>

       {/* Placeholder for Logo on Mobile when menu is closed (optional) */}
       <div className="flex items-center gap-2 md:hidden">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base text-foreground whitespace-nowrap"
            >
                 <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="hsl(var(--primary))"/>
                    <path d="M50 15L80.8 32.5V67.5L50 85L19.2 67.5V32.5L50 15Z" fill="hsl(var(--background))"/>
                    <path d="M50 25L72.15 37.5V62.5L50 75L27.85 62.5V37.5L50 25Z" fill="hsl(var(--primary))"/>
                 </svg>
                 <span className="sr-only">AlwaysUp</span> {/* Hide text on mobile, show logo */}
            </Link>
       </div>
    </header>
  );
}
