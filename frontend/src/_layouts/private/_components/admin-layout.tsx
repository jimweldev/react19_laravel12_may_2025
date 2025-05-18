import { FaChartArea, FaUsers, FaUserShield } from 'react-icons/fa6';
import { type SidebarGroup } from '@/templates/main/_components/app-sidebar';
import MainTemplate from '@/templates/main/main-template';

const AdminLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Admin',
      sidebarItems: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: FaChartArea,
          end: true,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: FaUsers,
        },
        {
          title: 'RBAC',
          url: '/admin/rbac',
          icon: FaUserShield,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default AdminLayout;
