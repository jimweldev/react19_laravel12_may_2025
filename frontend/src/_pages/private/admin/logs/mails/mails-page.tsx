import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MailLogsTab from './_tabs/logs/mail-logs-tab';
import MailTemplatesTab from './_tabs/templates/mail-templates-tab';

const MailsPage = () => {
  const { mailTab } = useParams();
  const navigate = useNavigate();
  const currentTab = mailTab || 'logs';

  const handleTabChange = (value: string) => navigate(`/admin/mails/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Mails</PageHeader>

        <TabsList size="sm">
          <TabsTrigger value="logs">Logs</TabsTrigger>

          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
      </div>

      <Card>
        <TabsContent value="logs">
          <CardBody>
            <MailLogsTab />
          </CardBody>
        </TabsContent>

        <TabsContent value="templates">
          <CardBody>
            <MailTemplatesTab />
          </CardBody>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default MailsPage;
