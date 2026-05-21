import { AnimatePresence, motion } from "motion/react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth.ts";

import "../style/common.css";

const tabs = ["Home", "About", "Events", "Sponsors", "Contact", "Faq"];

const linkStyle = {
  textDecoration: "none",
  color: "black",
};

const Header = () => {
  const location = useLocation();
  const { user, hasAccount, loading, logout } = useAuth();

  // User is only considered "signed in" to the club once they have a full account.
  // A Google-authed user mid-signup should still see the Sign In button.
  const isSignedIn = !!user && hasAccount;

  return (
    <div className="header flex items-center p-6 bg-yellow-light w-full">
      <div className="pl-2 flex-1">Fancy Logo 😱</div>

      <div className="flex flex-1 justify-center gap-2 w-fit rounded-full bg-yellow-medium">
        {tabs.map((tab) => {
          const route = `/${tab.toLowerCase()}`;
          const actualRoute = route === "/home" ? "/" : route;
          const isSelected = location.pathname === actualRoute;

          return (
            <Link
              key={tab}
              to={actualRoute}
              className="px-8 py-2 rounded-full relative text-decoration-none col-blue-medium w-0.8"
            >
              <span className="relative z-10 uppercase text-sm">{tab}</span>
              <AnimatePresence key={tab}>
                {isSelected && (
                  <motion.span
                    layoutId="pill-tab"
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute inset-0 z-0 rounded-full bg-yellow-dark"
                  ></motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
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
                style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
              />
              <span style={{ whiteSpace: "nowrap" }}>{user.displayName}</span>
              <button
                onClick={logout}
                className="cursor-pointer text-decoration-none col-blue-medium font-inherit"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/api/auth/google"
              className="text-decoration-none col-blue-medium uppercase rounded-full bg-yellow-dark px-8 py-2"
            >
              Join KAC!
            </a>
          ))}
      </div>
    </div>
  );
};

export default Header;
