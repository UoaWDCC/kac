import { useState } from "react";
import kacoTitle from "../images/kaco-title.png";

import "../style/common.css";
import "../style/profile.css";
import { ImageBlock } from "../components/image_block/ImageBlock";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileDashboard from "../components/profile/ProfileDashboard";

export type ProfileSection = "profile" | "attended";

const Profile = () => {
    const [activeSection, setActiveSection] = useState<ProfileSection>("profile");

    return (
        <div className="profile-page">
            <title>User Profile</title>
            <section className="section relative w-full overflow-hidden bg-yellow-light pr-0! p-0!">
                <div className="justify-self-end relative">
                    <ImageBlock
                        pageKey="mascot-bg"
                        alt="Profile Background"
                        style={{ width: "90vw" }}
                    />
                </div>
                <div className="absolute top-0 w-full">
                    <div className="profile-title-group">
                        <img
                            className="profile-title-kaco"
                            src={kacoTitle}
                            alt="Kaco mascot"
                        />
                        <h1 className="title-text font-sans">MY PROFILE</h1>
                    </div>
                    <div className="px-4 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
                        <div className="grid w-full max-w-[60rem] gap-8 lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:items-start lg:gap-14">
                            <ProfileSidebar
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            />
                            <ProfileDashboard activeSection={activeSection} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
