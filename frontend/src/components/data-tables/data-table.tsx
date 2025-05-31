import { type AxiosError } from 'axios';
import { FaArrowRotateRight, FaSpinner } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { type ErrorResponse } from '@/_types/common/error-response';
import { type Info } from '@/_types/common/paginated-records';
import ToolTip from '../tool-tips/tool-tip';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import DataTableHead from './data-table-head';

interface PaginationState<T> {
  data?: {
    records: T[];
    info: Info;
  };
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  limit: string;
  sort: string;
  currentPage: number;
  searchTerm: string;
  setLimit: (limit: string) => void;
  setSort: (sort: string) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  refetch?: () => void;
}

export interface DataTableColumns {
  label: string;
  column?: string;
}

interface DataTableProps<T> {
  pagination?: PaginationState<T>;
  columns: DataTableColumns[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showRefreshButton?: boolean; // Add this new prop
  size?: 'sm' | 'md' | 'lg';
}

const DataTable = <T,>({
  pagination = {
    // Provide default values for the pagination state
    data: { records: [], info: { total: 0, pages: 1 } },
    isLoading: false,
    isFetching: false,
    error: null,
    limit: '10',
    sort: '',
    currentPage: 1,
    searchTerm: '',
    setLimit: () => {},
    setSort: () => {},
    setCurrentPage: () => {},
    setSearchTerm: () => {},
  },
  columns,
  actions,
  children,
  showRefreshButton = true, // Default to true for backward compatibility
  size = 'md',
}: DataTableProps<T>) => {
  const records = pagination.data?.records || [];
  const info = pagination.data?.info;

  const handlePageChange = ({ selected }: { selected: number }) =>
    pagination.setCurrentPage(selected + 1);

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-between gap-2 @xl/main:flex-row">
        <div>{actions}</div>
        <div className="flex flex-col items-center justify-between gap-2 @lg/main:flex-row">
          <Input
            placeholder="Search..."
            className="w-[180px]"
            inputSize="sm"
            defaultValue={pagination.searchTerm}
            onChange={e => {
              pagination.setCurrentPage(1);
              pagination.setSearchTerm(e.target.value);
            }}
          />

          <Select
            value={pagination.limit}
            onValueChange={value => {
              pagination.setLimit(value);
              pagination.setCurrentPage(1);
            }}
          >
            <SelectTrigger
              size="sm"
              className="@lg/main:w-[75px] @lg/main:min-w-[75px]"
            >
              <SelectValue placeholder="Select entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {showRefreshButton ? (
            <ToolTip content="Refresh">
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.refetch}
                disabled={pagination.isFetching}
              >
                {pagination.isFetching ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaArrowRotateRight />
                )}
              </Button>
            </ToolTip>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          className={`border-t ${pagination.isFetching ? 'border-primary' : ''} table-${size}`}
        >
          <TableHeader className="select-none">
            <TableRow>
              {columns.map(({ label, column }) =>
                column ? (
                  <DataTableHead
                    key={label}
                    sort={pagination.sort}
                    setSort={pagination.setSort}
                    setCurrentPage={pagination.setCurrentPage}
                    label={label}
                    column={column}
                  />
                ) : (
                  <TableHead key={label}>{label}</TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="border-b">
            {children}
            {!pagination.isLoading &&
              !pagination.error &&
              records.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center font-medium"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            {pagination.error && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center font-medium"
                >
                  {(pagination.error as AxiosError<ErrorResponse>)?.response
                    ?.data?.message ||
                    pagination.error.message ||
                    'An error occurred'}
                </TableCell>
              </TableRow>
            )}
            {pagination.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center font-medium"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 @2xl/main:flex-row">
        <span className="text-muted-foreground text-sm">
          {`Showing ${
            records.length > 0
              ? (pagination.currentPage - 1) * Number(pagination.limit) + 1
              : 0
          } to ${(pagination.currentPage - 1) * Number(pagination.limit) + records.length} of ${
            info?.total || 0
          } entries`}
        </span>
        <ReactPaginate
          containerClassName="pagination pagination-sm"
          pageCount={info?.pages || 1}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          forcePage={pagination.currentPage - 1}
          previousLabel={<>&laquo;</>}
          nextLabel={<>&raquo;</>}
          breakLabel="..."
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default DataTable;
