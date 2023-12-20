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
  header: `CloudSign`,
  subheader: `Монголын Анхны үүлэн тоон гарын үсгийн систем`,
  image: `/cloud.png`,
};

export default function HeroHeader() {
  return (
    <section className="col container flex flex-col gap-4 pb-12 pt-4 text-center lg:flex-row lg:items-center lg:gap-8 ">
      <div className="flex flex-1 flex-col gap-4 text-center lg:gap-8">
        <div className="space-y-2">
          <div className="relative overflow-hidden">
            <h1 className="text-start text-6xl font-black text-slate-800 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)] dark:text-slate-100 lg:text-7xl">
              {heroHeader.header}
            </h1>
            <div className="absolute bottom-0 left-4 z-[-11] h-7 w-[480px] bg-gradient-to-r from-[#78dbfe] via-[#e387fb] to-transparent"></div>
          </div>
          <h2 className="animate-typing overflow-hidden whitespace-nowrap border-r-[15px] border-r-slate-800 pr-0 text-start text-lg font-bold text-muted-foreground transition dark:border-r-white lg:text-2xl">
            {heroHeader.subheader}
          </h2>
        </div>
        <div className="flex gap-2">
          <Link
            href="/upload"
            className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
          >
            Туршиж үзэх
          </Link>
          <Link
            href="/cryptography"
            className={`w-[10rem] ${cn(
              buttonVariants({ size: "lg", variant: "outline" }),
            )}`}
          >
            Криптограф
          </Link>
        </div>
      </div>
      <div className="relative mt-0 flex-1  animate-randomBounce">
        <Image
          src="/cloud.png"
          width={1024}
          height={1024}
          alt="CloudSign hero image"
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
