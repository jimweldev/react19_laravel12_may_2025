import { FaCogs } from 'react-icons/fa';
import { FaChartArea, FaEnvelope, FaUsers } from 'react-icons/fa6';
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
          title: 'System',
          url: '/admin/system',
          icon: FaCogs,
        },
        {
          title: 'Mails',
          url: '/admin/mails',
          icon: FaEnvelope,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default AdminLayout;
