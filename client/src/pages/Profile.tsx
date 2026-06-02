// TODO: replace with dynamic link fetched from admin dashboard once implemented
const PASS2U_LINK =
  "https://www.pass2u.net/p/mZvjfJH6V37n?openExternalBrowser=1";

const Profile = () => {
  return (
    <div>
      <h1>My Membership</h1>
      <a href={PASS2U_LINK} target="_blank" rel="noopener noreferrer">
        Add to Wallet
      </a>
    </div>
  );
};

export default Profile;
