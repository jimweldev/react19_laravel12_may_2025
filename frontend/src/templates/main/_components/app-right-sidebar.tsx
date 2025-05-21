import { useEffect, useState } from 'react';
import { FaRegBell, FaRegMessage } from 'react-icons/fa6';
import { Link } from 'react-router';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AppRightSidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
};

const AppRightSidebar = ({
  open,
  setOpen,
  activeTab = 'Notifications',
  setActiveTab,
}: AppRightSidebarProps) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);

  // Update local state when prop changes
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    const newTab = value;
    setCurrentTab(newTab);
    // Also update parent state if provided
    if (setActiveTab) {
      setActiveTab(newTab);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <SheetContent className="h-screen">
          <SheetTitle />
          <SheetDescription />

          <SheetHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Notifications">
                <FaRegBell />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="Messages">
                <FaRegMessage />
                Messages
              </TabsTrigger>
            </TabsList>
          </SheetHeader>
          <TabsContent
            className="flex flex-col overflow-y-hidden"
            value="Notifications"
          >
            <div className="border-t border-b p-2">
              <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                <FaRegBell />
                Notifications
              </h4>
            </div>
            <div className="overflow-y-auto py-1">
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegBell />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      System Update
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      New features and improvements have been added to enhance
                      your experience
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </TabsContent>
          <TabsContent
            className="flex flex-col overflow-y-hidden"
            value="Messages"
          >
            <div className="border-t border-b p-2">
              <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                <FaRegMessage />
                Messages
              </h4>
            </div>
            <div className="overflow-y-auto py-1">
              <Link to="/">
                <div className="hover:bg-muted flex items-center gap-2 p-2">
                  <div className="border-primary flex size-8 items-center justify-center rounded-full border-2">
                    <FaRegMessage />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      Jimwel Dizon
                    </p>
                    <div className="flex justify-between gap-2">
                      <p className="text-muted-foreground truncate text-xs">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Excepturi in qui aut provident totam odio amet
                        voluptatibus et tempore ea quibusdam commodi id, facilis
                        quod delectus magnam nostrum at debitis.
                      </p>
                      <p className="text-muted-foreground text-xs">2m</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </TabsContent>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default AppRightSidebar;
