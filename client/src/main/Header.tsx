import { Link } from "react-router-dom";

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
      </div>
    </header>
  );
};

export default Header;
