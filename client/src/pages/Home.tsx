import "../style/common.css";
import { Link } from "react-router-dom";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";

const Home = () => {
  return (
    <div>
      {/** HERO */}
      <section className="section bg-yellow-light flex items-center justify-center">
        <div className="flex items-end justify-center gap-8 2xl:gap-16">
          <div>
            <h2 className="px-[2.4rem] 2xl:px-16 pb-12 2xl:pb-0 font-monospace text-[2.6rem] 2xl:text-[2.8rem] font-medium">
              Welcome to
            </h2>
            <div>
              <div className="flex uppercase">
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] pl-8 2xl:pl-12 font-bold text-blue-medium">
                  K
                </h1>
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] font-bold text-blue-light">
                  iwi
                </h1>
              </div>
              <div className="flex uppercase">
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] pl-8 2xl:pl-12 font-bold text-blue-medium">
                  A
                </h1>
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] font-bold text-blue-light">
                  sian
                </h1>
              </div>
              <div className="flex uppercase -mb-8 2xl:-mb-16">
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] pl-8 2xl:pl-12 font-bold text-blue-medium">
                  C
                </h1>
                <h1 className="text-[10rem]! 2xl:text-[12rem]! leading-[10%] 2xl:leading-[60%] font-bold text-blue-light">
                  lub
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-end">
            <div className="shrink-0">
              <ImageBlock
                pageKey="home-mascot"
                role="admin"
                alt="Club Mascot"
                style={{
                  width: "40vw",
                }}
              />
            </div>
            <div className="text-xl ml-[-8vw] w-fit">
              <a href="/api/auth/google" className="button">
                Join Us!
              </a>
            </div>
          </div>
        </div>
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
      <section className="section relative h-80vh w-full overflow-hidden bg-yellow-light pr-0!">
        <div className="justify-self-end">
          {/** add absolute inset-0 -z-10 once events carousel exists*/}
          <ImageBlock
            pageKey="mascot-bg"
            role="admin"
            alt="Events"
            style={{ width: "90vw" }}
          />
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
