
import type { Metadata } from 'next';
import { CheckCircle, Star } from 'lucide-react'; // Using CheckCircle for features
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Import Badge

export const metadata: Metadata = {
  title: 'AlwaysUp - Choose Your Plan',
  description: 'Select the plan that matches your needs and start saving time.',
};

// Using placeholder icons similar to the image
const BasicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>; // Simple placeholder
const BusinessIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>; // Simple placeholder


const pricingTiers = [
  {
    name: 'Basic',
    price: '₹499', // Adjusted price
    frequency: '/month',
    description: 'For personal projects & basic needs.',
    features: [
      '5 Monitors',
      '5-minute Check Interval',
      'Email Alerts',
      'Basic Status Page',
    ],
    cta: 'Get the plan',
    href: '#', // Placeholder
    mostPopular: false,
    icon: BasicIcon,
    footerNote: 'No extra hidden charge',
  },
  {
    name: 'Pro',
    price: '₹799', // Kept this one as requested earlier
    frequency: '/month',
    description: 'For small businesses & professionals.',
    features: [
      '50 Monitors',
      '1-minute Check Interval',
      'Email & SMS Alerts',
      'Customizable Status Page',
      'Advanced Reporting',
    ],
    cta: 'Get the plan',
    href: '#', // Placeholder
    mostPopular: true,
    icon: null, // No specific icon shown for Pro in the image
    footerNote: 'No extra hidden charge',
  },
  {
    name: 'Business',
    price: '₹3,999', // Kept this one
    frequency: '/month',
    description: 'For teams & critical applications.',
    features: [
      'Unlimited Monitors',
      '1-minute Check Interval',
      'Email, SMS & Pager Alerts',
      'Team Collaboration',
      'Priority Support',
      'API Access',
    ],
    cta: 'Get the plan',
    href: '#', // Placeholder
    mostPopular: false,
    icon: BusinessIcon,
    footerNote: 'No extra hidden charge',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4">
      <header className="container mx-auto max-w-5xl text-center mb-12">
        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary font-semibold border-primary/20">
            Simple Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Boost your website reliability with AlwaysUp monitoring. Select the plan that matches your needs and gain peace of mind today.
        </p>
         {/* Removed back link for cleaner look */}
      </header>

      <main className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'flex flex-col bg-card border border-border rounded-xl shadow-lg transition-all hover:shadow-primary/20 hover:border-primary/50', // Updated card styles
                tier.mostPopular ? 'border-primary ring-2 ring-primary/30 shadow-primary/30' : 'border-border/50', // Glow effect for popular
                'relative overflow-hidden' // Ensure badge positioning works
              )}
            >
              {tier.mostPopular && (
                  <Badge
                    variant="default" // Use primary color for badge
                    className="absolute top-4 right-4 flex items-center gap-1 bg-primary text-primary-foreground"
                  >
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                )}
              <CardHeader className="pt-8 pb-4 px-6"> {/* Adjusted padding */}
                <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-2xl font-semibold text-foreground">{tier.name}</CardTitle>
                    {tier.icon && <tier.icon />}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                  <span className="text-lg font-medium text-muted-foreground">{tier.frequency}</span>
                </div>
                 {/* Description moved below price */}
                 <CardDescription className="text-muted-foreground mt-2 h-10">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-6 pb-8 px-6 border-t border-border/30"> {/* Added border */}
                <ul role="list" className="space-y-3 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" /> {/* Changed icon and color */}
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col items-center pt-6 pb-8 px-6 border-t border-border/30"> {/* Added border */}
                <Button
                  asChild
                  className="w-full mb-4 bg-gradient-to-r from-primary/80 to-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold" // Updated button style
                  // variant={tier.mostPopular ? 'default' : 'outline'} // Simplified variant
                  disabled={tier.href === '#'}
                  aria-disabled={tier.href === '#'}
                  title={tier.href === '#' ? 'Payment integration coming soon' : undefined}
                >
                  <Link href={tier.href}>{tier.cta} &rarr;</Link> {/* Added arrow */}
                </Button>
                <p className="text-xs text-muted-foreground">{tier.footerNote}</p>
                 {/* Removed specific payment note from here */}
              </CardFooter>
            </Card>
          ))}
        </div>
         <p className="mt-12 text-center text-sm text-muted-foreground">
            Note: PhonePe payment gateway integration requires backend setup and is currently simulated. Clicking upgrade buttons will not initiate a real transaction yet.
         </p>
      </main>

        {/* Removed separate footer */}
    </div>
  );
}
