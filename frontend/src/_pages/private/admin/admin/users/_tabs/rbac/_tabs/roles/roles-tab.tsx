import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacRole } from '@/_types/rbac-role';
import { type RbacRolePermission } from '@/_types/rbac-role-permission';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateRole from './_components/create-role';
import DeleteRole from './_components/delete-role';
import UpdateRole from './_components/update-role';

const RolesTab = () => {
  const rbacRolesPagination = usePagination(
    '/api/rbac/roles/paginate',
    'label',
  );

  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'Label',
      column: 'label',
    },
    {
      label: 'Value',
      column: 'value',
    },
    {
      label: 'Permissions',
    },
    {
      label: 'Actions',
    },
  ];

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateRbacRole(true);
      }}
    >
      Create
    </Button>
  );

  const [selectedRbacRole, setSelectedRbacRole] = useState<RbacRole | null>(
    null,
  );
  const [openCreateRbacRole, setOpenCreateRbacRole] = useState<boolean>(false);
  const [openUpdateRbacRole, setOpenUpdateRbacRole] = useState<boolean>(false);
  const [openDeleteRbacRole, setOpenDeleteRbacRole] = useState<boolean>(false);

  return (
    <>
      <DataTable
        pagination={rbacRolesPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {!rbacRolesPagination.error && rbacRolesPagination.data
          ? rbacRolesPagination.data.records?.map((rbacRole: RbacRole) => (
              <TableRow key={rbacRole.id}>
                <TableCell>{rbacRole.label}</TableCell>

                <TableCell>{rbacRole.value}</TableCell>

                <TableCell className="flex flex-wrap gap-1">
                  {rbacRole.rbac_role_permissions?.map(
                    (rolePermission: RbacRolePermission) => (
                      <Badge key={rolePermission.id}>
                        {rolePermission.rbac_permission?.label}
                      </Badge>
                    ),
                  )}
                </TableCell>

                <TableCell>
                  <InputGroup size="sm">
                    <ToolTip content="Edit">
                      <Button
                        variant="info"
                        onClick={() => {
                          setSelectedRbacRole(rbacRole);
                          setOpenUpdateRbacRole(true);
                        }}
                        size="xs"
                      >
                        <FaEdit />
                      </Button>
                    </ToolTip>

                    <ToolTip content="Delete">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedRbacRole(rbacRole);
                          setOpenDeleteRbacRole(true);
                        }}
                        size="xs"
                      >
                        <FaTrash />
                      </Button>
                    </ToolTip>
                  </InputGroup>
                </TableCell>
              </TableRow>
            ))
          : null}
      </DataTable>

      <CreateRole
        open={openCreateRbacRole}
        setOpen={setOpenCreateRbacRole}
        refetch={rbacRolesPagination.refetch}
      />

      <UpdateRole
        selectedItem={selectedRbacRole}
        setSelectedItem={setSelectedRbacRole}
        open={openUpdateRbacRole}
        setOpen={setOpenUpdateRbacRole}
        refetch={rbacRolesPagination.refetch}
      />

      <DeleteRole
        selectedItem={selectedRbacRole}
        setSelectedItem={setSelectedRbacRole}
        open={openDeleteRbacRole}
        setOpen={setOpenDeleteRbacRole}
        refetch={rbacRolesPagination.refetch}
      />
    </>
  );
};

export default RolesTab;
