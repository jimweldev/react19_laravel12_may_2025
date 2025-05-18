import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaBoxArchive, FaFilter } from 'react-icons/fa6';
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
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { formatName } from '@/lib/format-name';
import { getImageUrl } from '@/lib/get-image-url';
import CreateUser from './_components/create-user';
import DeleteUser from './_components/delete-user';
import ImportUsers from './_components/import-users';
import UpdateUser from './_components/update-user';

const ActiveUsersTab = () => {
  // PAGINATION
  const [queryFilter, setQueryFilter] = useState<string>('');

  // pagination - use pagination hook
  const usersPagination = usePagination(
    '/api/users/paginate',
    'first_name',
    queryFilter,
  );

  // pagination - data table columns
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
      label: 'Role',
      column: 'is_admin',
    },
    {
      label: 'Actions',
    },
  ];

  // pagination - actions
  const Actions = (
    <div className="space-x-2">
      {/* filter */}
      <ToolTip content="Filter">
        <Button
          variant="warning"
          size="sm"
          onClick={() => {
            setOpenFilterUsers(true);
          }}
        >
          <FaFilter />
        </Button>
      </ToolTip>
      {/* create */}
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
    </div>
  );

  // MODAL
  // modal - states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
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
      label: 'Role',
      column: 'is_admin',
      element: (value, onChange) => (
        <Select
          value={typeof value === 'string' ? value : ''}
          onValueChange={v => onChange(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Admin</SelectItem>
            <SelectItem value="0">User</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <>
      {/* fancybox wrapper for image previews */}
      <Fancybox>
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
                  {/* avatar and name */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* avatar */}
                      <a
                        data-fancybox={`${user.id}`}
                        href={getImageUrl(
                          `${import.meta.env.VITE_STORAGE_BASE_URL}/avatars`,
                          user.avatar,
                          fallbackImage,
                        )}
                      >
                        <div className="outline-primary border-card flex aspect-square h-8 cursor-pointer items-center overflow-hidden rounded-full border-1 outline-2 select-none">
                          <ReactImage
                            className="pointer-events-none h-full w-full object-cover"
                            src={getImageUrl(
                              `${import.meta.env.VITE_STORAGE_BASE_URL}/avatars`,
                              user.avatar,
                              fallbackImage,
                            )}
                          />
                        </div>
                      </a>
                      {/* name */}
                      <div>
                        <h6 className="font-medium">
                          {formatName(user, 'semifull')}
                        </h6>
                      </div>
                    </div>
                  </TableCell>
                  {/* email */}
                  <TableCell>{user.email}</TableCell>
                  {/* role */}
                  <TableCell>
                    <Badge variant={user.is_admin ? 'success' : 'default'}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  {/* actions */}
                  <TableCell>
                    <InputGroup size="sm">
                      {/* edit */}
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
                      {/* archive */}
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

      {/* modal - create */}
      <CreateUser
        open={openCreateUser}
        setOpen={setOpenCreateUser}
        refetch={usersPagination.refetch}
      />
      {/* modal - update */}
      <UpdateUser
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openUpdateUser}
        setOpen={setOpenUpdateUser}
        refetch={usersPagination.refetch}
      />
      {/* modal - delete */}
      <DeleteUser
        selectedItem={selectedUser}
        setSelectedItem={setSelectedUser}
        open={openDeleteUser}
        setOpen={setOpenDeleteUser}
        refetch={usersPagination.refetch}
      />
      {/* modal - import */}
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
      />
    </>
  );
};

export default ActiveUsersTab;
