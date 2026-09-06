import "../style/common.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageBlock } from "../components/image_block/ImageBlock.tsx";
import ImageSlider from "../components/ImageSlider";
import kacoVector from "../images/kaco-vector.png";
import SponsorCard from "../components/SponsorCard";
import { useAuth } from "../auth/useAuth.ts";
import { getSponsors } from "../api/sponsorsApi";
import {
  formatSponsorDeal,
  formatSponsorLocation,
  pickRandomSponsors,
  type Sponsor,
} from "../util/sponsors";

const FEATURED_SPONSOR_COUNT = 8;

// Mobile stacks the tiles into a staggered 2/3/2 diamond rather than a uniform
// grid, so the wider middle row breaks out past the rows above and below it.
const MOBILE_SPONSOR_ROW_SIZES = [2, 3, 2];

const EVENT_PAGE_KEYS = [
  "A Night Out in Hongdae",
  "A Few Days Away",
  "Sunset and Chill",
];

// The hero wordmark scales with the viewport on small screens, then locks to the
// fixed desktop sizes from lg up. Margins are pinned so the tight leading is what
// controls the stack - the global h1 margins would otherwise spread it out.
// Every size here is !-flagged: common.css declares an unlayered `h1 { font-size:
// 3.3rem }`, and unlayered rules beat Tailwind's layered utilities regardless of
// specificity, so an unflagged text-* on an <h1> is silently dropped.
const HERO_LETTER =
  "text-[clamp(3.5rem,32.7vw,9rem)]! lg:text-[10rem]! 2xl:text-[12rem]! " +
  "leading-[0.766]! lg:leading-[10%]! 2xl:leading-[60%]! font-bold " +
  "mt-0! mb-0! lg:mt-4! lg:mb-24!";

const Home = () => {
  const { user, hasAccount, loading } = useAuth();
  const isSignedIn = !!user && hasAccount;
  const [featuredSponsors, setFeaturedSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    let active = true;

    getSponsors()
      .then((data: Sponsor[]) => {
        if (active) {
          setFeaturedSponsors(pickRandomSponsors(data, FEATURED_SPONSOR_COUNT));
        }
      })
      .catch((err) => console.error("Error loading sponsors:", err));

    return () => {
      active = false;
    };
  }, []);

  const sponsorRows = [
    featuredSponsors.slice(0, FEATURED_SPONSOR_COUNT / 2),
    featuredSponsors.slice(FEATURED_SPONSOR_COUNT / 2),
  ];

  const mobileSponsorRows = MOBILE_SPONSOR_ROW_SIZES.map((size, rowIndex) => {
    const start = MOBILE_SPONSOR_ROW_SIZES.slice(0, rowIndex).reduce(
      (total, count) => total + count,
      0
    );
    return featuredSponsors.slice(start, start + size);
  });

  const joinUsButton =
    !loading && !isSignedIn ? (
      <a href="/api/auth/google" className="button">
        Join Us!
      </a>
    ) : null;

  return (
    <div>
      {/** HERO */}
      <section className="section bg-yellow-light flex items-center justify-center max-lg:px-5!">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8 2xl:gap-16 pt-8 2xl:pt-16 2xl:pb-24 max-lg:w-full">
          <div className="w-full lg:w-auto">
            <h2 className="px-0 lg:px-[2.4rem] 2xl:px-16 pb-4 lg:pb-12 2xl:pb-0 font-monospace text-[clamp(1.5rem,7.55vw,2.2rem)] lg:text-[2.6rem]! 2xl:text-[2.8rem]! font-medium">
              Welcome to
            </h2>
            <div>
              <div className="flex uppercase">
                <h1
                  className={`${HERO_LETTER} pl-0 lg:pl-8 2xl:pl-12 text-blue-medium`}
                >
                  K
                </h1>
                <h1 className={`${HERO_LETTER} text-blue-light`}>iwi</h1>
              </div>
              <div className="flex uppercase">
                <h1
                  className={`${HERO_LETTER} pl-0 lg:pl-8 2xl:pl-12 text-blue-medium`}
                >
                  A
                </h1>
                <h1 className={`${HERO_LETTER} text-blue-light`}>sian</h1>
              </div>
              <div className="flex uppercase lg:-mb-8 2xl:-mb-16">
                <h1
                  className={`${HERO_LETTER} pl-0 lg:pl-8 2xl:pl-12 text-blue-medium`}
                >
                  C
                </h1>
                <h1 className={`${HERO_LETTER} text-blue-light`}>lub</h1>
              </div>
            </div>

            {/** Sits under the wordmark on mobile, beside the mascot from lg up */}
            <div className="text-center text-xl mt-8 lg:hidden">
              {joinUsButton}
            </div>
          </div>

          <div className="flex flex-row items-end">
            {/* Full-bleed via negative margins so the margin box still matches the
                content box - w-screen here would widen the flex container and
                drag the wordmark out with it. 2.5rem = the section's px-5 x2. */}
            <div className="shrink-0 -mx-5 w-[calc(100%+2.5rem)] overflow-hidden lg:mx-0 lg:w-[40vw] lg:overflow-visible">
              {/* Figma has the mascot at 545x445 inside a 390-wide frame, i.e.
                  140% of the viewport. The -20% margin re-centres that width and
                  the wrapper clips the overhang, so the wings crop at both edges. */}
              <div className="w-[140%] -ml-[20%] lg:ml-0 lg:w-full">
                <ImageBlock
                  pageKey="home-mascot"
                  alt="Club Mascot"
                  style={{ width: "100%" }}
                  editable={true}
                />
              </div>
            </div>
            <div className="hidden lg:block text-2xl ml-[-8vw] w-fit">
              {joinUsButton}
            </div>
          </div>
        </div>
      </section>

      {/** WHAT WE DO */}
      {/* On mobile the card rides up over the mascot, per the Figma. The section
          background goes transparent so only the card itself clips the mascot -
          an opaque background would cut it off in a straight line above the card.
          The page behind is already the same cream. */}
      <section className="section bg-yellow-light h-auto lg:h-200 flex flex-col items-center justify-center gap-12 py-12 lg:py-0 max-lg:-mt-48 max-lg:px-5! max-lg:pt-0! max-lg:bg-transparent!">
        <div className="card-shadow relative bg-yellow-dark w-full lg:w-9/10 2xl:w-8/10 justify-self-center rounded-[23px] lg:rounded-4xl h-auto pt-8 pb-8 px-6 lg:pt-14 lg:pb-12 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            <div className="w-full lg:w-6/10 shrink-0 self-center">
              <ImageBlock
                pageKey="what-we-do"
                alt="What We Do"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "1.6rem",
                }}
                editable={true}
              />
            </div>
            <div className="w-full lg:w-4/10 flex flex-col justify-between h-full self-center">
              <h2 className="mt-0! mb-0! font-monospace text-[1.8rem] lg:text-[2.6rem] font-medium">
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
              <div className="hidden lg:block text-xl mt-8 lg:mt-16">
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
      <section className="section relative w-full overflow-hidden bg-yellow-light p-0! pt-20! pb-12! lg:pt-0! lg:pb-0!">
        {/**
         * Desktop lays the CMS mascot out in flow and floats the heading and
         * slider on top of it. On mobile that would leave a 90vw-tall gap, so
         * the KACO silhouette sits behind the section as a watermark instead.
         */}
        <img
          src={kacoVector}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 pointer-events-none select-none lg:hidden"
        />

        <div className="hidden lg:block lg:justify-self-end lg:relative">
          <ImageBlock
            pageKey="mascot-bg"
            alt="Events"
            style={{ width: "90vw" }}
            editable={false}
          />
        </div>

        <h2 className="relative uppercase font-monospace text-[1.8rem] lg:text-[2.6rem] font-medium text-center lg:absolute lg:inset-0 lg:justify-self-center lg:top-[20vh] 2xl:top-[22vh]">
          Our Recent Events:
        </h2>

        <div className="relative lg:absolute lg:inset-0 lg:top-[4vh]">
          <ImageSlider pageKeys={EVENT_PAGE_KEYS} />
        </div>

        <div className="relative pt-10 text-center text-xl lg:hidden">
          <Link to="/events" className="button">
            More Events
          </Link>
        </div>
      </section>

      {/** SPONSORS */}
      <section className="section bg-yellow-light">
        <div className="justify-self-center mt-8">
          <h2 className="-mt-8! pl-4 uppercase font-monospace text-[1.8rem] lg:text-[2.6rem] font-medium">
            Our Sponsors:
          </h2>

          {/** Mobile - logo tiles in a staggered 2/3/2 stack, each row centred */}
          <div className="flex flex-col items-center gap-4 py-8 lg:hidden">
            {mobileSponsorRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-4">
                {row.map((sponsor) => (
                  <div key={sponsor.name} className="w-[25vw] max-w-[100px]">
                    <SponsorCard
                      compact
                      name={sponsor.name}
                      description={formatSponsorDeal(sponsor)}
                      location={formatSponsorLocation(sponsor)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/** Desktop - two staggered rows of four */}
          <div className="hidden lg:block">
            {sponsorRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`${rowIndex === 0 ? "pl-16" : "pl-32"} py-8 flex flex-row gap-12`}
              >
                {row.map((sponsor) => (
                  <div key={sponsor.name} className="w-[15vw]">
                    <SponsorCard
                      name={sponsor.name}
                      description={formatSponsorDeal(sponsor)}
                      location={formatSponsorLocation(sponsor)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xl lg:text-2xl py-8 w-fit justify-self-center">
          <a href="/sponsors" className="button">
            Discover More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
