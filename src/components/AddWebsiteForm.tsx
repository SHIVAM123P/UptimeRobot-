"use client";

import * as React from "react";
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import Link from 'next/link';

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addWebsite } from "@/app/actions"; // Import the server action

const FREE_TIER_LIMIT = 5;

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWebsiteFormProps {
  currentMonitorCount: number;
}

// Submit Button component to use useFormStatus
function SubmitButton({ isLimitReached }: { isLimitReached: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || isLimitReached}
      aria-disabled={pending || isLimitReached}
    >
      {pending ? 'Adding...' : <><Plus className="mr-2 h-4 w-4" /> Add Website</>}
    </Button>
  );
}

export function AddWebsiteForm({ currentMonitorCount }: AddWebsiteFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // useFormState hook to handle server action state
  const [state, formAction] = useFormState(addWebsite, null); // Pass the server action

  const { pending } = useFormStatus(); // Get pending state for disabling input

  const isLimitReached = currentMonitorCount >= FREE_TIER_LIMIT;

  // Effect to show toast message based on server action result
  React.useEffect(() => {
    if (state?.success) {
      toast({
        title: "Website Added",
        description: state.success,
      });
      form.reset(); // Reset form on success
    } else if (state?.error) {
      toast({
        variant: "destructive",
        title: "Error Adding Website",
        description: state.error,
      });
      // Optionally set form errors if fieldErrors exist
       if (state.fieldErrors?.url) {
         form.setError("url", { type: "server", message: state.fieldErrors.url[0] });
       }
    }
  }, [state, toast, form]);


  return (
    <Form {...form}>
       {isLimitReached && !pending && ( // Show limit alert only if not currently submitting
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
       {/* The form now calls the formAction */}
      <form
         action={formAction} // Use the action from useFormState
         // onSubmit={form.handleSubmit(() => {})} // We don't need react-hook-form's onSubmit directly with formAction
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
                  disabled={isLimitReached || pending} // Disable input if limit reached or pending
                  required // HTML5 validation
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {/* Use the dedicated SubmitButton */}
         <SubmitButton isLimitReached={isLimitReached} />
      </form>
    </Form>
  );
}
