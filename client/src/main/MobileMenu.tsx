import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tabs: string[];
  routeFor: (tab: string) => string;
  currentPath: string;
  isSignedIn: boolean;
  isAdmin: boolean;
  logout: () => void;
};

const MobileMenu = ({
  isOpen,
  onClose,
  tabs,
  routeFor,
  currentPath,
  isSignedIn,
  isAdmin,
  logout,
}: Props) => {
  // Close on Escape, and stop the page behind the drawer from scrolling.
  // Also close once the viewport reaches the desktop breakpoint - the drawer is
  // hidden from lg up, so leaving it "open" would strand the scroll lock.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const desktop = globalThis.matchMedia("(min-width: 64rem)");
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };

    document.body.classList.add("mobile-menu-open");
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleBreakpointChange);

    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleBreakpointChange);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-blue-medium/40 lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />

          <motion.div
            animate={{ x: 0 }}
            aria-label="Site menu"
            className="fixed top-0 right-0 z-50 flex h-dvh w-72 max-w-[80vw] flex-col bg-yellow-dark px-6 py-5 lg:hidden"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            role="dialog"
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg lowercase text-blue-medium/45">
                menu
              </span>
              <button
                aria-label="Close menu"
                className="cursor-pointer border-0 bg-transparent p-1 text-blue-medium"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" size={28} strokeWidth={2.5} />
              </button>
            </div>

            <nav className="mt-6 flex flex-col items-start gap-1">
              {tabs.map((tab) => {
                const route = routeFor(tab);
                const isSelected = currentPath === route;

                return (
                  <Link
                    key={tab}
                    className="relative w-full rounded-full px-4 py-2 text-decoration-none"
                    onClick={onClose}
                    to={route}
                  >
                    <span className="relative z-10 text-lg uppercase text-blue-medium">
                      {tab}
                    </span>
                    {isSelected && (
                      <motion.span
                        className="absolute inset-0 z-0 rounded-full bg-yellow-medium"
                        layoutId="mobile-pill-tab"
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <hr className="mt-6 mb-0 w-full border-0 border-t border-blue-medium/25" />

            {isSignedIn && (
              <div className="mt-4 flex flex-col items-start gap-1">
                <Link
                  className="flex w-full items-center gap-3 rounded-full px-4 py-2 text-decoration-none text-base uppercase text-blue-medium"
                  onClick={onClose}
                  to="/profile"
                >
                  <UserRound aria-hidden="true" size={18} />
                  Profile
                </Link>

                {isAdmin && (
                  <Link
                    className="flex w-full items-center gap-3 rounded-full px-4 py-2 text-decoration-none text-base uppercase text-blue-medium"
                    onClick={onClose}
                    to="/admin"
                  >
                    <ShieldCheck aria-hidden="true" size={18} />
                    Admin
                  </Link>
                )}

                <button
                  className="flex w-full cursor-pointer items-center gap-3 rounded-full border-0 bg-transparent px-4 py-2 text-left font-sans text-base uppercase text-blue-medium"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={18} />
                  Logout
                </button>
              </div>
            )}

            <div className="mt-auto pt-6">
              {!isSignedIn && (
                <a className="button-navy" href="/api/auth/google">
                  Join Us!
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
