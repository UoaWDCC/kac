import Collapsible from "../components/Collapsible";
import Executives from "../components/Executives.tsx";

import "../style/common.css";
import "../style/about.css";
import exec_team from "../images/exec_team.png";


/**
  About Page Content
*/

const About = () => {
  return <div>
    <title>Kiwi Asian Club - About Us</title>
    {/** Title + Photo */}
    <section className="section yellow-bg title">
      <h1 className="title-text">
        A B O U T &nbsp; U S
      </h1>
      <img
        src={exec_team}
        alt="Kiwi Asian Club Executive Team"
        className="medium-content"
      />

      <br/><br/>

      {/** What We Do */}
      <div className="medium-content">
        <Collapsible title="WHAT WE DO">
          <p className="header-body">
            The Kiwi Asian Club is a group for everyone on and off campus!
            We have been one of the most active clubs on campus since 2001, hosting weekly social,
            cultural, sporting, and charity events throughout the university year.
          </p>
          <p className="header-body">
            We aim to build lasting friendships and help you form meaningful connections and memories.
            With over 1000 members, we celebrate the cultural diversity of students in New Zealand,
            and people of all backgrounds are welcome to join.
          </p>
          <p className="header-body">
            If you're a new member, don't worry! We hold team-based events for people to meet each other,
            and our friendly executive team is here to help you along the way.
          </p>
          <p className="header-body">
            Keep yourself informed by visiting our LinkTree to sign up for events
            and connect with us on social media!
          </p>
        </Collapsible>
      </div>
    </section>

    {/** Executive Cards */}
    <section>
      <Executives/>
    </section>

  </div>;
};

export default About;
