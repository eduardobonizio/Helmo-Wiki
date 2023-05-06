import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./nav/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monsters from "./routes/monsters/monsters";
import Home from "./routes/home/home";
import PkSystem from "./routes/pk system/PkSystem";
import Items from "./routes/items/items";
import Item from "./routes/items/item";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Monsters />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/pk" element={<PkSystem />} />
          <Route path="/items" element={<Items />} />
          <Route path="/item" element={<Item />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
