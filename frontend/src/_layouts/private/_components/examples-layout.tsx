import { BsInputCursor } from 'react-icons/bs';
import { FaCaretSquareDown } from 'react-icons/fa';
import { FaBoxOpen, FaChevronDown, FaKeyboard, FaTable } from 'react-icons/fa6';
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
        {
          title: 'React Quill',
          url: '/examples/forms/react-quill',
          icon: FaKeyboard,
          end: true,
        },
        {
          title: 'Global Dropdown',
          url: '/examples/forms/global-dropdown',
          icon: FaChevronDown,
          end: true,
        },
      ],
    },
    {
      sidebarLabel: 'CRUD',
      sidebarItems: [
        {
          title: 'Data Table',
          url: '/examples/crud/data-table',
          icon: FaTable,
        },
      ],
    },
  ];

  return <MainTemplate sidebarGroups={sidebarGroups} />;
};

export default ExamplesLayout;
