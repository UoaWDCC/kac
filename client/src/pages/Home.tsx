import "../style/common.css";
import placeholder from "../images/placeholder.jpg";
import { Link } from "react-router-dom";
import api from "../util/api";
import { useEffect } from "react";

const Home = () => {
  // Temporary backend test
  useEffect(() => {
    api.getTest().then((response) => {
      console.log(response);
    });
  }, []);

  return (
    <div>
      {/** TITLE */}
      <section
        className="section yellow-bg"
        style={{ width: "100%", letterSpacing: "5px", textAlign: "center" }}
      >
        <h1>KIWI ASIAN CLUB</h1>
        <img
          src={placeholder}
          alt="Kiwi Asian Club group photo"
          style={{ maxWidth: "1000px", width: "100%", height: "auto" }}
        ></img>
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
          <h2>CHECK OUT OUR EVENTS</h2>
          <p>image gallery here</p>
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
