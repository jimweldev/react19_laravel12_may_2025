import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import type { Cat } from '@/_types/cat';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { getDateTimezone } from '@/lib/get-date-timezone';
import CreateCat from './_components/create-cat';
import DeleteCat from './_components/delete-cat';
import UpdateCat from './_components/update-cat';

const DataTablePage = () => {
  const catsPagination = usePagination('/api/cats/paginate', 'id');

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateCat(true);
      }}
    >
      Create
    </Button>
  );

  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [openCreateCat, setOpenCreateCat] = useState<boolean>(false);
  const [openUpdateCat, setOpenUpdateCat] = useState<boolean>(false);
  const [openDeleteCat, setOpenDeleteCat] = useState<boolean>(false);

  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'ID',
      column: 'id',
    },
    {
      label: 'Name',
      column: 'name',
    },
    {
      label: 'Date Created',
      column: 'created_at',
    },
    {
      label: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader className="mb-3">Data Table</PageHeader>

      <Card>
        <CardBody>
          <DataTable
            actions={Actions}
            pagination={catsPagination}
            columns={dataTableColumns}
          >
            {!catsPagination.error && catsPagination.data
              ? catsPagination.data.records?.map((cat: Cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>

                    <TableCell>{cat.name}</TableCell>

                    <TableCell className="font-mono text-xs">
                      {getDateTimezone(cat.created_at || '', 'date_time')}
                    </TableCell>

                    <TableCell>
                      <InputGroup size="sm">
                        <ToolTip content="Edit">
                          <Button
                            variant="info"
                            onClick={() => {
                              setSelectedCat(cat);
                              setOpenUpdateCat(true);
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
                              setSelectedCat(cat);
                              setOpenDeleteCat(true);
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
        </CardBody>
      </Card>

      <CreateCat
        open={openCreateCat}
        setOpen={setOpenCreateCat}
        refetch={catsPagination.refetch}
      />

      <UpdateCat
        selectedItem={selectedCat}
        setSelectedItem={setSelectedCat}
        open={openUpdateCat}
        setOpen={setOpenUpdateCat}
        refetch={catsPagination.refetch}
      />

      <DeleteCat
        selectedItem={selectedCat}
        setSelectedItem={setSelectedCat}
        open={openDeleteCat}
        setOpen={setOpenDeleteCat}
        refetch={catsPagination.refetch}
      />
    </>
  );
};

export default DataTablePage;
