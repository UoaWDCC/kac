import type { ProfileSection } from "../../pages/Profile.tsx";
import { Inbox, UserRoundCheck } from "lucide-react";

type ProfileDashboardProps = {
    activeSection: ProfileSection;
};

export default function ProfileDashboard({ activeSection }: ProfileDashboardProps) {
    const section =
        activeSection === "profile"
            ? {
                description:
                    "Profile Data",
                label: "Profile",
                title: "My Details",
            }
            : {
                description:
                    "Events user has attended",
                label: "Events Attended",
                title: "Events I Have Attended",
            };

    return (
        <main className="flex min-w-0 flex-1 flex-col gap-5">

            {activeSection === "profile" &&
                <div className="flex flex-col gap-8 rounded-4xl bg-white p-15 shadow-sm">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <div className="profile-grid">
                        <form action="" className="grid grid-cols-2 gap-4">
                            <div className="profile-field">
                                <label>First Name</label>
                                <input
                                    name="firstName"
                                    placeholder={"original name"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Last Name</label>
                                <input
                                    name="lastName"
                                    placeholder={"original name"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Email</label>
                                <input
                                    name="email"
                                    placeholder={"original email"}
                                    value={"potato@example.com"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Phone Number</label>
                                <input
                                    name="phone"
                                    placeholder={"original phone number"}
                                    value={"123-456-7890"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Pronouns</label>
                                <input
                                    name="pronouns"
                                    placeholder={"original pronouns"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>University</label>
                                <input
                                    name="university"
                                    placeholder={"original university"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>UPI</label>
                                <input
                                    name="UPI"
                                    placeholder={"original UPI"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Student Number</label>
                                <input
                                    name="studentNumber"
                                    placeholder={"original student number"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Faculty</label>
                                <input
                                    name="faculty"
                                    placeholder={"original faculty"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Physical KAC Card</label>
                                <input
                                    name="physicalKACCard"
                                    placeholder={"Yes"}
                                    value={"potato"}
                                    onChange={() => { }}
                                />
                            </div>
                        </form>
                        <button className="button">Update Details {'>'}</button>
                    </div>
                </div>
            }

            {activeSection === "attended" && <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-slate-600">{section.description}</p>
            </div>}
        </main>
    );
}
