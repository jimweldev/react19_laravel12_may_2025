import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacUserRole } from '@/_types/rbac-user-role';
import { type User } from '@/_types/user';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { formatName } from '@/lib/format-name';
import CreateUserRoles from './_components/create-user-roles';
import DeleteUserRoles from './_components/delete-user-roles';
import UpdateUserRoles from './_components/update-user-roles';

const UserRolesTab = () => {
  // PAGINATION
  // pagination - use pagination hook
  const usersPagination = usePagination(
    '/api/users/paginate',
    'first_name',
    'has=rbac_user_roles&with=rbac_user_roles',
  );

  // pagination - data table columns
  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'Name',
      column: 'first_name',
    },
    {
      label: 'Roles',
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
          setOpenCreateRbacUserRole(true);
        }}
      >
        Create
      </Button>
    </div>
  );

  // MODAL
  // modal - states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openCreateRbacUserRole, setOpenCreateRbacUserRole] =
    useState<boolean>(false);
  const [openUpdateRbacUserRole, setOpenUpdateRbacUserRole] =
    useState<boolean>(false);
  const [openDeleteRbacUserRole, setOpenDeleteRbacUserRole] =
    useState<boolean>(false);

  return (
    <>
      {/* data table component */}
      <DataTable
        pagination={usersPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {/* data table rows */}
        {!usersPagination.error && usersPagination.data
          ? usersPagination.data.records?.map((user: User) => (
              <TableRow key={user.id}>
                {/* name */}
                <TableCell>{formatName(user, 'semifull')}</TableCell>
                {/* roles */}
                <TableCell className="flex flex-wrap gap-1">
                  {user?.rbac_user_roles?.map((role: RbacUserRole) => (
                    <Badge key={role.id}>{role.rbac_role?.label}</Badge>
                  ))}
                </TableCell>
                {/* actions */}
                <TableCell>
                  <InputGroup size="sm">
                    {/* edit */}
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenUpdateRbacUserRole(true);
                      }}
                      size="xs"
                    >
                      <FaEdit />
                    </Button>
                    {/* delete */}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDeleteRbacUserRole(true);
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
      <CreateUserRoles
        open={openCreateRbacUserRole}
        setOpen={setOpenCreateRbacUserRole}
        refetch={usersPagination.refetch}
      />
      {/* modal - update */}
      <UpdateUserRoles
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openUpdateRbacUserRole}
        setOpen={setOpenUpdateRbacUserRole}
        refetch={usersPagination.refetch}
      />
      {/* modal - delete */}
      <DeleteUserRoles
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openDeleteRbacUserRole}
        setOpen={setOpenDeleteRbacUserRole}
        refetch={usersPagination.refetch}
      />
    </>
  );
};

export default UserRolesTab;
