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
      <title>Kiwi Asian Club</title>
      {/** Title **/}
      <div className="pt-12 flex flex-row pl-24">
        <img
          src="src/images/kaco-title.png"
          alt="Mascot"
          className="absolute w-[16vw]"
        />
        <h1 className="w-full uppercase m-0 text-[7.4vw]! font-bold pl-40 2xl:pl-52 pt-8 2xl:pt-16">
          Meet the Execs
        </h1>
      </div>

      {/** Executive Cards */}
      <section>
        <Executives />
      </section>
    </div>
  );
};

export default About;
