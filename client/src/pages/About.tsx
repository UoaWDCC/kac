import "../style/common.css";
import exec_team from "../images/exec_team.png";

const About = () => {
  return <div>
    {/** TITLE */}
      <section
        className="section yellow-bg"
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 
          style={{
            fontWeight: 700, fontSize: 46,  // styling is rough. just eyeballed it.
          }}>
          A B O U T &nbsp; U S
        </h1>
        <img
          src={ exec_team }  // a screenshot placeholder, no access to official file?
          alt="Kiwi Asian Club Executive Team"
          style={{
            maxWidth: "960px",
            width: "100%",
            height: "auto",
          }}
        ></img>
      </section>
  </div>;
};

export default About;
