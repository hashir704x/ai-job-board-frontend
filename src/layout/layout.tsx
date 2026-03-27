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
import ThemeToggle from "@/components/theme-toggle";
import {
  ClipboardListIcon,
  BrainCircuitIcon,
  LayoutDashboard,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { LogInIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import FullscreenLoader from "@/components/loading/fullscreen-loader";

export default function Layout() {
  const isMobile = useIsMobile();
  const { data, error, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <main>
        <FullscreenLoader title="Checking session..." subtitle="Please wait" />
      </main>
    );
  }
  if (error) {
    console.log(error.message);
    return (
      <main className="p-4">
        <div className="mx-auto max-w-lg border rounded-xl p-6 bg-card text-center space-y-2">
          <div className="text-lg font-semibold text-destructive">
            Error in auth
          </div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
        </div>
      </main>
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
              {!data && (
                <SidebarMenu>
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
                </SidebarMenu>
              )}

              <SidebarMenu>
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
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <ThemeToggle />
                </SidebarMenuItem>
                {data && (
                  <SidebarMenuItem>
                    <SidebarUserButton />
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
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
