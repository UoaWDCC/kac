import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Pencil, Phone, ShieldCheck } from "lucide-react";

export interface Member {
  _id: string;
  isAdmin: boolean;
  latestMembershipYear: number | null;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  pronouns?: string;
  university: string;
  studentId: string;
  upi: string;
  yearOfStudy: number;
  faculties: string[];
  createdAt?: string;
}

export const getCurrentMembershipYear = () => {
  const now = new Date();
  return now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
};

const dateFormatter = new Intl.DateTimeFormat("en-NZ", {
  dateStyle: "medium",
});

const formatDate = (value?: string) => {
  if (!value) return "Not recorded";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return dateFormatter.format(date);
};

const currentMembershipYear = getCurrentMembershipYear();

export const getMemberColumns = (
  onViewEdit: (member: Member) => void
): ColumnDef<Member>[] => [
  {
    accessorFn: (member) => `${member.firstName} ${member.lastName}`,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-950">
              {member.firstName} {member.lastName}
            </span>
            {member.isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-medium px-2 py-0.5 text-xs font-semibold text-white">
                <ShieldCheck aria-hidden="true" className="h-3 w-3" />
                Admin
              </span>
            ) : null}
          </div>
          {member.pronouns ? (
            <span className="text-xs text-slate-500">{member.pronouns}</span>
          ) : null}
        </div>
      );
    },
    header: "Member",
    id: "name",
  },
  {
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-2">
        <a
          className="inline-flex max-w-full items-center gap-2 text-blue-medium transition hover:text-black"
          href={`mailto:${row.original.email}`}
          title={`Email ${row.original.email}`}
        >
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="min-w-0 break-all">{row.original.email}</span>
        </a>
        <a
          className="inline-flex max-w-full items-center gap-2 text-slate-600 transition hover:text-black"
          href={`tel:${row.original.mobileNumber}`}
          title={`Call ${row.original.mobileNumber}`}
        >
          <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="min-w-0 break-all">{row.original.mobileNumber}</span>
        </a>
      </div>
    ),
    header: "Contact",
  },
  {
    accessorKey: "studentId",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-950">
          {row.original.studentId}
        </p>
        <p className="text-xs text-slate-500">{row.original.upi}</p>
      </div>
    ),
    header: "Student",
  },
  {
    accessorKey: "university",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm text-slate-950">{row.original.university}</p>
        <p className="text-xs text-slate-500">
          Year {row.original.yearOfStudy}
        </p>
      </div>
    ),
    header: "Study",
  },
  {
    accessorFn: (member) => member.faculties.join(", "),
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {row.original.faculties.map((faculty) => (
          <span
            className="rounded-full bg-yellow-light px-2 py-1 text-xs font-semibold text-blue-medium"
            key={faculty}
          >
            {faculty}
          </span>
        ))}
      </div>
    ),
    header: "Faculties",
    id: "faculties",
  },
  {
    accessorKey: "latestMembershipYear",
    cell: ({ row }) => {
      const year = row.original.latestMembershipYear;
      const isCurrent = year === currentMembershipYear;

      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            isCurrent
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {year ?? "No year"}
        </span>
      );
    },
    header: "Membership",
  },
  {
    accessorFn: (member) =>
      member.createdAt ? new Date(member.createdAt).getTime() : 0,
    cell: ({ row }) => formatDate(row.original.createdAt),
    header: "Joined",
    id: "joined",
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
