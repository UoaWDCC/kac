import { useCallback, useEffect, useMemo, useState } from "react";
import { MailOpen, MessageSquareText, UsersRound } from "lucide-react";
import { fetchContacts } from "../../api/contactApi";
import DataTable from "./DataTable";
import ResponseDetailsModal from "./ResponseDetailsModal";
import { getResponseColumns, type ContactResponse } from "./ResponseColumns";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

const isWithinLastWeek = (value?: string) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - date.getTime() <= weekInMilliseconds;
};

export default function ResponsesSection() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<ContactResponse[]>([]);
  const [selectedResponse, setSelectedResponse] =
    useState<ContactResponse | null>(null);

  const loadResponses = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const nextResponses = await fetchContacts();
      setResponses(nextResponses);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => getResponseColumns((response) => setSelectedResponse(response)),
    []
  );

  useEffect(() => {
    void loadResponses();
  }, [loadResponses]);

  const stats = useMemo(
    () => [
      {
        icon: MessageSquareText,
        label: "Total responses",
        value: responses.length,
      },
      {
        icon: MailOpen,
        label: "Last 7 days",
        value: responses.filter((response) => isWithinLastWeek(response.createdAt))
          .length,
      },
      {
        icon: UsersRound,
        label: "Unique senders",
        value: new Set(
          responses
            .map((response) => response.email.trim().toLowerCase())
            .filter(Boolean)
        ).size,
      },
    ],
    [responses]
  );

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
        data={responses}
        emptyDescription="Contact form submissions will appear here."
        emptyTitle="No responses found"
        error={error}
        getRowId={(response) => response._id}
        isLoading={isLoading}
        searchPlaceholder="Search responses"
      />

      {selectedResponse ? (
        <ResponseDetailsModal
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onDelete={(id) =>
            setResponses((current) =>
              current.filter((response) => response._id !== id)
            )
          }
          onSave={(updatedResponse) =>
            setResponses((current) =>
              current.map((response) =>
                response._id === updatedResponse._id
                  ? updatedResponse
                  : response
              )
            )
          }
        />
      ) : null}
    </section>
  );
}
