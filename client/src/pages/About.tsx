import Executives from "../components/Executives.tsx";

import "../style/common.css";
import "../style/about.css";
import PageTitle from "../components/PageTitle.tsx";

/**
  About Page Content
*/

const About = () => {
  return (
    <div className="about-page">
      <title>Kiwi Asian Club</title>
      {/** Title **/}
      <PageTitle title="MEET THE EXECS" />

      {/** Executive Cards */}
      <section>
        <Executives />
      </section>
    </div>
  );
};

export default About;
