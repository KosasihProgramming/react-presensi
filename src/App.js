// import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shift from "./pages/Shift";
import Navigation from "./components/Navigation";
import Kehadiran from "./pages/Kehadiran";
import Absen from "./pages/Absen";
import Pulang from "./pages/Pulang";

function App() {
  return (
    <div className="bg-gray-200 pb-10">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/shift" Component={Shift} />
          <Route path="/kehadiran" Component={Kehadiran} />
          <Route path="/presensi" Component={Absen} />
          <Route path="/pulang/:id_kehadiran" Component={Pulang} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
