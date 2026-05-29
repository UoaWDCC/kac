import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Pencil } from "lucide-react";

export interface ContactResponse {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

const getMessagePreview = (message: string) => {
  const words = message.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 18) return message;

  return `${words.slice(0, 18).join(" ")}...`;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-NZ", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDateTime = (value?: string) => {
  if (!value) return "Not recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return dateTimeFormatter.format(date);
};

export const getResponseColumns = (
  onViewEdit: (response: ContactResponse) => void
): ColumnDef<ContactResponse>[] => [
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-semibold text-slate-950">{row.original.name}</p>
        <a
          className="mt-1 inline-flex max-w-full items-center gap-2 text-sm text-blue-medium transition hover:text-black"
          href={`mailto:${row.original.email}`}
          title={`Email ${row.original.email}`}
        >
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="min-w-0 break-all">{row.original.email}</span>
        </a>
      </div>
    ),
    header: "Sender",
  },
  {
    accessorKey: "message",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="max-h-12 min-w-0 overflow-hidden whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {getMessagePreview(row.original.message)}
        </p>
        {row.original.message.trim().split(/\s+/).filter(Boolean).length > 18 ? (
          <span className="mt-1 inline-flex text-xs font-semibold text-slate-500">
            Longer message
          </span>
        ) : null}
      </div>
    ),
    header: "Message",
  },
  {
    accessorFn: (response) =>
      response.createdAt ? new Date(response.createdAt).getTime() : 0,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDateTime(row.original.createdAt)}</span>
    ),
    header: "Received",
    id: "received",
  },
  {
    cell: ({ row }) => (
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-medium px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
        onClick={() => onViewEdit(row.original)}
        type="button"
      >
        <Pencil aria-hidden="true" className="h-4 w-4" />
        View/Edit
      </button>
    ),
    enableSorting: false,
    header: "Actions",
    id: "actions",
  },
];
