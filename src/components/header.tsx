"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
// import LoginButton from "./login_modal";

const Header = () => {
  const [opened, setOpened] = useState(false);
  const pathName = usePathname();
  const isHome = pathName === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-b-gray-200 bg-white bg-opacity-25 backdrop-blur-md">
      <nav
        className="flex items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <div className="-m-1.5 flex items-center gap-2 p-1.5">
              <Image
                height={80}
                width={80}
                className="h-12 w-auto object-cover dark:invert"
                src="/images/logo.png"
                alt="logo"
              />
              <p className="font-bold">Cloudsign</p>
            </div>
          </Link>
        </div>
        {!isHome && (
          <div className="mx-4 mr-4 md:mr-8">{/* <SearchBar sm /> */}</div>
        )}
        <div className="flex lg:hidden">
          <Button variant="outline" onClick={() => setOpened(true)}>
            <Menu size={24} />
          </Button>
        </div>

        <div className="hidden items-center lg:flex lg:gap-x-12"></div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* <LoginButton /> */}
          <div>test</div>
        </div>
      </nav>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <div className="flex h-full flex-col justify-center overflow-y-auto bg-white px-4 pb-10 pt-6">
            <nav className="flex flex-col gap-y-4">
              {/* <a
                href={"https://huvaari.bagsh.space/"}
                className="relative text-sm font-semibold leading-6 text-gray-900"
              >
                <div className="absolute -right-2 -top-4 rounded-bl-full rounded-tr-full bg-green-500 px-2 py-0.5 text-xs text-white opacity-75">
                  Шинэ
                </div>
                Хуваарь үүсгэгч
              </a>
              <a
                href={"https://huvaari.bagsh.space/"}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Холбоо барих
              </a> */}
            </nav>
            <div className=" mt-4 w-full border-t border-t-gray-200 pt-4">
              {/* <LoginButton /> */}
              <div>test</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
