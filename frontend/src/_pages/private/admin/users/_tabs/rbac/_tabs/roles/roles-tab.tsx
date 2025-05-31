import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacRole } from '@/_types/rbac-role';
import { type RbacRolePermission } from '@/_types/rbac-role-permission';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateRole from './_components/create-role';
import DeleteRole from './_components/delete-role';
import UpdateRole from './_components/update-role';

const RolesTab = () => {
  // PAGINATION
  // pagination - use pagination hook
  const rbacRolesPagination = usePagination(
    '/api/rbac/roles/paginate',
    'label',
  );

  // pagination - data table columns
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

  // pagination - actions
  const Actions = (
    <div className="space-x-2">
      <Button
        size="sm"
        onClick={() => {
          setOpenCreateRbacRole(true);
        }}
      >
        Create
      </Button>
    </div>
  );

  // MODAL
  // modal - states
  const [selectedRbacRole, setSelectedRbacRole] = useState<RbacRole | null>(
    null,
  );
  const [openCreateRbacRole, setOpenCreateRbacRole] = useState<boolean>(false);
  const [openUpdateRbacRole, setOpenUpdateRbacRole] = useState<boolean>(false);
  const [openDeleteRbacRole, setOpenDeleteRbacRole] = useState<boolean>(false);

  return (
    <>
      {/* data table component */}
      <DataTable
        pagination={rbacRolesPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {/* data table rows */}
        {!rbacRolesPagination.error && rbacRolesPagination.data
          ? rbacRolesPagination.data.records?.map((rbacRole: RbacRole) => (
              <TableRow key={rbacRole.id}>
                {/* label */}
                <TableCell>{rbacRole.label}</TableCell>
                {/* value */}
                <TableCell>{rbacRole.value}</TableCell>
                {/* permissions */}
                <TableCell className="flex flex-wrap gap-1">
                  {rbacRole.rbac_role_permissions?.map(
                    (rolePermission: RbacRolePermission) => (
                      <Badge key={rolePermission.id}>
                        {rolePermission.rbac_permission?.label}
                      </Badge>
                    ),
                  )}
                </TableCell>
                {/* actions */}
                <TableCell>
                  <InputGroup size="sm">
                    {/* edit */}
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
                    {/* delete */}
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
                  </InputGroup>
                </TableCell>
              </TableRow>
            ))
          : null}
      </DataTable>

      {/* modal - create */}
      <CreateRole
        open={openCreateRbacRole}
        setOpen={setOpenCreateRbacRole}
        refetch={rbacRolesPagination.refetch}
      />
      {/* modal - update */}
      <UpdateRole
        selectedItem={selectedRbacRole}
        setSelectedItem={setSelectedRbacRole}
        open={openUpdateRbacRole}
        setOpen={setOpenUpdateRbacRole}
        refetch={rbacRolesPagination.refetch}
      />
      {/* modal - delete */}
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
