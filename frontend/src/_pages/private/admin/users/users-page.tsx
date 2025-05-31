import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveUsersTab from './_tabs/active-users/active-users-tab';
import ArchivedUsersTab from './_tabs/archived-users/archived-users-tab';
import RbacTab from './_tabs/rbac/rbac-tab';

const UsersPage = () => {
  const { userTab } = useParams();
  const navigate = useNavigate();
  const currentTab = userTab || 'active-users';

  const handleTabChange = (value: string) => navigate(`/admin/users/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Users</PageHeader>

        {/* tabs - list */}
        <TabsList size="sm">
          {/* tabs - active users */}
          <TabsTrigger value="active-users">Active Users</TabsTrigger>
          {/* tabs - archived users */}
          <TabsTrigger value="archived-users">Archived Users</TabsTrigger>
          {/* tabs - rbac */}
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
        </TabsList>
      </div>

      <Card>
        {/* tabs - content */}
        {/* tabs - active users */}
        <TabsContent value="active-users">
          <CardBody>
            <ActiveUsersTab />
          </CardBody>
        </TabsContent>
        {/* tabs - archived users */}
        <TabsContent value="archived-users">
          <CardBody>
            <ArchivedUsersTab />
          </CardBody>
        </TabsContent>
        {/* tabs - rbac */}
        <TabsContent value="rbac">
          <RbacTab />
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default UsersPage;
