// import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shift from "./pages/Shift";
import Navigation from "./components/Navigation";
import JadwalKehadiran from "./pages/Jadwal";
import DetailJadwal from "./pages/DetailJadwal";

function App() {
  return (
    <div className="bg-gray-200 pb-10">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/shift" Component={Shift} />
          <Route path="/jadwal-kehadiran" Component={JadwalKehadiran} />
          <Route
            path="/jadwal/detail-jadwal/:idJadwal"
            Component={DetailJadwal}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
