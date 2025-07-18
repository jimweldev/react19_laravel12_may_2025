import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaBoxArchive, FaFilter, FaShield } from 'react-icons/fa6';
import type { RbacUserRole } from '@/_types/rbac-user-role';
import { type User } from '@/_types/user';
import fallbackImage from '@/assets/images/default-avatar.png';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import DataTableFilter, {
  type Column,
} from '@/components/data-tables/data-table-filter';
import InputGroup from '@/components/forms/input-group';
import Fancybox from '@/components/images/fancy-box';
import ReactImage from '@/components/images/react-image';
import UsersSelect from '@/components/react-select/users-select';
import ProfileToolTip from '@/components/tool-tips/profile-tool-tip';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { formatName } from '@/lib/format-name';
import { getImageUrl } from '@/lib/get-image-url';
import CreateUser from './_components/create-user';
import DeleteUser from './_components/delete-user';
import ImportUsers from './_components/import-users';
import UpdateUser from './_components/update-user';
import UpdateUserRoles from './_components/update-user-roles';

const ActiveUsersTab = () => {
  const [queryFilter, setQueryFilter] = useState<string>('');

  const usersPagination = usePagination(
    '/api/users/paginate',
    'first_name',
    queryFilter,
  );

  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'Name',
      column: 'first_name',
    },
    {
      label: 'Email',
      column: 'email',
    },
    {
      label: 'Admin',
      column: 'is_admin',
    },
    {
      label: 'Roles',
    },
    {
      label: 'Actions',
    },
  ];

  const Actions = (
    <>
      <ToolTip content="Filter">
        <Button
          variant={queryFilter ? 'success' : 'outline'}
          size="sm"
          onClick={() => {
            setOpenFilterUsers(true);
          }}
        >
          <FaFilter />
        </Button>
      </ToolTip>

      <Button
        size="sm"
        onClick={() => {
          setOpenCreateUser(true);
        }}
      >
        Create
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpenImportUsers(true)}
      >
        Import
      </Button>
    </>
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [openUpdateUserRoles, setOpenUpdateUserRoles] =
    useState<boolean>(false);
  const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
  const [openImportUsers, setOpenImportUsers] = useState<boolean>(false);
  const [openFilterUsers, setOpenFilterUsers] = useState<boolean>(false);

  const columns: Column[] = [
    {
      label: 'User',
      column: 'id',
      element: (value, onChange) => (
        <UsersSelect
          value={value && typeof value === 'object' ? value : null}
          onChange={(v: { value: string; label: string } | null) => onChange(v)}
          className="w-full"
          styles={{
            control: (baseStyles: Record<string, unknown>) => ({
              ...baseStyles,
              borderRadius: '0px !important',
            }),
          }}
        />
      ),
    },
    {
      label: 'First Name',
      column: 'first_name',
      element: (value, onChange) => (
        <Input
          className="w-full"
          placeholder="Enter First Name"
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
        />
      ),
    },
    {
      label: 'Middle Name',
      column: 'middle_name',
      element: (value, onChange) => (
        <Input
          className="w-full"
          placeholder="Enter Middle Name"
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
        />
      ),
    },
    {
      label: 'Last Name',
      column: 'last_name',
      element: (value, onChange) => (
        <Input
          className="w-full"
          placeholder="Enter Last Name"
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
        />
      ),
    },
  ];

  return (
    <>
      <Fancybox>
        <DataTable
          pagination={usersPagination}
          columns={dataTableColumns}
          actions={Actions}
          size="md"
        >
          {!usersPagination.error && usersPagination.data
            ? usersPagination.data.records?.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        data-fancybox={`${user.id}`}
                        href={getImageUrl(
                          `${import.meta.env.VITE_STORAGE_BASE_URL}/`,
                          user.avatar_path,
                          fallbackImage,
                        )}
                      >
                        <div className="outline-primary border-card flex aspect-square h-8 cursor-pointer items-center overflow-hidden rounded-full border-1 outline-2 select-none">
                          <ReactImage
                            className="pointer-events-none h-full w-full object-cover"
                            src={getImageUrl(
                              `${import.meta.env.VITE_STORAGE_BASE_URL}/`,
                              user.avatar_path,
                              fallbackImage,
                            )}
                            unloaderSrc={fallbackImage}
                          />
                        </div>
                      </a>

                      <div>
                        <ProfileToolTip userId={user.id}>
                          <h6 className="font-medium">
                            {formatName(user, 'semifull')}
                          </h6>
                        </ProfileToolTip>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                      {user.is_admin ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {user?.rbac_user_roles?.length === 0 ? (
                        <Badge variant="secondary">No roles</Badge>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1">
                          {user?.rbac_user_roles?.map((role: RbacUserRole) => (
                            <Badge key={role.id}>{role.rbac_role?.label}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <InputGroup size="sm">
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenUpdateUser(true);
                          }}
                          size="xs"
                        >
                          <FaEdit />
                        </Button>
                      </ToolTip>

                      <ToolTip content="Update Roles">
                        <Button
                          variant="warning"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenUpdateUserRoles(true);
                          }}
                          size="xs"
                        >
                          <FaShield />
                        </Button>
                      </ToolTip>

                      <ToolTip content="Archive">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenDeleteUser(true);
                          }}
                          size="xs"
                        >
                          <FaBoxArchive />
                        </Button>
                      </ToolTip>
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </DataTable>
      </Fancybox>

      <CreateUser
        open={openCreateUser}
        setOpen={setOpenCreateUser}
        refetch={usersPagination.refetch}
      />

      <UpdateUser
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openUpdateUser}
        setOpen={setOpenUpdateUser}
        refetch={usersPagination.refetch}
      />

      <UpdateUserRoles
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openUpdateUserRoles}
        setOpen={setOpenUpdateUserRoles}
        refetch={usersPagination.refetch}
      />

      <DeleteUser
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openDeleteUser}
        setOpen={setOpenDeleteUser}
        refetch={usersPagination.refetch}
      />

      <ImportUsers
        open={openImportUsers}
        setOpen={setOpenImportUsers}
        refetch={usersPagination.refetch}
      />
      <DataTableFilter
        setQueryFilter={setQueryFilter}
        columns={columns}
        open={openFilterUsers}
        setOpen={setOpenFilterUsers}
        setCurrentPage={usersPagination.setCurrentPage}
      />
    </>
  );
};

export default ActiveUsersTab;
