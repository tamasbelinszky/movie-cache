"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ProfileItem } from "./ProfileItem";
import { TypewriterEffect } from "./ui/typewriter-effect";

const PROFILES = [
  { img: 1, name: "Zed" },
  { img: 2, name: "Amanda" },
  { img: 3, name: "Shad" },
  { img: 4, name: "Nina" },
  { img: 5, name: "Luna" },
] as const;

const getProfile = () => {
  let profile;

  if (typeof window !== "undefined") {
    profile = window.localStorage?.getItem("profile");
  }

  if (profile) {
    try {
      const parsedProfile = JSON.parse(profile);
      const foundProfile = PROFILES.find((p) => p.name === parsedProfile.name && p.img === parsedProfile.img);
      if (foundProfile) return foundProfile;
    } catch (error) {
      console.error(error);
    }
  }
  return PROFILES[0];
};

export function ProfileSheet() {
  const router = useRouter();
  const handleClick = (profile: (typeof PROFILES)[number]) => {
    localStorage.setItem("profile", JSON.stringify(profile));
    router.refresh();
  };

  const profile = getProfile();

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <button>
          <Image
            unoptimized
            alt={profile.name}
            src={`/static/images/${profile.img}.webp`}
            className="rounded-full border-2 border-primary/75 dark:border-primary/40"
            height={32}
            width={32}
          />
        </button>
      </SheetTrigger>
      <SheetContent side={"top"}>
        <div className="mt-[5vh] flex min-h-screen flex-col items-center justify-start gap-8 lg:mt-[10vh]  lg:gap-36 ">
          <SheetHeader>
            <SheetTitle className="animate-pulse">
              <TypewriterEffect
                className="text-3xl font-bold text-foreground"
                words={[{ text: "Who" }, { text: "is" }, { text: "watching" }, { text: "?" }]}
                cursorClassName="hidden"
              />
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 items-center gap-4 overflow-y-auto p-2 pb-96 text-center md:grid-cols-3 lg:grid-cols-5">
            {PROFILES.map((profile) => (
              <SheetClose asChild key={profile.name}>
                <Button
                  onClick={() => handleClick(profile)}
                  className="h-full bg-transparent hover:bg-primary/40 hover:text-white dark:hover:bg-gray-600 "
                >
                  <ProfileItem name={profile.name} avatar={`/static/images/${profile.img}.webp`} />
                </Button>
              </SheetClose>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
