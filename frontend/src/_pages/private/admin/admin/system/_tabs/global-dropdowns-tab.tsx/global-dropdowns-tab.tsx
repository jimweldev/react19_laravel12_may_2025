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
  const systemGlobalDropdownsPagination = usePagination(
    '/api/system/global-dropdowns/paginate',
    'id',
  );

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateSystemGlobalDropdown(true);
      }}
    >
      Create
    </Button>
  );

  const [selectedSystemGlobalDropdown, setSelectedSystemGlobalDropdown] =
    useState<SystemGlobalDropdown | null>(null);
  const [openCreateSystemGlobalDropdown, setOpenCreateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openUpdateSystemGlobalDropdown, setOpenUpdateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openDeleteSystemGlobalDropdown, setOpenDeleteSystemGlobalDropdown] =
    useState<boolean>(false);

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
      <DataTable
        actions={Actions}
        pagination={systemGlobalDropdownsPagination}
        columns={dataTableColumns}
      >
        {!systemGlobalDropdownsPagination.error &&
        systemGlobalDropdownsPagination.data
          ? systemGlobalDropdownsPagination.data.records?.map(
              (systemGlobalDropdown: SystemGlobalDropdown) => (
                <TableRow key={systemGlobalDropdown.id}>
                  <TableCell>{systemGlobalDropdown.label}</TableCell>

                  <TableCell>{systemGlobalDropdown.module}</TableCell>

                  <TableCell>{systemGlobalDropdown.type}</TableCell>

                  <TableCell>
                    <InputGroup size="sm">
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

      <CreateGlobalDropdown
        open={openCreateSystemGlobalDropdown}
        setOpen={setOpenCreateSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      <UpdateGlobalDropdown
        selectedItem={selectedSystemGlobalDropdown}
        setSelectedItem={setSelectedSystemGlobalDropdown}
        open={openUpdateSystemGlobalDropdown}
        setOpen={setOpenUpdateSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
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
