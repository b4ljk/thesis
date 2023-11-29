"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import LoginButton from "../auth/loginButton";
import { useSession } from "next-auth/react";
import ProfileMenu from "../navbar/profileMenu";
import { NavigationMenuComponent } from "./navigationMenu";

const Header = () => {
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();

  const handleClose = () => {
    setOpened(false);
  };

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
              <p className="font-bold">Cloud Cryptography</p>
            </div>
          </Link>
        </div>
        <NavigationMenuComponent
          className="hidden md:block"
          handleClose={handleClose}
        />
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
        </div>
      </nav>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="h-full w-full">
          <div className="flex h-full flex-col justify-center overflow-y-auto bg-white px-4 pb-10 pt-6">
            <nav className="flex flex-col gap-y-4">
              <NavigationMenuComponent handleClose={handleClose} />
            </nav>
            <div className=" mt-4 w-full border-t border-t-gray-200 pt-4">
              {!session?.user ? (
                <LoginButton />
              ) : (
                <div className="flex">
                  <ProfileMenu profile={session?.user?.image} />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
