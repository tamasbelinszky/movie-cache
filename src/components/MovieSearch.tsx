"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MAX_QUERY_LENGTH } from "@/lib/tmdb";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  movieName: z
    .string()
    .min(3, {
      message: "Movie name must be at least 3 characters.",
    })
    .max(MAX_QUERY_LENGTH, {
      message: `Movie name must be at most ${MAX_QUERY_LENGTH} characters.`,
    }),
});

export const MovieSearch: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieName: searchParams.get("query") || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", values.movieName);
      return router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center gap-2">
        <FormField
          control={form.control}
          name="movieName"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start lg:min-w-[500px]">
              <FormControl>
                <Input className="w-full" placeholder="Search for movies" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending || !form.formState.isValid} type="submit">
          Search
        </Button>
      </form>
    </Form>
  );
};
