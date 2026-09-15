import { useState } from "react";

import "../style/common.css";
import { ImageBlock } from "../components/image_block/ImageBlock";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileDashboard from "../components/profile/ProfileDashboard";
import PageTitle from "../components/PageTitle";

export type ProfileSection = "profile" | "attended";

const Profile = () => {
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");

  return (
    <div className="profile-page">
      <title>User Profile</title>
      <section className="section relative min-h-screen w-full overflow-x-clip bg-yellow-light pr-0! p-0!">
        <div className="absolute inset-0 z-0 flex justify-end overflow-hidden">
          <ImageBlock
            pageKey="mascot-bg"
            alt="Profile Background"
            style={{ width: "100vw", height: "auto" }}
            editable={false}
          />
        </div>
        <div className="relative z-10 w-full pb-16">
          {/** Title **/}
          <PageTitle title="MY PROFILE" />
          <div className="mb-40 px-4 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="grid w-full max-w-240 gap-8 lg:grid-cols-[18.5rem_minmax(0,1fr)] lg:items-start lg:gap-14">
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
