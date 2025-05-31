import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacPermission } from '@/_types/rbac-permission';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreatePermission from './_components/create-permission';
import DeletePermission from './_components/delete-permission';
import UpdatePermission from './_components/update-permission';

const PermissionsTab = () => {
  // PAGINATION
  // pagination - use pagination hook
  const rbacPermissionsPagination = usePagination(
    '/api/rbac/permissions/paginate',
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
      label: 'Actions',
    },
  ];

  // pagination - actions
  const Actions = (
    <div className="space-x-2">
      <Button
        size="sm"
        onClick={() => {
          setOpenCreateRbacPermission(true);
        }}
      >
        Create
      </Button>
    </div>
  );

  // MODAL
  // modal - states
  const [selectedRbacPermission, setSelectedRbacPermission] =
    useState<RbacPermission | null>(null);
  const [openCreateRbacPermission, setOpenCreateRbacPermission] =
    useState<boolean>(false);
  const [openUpdateRbacPermission, setOpenUpdateRbacPermission] =
    useState<boolean>(false);
  const [openDeleteRbacPermission, setOpenDeleteRbacPermission] =
    useState<boolean>(false);

  return (
    <>
      {/* data table component */}
      <DataTable
        pagination={rbacPermissionsPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {/* data table rows */}
        {!rbacPermissionsPagination.error && rbacPermissionsPagination.data
          ? rbacPermissionsPagination.data.records?.map(
              (rbacPermission: RbacPermission) => (
                <TableRow key={rbacPermission.id}>
                  {/* label */}
                  <TableCell>{rbacPermission.label}</TableCell>
                  {/* value */}
                  <TableCell>{rbacPermission.value}</TableCell>
                  {/* actions */}
                  <TableCell>
                    <InputGroup size="sm">
                      {/* edit */}
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedRbacPermission(rbacPermission);
                            setOpenUpdateRbacPermission(true);
                          }}
                          size="xs"
                        >
                          <FaEdit />
                        </Button>
                      </ToolTip>
                      {/* delete */}
                      <ToolTip content="Delete">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedRbacPermission(rbacPermission);
                            setOpenDeleteRbacPermission(true);
                          }}
                          size="xs"
                        >
                          <FaTrash />
                        </Button>
                      </ToolTip>
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ),
            )
          : null}
      </DataTable>

      {/* modal - create */}
      <CreatePermission
        open={openCreateRbacPermission}
        setOpen={setOpenCreateRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />
      {/* modal - update */}
      <UpdatePermission
        selectedItem={selectedRbacPermission}
        setSelectedItem={setSelectedRbacPermission}
        open={openUpdateRbacPermission}
        setOpen={setOpenUpdateRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />
      {/* modal - delete */}
      <DeletePermission
        selectedItem={selectedRbacPermission}
        setSelectedItem={setSelectedRbacPermission}
        open={openDeleteRbacPermission}
        setOpen={setOpenDeleteRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />
    </>
  );
};

export default PermissionsTab;
