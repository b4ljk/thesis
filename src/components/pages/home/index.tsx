import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroHeader = {
  header: string;
  subheader: string;
  image: string;
};

export const heroHeader: HeroHeader = {
  header: `Cloudsign`,
  subheader: `Монголын Анхны үүлэн тоон гарын үсгийн систем`,
  image: `/cloud.png`,
};

export default function HeroHeader() {
  return (
    <section className="col container flex flex-col gap-4 pb-12 pt-4 text-center lg:flex-row lg:items-center lg:gap-8 ">
      <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
        <div className="space-y-2">
          <div className="relative">
            <h1 className="text-start text-6xl font-black text-cyan-950 lg:text-6xl">
              {heroHeader.header}
            </h1>
            <div className="absolute bottom-0 left-4 z-[-11] h-7 w-[400px] bg-gradient-to-r from-[#78dbfe] via-[#e387fb] to-transparent"></div>
          </div>
          <h2 className="text-lg text-muted-foreground lg:text-2xl">
            {heroHeader.subheader}
          </h2>
        </div>
        <div className="flex gap-2">
          <Link
            href="https://github.com/redpangilinan/next-shadcn-landing"
            target="_blank"
            className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
          >
            Туршиж үзэх
          </Link>
          <Link
            href="https://github.com/redpangilinan/next-shadcn-landing"
            target="_blank"
            className={`w-[10rem] ${cn(
              buttonVariants({ size: "lg", variant: "outline" }),
            )}`}
          >
            Криптограф
          </Link>
        </div>
      </div>
      <div className="animate-randomBounce relative mt-0  flex-1">
        <Image
          src="/cloud.png"
          width={1024}
          height={1024}
          alt="Cloud sign hero image"
          className="w-full"
          priority
        />
        {/* <div className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse bg-red-200">
          hehe
        </div> */}
      </div>
    </section>
  );
}
