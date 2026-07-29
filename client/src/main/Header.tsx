import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { getCurrentProfileImage } from "../api/imageApi.ts";
import { useAuth } from "../auth/useAuth.ts";
import { ImageBlock } from "../components/image_block/ImageBlock.tsx";

import "../style/common.css";

const tabs = ["Home", "About", "Events", "Sponsors", "Contact", "Faq"];
const profileImageUpdatedEvent = "profile-image-updated";

const Header = () => {
  const location = useLocation();
  const { user, hasAccount, loading, logout, role } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // User is only considered "signed in" to the club once they have a full account.
  // A Google-authed user mid-signup should still see the Sign In button.
  const isSignedIn = !!user && hasAccount;
  const isAdmin = role === "admin";
  const fallbackProfileImage = user?.photos?.[0]?.value ?? null;
  const navbarProfileImage = profileImageUrl ?? fallbackProfileImage;

  const loadProfileImage = useCallback(async () => {
    if (!isSignedIn) {
      setProfileImageUrl(null);
      return;
    }

    try {
      const image = await getCurrentProfileImage();
      setProfileImageUrl(image.signedUrl ?? null);
    } catch (error) {
      console.error("Failed to load navbar profile image:", error);
      setProfileImageUrl(null);
    }
  }, [isSignedIn]);

  useEffect(() => {
    void loadProfileImage();

    if (!isSignedIn) return;

    const handleProfileImageUpdated = () => {
      void loadProfileImage();
    };

    globalThis.addEventListener(
      profileImageUpdatedEvent,
      handleProfileImageUpdated
    );

    return () => {
      globalThis.removeEventListener(
        profileImageUpdatedEvent,
        handleProfileImageUpdated
      );
    };
  }, [isSignedIn, loadProfileImage]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

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
            <div className="header-profile-menu-shell" ref={profileMenuRef}>
              <button
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                className="button header-profile-trigger"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                type="button"
              >
                {navbarProfileImage ? (
                  <img
                    className="header-profile-avatar"
                    src={navbarProfileImage}
                    alt="profile"
                  />
                ) : (
                  <span className="header-profile-avatar header-profile-avatar-fallback">
                    {user.displayName?.charAt(0).toUpperCase() ?? "K"}
                  </span>
                )}
                <span className="header-profile-menu-icon-shell">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={isProfileMenuOpen ? "chevron" : "hamburger"}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      className="header-profile-menu-icon-frame"
                      exit={{ opacity: 0, rotate: 90, scale: 0.72 }}
                      initial={{ opacity: 0, rotate: -90, scale: 0.72 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                    >
                      {isProfileMenuOpen ? (
                        <ChevronDown
                          aria-hidden="true"
                          className="header-profile-menu-icon"
                        />
                      ) : (
                        <Menu
                          aria-hidden="true"
                          className="header-profile-menu-icon"
                        />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen ? (
                  <motion.div
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="header-profile-menu"
                    exit={{ opacity: 0, scale: 0.98, y: -6 }}
                    initial={{ opacity: 0, scale: 0.98, y: -6 }}
                    role="menu"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Link
                      className="header-profile-menu-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                      to="/profile"
                    >
                      <UserRound aria-hidden="true" className="h-4 w-4" />
                      Profile
                    </Link>

                    {isAdmin ? (
                      <Link
                        className="header-profile-menu-item"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                        to="/admin"
                      >
                        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                        Admin
                      </Link>
                    ) : null}

                    <button
                      className="header-profile-menu-item"
                      onClick={logout}
                      role="menuitem"
                      type="button"
                    >
                      <LogOut aria-hidden="true" className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
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
