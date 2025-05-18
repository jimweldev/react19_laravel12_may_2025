import { Home } from 'lucide-react';
import { type SidebarGroup } from '@/templates/main/_components/app-sidebar';
import MainTemplate from '@/templates/main/main-template';

const MainLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Pages',
      sidebarItems: [
        {
          title: 'Home',
          url: '/',
          icon: Home,
          end: true,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default MainLayout;
