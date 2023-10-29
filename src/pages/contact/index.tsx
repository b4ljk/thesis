import Image from "next/image";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { cn } from "../../lib/utils";

const GradientSeparator = ({ className = "" }: { className?: string }) => (
  <div
    style={{
      background: "linear-gradient(to right, white, black, white)",
    }}
    className={cn("h-[2px] w-full", className)}
  />
);

export default function Contact() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="relative flex w-full justify-center">
        <div className="flex h-52 flex-col justify-center md:h-64">
          <Image
            src="/background/map.svg"
            layout="fill"
            // objectFit="cover"
            alt="map"
            className="absolute z-[-99] object-cover object-top"
          />
          <div className="flex flex-col md:flex-row">
            <p className="p-2 text-5xl font-black uppercase">Бидэнтэй</p>
            <p className="-rotate-3 rounded-lg bg-blue-600 p-2 text-5xl font-bold uppercase text-white">
              холбогдох
            </p>
          </div>
        </div>
      </div>
      <GradientSeparator className="w-screen" />
      <div className="mt-12 grid w-full max-w-2xl flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <Input placeholder="Name" />
        <Input placeholder="Name" />
      </div>
    </div>
  );
}
