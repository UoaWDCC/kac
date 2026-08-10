import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "../auth/AuthProvider.tsx";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

import { MemberRoute } from "../auth/MemberRoute.tsx";

import Home from "../pages/Home.tsx";
import Faq from "../pages/Faq.tsx";
import Contact from "../pages/Contact.tsx";
import Sponsors from "../pages/Sponsors.tsx";
import Events from "../pages/Events.tsx";
import UpcomingEvent from "../pages/UpcomingEvent.tsx";
import EventDetail from "../pages/EventDetail.tsx";
import PastEventDetail from "../pages/PastEventDetail.tsx";
import About from "../pages/About.tsx";
import SignUp from "../pages/Signup.tsx";
import Admin from "../pages/Admin.tsx";
import Toast from "../components/Toast.tsx";
import Profile from "../pages/Profile.tsx";

const App = () => {
  return (
    <AuthProvider>
      <Toast />
      <BrowserRouter>
        <Routes>
          {/* Sign-up sits outside the main layout — no header/footer chrome */}
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="events/temp" element={<EventDetail />} />
            <Route path="events/:id" element={<UpcomingEvent />} />
            <Route path="events/past/:slug" element={<PastEventDetail />} />
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<Faq />} />
            <Route path="admin" element={<Admin />} />

            <Route
              path="profile"
              element={
                <MemberRoute>
                  <Profile />
                </MemberRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const Layout = () => {
  const { pathname } = useLocation();

  // Reset scroll position on every route change - BrowserRouter doesn't do
  // this automatically the way a full-page navigation would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
