import { BsInputCursor } from 'react-icons/bs';
import { FaCaretSquareDown } from 'react-icons/fa';
import { FaBoxOpen, FaCalendarDay } from 'react-icons/fa6';
import { type SidebarGroup } from '@/templates/main/_components/app-sidebar';
import MainTemplate from '@/templates/main/main-template';

const ExamplesLayout = () => {
  const sidebarGroups: SidebarGroup[] = [
    {
      sidebarLabel: 'Forms',
      sidebarItems: [
        {
          title: 'Input',
          url: '/examples/forms',
          icon: BsInputCursor,
          end: true,
        },
        {
          title: 'Date Picker',
          url: '/examples/forms/date-picker',
          icon: FaCalendarDay,
          end: true,
        },
        {
          title: 'React Select',
          url: '/examples/forms/react-select',
          icon: FaCaretSquareDown,
          end: true,
        },
        {
          title: 'React Dropzone',
          url: '/examples/forms/react-dropzone',
          icon: FaBoxOpen,
          end: true,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default ExamplesLayout;
