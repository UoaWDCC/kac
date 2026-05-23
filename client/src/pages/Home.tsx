import "../style/common.css";
import { Link } from "react-router-dom";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";

const Home = () => {
  return (
    <div>
      {/** TITLE */}
      <section
        className="section bg-yellow-light"
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1>K I W I &nbsp; A S I A N &nbsp; C L U B</h1>
        <ImageBlock
          pageKey="hero"
          role="admin"
          alt="Hero Page"
          style={{ maxWidth: "1100px", width: "100%", height: "auto" }}
        />
      </section>

      {/** WHAT WE DO */}
      <section className="section bg-yellow-light h-200 flex flex-col items-center justify-center gap-12">
        <div
          className="bg-yellow-dark w-9/10 2xl:w-8/10 justify-self-center rounded-lg h-auto py-12 px-8"
          style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
        >
          <div className="flex items-start gap-8">
            <div className="w-6/10 shrink-0 self-center">
              <ImageBlock
                pageKey="what-we-do"
                role="admin"
                alt="What We Do"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "0.5em",
                }}
              />
            </div>
            <div className="w-4/10 flex flex-col justify-between h-full self-center">
              <h2 className="mt-0! mb-0! font-monospace text-[2.6rem] font-medium">
                WHAT WE DO:
              </h2>
              <p className="py-1 font-alan-sans">
                The Kiwi Asian Club is a group for everyone on and off campus!
                We have been one of the most active clubs on campus since 2001,
                hosting weekly social, cultural, sporting, and charity events
                throughout the university year.
              </p>
              <p className="py-1 font-alan-sans">
                We aim to build lasting friendships and help you form meaningful
                connections and memories.
              </p>
              <div className="hidden 2xl:block">
                <p className="py-1 font-alan-sans">
                  With over 1000 members, we celebrate the cultural diversity of
                  students in New Zealand, and people of all backgrounds are
                  welcome to join. If you're a new member, don't worry! We hold
                  team-based events for people to meet each other, and our
                  friendly executive team is here to help you along the way.
                </p>
                <p className="py-1 font-alan-sans">
                  Keep yourself informed by visiting our LinkTree to sign up for
                  events and connect with us on social media!
                </p>
              </div>
              <div className="text-xl mt-16">
                <Link
                  to="/about"
                  className="px-8 py-2 rounded-full relative text-decoration-none text-yellow-light bg-blue-medium w-0.8 hover:bg-blue-light duration-300"
                  style={{ boxShadow: "1px 4px var(--color-grey-medium)" }}
                >
                  Learn More {">>"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/** EVENTS */}
      <section className="section bg-yellow-light">
        <div className="narrow-content">
          <h2>CHECK OUT OUR UPCOMING EVENTS</h2>
          <ImageBlock
            pageKey="events"
            role="admin"
            alt="Kiwi Asian Club group photo"
            style={{
              maxWidth: "1100px",
              width: "100%",
              height: "auto",
              marginBottom: "1.5em",
            }}
          />
          <Link to="/events" className="wide-button">
            SEE MORE {">>"}
          </Link>
        </div>
      </section>

      {/** SPONSORS */}
      <section className="section bg-yellow-light">
        <div className="narrow-content">
          <h2>OUR SPONSORS</h2>
          <Link to="/sponsors" className="wide-button">
            SEE MORE {">>"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
