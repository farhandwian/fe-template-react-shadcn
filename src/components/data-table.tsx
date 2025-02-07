import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "./ui/input";
import { BanIcon, SearchIcon } from "lucide-react";
import { CustomColumnMeta } from "@/types";
import Block from "./block";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: keyof TData;
  onSearch?: (query: string) => void;
  sorting?: ColumnSort;
  onSortingChange?: (sorting: SortingState) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  isLoading?: boolean;
  totalCount?: number;
  extra?: React.ReactNode;
  clientSidePagination?: boolean;
  clientSideSorting?: boolean;
  clientSideFiltering?: boolean;
  onSelectedRowsChange?: (selectedRows: Row<TData>[]) => void;
  placeholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  errorCode?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onSearch,
  sorting: defaultSorting,
  onSortingChange,
  pagination: defaultPagination,
  onPaginationChange,
  isLoading,
  totalCount,
  extra,
  clientSidePagination = false,
  clientSideSorting = false,
  clientSideFiltering = false,
  onSelectedRowsChange,
  placeholder,
  showSearch = true,
  showPagination = true,
  errorCode,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [pagination, setPagination] = useState<PaginationState>(
    defaultPagination ?? {
      pageIndex: 0,
      pageSize: 10,
    }
  );

  useEffect(() => {
    if (defaultSorting) {
      setSorting([defaultSorting]);
    }
  }, [defaultSorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    rowCount: totalCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualFiltering: !clientSideFiltering,
    manualSorting: !clientSideSorting,
    manualPagination: !clientSidePagination,
  });

  useEffect(() => {
    if (columnFilters) {
      onSearch?.(columnFilters[0]?.value as string);
    }

    if (sorting) {
      onSortingChange?.(sorting);
    }

    if (pagination) {
      onPaginationChange?.(pagination);
    }
  }, [
    columnFilters,
    sorting,
    pagination,
    onSearch,
    onSortingChange,
    onPaginationChange,
  ]);

  useEffect(() => {
    if (rowSelection) {
      onSelectedRowsChange?.(
        table.getRowModel().rows.filter((row) => row.getIsSelected())
      );
    }
  }, [rowSelection]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2">{extra}</div>
        {showSearch && (
          <Input
            icon={<SearchIcon className="h-4 w-4 text-primary" />}
            placeholder={placeholder ?? "Cari..."}
            value={
              (table
                // eslint-disable-next-line no-constant-binary-expression
                .getColumn(String(searchKey) ?? "id")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table
                // eslint-disable-next-line no-constant-binary-expression
                .getColumn(String(searchKey) ?? "id")
                ?.setFilterValue(event.target.value);
              table.resetPagination();
            }}
            className="max-w-sm"
            disabled={isLoading || errorCode === 403}
          />
        )}
      </div>
      <div className="rounded-md border-b">
        {errorCode === 403 ? (
          <Block icon={<BanIcon size={28} className="text-red-400"/>}>
            Anda tidak memiliki izin untuk mengakses data ini.
          </Block>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, headerIndex) => {
                    const meta = header.column.columnDef.meta as
                      | CustomColumnMeta
                      | undefined;
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: meta?.width,
                          minWidth: meta?.minWidth,
                          maxWidth: meta?.maxWidth,
                        }}
                        className={cn({
                          "w-16": header.id === "actions",
                          "w-8": header.id === "select",
                          "bg-background": true,
                          "text-left": true,
                          "items-start": true,
                          "place-items-start": true,
                          "justify-start": true,
                          "rounded-tl-lg": headerIndex === 0,
                          "rounded-tr-lg":
                            headerIndex === headerGroup.headers.length - 1,
                        })}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center border-b-0"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`${
                          index % 2 === 0 ? "bg-background/50" : "bg-white"
                        } border-b-0`}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as
                            | CustomColumnMeta
                            | undefined;
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                width: meta?.width,
                                minWidth: meta?.minWidth,
                                maxWidth: meta?.maxWidth,
                              }}
                              className="border-b-0"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center border-b-0"
                      >
                        Data tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {showPagination && (
        <div className="py-4">
          <DataTablePagination table={table} totalData={totalCount} />
        </div>
      )}
    </div>
  );
}
