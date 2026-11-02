import { useState } from "react";
import type { ReactNode } from "react";
import "../../style/admin.css";
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
  columnWidthClasses?: Record<string, string>;
  initialPageSize?: number;
  toolbar?: ReactNode;
  showUnresolvedButton?: ReactNode;
};

const pageSizeOptions = [3, 10, 20, 50];

export default function DataTable<TData extends object>({
  columnWidthClasses,
  columns,
  data,
  emptyDescription,
  emptyTitle,
  error,
  getRowId,
  isLoading = false,
  initialPageSize = pageSizeOptions[0],
  searchPlaceholder,
  toolbar,
  showUnresolvedButton,
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
        pageSize: initialPageSize,
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
    if (columnWidthClasses?.[columnId]) {
      return columnWidthClasses[columnId];
    }

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
        return "w-[45%]";
      case "status":
        return "w-[9%]";
      case "received":
        return "w-[16%]";
      default:
        return "";
    }
  };
  const isCenteredColumn = (columnId: string) =>
    columnId === "actions" ||
    columnId === "latestMembershipYear" ||
    columnId === "attended";

  return (
    <div className="admin-theme admin-table-shell" aria-busy={isLoading}>
      {toolbar}
      <div className="admin-table-search-bar">
        <label className="admin-search-field">
          <span className="admin-visually-hidden">Search records</span>
          <Search aria-hidden="true" className="admin-search-icon" />
          <input
            className="admin-search-input"
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            type="text"
            value={globalFilter}
          />
          {globalFilter ? (
            <button
              aria-label="Clear search"
              className="admin-clear-search"
              onClick={() => setGlobalFilter("")}
              title="Clear search"
              type="button"
            >
              <X aria-hidden="true" className="admin-small-icon" />
            </button>
          ) : null}
        </label>

        <div className="admin-table-options">
          {showUnresolvedButton}
          <span className="admin-record-count">
            {error
              ? "Records unavailable"
              : isLoading
                ? "Loading records…"
                : `${totalRows} ${totalRows === 1 ? "record" : "records"}`}
          </span>
          <div className="admin-select-field">
            <select
              aria-label="Rows per page"
              className="admin-select"
              onChange={(event) =>
                table.setPageSize(Number(event.target.value))
              }
              value={table.getState().pagination.pageSize}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} rows
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="admin-select-icon" />
          </div>
        </div>
      </div>

      <div>
        <table className="admin-desktop-table">
          <thead className="admin-table-head">
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
                      className={`admin-table-header-cell ${isCenteredColumn(header.column.id) ? "admin-centered-cell" : ""} ${getColumnWidthClass(
                        header.column.id
                      )}`}
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className={`admin-sort-button ${isCenteredColumn(header.column.id) ? "admin-centered-sort" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          <span className="admin-column-label">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {sorted === "asc" ? (
                            <ArrowUp
                              aria-hidden="true"
                              className="admin-sort-icon"
                            />
                          ) : sorted === "desc" ? (
                            <ArrowDown
                              aria-hidden="true"
                              className="admin-sort-icon"
                            />
                          ) : (
                            <ChevronsUpDown
                              aria-hidden="true"
                              className="admin-sort-icon"
                            />
                          )}
                        </button>
                      ) : (
                        <span className="admin-column-label">
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
          <tbody className="admin-table-body">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr className="admin-skeleton-row" key={index}>
                  {Array.from({ length: visibleColumnCount }).map(
                    (_cell, cellIndex) => (
                      <td className="admin-skeleton-cell" key={cellIndex}>
                        <div className="admin-skeleton-line" />
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td className="admin-state-cell" colSpan={visibleColumnCount}>
                  <div className="admin-error-state">
                    <p className="admin-error-title">Could not load records</p>
                    <p className="admin-state-description">{error}</p>
                  </div>
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((row) => (
                <tr className="admin-data-row" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={`admin-table-cell ${isCenteredColumn(cell.column.id) ? "admin-centered-cell" : ""} ${getColumnWidthClass(
                        cell.column.id
                      )}`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="admin-state-cell" colSpan={visibleColumnCount}>
                  <div className="admin-empty-state">
                    <p className="admin-state-title">{emptyTitle}</p>
                    {emptyDescription ? (
                      <p className="admin-state-description">
                        {emptyDescription}
                      </p>
                    ) : null}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="admin-mobile-cards">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="admin-skeleton-card" key={index}>
                <div className="admin-skeleton-heading" />
                <div className="admin-skeleton-lines">
                  <div className="admin-skeleton-line" />
                  <div className="admin-skeleton-line" />
                  <div className="admin-skeleton-line" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="admin-error-state">
              <p className="admin-error-title">Could not load records</p>
              <p className="admin-state-description">{error}</p>
            </div>
          ) : rows.length ? (
            rows.map((row) => (
              <article className="admin-mobile-card" key={row.id}>
                <dl className="admin-mobile-details">
                  {row.getVisibleCells().map((cell) => (
                    <div className="admin-mobile-detail" key={cell.id}>
                      <dt className="admin-mobile-label">
                        {getColumnLabel(cell)}
                      </dt>
                      <dd className="admin-mobile-value">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          ) : (
            <div className="admin-empty-state">
              <p className="admin-state-title">{emptyTitle}</p>
              {emptyDescription ? (
                <p className="admin-state-description">{emptyDescription}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="admin-table-footer">
        <span className="admin-page-label">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="admin-pagination">
          <button
            aria-label="Previous page"
            className="admin-page-button"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            title="Previous page"
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="admin-small-icon" />
            Previous
          </button>
          <button
            aria-label="Next page"
            className="admin-page-button"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            title="Next page"
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" className="admin-small-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
