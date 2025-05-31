import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalDropdownsTab from './_tabs/global-dropdowns-tab.tsx/global-dropdowns-tab';
import SettingsTab from './_tabs/settings/settings-tab';

const SystemPage = () => {
  const { systemTab } = useParams();
  const navigate = useNavigate();
  const currentTab = systemTab || 'settings';

  const handleTabChange = (value: string) => navigate(`/admin/system/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>System</PageHeader>

        {/* tabs - list */}
        <TabsList size="sm">
          {/* tabs - settings */}
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {/* tabs - global dropdowns */}
          <TabsTrigger value="global-dropdowns">Global Dropdowns</TabsTrigger>
        </TabsList>
      </div>

      <Card>
        <CardBody>
          {/* tabs - content */}
          {/* tabs - settings */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          {/* tabs - global dropdowns */}
          <TabsContent value="global-dropdowns">
            <GlobalDropdownsTab />
          </TabsContent>
        </CardBody>
      </Card>
    </Tabs>
  );
};

export default SystemPage;
