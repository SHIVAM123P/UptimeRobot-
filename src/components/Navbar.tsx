
import Link from 'next/link';
import { Home, Menu, Package2, CircleUser, Settings, LifeBuoy, LogOut } from 'lucide-react'; // Added more specific icons
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils'; // Import cn utility

export default function Navbar() {
  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Desktop Navigation */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary whitespace-nowrap" // Ensure logo/name doesn't wrap
        >
          <Package2 className="h-6 w-6" />
          <span className="">AlwaysUp</span> {/* Keep name visible */}
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
             // TODO: Add active link highlighting based on current route
            className={cn(
              "transition-colors hover:text-foreground",
              // Example active state: pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
              "text-muted-foreground" // Default state
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col"> {/* Use flex-col for layout */}
           <nav className="grid gap-6 text-lg font-medium mt-4"> {/* Add margin top */}
             <Link
               href="/"
               className="flex items-center gap-2 text-lg font-semibold text-primary mb-4" // Add margin bottom
             >
               <Package2 className="h-6 w-6" />
               <span>AlwaysUp</span>
             </Link>
             {navLinks.map((link) => (
               <Link
                 key={link.href}
                 href={link.href}
                 // TODO: Add active link highlighting for mobile
                 className={cn(
                   "transition-colors hover:text-foreground",
                   // Example active state: pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                   "text-muted-foreground" // Default state
                 )}
                 // onClick={() => closeSheet()} // Consider closing sheet on navigation
               >
                 {link.label}
               </Link>
             ))}
           </nav>
         </SheetContent>
      </Sheet>

      {/* Right side items (User Menu) */}
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
               <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
