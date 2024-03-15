import { WavyBackground } from "@/components/ui/wavy-background";

export default function Home() {
  return (
    <WavyBackground className="flex w-full flex-col p-2 pb-[60vh] lg:pb-40">
      <h1 className="inter-var text-balance text-center text-2xl font-bold text-white md:text-4xl lg:text-7xl">
        Discover Movies with <span className="text-primary">Movie Cache App</span>
      </h1>
      <p className="inter-var mt-4 text-balance text-center text-base font-normal text-white md:text-lg">
        Simply click the search icon to start exploring!
      </p>
    </WavyBackground>
  );
}
