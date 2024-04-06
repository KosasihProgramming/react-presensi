// import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shift from "./pages/Shift";
import Navigation from "./components/Navigation";
import JadwalKehadiran from "./pages/Jadwal";
import DetailJadwal from "./pages/DetailJadwal";
import Kehadiran from "./pages/Kehadiran";
import Absen from "./pages/Absen";
import Pulang from "./pages/Pulang";
import RekapGajiPerShift from "./pages/RekapGajiPerShift";

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
          <Route path="/kehadiran" Component={Kehadiran} />
          <Route path="/presensi" Component={Absen} />
          <Route path="/pulang/:id_kehadiran" Component={Pulang} />
          <Route path="/rekap-gaji" Component={RekapGajiPerShift} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
