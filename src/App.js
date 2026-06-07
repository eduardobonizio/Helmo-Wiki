import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { Suspense, lazy } from "react";
import NavBar from "./elements/nav/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";

const IS_DEV = process.env.NODE_ENV === "development";

const Monsters = lazy(() => import("./routes/monsters/monsters"));
const Items = lazy(() => import("./routes/items/items"));
const Bosses = lazy(() => import("./routes/bosses/bosses"));
const Updates = IS_DEV ? lazy(() => import("./routes/updates/updates")) : null;

function PageFallback() {
  return (
    <div className="container py-5 text-center" aria-busy="true" aria-live="polite">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Carregando…</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="body">
          <NavBar />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Monsters />} />
              <Route path="/monsters" element={<Monsters />} />
              <Route path="/bosses" element={<Bosses />} />
              <Route path="/items" element={<Items />} />
              {IS_DEV && Updates && <Route path="/updates" element={<Updates />} />}
            </Routes>
          </Suspense>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
