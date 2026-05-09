import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import NavBar from "./elements/nav/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monsters from "./routes/monsters/monsters";
// import Home from "./routes/home/home";
import Items from "./routes/items/items";
import React from "react";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="body">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Monsters />} />
            <Route path="/monsters" element={<Monsters />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </Router>
      </div>
    </LanguageProvider>
  );
}

export default App;
