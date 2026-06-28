import type { AdminSection } from "../../pages/Admin.tsx";
import { Inbox, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AdminSidebarProps = {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
};

export default function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const navItems: { icon: LucideIcon; label: string; value: AdminSection }[] = [
    { icon: UsersRound, label: "Members", value: "members" },
    { icon: Inbox, label: "Form Responses", value: "responses" },
  ];

  return (
    <aside className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:sticky lg:top-4 lg:w-64 lg:self-start">
      <div className="border-b border-slate-100 bg-blue-medium px-4 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-normal text-yellow-dark">
          KAC
        </p>
        <h2 className="mt-1 text-xl font-bold leading-none">Admin</h2>
      </div>

      <nav className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSectionChange(item.value)}
              className={`group flex h-12 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-yellow-light text-blue-medium shadow-sm ring-1 ring-yellow-dark/40"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-medium"
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${
                  isActive
                    ? "bg-blue-medium text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-yellow-light group-hover:text-blue-medium"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
