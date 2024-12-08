import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./elements/nav/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monsters from "./routes/monsters/monsters";
// import Home from "./routes/home/home";
import Items from "./routes/items/items";
import React from "react";

function App() {
  return (
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
  );
}

export default App;
