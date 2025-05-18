import { useNavigate, useParams } from 'react-router';
import PageHeader from '@/components/typography/page-header';
import { Card, CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionsTab from './_tabs/permissions/permissions-tab';
import RolesTab from './_tabs/roles/roles-tab';
import UserRolesTab from './_tabs/user-roles/user-roles-tab';

const RbacPage = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const currentTab = searchParams.get('tab') || 'user-roles';

  // const handleTabChange = (tab: string) => {
  //   setSearchParams({ tab });
  // };

  const { rbacTab } = useParams();
  const navigate = useNavigate();
  const currentTab = rbacTab || 'user-roles';

  const handleTabChange = (value: string) => navigate(`/admin/rbac/${value}`);

  return (
    <>
      <PageHeader className="mb-3">RBAC</PageHeader>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <Card>
          {/* <CardHeader> */}
          <TabsList variant="outline">
            <TabsTrigger value="user-roles">User Roles</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          {/* </CardHeader> */}
          <CardBody>
            <TabsContent value="user-roles">
              <UserRolesTab />
            </TabsContent>
            <TabsContent value="roles">
              <RolesTab />
            </TabsContent>
            <TabsContent value="permissions">
              <PermissionsTab />
            </TabsContent>
          </CardBody>
        </Card>
      </Tabs>
    </>
  );
};

export default RbacPage;
