import React, { useState } from 'react'
import kacoTitle from "../images/kaco-title.png";

import "../style/common.css";
import "../style/profile.css";
import { ImageBlock } from '../components/image_block/ImageBlock';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileDashboard from '../components/profile/ProfileDashboard';

export type ProfileSection = "profile" | "attended";

const Profile = () => {
    const [activeSection, setActiveSection] = useState<ProfileSection>("profile");

    return (
        <div className="profile-page">
            <title>User Profile</title>
            {/** Title **/}
            <section className="section relative w-full overflow-hidden bg-yellow-light pr-0! p-0!">
                <div className="justify-self-end relative">
                    <ImageBlock
                        pageKey="mascot-bg"
                        alt="Profile Background"
                        style={{ width: "90vw" }}
                    />
                </div>
                <div className="absolute top-0">
                    <div className="profile-title-group">
                        <img className="profile-title-kaco" src={kacoTitle} alt="Kaco mascot" />
                        <h1 className="title-text font-sans">MY PROFILE</h1>
                    </div>
                    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:flex-row">
                            <ProfileSidebar
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            />
                            <ProfileDashboard activeSection={activeSection} />
                        </div>
                    </div>
                </div>
            </section>
        </div >
    )
}

export default Profile
