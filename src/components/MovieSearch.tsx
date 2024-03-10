"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const formSchema = z.object({
  movieName: z
    .string()
    .min(3, {
      message: "Movie name must be at least 3 characters.",
    })
    .max(80, {
      message: "Movie name must be at most 80 characters.",
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center gap-2"
      >
        <FormField
          control={form.control}
          name="movieName"
          render={({ field }) => (
            <FormItem className="flex lg:min-w-[500px] flex-col items-start">
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Search for a movie name"
                  autoFocus
                  {...field}
                />
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
