import { useNavigate, useParams } from 'react-router';
import { CardBody } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PermissionsTab from './_tabs/permissions/permissions-tab';
import RolesTab from './_tabs/roles/roles-tab';

const RbacTab = () => {
  const { rbacTab } = useParams();
  const navigate = useNavigate();
  const currentTab = rbacTab || 'roles';

  const handleTabChange = (value: string) =>
    navigate(`/admin/users/rbac/${value}`);

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList variant="outline">
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>
      <CardBody>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </CardBody>
    </Tabs>
  );
};

export default RbacTab;
