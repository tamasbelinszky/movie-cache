"use client";

import React from "react";

import { TypewriterEffect } from "./ui/typewriter-effect";

export function MovieNotFound() {
  return (
    <div className="flex h-[25rem] flex-col items-center justify-start gap-2 text-center text-3xl font-bold">
      <p>Movie not found</p>
      <p className="text-primary">404</p>
      <TypewriterEffect words={[{ text: "Please" }, { text: "try" }, { text: "another" }, { text: "search." }]} />
    </div>
  );
}
