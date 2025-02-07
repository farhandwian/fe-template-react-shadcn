import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChevronLeftIcon from "/src/assets/chevron-left.svg";
import ChevronRightIcon from "/src/assets/chevron-right.svg";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalData?: number;
}

export function DataTablePagination<TData>({
  table,
  totalData,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 md:flex-row md:gap-0">
      <div className=" text-sm text-muted-foreground">
        Menampilkan{" "}
        {table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
          1}
        -
        {table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
          table.getRowModel().rows.length}{" "}
        dari {totalData ? totalData : table.getRowModel().rows.length} data
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Tampil</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium">Entri</p>
      </div>

      <div className="flex flex-col gap-2 space-x-6 md:flex-row md:items-center md:gap-0 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <img src={ChevronLeftIcon} alt="Left" />
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <Button
              key={index}
              variant={
                table.getState().pagination.pageIndex === index
                  ? "default"
                  : "outline"
              }
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          )).slice(
            Math.max(0, table.getState().pagination.pageIndex - 1),
            Math.min(
              table.getPageCount(),
              table.getState().pagination.pageIndex + 4
            )
          )}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <img src={ChevronRightIcon} alt="Right" />
          </Button>
        </div>
      </div>
    </div>
  );
}
