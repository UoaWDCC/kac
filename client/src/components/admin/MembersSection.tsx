import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Download, ShieldCheck, UsersRound } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { fetchMembers } from "../../api/usersApi";
import { downloadCsv, toCsv } from "../../util/csv";
import DataTable from "./DataTable";
import MemberDetailsModal from "./MemberDetailsModal";
import {
  getCurrentMembershipYear,
  getMemberColumns,
  memberCsvColumns,
  type Member,
} from "./MemberColumns";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

export default function MembersSection() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const loadMembers = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const nextMembers = await fetchMembers();
      setMembers(nextMembers);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => getMemberColumns((member) => setSelectedMember(member)),
    []
  );

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const adminCount = useMemo(
    () => members.filter((member) => member.isAdmin).length,
    [members]
  );

  const stats = useMemo(() => {
    const membershipYear = getCurrentMembershipYear();

    return [
      {
        icon: UsersRound,
        label: "Total members",
        value: members.length,
      },
      {
        icon: BadgeCheck,
        label: `${membershipYear} members`,
        value: members.filter(
          (member) => member.latestMembershipYear === membershipYear
        ).length,
      },
      {
        icon: ShieldCheck,
        label: "Admins",
        value: adminCount,
      },
    ];
  }, [adminCount, members]);

  const handleDownload = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`members-${date}.csv`, toCsv(members, memberCsvColumns));
  };

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm"
              key={stat.label}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-yellow-light text-blue-medium ring-1 ring-yellow-dark/40">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="truncate text-sm font-semibold text-slate-600">
                  {stat.label}
                </p>
              </div>
              <p className="shrink-0 text-2xl font-bold leading-none text-slate-950">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={members}
        emptyDescription="New paid signups will appear here."
        emptyTitle="No members found"
        error={error}
        getRowId={(member) => member._id}
        isLoading={isLoading}
        searchPlaceholder="Search members"
        showUnresolvedButton={
          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:enabled:!bg-blue-medium hover:enabled:text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || Boolean(error) || members.length === 0}
            onClick={handleDownload}
            title="Download all members as CSV"
            type="button"
          >
            <Download aria-hidden="true" className="h-4 w-4 shrink-0" />
            Download CSV
          </button>
        }
      />

      {selectedMember ? (
        <MemberDetailsModal
          adminCount={adminCount}
          isCurrentUser={selectedMember.googleUid === user?.id}
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onDelete={(id) =>
            setMembers((current) =>
              current.filter((member) => member._id !== id)
            )
          }
          onSave={(updatedMember) =>
            setMembers((current) =>
              current.map((member) =>
                member._id === updatedMember._id ? updatedMember : member
              )
            )
          }
        />
      ) : null}
    </section>
  );
}
