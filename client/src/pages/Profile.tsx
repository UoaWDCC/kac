import kacoTitle from "../images/kaco-title.png";
import { ImageBlock } from "../components/image_block/ImageBlock.tsx";

import "../style/common.css";
import "../style/profile.css";

// TODO: replace with dynamic link fetched from admin dashboard once implemented
const PASS2U_LINK =
  "https://www.pass2u.net/p/mZvjfJH6V37n?openExternalBrowser=1";

const Profile = () => {
  return (
    <div className="profile-page">
      <title>Kiwi Asian Club - My Profile</title>

      {/** Background Mascot **/}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-screen flex items-start justify-start overflow-hidden">
        <ImageBlock
          pageKey="mascot-bg"
          alt="Kaco mascot background"
          style={{ width: "90vw" }}
        />
      </div>

      <div className="relative z-10">
        {/** Title **/}
        <section className="section h1 profile-title-section">
          <div className="profile-title-group">
            <img
              className="about-title-kaco"
              src={kacoTitle}
              alt="Kaco mascot"
            />
            <h1 className="title-text font-sans">MY &nbsp;PROFILE</h1>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
