import { authClient } from "@/lib/auth-client";
import { SidebarMenuButton } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router";

export default function SidebarUserButton() {
  const { data } = authClient.useSession();
  const imageSrc = data?.user.image as string | undefined;
  const nameInitials = data?.user.name
    .split("")
    .slice(0, 2)
    .map((str) => str[0])
    .join("");
  return (
    <Link to="/app/user-profile">
    <SidebarMenuButton
      size="lg"
      className="flex items-center gap-2 overflow-hidden bg-gray-200 cursor-pointer"
    >
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageSrc} alt={data?.user.name} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1 min-w-0 leading-tight">
        <span className="truncate text-sm font-semibold">
          {data?.user.name}
        </span>
        <span className="truncate text-xs">{data?.user.email}</span>
      </div>

      
    </SidebarMenuButton>
      </Link>
  );
}

