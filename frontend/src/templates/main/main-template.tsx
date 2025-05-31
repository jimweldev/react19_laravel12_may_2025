import { useState } from 'react';
import {
  FaArrowRightFromBracket,
  FaGear,
  FaRegBell,
  FaRegMessage,
} from 'react-icons/fa6';
import { Link, Outlet } from 'react-router';
import useAuthUserStore from '@/_stores/auth-user-store';
import fallbackImage from '@/assets/images/default-avatar.png';
import ReactImage from '@/components/images/react-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider } from '@/components/ui/sidebar';
import { formatName } from '@/lib/format-name';
import AppNavbarLinks from './_components/app-navbar-links';
import AppRightSidebar from './_components/app-right-sidebar';
import AppSidebar, { type SidebarGroup } from './_components/app-sidebar';
import AppSidebarTrigger from './_components/app-sidebar-trigger';

type MainTemplateProps = {
  sidebarGroups: SidebarGroup[];
};

const MainTemplate = ({ sidebarGroups }: MainTemplateProps) => {
  const { user, clearAuthUser } = useAuthUserStore();

  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Notifications');

  return (
    <>
      <SidebarProvider>
        <AppSidebar sidebarGroups={sidebarGroups} />
        <main className="flex-1">
          <div className="bg-card flex items-center justify-between border-b p-2">
            <div className="flex items-center gap-2">
              <AppSidebarTrigger />
              <Separator className="h-4 min-h-0" orientation="vertical" />
              <AppNavbarLinks />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <Button
                  className="bg-muted rounded-full"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('Notifications');
                    setRightSidebarOpen(true);
                  }}
                >
                  <FaRegBell />
                </Button>
                <Button
                  className="bg-muted rounded-full"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('Messages');
                    setRightSidebarOpen(true);
                  }}
                >
                  <FaRegMessage />
                </Button>
              </div>

              <Separator className="h-4 min-h-0" orientation="vertical" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="size-10 cursor-pointer rounded-full p-1">
                    <div className="outline-primary flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent object-contain outline-2">
                      <ReactImage
                        src={`${import.meta.env.VITE_STORAGE_BASE_URL}/avatars/${user?.avatar}`}
                        alt="Avatar"
                        unloaderSrc={fallbackImage}
                      />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mx-2 min-w-56">
                  <DropdownMenuLabel>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {formatName(user)}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link to="/settings">
                      <DropdownMenuItem>
                        <FaGear className="text-inherit" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={clearAuthUser}>
                      <FaArrowRightFromBracket className="text-inherit" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="@container/main p-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>

      <AppRightSidebar
        open={rightSidebarOpen}
        setOpen={setRightSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default MainTemplate;
