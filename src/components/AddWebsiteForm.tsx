
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import Link from 'next/link'; // Import Link

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert components

const FREE_TIER_LIMIT = 5; // Define the limit

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWebsiteFormProps {
  onAddWebsite: (url: string) => void;
  isLoading: boolean;
  currentMonitorCount: number; // Add prop for current count
}

export function AddWebsiteForm({ onAddWebsite, isLoading, currentMonitorCount }: AddWebsiteFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const isLimitReached = currentMonitorCount >= FREE_TIER_LIMIT;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
     if (isLimitReached) {
        // This check is redundant if the button is disabled, but good as a safeguard
        toast({
          variant: "destructive",
          title: "Free Tier Limit Reached",
          description: (
             <>
              You can monitor up to {FREE_TIER_LIMIT} websites on the free plan. {' '}
              <Link href="/pricing" className="underline text-accent-foreground font-medium">
                Upgrade
              </Link>
              {' '} for more monitors.
             </>
         ),
        });
        return;
     }

     try {
       onAddWebsite(data.url);
       form.reset(); // Reset form after successful submission
     } catch (error: any) {
       toast({
         variant: "destructive",
         title: "Error Adding Website",
         description: error.message || "Could not add the website.",
       });
     }
  };

  return (
    <Form {...form}>
       {isLimitReached && (
         <Alert variant="destructive" className="mb-4">
           <AlertDescription className="text-center">
             You've reached the free tier limit ({FREE_TIER_LIMIT} monitors). {' '}
             <Link href="/pricing" className="underline font-semibold">
               Upgrade
             </Link>
             {' '} to add more.
           </AlertDescription>
         </Alert>
       )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel className="sr-only">Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  aria-label="Website URL"
                  disabled={isLimitReached || isLoading} // Disable input if limit reached
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid || isLimitReached} // Disable button if limit reached
        >
          {isLoading ? 'Adding...' : <><Plus className="mr-2 h-4 w-4" /> Add Website</>}
        </Button>
      </form>
    </Form>
  );
}
