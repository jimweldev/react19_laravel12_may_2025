import { FaLock, FaSliders, FaUser } from 'react-icons/fa6';
import { type SidebarGroup } from '@/templates/main/_components/app-sidebar';
import MainTemplate from '@/templates/main/main-template';

const SettingsLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Settings',
      sidebarItems: [
        {
          title: 'Profile',
          url: '/settings/profile',
          icon: FaUser,
          end: true,
        },
        {
          title: 'Password',
          url: '/settings/password',
          icon: FaLock,
        },
        {
          title: 'General',
          url: '/settings/general',
          icon: FaSliders,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default SettingsLayout;
