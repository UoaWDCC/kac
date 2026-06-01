import { AnimatePresence, motion } from "motion/react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth.ts";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";

import "../style/common.css";

const tabs = ["Home", "About", "Events", "Sponsors", "Contact", "Faq"];

const Header = () => {
  const location = useLocation();
  const { user, hasAccount, loading } = useAuth(); // removed unused logout

  // User is only considered "signed in" to the club once they have a full account.
  // A Google-authed user mid-signup should still see the Sign In button.
  const isSignedIn = !!user && hasAccount;

  return (
    <div className="header flex items-center p-6 bg-yellow-light w-full">
      <div className="pl-2 flex-1">
        <div className="flex items-center w-fit">
          <ImageBlock
            pageKey="logo"
            alt="KAC Logo"
            style={{ width: "64px", height: "64px" }}
          />
          <div className="flex-col font-sans! uppercase font-bold whitespace-nowrap m-0">
            <p className="text-base! leading-none!">Kiwi</p>
            <p className="text-base! leading-none!">Asian</p>
            <p className="text-base! leading-none!">Club</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-center gap-2 w-fit rounded-full bg-yellow-medium">
        <AnimatePresence>
          {tabs.map((tab) => {
            const route = `/${tab.toLowerCase()}`;
            const actualRoute = route === "/home" ? "/" : route;
            const isSelected = location.pathname === actualRoute;

            return (
              <Link
                key={tab}
                to={actualRoute}
                className="px-8 py-3 rounded-full relative text-decoration-none col-blue-medium w-0.8"
              >
                <span className="relative z-10 uppercase text-xl">{tab}</span>
                {isSelected && (
                  <motion.span
                    layoutId="pill-tab"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-full bg-yellow-dark"
                  />
                )}
              </Link>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex pr-2 justify-end">
        {!loading &&
          (isSignedIn ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src={user.photos?.[0]?.value}
                alt="profile"
                style={{
                  width: "2.6rem",
                  height: "2.6rem",
                  borderRadius: "50%",
                }}
              />
            </div>
          ) : (
            <a
              href="/api/auth/google"
              className="text-decoration-none text-xl text--blue-medium uppercase rounded-full bg-yellow-dark hover:bg-blue-medium hover:text-yellow-light duration-0.3 transition px-8! py-2!"
            >
              Join KAC!
            </a>
          ))}
      </div>
    </div>
  );
};

export default Header;
