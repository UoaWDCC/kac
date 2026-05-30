import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Pencil, Phone, ShieldCheck } from "lucide-react";

export interface Member {
  _id: string;
  googleUid: string;
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

const currentMembershipYear = getCurrentMembershipYear();

export const getMemberColumns = (
  onViewEdit: (member: Member) => void
): ColumnDef<Member>[] => [
  {
    accessorFn: (member) => `${member.firstName} ${member.lastName}`,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex min-w-0 flex-col gap-2">
          {member.isAdmin ? (
            <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-blue-medium px-2 py-0.5 text-xs font-semibold text-white">
                <ShieldCheck aria-hidden="true" className="h-3 w-3" />
                Admin
              </span>
          ) : null}
          <span
            className="min-w-0 truncate font-semibold text-slate-950"
            title={`${member.firstName} ${member.lastName}`}
          >
            {member.firstName} {member.lastName}
          </span>
          {member.pronouns ? (
            <span className="truncate text-xs text-slate-500" title={member.pronouns}>
              {member.pronouns}
            </span>
          ) : null}
        </div>
      );
    },
    header: "Member",
    id: "name",
    size: 190,
  },
  {
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-2">
        <a
          className="inline-flex min-w-0 max-w-full items-center gap-2 text-blue-medium transition hover:text-black"
          href={`mailto:${row.original.email}`}
          title={`Email ${row.original.email}`}
        >
          <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="min-w-0 truncate">{row.original.email}</span>
        </a>
        <a
          className="inline-flex min-w-0 max-w-full items-center gap-2 text-slate-600 transition hover:text-black"
          href={`tel:${row.original.mobileNumber}`}
          title={`Call ${row.original.mobileNumber}`}
        >
          <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="min-w-0 truncate">{row.original.mobileNumber}</span>
        </a>
      </div>
    ),
    header: "Contact",
    size: 220,
  },
  {
    accessorFn: (member) =>
      `${member.studentId} ${member.upi} ${member.university} ${member.yearOfStudy}`,
    cell: ({ row }) => (
      <div className="grid min-w-0 gap-1 text-sm leading-5">
        <div className="flex min-w-0 items-baseline gap-2">
          <span
            className="truncate text-sm font-semibold text-slate-950"
            title={row.original.studentId}
          >
            {row.original.studentId}
          </span>
          <span className="truncate text-xs text-slate-500" title={row.original.upi}>
            {row.original.upi}
          </span>
        </div>
        <span className="truncate text-sm text-slate-800" title={row.original.university}>
          {row.original.university}
        </span>
        <span className="text-xs font-semibold text-slate-500">
          Year {row.original.yearOfStudy}
        </span>
      </div>
    ),
    header: "Student & Study",
    id: "studentStudy",
    size: 230,
  },
  {
    accessorFn: (member) => member.faculties.join(", "),
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {row.original.faculties.slice(0, 2).map((faculty) => (
          <span
            className="max-w-full truncate rounded-full bg-yellow-light px-2 py-1 text-xs font-semibold text-blue-medium"
            key={faculty}
            title={faculty}
          >
            {faculty}
          </span>
        ))}
        {row.original.faculties.length > 2 ? (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            +{row.original.faculties.length - 2}
          </span>
        ) : null}
      </div>
    ),
    header: "Faculties",
    id: "faculties",
    size: 190,
  },
  {
    accessorKey: "latestMembershipYear",
    cell: ({ row }) => {
      const year = row.original.latestMembershipYear;
      const isCurrent = year === currentMembershipYear;

      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
              isCurrent
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {year ?? "No year"}
          </span>
        </div>
      );
    },
    header: "Membership",
    size: 135,
  },
  {
    cell: ({ row }) => (
      <button
        className="admin-action-button"
        onClick={() => onViewEdit(row.original)}
        type="button"
      >
        <Pencil aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>View/Edit</span>
      </button>
    ),
    enableSorting: false,
    header: "Actions",
    id: "actions",
    size: 110,
  },
];
