import { FaBarsStaggered } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const AppSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
      <FaBarsStaggered />
    </Button>
  );
};

export default AppSidebarTrigger;
