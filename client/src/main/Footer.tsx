import "../style/common.css";
import "../style/footer.css";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <img
        src="src/images/kaco-title.png"
        className="footer-image"
        alt="Club mascot"
      />

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <a href="/about">
              <h3>About</h3>
            </a>

            <a href="/about">Our History</a>
            <a href="/about">Our Execs</a>
          </div>

          <div className="footer-column">
            <a href="/events">
              <h3>Events</h3>
            </a>

            <a href="/events">Upcoming Events</a>
            <a href="/events">Past Events</a>
          </div>

          <div className="footer-column">
            <a href="/sponsors">
              <h3>Sponsors</h3>
            </a>

            <a href="/sponsors">CBD Sponsors</a>
            <a href="/sponsors">New Market Sponsors</a>
            <a href="/sponsors">Other Sponsors</a>
          </div>

          <div className="footer-column">
            <a href="/contact">
              <h3>Contact Us</h3>
            </a>

            <a href="/contact">Contact</a>
            <a href="/contact">FAQ's</a>
          </div>

          <div className="footer-column">
            <h3>Connect With Us!</h3>

            <a href="https://www.instagram.com/kiwiasianclub/?hl=en">
              Instagram
            </a>
            <a href="https://www.facebook.com/kiwiasianclub">Facebook</a>
            <a href="https://www.tiktok.com/@kiwiasianclub?_r=1&_t=ZS-92szPPEDCNj">
              Tiktok
            </a>
            <a href="mailto:kiwiasian@gmail.com">Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">
            <img src="src/images/kaco-title.png" alt="Club logo" />
            <span>KAC</span>
          </div>
          <p>© 2026 Kiwi Asian Club</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
