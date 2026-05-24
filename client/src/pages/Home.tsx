import "../style/common.css";
import { Link } from "react-router-dom";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";
import ImageSlider from "../components/ImageSlider";

const Home = () => {
  return (
    <div>
      {/** HERO */}
      <section className="section bg-yellow-light flex items-center justify-center">
        <div className="flex items-end justify-center gap-8 2xl:gap-16 pt-8 2xl:pt-16 2xl:pb-24">
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
            <div className="text-2xl ml-[-8vw] w-fit">
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
          className="bg-yellow-dark w-9/10 2xl:w-8/10 justify-self-center rounded-4xl h-auto pt-14 pb-12 px-8"
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
                  borderRadius: "1.6rem",
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
        <div className="justify-self-end absolute inset-0 h-fit">
          {/** cannot click edit for some reason, so hid it */}
          <ImageBlock
            pageKey="mascot-bg"
            role="user"
            alt="Events"
            style={{ width: "90vw" }}
          />
        </div>
        <div className="-translate-y-20">
          <ImageSlider
            pageKeys={["event-2", "event-1", "event-3"]}
            role="admin"
          />
        </div>
      </section>

      {/** SPONSORS */}
      <section className="section bg-yellow-light">
        <div className="justify-self-center">
          <h2 className="-mt-8! pl-4 font-monospace text-[2.6rem] font-medium">
            Our Sponsors:
          </h2>
          {/** ROW ONE */}
          <div className="pl-16 py-8 flex flex-row gap-12">
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-1"
                  role="admin"
                  alt="Sponsor 1"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-2"
                  role="admin"
                  alt="Sponsor 2"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-3"
                  role="admin"
                  alt="Sponsor 3"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-4"
                  role="admin"
                  alt="Sponsor 4"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
          </div>
          {/** ROW TWO */}
          <div className="pl-32 py-8 flex flex-row gap-12">
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-5"
                  role="admin"
                  alt="Sponsor 5"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-6"
                  role="admin"
                  alt="Sponsor 6"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-7"
                  role="admin"
                  alt="Sponsor 7"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
            <div
              className="bg-white w-[15vw] aspect-square justify-self-left rounded-4xl p-8 items-center flex justify-center"
              style={{ boxShadow: "10px 10px var(--color-yellow-medium)" }}
            >
              <div className="w-fit aspect-square">
                <ImageBlock
                  pageKey="sponsor-8"
                  role="admin"
                  alt="Sponsor 8"
                  style={{ borderRadius: "1.6rem" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-2xl py-8 w-fit justify-self-center">
          <a href="/api/auth/google" className="button">
            Discover More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
