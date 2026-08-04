import type { AdminSection } from "../../pages/Admin.tsx";
import MembersSection from "./MembersSection.tsx";
import ResponsesSection from "./ResponseSection.tsx";
import { Inbox, UserRoundCheck } from "lucide-react";

type AdminDashboardProps = {
  activeSection: AdminSection;
};

export default function AdminDashboard({ activeSection }: AdminDashboardProps) {
  const section =
    activeSection === "members"
      ? {
          description:
            "Search membership records, check payment year, and find student details quickly.",
          icon: UserRoundCheck,
          label: "Members",
          title: "Member Details",
        }
      : {
          description:
            "Review contact form messages and reply to recent enquiries.",
          icon: Inbox,
          label: "Inbox",
          title: "Contact Form Responses",
        };

  const Icon = section.icon;

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5">
      <header className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="flex min-w-0 items-start gap-4">
            <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-medium text-yellow-light shadow-sm">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="!m-0 !text-sm font-semibold uppercase leading-none tracking-normal text-slate-500">
                  Admin Dashboard
                </p>
                <span className="inline-flex rounded-full bg-yellow-light px-3 py-1 text-sm font-semibold leading-none text-blue-medium md:hidden">
                  {section.label}
                </span>
              </div>

              <h1 className="!mb-0 !mt-2 !text-4xl font-bold leading-tight text-slate-950">
                {section.title}
              </h1>

              <p className="!mb-0 !mt-3 max-w-3xl !text-base leading-6 text-slate-600">
                {section.description}
              </p>
            </div>
          </div>

          <span className="hidden rounded-full bg-yellow-light px-3 py-1 text-sm font-semibold leading-none text-blue-medium md:inline-flex">
            {section.label}
          </span>
        </div>
      </header>

      {activeSection === "members" && <MembersSection />}

      {activeSection === "responses" && <ResponsesSection />}
    </main>
  );
}
