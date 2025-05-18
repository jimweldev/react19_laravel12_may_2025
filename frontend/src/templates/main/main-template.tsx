import { FaArrowRightFromBracket, FaGear } from 'react-icons/fa6';
import { Link, Outlet } from 'react-router';
import useAuthUserStore from '@/_stores/auth-user-store';
import ReactImage from '@/components/images/react-image';
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
import AppSidebar, { type SidebarGroup } from './_components/app-sidebar';
import AppSidebarTrigger from './_components/app-sidebar-trigger';

type MainTemplateProps = {
  sidebarGroups: SidebarGroup[];
};

const MainTemplate = ({ sidebarGroups }: MainTemplateProps) => {
  const { user, clearAuthUser } = useAuthUserStore();

  return (
    <SidebarProvider>
      <AppSidebar sidebarGroups={sidebarGroups} />
      <main className="flex-1">
        <div className="bg-card flex items-center justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <AppSidebarTrigger />
            <Separator className="h-4 min-h-0" orientation="vertical" />
            <AppNavbarLinks />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="size-10 cursor-pointer rounded-full p-1">
                <div className="outline-primary flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent object-contain outline-2">
                  <ReactImage
                    src={`${import.meta.env.VITE_STORAGE_BASE_URL}/avatars/${user?.avatar}`}
                    alt="Avatar"
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
        <div className="@container/main p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default MainTemplate;
