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
import CreateCat from './_components/create-cat';
import DeleteCat from './_components/delete-cat';
import UpdateCat from './_components/update-cat';

const DataTablePage = () => {
  // PAGINATION
  // pagination - use pagination hook
  const catsPagination = usePagination('/api/cats/paginate', 'id');

  // pagination - actions
  const Actions = (
    <div className="space-x-2">
      <Button
        size="sm"
        onClick={() => {
          setOpenCreateCat(true);
        }}
      >
        Create
      </Button>
    </div>
  );

  // MODAL
  // modal - states
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [openCreateCat, setOpenCreateCat] = useState<boolean>(false);
  const [openUpdateCat, setOpenUpdateCat] = useState<boolean>(false);
  const [openDeleteCat, setOpenDeleteCat] = useState<boolean>(false);

  // pagination - data table columns
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
      label: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader className="mb-3">Data Table</PageHeader>

      {/* card */}
      <Card>
        <CardBody>
          {/* data table component */}
          <DataTable
            actions={Actions}
            pagination={catsPagination}
            columns={dataTableColumns}
          >
            {/* data table rows */}
            {!catsPagination.error && catsPagination.data
              ? catsPagination.data.records?.map((cat: Cat) => (
                  <TableRow key={cat.id}>
                    {/* id */}
                    <TableCell>{cat.id}</TableCell>

                    {/* label */}
                    <TableCell>{cat.name}</TableCell>

                    {/* actions */}
                    <TableCell>
                      <InputGroup size="sm">
                        {/* edit */}
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
                        {/* delete */}
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

      {/* modal - create */}
      <CreateCat
        open={openCreateCat}
        setOpen={setOpenCreateCat}
        refetch={catsPagination.refetch}
      />
      {/* modal - update */}
      <UpdateCat
        selectedItem={selectedCat}
        setSelectedItem={setSelectedCat}
        open={openUpdateCat}
        setOpen={setOpenUpdateCat}
        refetch={catsPagination.refetch}
      />
      {/* modal - delete */}
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
