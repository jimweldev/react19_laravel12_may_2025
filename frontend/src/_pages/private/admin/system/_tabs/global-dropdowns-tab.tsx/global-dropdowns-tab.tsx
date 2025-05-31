import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import type { SystemGlobalDropdown } from '@/_types/system-global-dropdown';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateGlobalDropdown from './_components/create-global-dropdown';
import DeleteGlobalDropdown from './_components/delete-global-dropdown';
import UpdateGlobalDropdown from './_components/update-global-dropdown';

const GlobalDropdownsTab = () => {
  // PAGINATION
  // pagination - use pagination hook
  const systemGlobalDropdownsPagination = usePagination(
    '/api/system/global-dropdowns/paginate',
    'id',
  );

  // pagination - actions
  const Actions = (
    <div className="space-x-2">
      <Button
        size="sm"
        onClick={() => {
          setOpenCreateSystemGlobalDropdown(true);
        }}
      >
        Create
      </Button>
    </div>
  );

  // MODAL
  // modal - states
  const [selectedSystemGlobalDropdown, setSelectedSystemGlobalDropdown] =
    useState<SystemGlobalDropdown | null>(null);
  const [openCreateSystemGlobalDropdown, setOpenCreateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openUpdateSystemGlobalDropdown, setOpenUpdateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openDeleteSystemGlobalDropdown, setOpenDeleteSystemGlobalDropdown] =
    useState<boolean>(false);

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
      label: 'Notes',
      column: 'notes',
    },
    {
      label: 'Actions',
    },
  ];

  return (
    <>
      {/* data table component */}
      <DataTable
        actions={Actions}
        pagination={systemGlobalDropdownsPagination}
        columns={dataTableColumns}
      >
        {/* data table rows */}
        {!systemGlobalDropdownsPagination.error &&
        systemGlobalDropdownsPagination.data
          ? systemGlobalDropdownsPagination.data.records?.map(
              (systemGlobalDropdown: SystemGlobalDropdown) => (
                <TableRow key={systemGlobalDropdown.id}>
                  {/* label */}
                  <TableCell>{systemGlobalDropdown.label}</TableCell>

                  {/* value */}
                  <TableCell>{systemGlobalDropdown.module}</TableCell>

                  {/* notes */}
                  <TableCell>{systemGlobalDropdown.type}</TableCell>

                  {/* actions */}
                  <TableCell>
                    <InputGroup size="sm">
                      {/* edit */}
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedSystemGlobalDropdown(
                              systemGlobalDropdown,
                            );
                            setOpenUpdateSystemGlobalDropdown(true);
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
                            setSelectedSystemGlobalDropdown(
                              systemGlobalDropdown,
                            );
                            setOpenDeleteSystemGlobalDropdown(true);
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
      <CreateGlobalDropdown
        open={openCreateSystemGlobalDropdown}
        setOpen={setOpenCreateSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      {/* modal - update */}
      <UpdateGlobalDropdown
        selectedItem={selectedSystemGlobalDropdown}
        setSelectedItem={setSelectedSystemGlobalDropdown}
        open={openUpdateSystemGlobalDropdown}
        setOpen={setOpenUpdateSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      {/* modal - delete */}
      <DeleteGlobalDropdown
        selectedItem={selectedSystemGlobalDropdown}
        setSelectedItem={setSelectedSystemGlobalDropdown}
        open={openDeleteSystemGlobalDropdown}
        setOpen={setOpenDeleteSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
    </>
  );
};

export default GlobalDropdownsTab;
