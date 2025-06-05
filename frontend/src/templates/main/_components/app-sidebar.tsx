import { MessageCircleQuestion } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import ReactImage from '@/components/images/react-image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';

export type SidebarGroup = {
  sidebarLabel?: string;
  sidebarItems: SidebarItem[];
};

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  end?: boolean;
  subSidebarItems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  url: string;
};

type AppSidebarProps = {
  sidebarGroups: SidebarGroup[];
  side?: 'left' | 'right';
};

const AppSidebar = ({ sidebarGroups = [], ...props }: AppSidebarProps) => {
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton
                size="lg"
                className="!text-sidebar-foreground !bg-transparent"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ReactImage
                    className="size-full rounded-lg"
                    src="/images/app-logo.jpg"
                    alt="App Logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {import.meta.env.VITE_APP_NAME}
                  </span>
                  <span className="truncate text-xs">
                    {import.meta.env.VITE_COMPANY_NAME}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarGroups.map(group => (
          <SidebarGroup key={group.sidebarLabel}>
            <SidebarGroupLabel>{group.sidebarLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.sidebarItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end={item.end}>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <item.icon />
                          {item.title}
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                    {item.subSidebarItems && (
                      <SidebarMenuSub>
                        {item.subSidebarItems.map(subItem => (
                          <SidebarMenuItem key={subItem.title}>
                            <NavLink to={subItem.url} end>
                              {({ isActive }) => (
                                <SidebarMenuButton isActive={isActive}>
                                  {subItem.title}
                                </SidebarMenuButton>
                              )}
                            </NavLink>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="help" end>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <MessageCircleQuestion />
                  Help
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
