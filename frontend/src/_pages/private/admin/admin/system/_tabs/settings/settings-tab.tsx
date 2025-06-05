import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import type { SystemSetting } from '@/_types/system-setting';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateSetting from './_components/create-setting';
import DeleteSetting from './_components/delete-setting';
import UpdateSetting from './_components/update-setting';

const SettingsTab = () => {
  const systemSettingsPagination = usePagination(
    '/api/system/settings/paginate',
    'label',
  );

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateSystemSetting(true);
      }}
    >
      Create
    </Button>
  );

  const [selectedSystemSetting, setSelectedSystemSetting] =
    useState<SystemSetting | null>(null);
  const [openCreateSystemSetting, setOpenCreateSystemSetting] =
    useState<boolean>(false);
  const [openUpdateSystemSetting, setOpenUpdateSystemSetting] =
    useState<boolean>(false);
  const [openDeleteSystemSetting, setOpenDeleteSystemSetting] =
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
        pagination={systemSettingsPagination}
        columns={dataTableColumns}
      >
        {!systemSettingsPagination.error && systemSettingsPagination.data
          ? systemSettingsPagination.data.records?.map(
              (systemSetting: SystemSetting) => (
                <TableRow key={systemSetting.id}>
                  <TableCell>{systemSetting.label}</TableCell>

                  <TableCell>{systemSetting.value}</TableCell>

                  <TableCell>{systemSetting.notes}</TableCell>

                  <TableCell>
                    <InputGroup size="sm">
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedSystemSetting(systemSetting);
                            setOpenUpdateSystemSetting(true);
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
                            setSelectedSystemSetting(systemSetting);
                            setOpenDeleteSystemSetting(true);
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

      <CreateSetting
        open={openCreateSystemSetting}
        setOpen={setOpenCreateSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />

      <UpdateSetting
        selectedItem={selectedSystemSetting}
        setSelectedItem={setSelectedSystemSetting}
        open={openUpdateSystemSetting}
        setOpen={setOpenUpdateSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />

      <DeleteSetting
        selectedItem={selectedSystemSetting}
        setSelectedItem={setSelectedSystemSetting}
        open={openDeleteSystemSetting}
        setOpen={setOpenDeleteSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />
    </>
  );
};

export default SettingsTab;
