import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import { CustomCursor } from "./components/CustomCursor";
import { db } from "./lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function FaviconUpdater() {
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "site_assets"), (snap) => {
      const faviconDoc = snap.docs.find(d => d.data().key === "favicon");
      if (faviconDoc) {
        const url = faviconDoc.data().image_url;
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = url;
      }
    });
    return () => unsub();
  }, []);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <FaviconUpdater />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
