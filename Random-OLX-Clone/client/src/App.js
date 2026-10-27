import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ScrollProgressBar, BackToTop, ToastProvider } from "./components/common/UIUtils";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import Modallogin from "./components/auth/Modallogin";
import Loading from "./components/common/Loading";
import NotFound from "./components/common/NotFound";
import MaintenancePage from "./components/common/MaintenancePage";

// Features
import PreviewAd from "./features/ads/PreviewAd";
import CatagoryView from "./features/ads/CatagoryView";
import Myads from "./features/ads/Myads";
import Sell from "./features/sell/Sell";
import SellForm from "./features/sell/SellForm";
import AdSuccess from "./features/sell/AdSuccess";
import UserProfileEdit from "./features/profile/UserProfileEdit";
import Profile from "./features/profile/Profile";
import SearchProfile from "./features/profile/SearchProfile";
import SearchResults from "./features/search/SearchResults";
import MyChat from "./features/chat/MyChat";
import AdminDashboard from "./features/admin/AdminDashboard";

const BACKEND_URL = "/api";

// ─── PAGE TRANSITION WRAPPER ─────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

// ─── ANIMATED ROUTES (needs useLocation inside Router) ───────────────────────
function AnimatedRoutes({ auth, staticModal, setStaticModal, toggleShow }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/adsuccess" element={<PageTransition><AdSuccess /></PageTransition>} />
        <Route path="/preview_ad/:id" element={<PageTransition><PreviewAd auth={auth} /></PageTransition>} />
        {auth && <Route path="/attributes/:category/:item" element={<PageTransition><SellForm /></PageTransition>} />}
        {auth && <Route path="/chat/:id/:useremail" element={<PageTransition><MyChat /></PageTransition>} />}
        {auth && <Route path="/chat" element={<PageTransition><MyChat /></PageTransition>} />}
        {auth && <Route path="/editprofile" element={<PageTransition><UserProfileEdit /></PageTransition>} />}
        {auth && <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />}
        {auth && <Route path="/myads" element={<PageTransition><Myads /></PageTransition>} />}
        {auth && <Route path="/sell" element={<PageTransition><Sell /></PageTransition>} />}
        {auth && <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />}
        {!auth && <Route path="/sell" element={<PageTransition><><Modallogin key="m" setStaticModal={setStaticModal} toggleShow={toggleShow} staticModal={staticModal} /><Home /></></PageTransition>} />}
        {!auth && <Route path="/attributes/:category/:item" element={<PageTransition><><Modallogin key="m" setStaticModal={setStaticModal} toggleShow={toggleShow} staticModal={staticModal} /><Home /></></PageTransition>} />}
        <Route path="/:category" element={<PageTransition><CatagoryView /></PageTransition>} />
        <Route path="/results" element={<PageTransition><SearchResults /></PageTransition>} />
        <Route path="/profile/:useremail" element={<PageTransition><SearchProfile /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
function App() {
  const [staticModal, setStaticModal] = useState(true);
  const toggleShow = () => setStaticModal(s => !s);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("online");

  async function checkBackendStatus() {
    try {
      const r = await fetch(`${BACKEND_URL}/check-status`);
      const d = await r.json();
      setBackendStatus(d.status);
    } catch { setBackendStatus("offline"); }
    finally { setLoading(false); }
  }

  async function checkAuthentication() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const r = await fetch(`${BACKEND_URL}/auth-endpoint`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setAuth(d.isAuthenticated === true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    checkBackendStatus();
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <ScrollProgressBar />
        <BackToTop />

        <div className="App">
          <Navbar auth={auth} setAuth={setAuth} />

          {backendStatus === "online" ? (
            <AnimatedRoutes
              auth={auth}
              staticModal={staticModal}
              setStaticModal={setStaticModal}
              toggleShow={toggleShow}
            />
          ) : (
            <MaintenancePage />
          )}

          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;