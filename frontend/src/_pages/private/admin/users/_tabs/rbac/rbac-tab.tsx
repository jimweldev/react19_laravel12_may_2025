import { useNavigate, useParams } from 'react-router';
import { CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionsTab from './_tabs/permissions/permissions-tab';
import RolesTab from './_tabs/roles/roles-tab';

const RbacTab = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const currentTab = searchParams.get('tab') || 'user-roles';

  // const handleTabChange = (tab: string) => {
  //   setSearchParams({ tab });
  // };

  const { rbacTab } = useParams();
  const navigate = useNavigate();
  const currentTab = rbacTab || 'roles';

  const handleTabChange = (value: string) =>
    navigate(`/admin/users/rbac/${value}`);

  return (
    <>
      {/* <PageHeader className="mb-3">RBAC</PageHeader> */}

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        {/* <Card> */}
        {/* <CardHeader> */}
        <TabsList variant="outline">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        {/* </CardHeader> */}
        <CardBody>
          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>
          <TabsContent value="permissions">
            <PermissionsTab />
          </TabsContent>
        </CardBody>
        {/* </Card> */}
      </Tabs>
    </>
  );
};

export default RbacTab;
