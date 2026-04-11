import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/*left side of footer*/}
        <div className="footer-left">
          <h2>Contact Us</h2>

          <div className="social-media-icons">
            <a
            href="https://www.facebook.com/kiwiasianclub"
            target="_blank"
            rel="noopener noreferrer"
            className="icon"
            >
              f
            </a>

            <a
            href="https://www.instagram.com/kiwiasianclub/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="icon"
            >
              i
            </a>

            <a
            href="https://www.tiktok.com/@kiwiasianclub?_r=1&_t=ZS-92szPPEDCNj"
            target="_blank"
            rel="noopener noreferrer"
            className="icon"
            >
              t
            </a>

            <a
            href="https://www.tiktok.com/@kiwiasianclub?_r=1&_t=ZS-92szPPEDCNj" 
            target="_blank"
            rel="noopener noreferrer"
            className="icon"
            >
              g
            </a>
          </div>

          {/*links that lead to other pages of the website*/}
          <Link to="/Faq" className="faq-link">
          Join Us!
          </Link>
        </div>

        {/*right side of the footer*/}
        <div className="footer-right">
          <p>
            Always feel free to ask any questions
            <br /> 
            you may have! 
          </p>

          {/*links that lead to other pages of the website*/}
          <p>
            <Link to="/Faq" className="faq-link">
            You can find FAQ's here.
            </Link>
          </p>
          
          <p>
            <Link to="/Contact" className="contact-link">
            Contact Us!
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
