"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MAX_QUERY_LENGTH } from "@/lib/tmdb";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "./ui/input";

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

export function MovieSearchDrawer() {
  const [open, setOpen] = React.useState(false);

  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieName: searchParams.get("query") || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("query", values.movieName);
      setOpen(false);
      return router.push(`/movies?${params.toString()}`);
    });
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button data-testid="movie-search-drawer-btn" variant="outline">
          <SearchIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm ">
          <DrawerHeader>
            <DrawerTitle className="mb-6 text-2xl">What are you looking for?</DrawerTitle>
            <DrawerDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col items-start justify-center gap-2 lg:w-[500px]"
                >
                  <FormField
                    control={form.control}
                    name="movieName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Search for movies" autoFocus {...field} />
                        </FormControl>
                        <section className="h-5">
                          <FormMessage />
                        </section>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </DrawerDescription>
            <DrawerClose asChild>
              <Button disabled={isPending || !form.formState.isValid} type="submit">
                Search
              </Button>
            </DrawerClose>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
