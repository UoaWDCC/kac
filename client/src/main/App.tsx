import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "../auth/AuthProvider.tsx";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

import Home from "../pages/Home.tsx";
import Faq from "../pages/Faq.tsx";
import Contact from "../pages/Contact.tsx";
import Sponsors from "../pages/Sponsors.tsx";
import Events from "../pages/Events.tsx";
import EventDetail from "../pages/EventDetail.tsx";
import About from "../pages/About.tsx";
import SignUp from "../pages/Signup.tsx";
import Admin from "../pages/Admin.tsx";
import Toast from "../components/Toast.tsx";

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
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<Faq />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const Layout = () => {
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
