import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./elements/nav/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monsters from "./routes/monsters/monsters";
// import Home from "./routes/home/home";
import PkSystem from "./routes/pk system/PkSystem";
import Items from "./routes/items/items";
import Item from "./routes/items/item";
import Party from "./routes/party/party";
import React from "react";

function App() {
  return (
    <div className="body">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Monsters />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/pk" element={<PkSystem />} />
          <Route path="/items" element={<Items />} />
          <Route path="/item" element={<Item />} />
          <Route path="/party" element={<Party />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
