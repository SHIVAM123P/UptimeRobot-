
import Link from 'next/link';
import { Home, Menu, Package2, CircleUser } from 'lucide-react'; // Added Package2 and CircleUser
import { Button } from '@/components/ui/button'; // Added Button import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Added DropdownMenu imports
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Added Sheet imports

export default function Navbar() { // Changed to default export
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">AlwaysUp</span>
        </Link>
        <Link
          href="/"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="/pricing"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Pricing
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          About Us
        </Link>
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
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-primary"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">AlwaysUp</span>
            </Link>
             <Link href="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground"
            >
              About Us
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Placeholder for potential search or other actions */}
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
