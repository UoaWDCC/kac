import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth.ts";

const linkStyle = {
  textDecoration: "none",
  color: "black",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem",
};

const Header = () => {
  const { user, loading, logout } = useAuth();

  return (
    <header className="yellow-bg" style={headerStyle}>
      <Link to="/" style={linkStyle}>
        Kiwi Asian Club
      </Link>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/About" style={linkStyle}>
          About
        </Link>
        <Link to="/Events" style={linkStyle}>
          Events
        </Link>
        <Link to="/Sponsors" style={linkStyle}>
          Sponsors
        </Link>
        <Link to="/Contact" style={linkStyle}>
          Contact
        </Link>
        <Link to="/Faq" style={linkStyle}>
          Faq
        </Link>

        {!loading &&
          (user ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src={user.photos?.[0]?.value}
                alt="profile"
                style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
              />
              <span style={{ whiteSpace: "nowrap" }}>{user.displayName}</span>
              <button
                onClick={logout}
                style={{
                  ...linkStyle,
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a href="/api/auth/google" style={linkStyle}>
              Sign In
            </a>
          ))}
      </div>
    </header>
  );
};

export default Header;
