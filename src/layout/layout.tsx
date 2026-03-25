import { Link, Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import SidebarUserButton from "@/components/sidebar-user-button";
import {
  ClipboardListIcon,
  BrainCircuitIcon,
  LayoutDashboard,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { LogInIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Layout() {
  const isMobile = useIsMobile();
  const { data, error, isPending } = authClient.useSession();
  if (isPending)
    return (
      <div className="mt-28 text-2xl animate-bounce text-center">
        Checking Session
      </div>
    );
  if (error) {
    console.log(error.message);
    return (
      <div className="text-xl mt-32 text-red-500 text-center">
        Error in auth, {error.message}
      </div>
    );
  }
  return (
    <main>
      <TooltipProvider>
        <SidebarProvider>
          <Sidebar collapsible="icon" className="overflow-hidden">
            <SidebarHeader className="flex-row">
              <SidebarTrigger className="size-8" />
              <span className="text-lg text-nowrap">Jobs Board</span>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                {!data && (
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 text-sm"
                      >
                        <LogInIcon /> <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer w-full"
                  >
                    <ClipboardListIcon /> <span>Job Board</span>
                  </Link>
                </SidebarMenuButton>

                {data && (
                  <div>
                    <SidebarMenuButton>
                      <Link
                        to="/app/ai-search"
                        className="flex items-center gap-3 cursor-pointer w-full"
                      >
                        <BrainCircuitIcon /> <span>AI Search</span>
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton>
                      <Link
                        to="/app/employer-dashboard"
                        className="flex items-center gap-3  cursor-pointer w-full"
                      >
                        <LayoutDashboard /> <span>Employer Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarContent>

            <SidebarFooter>
              {data && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarUserButton />
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarFooter>
          </Sidebar>

          {isMobile && <SidebarTrigger />}

          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </main>
  );
}
