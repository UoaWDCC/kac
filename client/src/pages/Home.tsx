import "../style/common.css";
import placeholder from "../images/placeholder.png";
import { Link } from "react-router-dom";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";

const Home = () => {
  return (
    <div>
      {/** TITLE */}
      <section
        className="section yellow-bg"
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1>K I W I &nbsp; A S I A N &nbsp; C L U B</h1>
        <ImageBlock imageId="" role="admin" />
        {/* <img
          src={placeholder}
          alt="Kiwi Asian Club group photo"
          style={{
            maxWidth: "1100px",
            width: "100%",
            height: "auto",
          }}
        ></img> */}
      </section>

      {/** EXEC TEAM */}
      <section className="section">
        <div className="narrow-content">
          <h2>MEET THE EXEC TEAM</h2>
          <p>
            As a team we passionately create events that are enjoyable and
            welcoming to everyone
          </p>
          <Link to="/About" className="wide-button">
            SEE MORE {">>"}
          </Link>
        </div>
      </section>

      {/** EVENTS */}
      <section className="section yellow-bg">
        <div className="narrow-content">
          <h2>CHECK OUT OUR UPCOMING EVENTS</h2>
          <img
            src={placeholder}
            alt="Kiwi Asian Club group photo"
            style={{
              maxWidth: "1100px",
              width: "100%",
              height: "auto",
              marginBottom: "1.5em",
            }}
          ></img>
          <Link to="/Events" className="wide-button">
            SEE MORE {">>"}
          </Link>
        </div>
      </section>

      {/** SPONSORS */}
      <section className="section">
        <div className="narrow-content">
          <h2>OUR SPONSORS</h2>
          <Link to="/Sponsors" className="wide-button">
            SEE MORE {">>"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
