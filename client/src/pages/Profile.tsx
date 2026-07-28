import kacoTitle from "../images/kaco-title.png";

import "../style/common.css";
import "../style/profile.css";

// TODO: replace with dynamic link fetched from admin dashboard once implemented
const PASS2U_LINK =
  "https://www.pass2u.net/p/mZvjfJH6V37n?openExternalBrowser=1";

const Profile = () => {
  return (
    <div className="profile-page">
      <title>Kiwi Asian Club - My Profile</title>

      {/** Title **/}
      <section className="section h1 profile-title-section">
        <div className="profile-title-group">
          <img className="about-title-kaco" src={kacoTitle} alt="Kaco mascot" />
          <h1 className="title-text font-sans">MY &nbsp;PROFILE</h1>
        </div>
      </section>
    </div>
  );
};

export default Profile;
