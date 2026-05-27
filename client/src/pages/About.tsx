import Executives from "../components/Executives.tsx";
import kacoTitle from "../images/kaco-title.png";

import "../style/common.css";
import "../style/about.css";

/**
  About Page Content
*/

const About = () => {
  return (
    <div className="about-page">
      <title>Kiwi Asian Club - About Us</title>
      {/** Title **/}
      <section className="section h1 about-title-section">
        <div className="about-title-group">
          <img className="about-title-kaco" src={kacoTitle} alt="Kaco mascot" />
          <h1 className="title-text font-sans">MEET &nbsp;THE &nbsp;EXECS</h1>
        </div>
      </section>

      {/** Executive Cards */}
      <section>
        <Executives />
      </section>
    </div>
  );
};

export default About;
