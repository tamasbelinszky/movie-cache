import Image from "next/image";
import React from "react";

export const ProfileItem: React.FC<{
  name: string;
  avatar: string;
}> = ({ name, avatar }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="translate-z-0 relative h-[calc(5rem+5vw)] w-[calc(5rem+5vw)] transform overflow-hidden rounded-xl bg-gray-200 md:h-52 md:w-52 2xl:h-80 2xl:w-80">
        {avatar && <Image unoptimized src={avatar} alt={name} fill className="h-full w-full object-cover" />}
        <div className="absolute inset-0 rounded-xl border-4 border-gray-900 opacity-0 transition-opacity duration-100 hover:opacity-100 active:opacity-100"></div>
      </div>
      <h3 className="active:text-primary-primary mt-4 text-xl font-bold text-primary transition-colors duration-100 hover:text-foreground dark:text-foreground dark:hover:text-primary dark:active:text-foreground">
        {name}
      </h3>
    </div>
  );
};
