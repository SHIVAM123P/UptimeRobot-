"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

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

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWebsiteFormProps {
  onAddWebsite: (url: string) => void;
  isLoading: boolean;
}

export function AddWebsiteForm({ onAddWebsite, isLoading }: AddWebsiteFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
     try {
       // Basic check to prevent adding localhost or private IPs if needed
       // const parsedUrl = new URL(data.url);
       // if (['localhost', '127.0.0.1'].includes(parsedUrl.hostname) || parsedUrl.hostname.startsWith('192.168.') || parsedUrl.hostname.startsWith('10.')) {
       //   throw new Error("Monitoring local or private URLs is not supported.");
       // }

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
                <Input placeholder="https://example.com" {...field} aria-label="Website URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !form.formState.isValid}>
          {isLoading ? 'Adding...' : <><Plus className="mr-2 h-4 w-4" /> Add Website</>}
        </Button>
      </form>
    </Form>
  );
}
