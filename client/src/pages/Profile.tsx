import kacoTitle from "../images/kaco-title.png";
import { ImageBlock } from "../components/image_block/ImageBlock.tsx";

import "../style/common.css";
import "../style/profile.css";

// TODO: replace with dynamic link fetched from admin dashboard once implemented
const PASS2U_LINK =
  "https://www.pass2u.net/p/mZvjfJH6V37n?openExternalBrowser=1";

const Profile = () => {
  return (
    <div className="relative min-h-screen bg-yellow-light">
      <title>Kiwi Asian Club - My Profile</title>

      {/** Background Mascot **/}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-screen flex items-start justify-start overflow-visible">
        <div style={{ transform: "translateX(-5vw)" }}>
          <ImageBlock
            pageKey="mascot-bg"
            alt="Kaco mascot background"
            style={{ width: "90vw", overflow: "visible" }}
          />
        </div>
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

        {/** Profile Details **/}
        <section
          className="w-[60rem] max-w-full mx-auto rounded-[26px] bg-white py-10 px-16 text-left flex flex-col gap-3"
          style={{ boxShadow: "10px 10px 0 var(--color-yellow-medium)" }}
        >
          <h2 className="font-sans text-[2.2rem]">My Details</h2>

          <p className="font-alan-sans">
            Add your membership pass to your phone's wallet.
          </p>

          <div className="text-xl w-fit mx-auto text-center">
            <a
              href={PASS2U_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              Add to Wallet
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
