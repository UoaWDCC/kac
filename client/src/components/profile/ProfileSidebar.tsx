import { ChevronRight, Star, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProfileSection } from "../../pages/Profile.tsx";

type ProfileSidebarProps = {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
};

export default function ProfileSidebar({
  activeSection,
  onSectionChange,
}: ProfileSidebarProps) {
  const navItems: { icon: LucideIcon; label: string; value: ProfileSection }[] =
    [
      { icon: UserRound, label: "Personal Information", value: "profile" },
      { icon: Star, label: "Events Attended", value: "attended" },
    ];

  return (
    <aside className="w-full shrink-0 rounded-[1.35rem] bg-white px-8 py-7 shadow-[6px_6px_0_var(--color-yellow-medium)] sm:w-[18.5rem] lg:sticky lg:top-8 lg:self-start">
      <nav className="flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive = activeSection === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSectionChange(item.value)}
              className="group flex w-full items-center gap-3 bg-transparent p-0 text-left text-blue-medium"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-yellow-dark">
                <Icon
                  aria-hidden="true"
                  className={`h-7 w-7 ${item.value === "attended" ? "fill-yellow-dark" : ""}`}
                  strokeWidth={2.4}
                />
              </span>
              <span
                className={`flex min-h-9 items-center rounded-full px-4 text-base font-bold leading-none transition ${
                  isActive
                    ? "bg-yellow-dark"
                    : "bg-transparent group-hover:bg-yellow-medium"
                }`}
              >
                {item.label}
                {item.value === "attended" && (
                  <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
