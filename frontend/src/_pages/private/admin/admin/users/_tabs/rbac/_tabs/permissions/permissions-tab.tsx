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
  const rbacPermissionsPagination = usePagination(
    '/api/rbac/permissions/paginate',
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
      label: 'Actions',
    },
  ];

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateRbacPermission(true);
      }}
    >
      Create
    </Button>
  );

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
      <DataTable
        pagination={rbacPermissionsPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {!rbacPermissionsPagination.error && rbacPermissionsPagination.data
          ? rbacPermissionsPagination.data.records?.map(
              (rbacPermission: RbacPermission) => (
                <TableRow key={rbacPermission.id}>
                  <TableCell>{rbacPermission.label}</TableCell>

                  <TableCell>{rbacPermission.value}</TableCell>

                  <TableCell>
                    <InputGroup size="sm">
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

      <CreatePermission
        open={openCreateRbacPermission}
        setOpen={setOpenCreateRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />

      <UpdatePermission
        selectedItem={selectedRbacPermission}
        setSelectedItem={setSelectedRbacPermission}
        open={openUpdateRbacPermission}
        setOpen={setOpenUpdateRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />

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
