
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AlwaysUp - Pricing (India)',
  description: 'Choose the right plan for your website monitoring needs.',
};

const pricingTiers = [
  {
    name: 'Free',
    price: '₹0',
    frequency: '/ month',
    description: 'For personal projects & basic needs.',
    features: [
      '5 Monitors',
      '5-minute Check Interval',
      'Email Alerts',
      'Basic Status Page',
    ],
    cta: 'Get Started',
    href: '/', // Link back to dashboard or signup
    mostPopular: false,
    paymentNote: '',
  },
  {
    name: 'Pro',
    price: '₹799', // Approx $10
    frequency: '/ month',
    description: 'For small businesses & professionals.',
    features: [
      '50 Monitors',
      '1-minute Check Interval',
      'Email & SMS Alerts',
      'Customizable Status Page',
      'Advanced Reporting',
    ],
    cta: 'Upgrade to Pro',
    href: '#', // Placeholder for upgrade link/action
    mostPopular: true,
    paymentNote: 'Payments via PhonePe (UPI, Cards, etc.)',
  },
  {
    name: 'Business',
    price: '₹3,999', // Approx $50
    frequency: '/ month',
    description: 'For teams & critical applications.',
    features: [
      'Unlimited Monitors',
      '1-minute Check Interval',
      'Email, SMS & Pager Alerts',
      'Team Collaboration',
      'Priority Support',
      'API Access',
    ],
    cta: 'Contact Sales',
    href: '#', // Placeholder for contact link
    mostPopular: false,
    paymentNote: 'Payments via PhonePe & other options available.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto max-w-5xl py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary mb-3">
          Simple, Transparent Pricing (INR)
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your monitoring needs. Start for free!
        </p>
         <Link href="/" className="text-sm text-primary hover:underline mt-4 inline-block">
          &larr; Back to Dashboard
        </Link>
      </header>

      <main className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'flex flex-col shadow-md transition-shadow hover:shadow-lg',
                tier.mostPopular ? 'border-2 border-primary ring-2 ring-primary/20' : 'border'
              )}
            >
              <CardHeader className="relative pb-4"> {/* Reduced padding bottom */}
                {tier.mostPopular && (
                  <div className="absolute top-0 right-4 -mt-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-xl font-semibold text-muted-foreground">{tier.frequency}</span>
                </div>
                 {tier.paymentNote && (
                    <p className="text-xs text-muted-foreground mt-1">{tier.paymentNote}</p>
                 )}
              </CardHeader>
              <CardContent className="flex-grow pt-2"> {/* Reduced padding top */}
                <ul role="list" className="space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={tier.mostPopular ? 'default' : 'outline'}
                  // Disable button if it's a placeholder to avoid confusion
                  disabled={tier.href === '#'}
                  aria-disabled={tier.href === '#'}
                  title={tier.href === '#' ? 'Payment integration coming soon' : undefined}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <p className="mt-10 text-center text-sm text-muted-foreground">
            Note: PhonePe payment gateway integration requires backend setup and is currently simulated on the frontend. Clicking upgrade buttons for paid plans will not initiate a real transaction yet.
         </p>
      </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground py-6 border-t">
           <p>&copy; {new Date().getFullYear()} AlwaysUp. All rights reserved.</p>
        </footer>
    </div>
  );
}
