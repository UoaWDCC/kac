import Collapsible from "../components/Collapsible";
import Executives from "../components/Executives.tsx";

import "../style/common.css";
import "../style/about.css";

/**
  About Page Content
*/

const About = () => {
  return (
    <div>
      <title>Kiwi Asian Club - About Us</title>
      {/** Title **/}
      <section className="section h1 bg-yellow-light">
        <h1 className="title-text">MEET &nbsp;THE &nbsp;EXECS</h1>
      </section>

      {/** Executive Cards */}
      <section>
        <Executives />
      </section>
    </div>
  );
};

export default About;
