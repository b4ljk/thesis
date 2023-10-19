"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import LoginButton from "./auth/loginButton";
import { useSession } from "next-auth/react";
import ProfileMenu from "./navbar/profileMenu";

const Header = () => {
  const [opened, setOpened] = useState(false);
  const pathName = usePathname();
  const isHome = pathName === "/";
  const { data: session } = useSession();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-b-gray-200 bg-white bg-opacity-25 backdrop-blur-md">
      <nav
        className="container flex items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <div className="-m-1.5 flex items-center gap-2 p-1.5">
              <Image
                height={80}
                width={80}
                className="h-12 w-auto object-cover"
                src="/images/logo.png"
                alt="logo"
              />
              <p className="font-bold">Cloudsign</p>
            </div>
          </Link>
        </div>
        {/* <Link href={"/upload"}>Ашиглах</Link> */}
        <div className="flex lg:hidden">
          <Button variant="outline" onClick={() => setOpened(true)}>
            <Menu size={24} />
          </Button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!session?.user ? (
            <LoginButton />
          ) : (
            <ProfileMenu profile={session?.user?.profile} />
          )}
          {/* <div>test</div> */}
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
              {!session?.user ? (
                <LoginButton />
              ) : (
                <Image
                  src={session?.user?.profile ?? "/images/default_avatar.jpg"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className={`dark:drop-shadow-gray-600
                  dark:drop-shadow-opacity-75
                  dark:drop-shadow-offset-y-2
                  dark:drop-shadow-offset-x-2
                  dark:drop-shadow-blur-2
                  dark:drop-shadow-spread-2
                  h-10
                  w-10
                  rounded-full
                  border-2
                  border-gray-600
                  object-cover
                  dark:border-gray-400
                  dark:bg-gray-800
                  dark:bg-opacity-25
                  dark:opacity-75
                  dark:blur-md
                  dark:drop-shadow-lg
                  dark:invert
                  dark:filter
                  `}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
