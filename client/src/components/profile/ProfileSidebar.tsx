import { Inbox, UsersRound } from "lucide-react";
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
    const navItems: { icon: LucideIcon; label: string; value: ProfileSection }[] = [
        { icon: UsersRound, label: "Profile", value: "profile" },
        { icon: Inbox, label: "Events Attended", value: "attended" },
    ];

    return (
        <aside className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:sticky lg:top-4 lg:w-64 lg:self-start">
            <nav className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-1">
                {navItems.map((item) => {
                    const isActive = activeSection === item.value;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onSectionChange(item.value)}
                            className={`group flex h-12 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${isActive
                                ? "bg-yellow-light text-blue-medium shadow-sm ring-1 ring-yellow-dark/40"
                                : "bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-medium"
                                }`}
                        >
                            <span
                                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${isActive
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
