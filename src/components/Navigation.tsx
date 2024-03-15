import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ModeToggle } from "./ModeToggle";
import { MovieSearchDrawer } from "./MovieSearchDrawer";
import { ProfileSheet } from "./ProfileSheet";

export const Navigation: React.FC = () => {
  return (
    <nav className="flex w-full items-center justify-between gap-3 p-2">
      <ProfileSheet />

      <div className="flex items-center gap-3">
        <MovieSearchDrawer />
        <ModeToggle />
        <Link
          href="https://github.com/tamasbelinszky"
          className="text-primary hover:animate-spin dark:text-foreground"
          target="_blank"
        >
          <GitHubLogoIcon className="h-8 w-8" />
        </Link>
      </div>
    </nav>
  );
};
