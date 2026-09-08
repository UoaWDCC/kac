import { Mail, Music } from "lucide-react";
import { ImageBlock } from "../components/image_block/ImageBlock";
import "../style/common.css";
import "../style/footer.css";

/* lucide 1.x dropped its brand icons, so the two brand marks are drawn from
   basic shapes rather than pulled from the icon set. */
const InstagramGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V11H5.5v4H8v6h4v-6h3l.5-4H12V7.5a1 1 0 0 1 1-1h2z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/kiwiasianclub/?hl=en",
    label: "Instagram",
    Icon: InstagramGlyph,
  },
  {
    href: "https://www.facebook.com/kiwiasianclub",
    label: "Facebook",
    Icon: FacebookGlyph,
  },
  {
    href: "https://www.tiktok.com/@kiwiasianclub?_r=1&_t=ZS-92szPPEDCNj",
    label: "TikTok",
    Icon: Music,
  },
  { href: "mailto:kiwiasian@gmail.com", label: "Email", Icon: Mail },
];

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <ImageBlock
        pageKey="footer"
        alt="Club mascot"
        style={{
          position: "absolute",
          width: "300px",
          top: "-150px",
          left: "90%",
          transform: "translateX(-50%) rotate(-15deg)",
          zIndex: 1,
        }}
        editable={true}
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

            <a href="/sponsors">CBD</a>
            <a href="/sponsors">Newmarket</a>
            <a href="/sponsors">Other</a>
          </div>

          <div className="footer-column">
            <a href="/contact">
              <h3>Contact Us</h3>
            </a>

            <a href="/contact">Contact</a>
            <a href="/contact">FAQs</a>
          </div>

          <div className="footer-column footer-column-social">
            <h3>Connect With Us!</h3>

            {SOCIAL_LINKS.map(({ href, label }) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>

          {/** Mobile swaps the text column for a row of icon circles */}
          <div className="footer-social-row">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                aria-label={label}
                className="footer-social-circle"
                href={href}
                key={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo cursor-pointer" onClick={() => window.location.href = '/'}>
            <ImageBlock pageKey="logo" alt="KAC Logo" editable={false} />
            <span>KAC</span>
          </div>
          <p>© 2026 Kiwi Asian Club</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
