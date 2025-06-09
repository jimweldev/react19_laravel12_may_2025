import { useState } from 'react';
import { FaEye } from 'react-icons/fa6';
import type { MailLog } from '@/_types/mail-log';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { getDateTimezone } from '@/lib/get-date-timezone';
import CreateMailLog from './_components/create-mail-log';
import ViewMailLog from './_components/view-mail-log';

const MailLogsTab = () => {
  const mailLogsPagination = usePagination('/api/mails/logs/paginate', 'id');

  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateMailLog(true);
      }}
    >
      Create
    </Button>
  );

  const [selectedMailLog, setSelectedMailLog] = useState<MailLog | null>(null);
  const [openCreateMailLog, setOpenCreateMailLog] = useState<boolean>(false);
  const [openViewMailLog, setOpenViewMailLog] = useState<boolean>(false);

  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'ID',
      column: 'id',
    },
    {
      label: 'Recipient',
      column: 'recipient_email',
    },
    {
      label: 'Subject',
      column: 'subject',
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
      <DataTable
        actions={Actions}
        pagination={mailLogsPagination}
        columns={dataTableColumns}
      >
        {!mailLogsPagination.error && mailLogsPagination.data
          ? mailLogsPagination.data.records?.map((mailLog: MailLog) => (
              <TableRow key={mailLog.id}>
                <TableCell>{mailLog.id}</TableCell>

                <TableCell>{mailLog.recipient_email}</TableCell>

                <TableCell>{mailLog.subject}</TableCell>

                <TableCell className="font-mono text-xs">
                  {getDateTimezone(mailLog.created_at || '', 'date_time')}
                </TableCell>

                <TableCell>
                  <InputGroup size="sm">
                    <ToolTip content="View Mail">
                      <Button
                        variant="info"
                        size="xs"
                        onClick={() => {
                          setSelectedMailLog(mailLog);
                          setOpenViewMailLog(true);
                        }}
                      >
                        <FaEye />
                      </Button>
                    </ToolTip>
                  </InputGroup>
                </TableCell>
              </TableRow>
            ))
          : null}
      </DataTable>

      <CreateMailLog
        open={openCreateMailLog}
        setOpen={setOpenCreateMailLog}
        refetch={mailLogsPagination.refetch}
      />

      <ViewMailLog
        open={openViewMailLog}
        setOpen={setOpenViewMailLog}
        selectedItem={selectedMailLog}
      />
    </>
  );
};

export default MailLogsTab;
