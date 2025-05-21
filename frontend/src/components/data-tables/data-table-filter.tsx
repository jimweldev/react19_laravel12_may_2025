import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import InputGroup from '../forms/input-group';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';

type DataTableFilterProps = {
  setQueryFilter: (queryFilter: string) => void;
  columns: Column[];
  open: boolean;
  setOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  title?: string;
};

interface Filter {
  column: string;
  operator: Operator;
  // support both simple strings and ReactSelect option objects
  value: string | number | { value: string; label: string } | null;
}

export interface Column {
  label: string;
  column: string;
  element: (
    value: Filter['value'],
    onChange: (value: Filter['value']) => void,
  ) => React.ReactNode;
}

const OPERATORS = ['=', '!=', '>', '<', '>=', '<='] as const;
type Operator = (typeof OPERATORS)[number];

const opMap: Record<Operator, string> = {
  '=': '', // equals → no suffix
  '>': '[gt]',
  '>=': '[gte]',
  '<': '[lt]',
  '<=': '[lte]',
  '!=': '[neq]',
};

const FilterRow = ({
  filter,
  columns,
  index,
  updateFilter,
  removeFilter,
}: {
  filter: Filter;
  columns: Column[];
  index: number;
  updateFilter: (i: number, key: keyof Filter, val: Filter['value']) => void;
  removeFilter: (i: number) => void;
}) => {
  const col = columns.find(c => c.column === filter.column)!;

  return (
    <InputGroup>
      {/* Column */}
      <Select
        value={filter.column}
        onValueChange={v => updateFilter(index, 'column', v)}
      >
        <SelectTrigger className="max-w-[180px] min-w-[180px]">
          <SelectValue placeholder="Select a column" />
        </SelectTrigger>
        <SelectContent>
          {columns.map(c => (
            <SelectItem key={c.column} value={c.column}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator */}
      <Select
        value={filter.operator}
        onValueChange={v => updateFilter(index, 'operator', v)}
      >
        <SelectTrigger className="max-w-[80px] min-w-[80px]">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map(op => (
            <SelectItem key={op} value={op}>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value - using the element function from the column */}
      {col.element(filter.value, value => updateFilter(index, 'value', value))}

      <Button variant="destructive" onClick={() => removeFilter(index)}>
        <FaTimes />
      </Button>
    </InputGroup>
  );
};

// Move this outside the component
const filtersToQueryString = (filters: Filter[]): string => {
  return filters
    .map(({ column, operator, value }) => {
      // If value is an object (and not null), default to its `value` key
      const rawVal =
        value !== null && typeof value === 'object' && 'value' in value
          ? value.value
          : value;

      // Skip if value is null, undefined, or empty string
      if (rawVal === null || rawVal === undefined || rawVal === '') {
        return null;
      }

      // Encode to be safe with spaces / special chars
      const encodedVal = encodeURIComponent(String(rawVal));

      const suffix = opMap[operator] ?? '';
      return `${column}${suffix}=${encodedVal}`;
    })
    .filter(Boolean) // Remove null entries (skipped empty values)
    .join('&');
};

const DataTableFilter = ({
  setQueryFilter,
  columns,
  open,
  setOpen,
  setCurrentPage,
  title = 'Filter Records',
}: DataTableFilterProps) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  const updateFilter = (i: number, key: keyof Filter, val: Filter['value']) => {
    setFilters(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  };

  const addFilter = () =>
    setFilters(prev => [
      ...prev,
      {
        column: columns.length > 0 ? columns[0].column : 'id',
        operator: '=',
        value: null,
      },
    ]);

  const removeFilter = (i: number) =>
    setFilters(prev => prev.filter((_, idx) => idx !== i));

  const clearFilters = () => {
    setFilters([]);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setQueryFilter(filtersToQueryString(filters));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]">
        <form
          onSubmit={e => {
            e.preventDefault();
            applyFilters();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Fill in the details below to filter records.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <div className="space-y-3">
              {filters.map((filter, idx) => (
                <FilterRow
                  key={idx}
                  filter={filter}
                  columns={columns}
                  index={idx}
                  updateFilter={updateFilter}
                  removeFilter={removeFilter}
                />
              ))}

              {/* no filter */}
              {filters.length === 0 ? (
                <Input
                  className="text-center"
                  placeholder="No filters applied"
                  readOnly
                />
              ) : null}

              <Separator />

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={addFilter}
              >
                <FaPlus />
                Add Filter
              </Button>
            </div>
          </DialogBody>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={clearFilters}>
              Clear
            </Button>
            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DataTableFilter;
