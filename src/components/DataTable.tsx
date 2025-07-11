import {
  Dropdown,
  DropdownItem,
  Label,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

// Column definition
export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (info: { row: T }) => ReactNode;
  enableSorting?: boolean;
}

// Action definition
export interface ActionDef<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: FC<React.SVGProps<SVGSVGElement>>;
}

// Props for the DataTable component
interface DataTableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: ActionDef<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
}

type SortDirection = "asc" | "desc" | "none";

export function DataTable<T extends object>({
  columns,
  data,
  actions,
  itemsPerPage = 10,
  searchable = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: SortDirection;
  }>({ key: null, direction: "none" });

  const handleSort = (key: keyof T) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        setSortConfig({ key, direction: "desc" });
      } else {
        setSortConfig({ key: null, direction: "none" });
      }
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let processData = [...data];

    // Filter data
    if (searchTerm && searchable) {
      processData = processData.filter((item) =>
        columns.some((column) => {
          const value = item[column.accessorKey];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        }),
      );
    }

    // Sort data
    if (sortConfig.key && sortConfig.direction !== "none") {
      processData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return processData;
  }, [data, searchTerm, sortConfig, columns, searchable]);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ml-2 inline h-4 w-4 text-gray-400" />;
    }
    if (sortConfig.direction === "asc") {
      return <FaSortUp className="ml-2 inline h-4 w-4" />;
    }
    if (sortConfig.direction === "desc") {
      return <FaSortDown className="ml-2 inline h-4 w-4" />;
    }
    return <FaSort className="ml-2 inline h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="bg-white p-4 shadow-md sm:rounded-lg dark:bg-gray-800">
      {searchable && (
        <div className="mb-4 flex items-center justify-between">
          <div className="w-full md:w-1/2">
            <Label htmlFor="table-search" className="sr-only">
              Search
            </Label>
            <TextInput
              id="table-search"
              placeholder="Search for items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeadCell
                  key={column.accessorKey as string}
                  onClick={() =>
                    column.enableSorting && handleSort(column.accessorKey)
                  }
                  className={column.enableSorting ? "cursor-pointer" : ""}
                >
                  {column.header}
                  {column.enableSorting && renderSortIcon(column.accessorKey)}
                </TableHeadCell>
              ))}
              {actions && actions.length > 0 && (
                <TableHeadCell>
                  <span className="sr-only">Actions</span>
                </TableHeadCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.accessorKey as string}
                    className="font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {column.cell
                      ? column.cell({ row })
                      : (row[column.accessorKey] as ReactNode)}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell>
                    <Dropdown
                      label=""
                      renderTrigger={() => (
                        <button>
                          <HiDotsVertical className="h-5 w-5" />
                        </button>
                      )}
                      arrowIcon={false}
                      inline
                    >
                      {actions.map((action) => (
                        <DropdownItem
                          key={action.label}
                          onClick={() => action.onClick(row)}
                          icon={action.icon}
                        >
                          {action.label}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {paginatedData.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}
            -
            {Math.min(currentPage * itemsPerPage, sortedAndFilteredData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {sortedAndFilteredData.length}
          </span>
        </span>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
