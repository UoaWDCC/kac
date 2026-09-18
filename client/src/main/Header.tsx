import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleUserRound,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { getCurrentProfileImage } from "../api/imageApi.ts";
import { useAuth } from "../auth/useAuth.ts";
import { ImageBlock } from "../components/image_block/ImageBlock.tsx";
import MobileMenu from "./MobileMenu.tsx";

import "../style/common.css";

const tabs = ["Home", "About", "Events", "Sponsors", "Contact", "Faq"];
const profileImageUpdatedEvent = "profile-image-updated";

// "Home" lives at "/" rather than "/home".
const routeForTab = (tab: string) => {
  const route = `/${tab.toLowerCase()}`;
  return route === "/home" ? "/" : route;
};

const Header = () => {
  const location = useLocation();
  const { user, hasAccount, loading, logout, role } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [failedProfileImageUrls, setFailedProfileImageUrls] = useState<
    Set<string>
  >(() => new Set());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(location.pathname);

  // Navigating away (including via browser back/forward) closes the drawer.
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  // User is only considered "signed in" to the club once they have a full account.
  // A Google-authed user mid-signup should still see the Sign In button.
  const isSignedIn = !!user && hasAccount;
  const isAdmin = role === "admin";
  const fallbackProfileImage =
    user?.photos?.find(
      (photo) => photo.value && !failedProfileImageUrls.has(photo.value)
    )?.value ?? null;
  const storedProfileImage =
    profileImageUrl && !failedProfileImageUrls.has(profileImageUrl)
      ? profileImageUrl
      : null;
  const navbarProfileImage = storedProfileImage ?? fallbackProfileImage;

  const handleProfileImageError = useCallback(() => {
    if (!navbarProfileImage) return;

    setFailedProfileImageUrls((current) => {
      if (current.has(navbarProfileImage)) return current;

      const next = new Set(current);
      next.add(navbarProfileImage);
      return next;
    });
  }, [navbarProfileImage]);

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
    setFailedProfileImageUrls(new Set());
  }, [user?.id]);

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
    <div className="header flex items-center gap-2 px-[1.59rem] py-3 lg:p-6 bg-yellow-light w-full">
      {/** MOBILE ONLY - profile shortcut, balances the hamburger on the right */}
      <div className="flex flex-1 justify-start lg:hidden">
        {!loading &&
          (isSignedIn ? (
            <Link
              aria-label="Profile"
              className="flex items-center text-decoration-none"
              to="/profile"
            >
              {navbarProfileImage ? (
                <img
                  className="header-profile-avatar"
                  src={navbarProfileImage}
                  alt="profile"
                  onError={handleProfileImageError}
                />
              ) : (
                <span className="header-profile-avatar header-profile-avatar-fallback">
                  {user.displayName?.charAt(0).toUpperCase() ?? "K"}
                </span>
              )}
            </Link>
          ) : (
            <a
              aria-label="Sign in"
              className="flex items-center text-blue-medium/35"
              href="/api/auth/google"
            >
              <CircleUserRound aria-hidden="true" size={38} strokeWidth={1.5} />
            </a>
          ))}
      </div>

      {/** LOGO - centred on mobile, left-aligned from lg up */}
      <div
        className="shrink-0 lg:flex-1 lg:pl-2 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <div className="flex items-center w-fit mx-auto lg:mx-0">
          <div className="h-[57px] w-[57px] lg:h-16 lg:w-16">
            <ImageBlock
              pageKey="logo"
              alt="KAC Logo"
              style={{ width: "100%", height: "100%" }}
              editable={false}
            />
          </div>
          <div className="flex-col font-sans! uppercase font-bold whitespace-nowrap m-0">
            <p className="text-base! leading-none!">Kiwi</p>
            <p className="text-base! leading-none!">Asian</p>
            <p className="text-base! leading-none!">Club</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center gap-1 xl:gap-2 w-fit rounded-full bg-yellow-medium">
        <AnimatePresence>
          {tabs.map((tab) => {
            const actualRoute = routeForTab(tab);
            const isSelected = location.pathname === actualRoute;

            return (
              <Link
                key={tab}
                to={actualRoute}
                className="px-4 xl:px-8 py-2 xl:py-3 rounded-full relative text-decoration-none col-blue-medium w-0.8"
              >
                <span className="relative z-10 uppercase text-base xl:text-xl">
                  {tab}
                </span>
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

      <div className="hidden lg:flex flex-1 pr-2 justify-end">
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
                    onError={handleProfileImageError}
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

      {/** MOBILE ONLY - hamburger toggle */}
      <div className="flex flex-1 justify-end lg:hidden">
        <button
          aria-expanded={isMobileMenuOpen}
          aria-label="Open menu"
          className="header-menu-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
          type="button"
        >
          <Menu aria-hidden="true" size={32} strokeWidth={2.5} />
        </button>
      </div>

      <MobileMenu
        currentPath={location.pathname}
        isAdmin={isAdmin}
        isOpen={isMobileMenuOpen}
        isSignedIn={isSignedIn}
        logout={logout}
        onClose={() => setIsMobileMenuOpen(false)}
        routeFor={routeForTab}
        tabs={tabs}
      />
    </div>
  );
};

export default Header;
