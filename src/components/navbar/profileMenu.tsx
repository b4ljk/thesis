import { ChevronDown, ChevronDownCircle } from "lucide-react";
import Image from "next/image";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

interface ProfileMenuProps {
  profile?: string;
}
export default function ProfileMenu({ profile }: ProfileMenuProps) {
  return (
    <div className="relative">
      <DropdownMenuComponent>
        <Image
          src={profile ?? "/images/default_avatar.jpg"}
          alt="avatar"
          width={40}
          height={40}
          className={`dark:drop-shadow-gray-600
                  dark:drop-shadow-opacity-75
                  dark:drop-shadow-offset-y-2
                  dark:drop-shadow-offset-x-2
                  dark:drop-shadow-blur-2
                  dark:drop-shadow-spread-2
                  h-14
                  w-14
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
        <div className="absolute bottom-0 right-0 rounded-full bg-slate-700">
          <ChevronDown size={19} strokeWidth={2.75} color="white" />
        </div>
      </DropdownMenuComponent>
    </div>
  );
}

interface ProfileDropdownProps {
  children: React.ReactNode;
}

const DropdownMenuComponent: React.FC<ProfileDropdownProps> = ({
  children,
}) => {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Тохиргоо</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Профайл</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Төлбөр</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Тохиргоо</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Гарах</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
