import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Cell, ColumnDef, SortingState } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyDescription?: string;
  emptyTitle: string;
  error?: string | null;
  getRowId?: (row: TData, index: number) => string;
  isLoading?: boolean;
  searchPlaceholder: string;
};

const pageSizeOptions = [10, 20, 50];

export default function DataTable<TData extends object>({
  columns,
  data,
  emptyDescription,
  emptyTitle,
  error,
  getRowId,
  isLoading = false,
  searchPlaceholder,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table exposes callback APIs that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSizeOptions[0],
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      sorting,
    },
  });

  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const getColumnLabel = (cell: Cell<TData, unknown>) => {
    const header = cell.column.columnDef.header;
    return typeof header === "string" ? header : cell.column.id;
  };
  const getColumnWidthClass = (columnId: string) => {
    switch (columnId) {
      case "name":
        return "w-[17%]";
      case "email":
        return "w-[19%]";
      case "studentStudy":
        return "w-[24%]";
      case "faculties":
        return "w-[15%]";
      case "latestMembershipYear":
        return "w-[13%]";
      case "actions":
        return "w-[12%]";
      case "message":
        return "w-[50%]";
      case "received":
        return "w-[16%]";
      default:
        return "";
    }
  };
  const isCenteredColumn = (columnId: string) =>
    columnId === "actions" || columnId === "latestMembershipYear";

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex w-full items-center sm:max-w-md">
          <span className="sr-only">Search records</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500"
          />
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/35"
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            type="text"
            value={globalFilter}
          />
          {globalFilter ? (
            <button
              aria-label="Clear search"
              className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-blue-medium"
              onClick={() => setGlobalFilter("")}
              title="Clear search"
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-white px-3">
            {totalRows} {totalRows === 1 ? "record" : "records"}
          </span>
          <div className="relative">
            <select
              aria-label="Rows per page"
              className="h-10 appearance-none rounded-md border border-slate-300 bg-white pl-3 pr-10 text-sm text-slate-950 outline-none focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40"
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              value={table.getState().pagination.pageSize}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} rows
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-950"
            />
          </div>
        </div>
      </div>

      <div>
        <table className="hidden w-full table-fixed border-collapse text-left text-sm lg:table">
          <thead className="bg-slate-50 text-xs uppercase tracking-normal text-slate-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : "none"
                      }
                      className={`border-b border-slate-200 px-3 py-3 font-semibold ${isCenteredColumn(header.column.id) ? "text-center" : ""} ${getColumnWidthClass(
                        header.column.id
                      )}`}
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className={`inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-md transition hover:text-slate-950 ${isCenteredColumn(header.column.id) ? "w-full justify-center text-center" : "text-left"}`}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          <span className="whitespace-nowrap">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {sorted === "asc" ? (
                            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          ) : (
                            <ChevronsUpDown
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          )}
                        </button>
                      ) : (
                        <span className="whitespace-nowrap">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr className="animate-pulse" key={index}>
                  {Array.from({ length: visibleColumnCount }).map(
                    (_cell, cellIndex) => (
                      <td className="px-4 py-4" key={cellIndex}>
                        <div className="h-4 rounded bg-slate-100" />
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td className="px-4 py-12 text-center" colSpan={visibleColumnCount}>
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-5">
                    <p className="text-base font-semibold text-red-700">
                      Could not load records
                    </p>
                    <p className="text-sm leading-6 text-slate-600">{error}</p>
                  </div>
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((row) => (
                <tr className="align-middle transition hover:bg-yellow-light/45" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={`min-w-0 overflow-hidden px-3 py-4 text-slate-800 ${isCenteredColumn(cell.column.id) ? "text-center" : ""} ${getColumnWidthClass(
                        cell.column.id
                      )}`}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-12 text-center" colSpan={visibleColumnCount}>
                  <div className="mx-auto max-w-sm rounded-lg border border-slate-200 bg-slate-50 px-4 py-6">
                    <p className="text-base font-semibold text-slate-950">
                      {emptyTitle}
                    </p>
                    {emptyDescription ? (
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {emptyDescription}
                      </p>
                    ) : null}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="grid gap-3 p-3 lg:hidden">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
                key={index}
              >
                <div className="mb-4 h-5 w-2/3 rounded bg-slate-100" />
                <div className="space-y-3">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-5 text-center">
              <p className="text-base font-semibold text-red-700">
                Could not load records
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{error}</p>
            </div>
          ) : rows.length ? (
            rows.map((row) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={row.id}
              >
                <dl className="grid gap-4">
                  {row.getVisibleCells().map((cell) => (
                    <div className="min-w-0" key={cell.id}>
                      <dt className="mb-1 text-xs font-semibold uppercase tracking-normal text-slate-500">
                        {getColumnLabel(cell)}
                      </dt>
                      <dd className="min-w-0 break-words text-sm text-slate-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-base font-semibold text-slate-950">
                {emptyTitle}
              </p>
              {emptyDescription ? (
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {emptyDescription}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex h-9 items-center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            title="Previous page"
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Previous
          </button>
          <button
            aria-label="Next page"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            title="Next page"
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
