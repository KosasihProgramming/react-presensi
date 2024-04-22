import React from "react";
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
import RekapGajiDokter from "./pages/RekapGajiDokter";
import ModalInfo from "./components/ModalInfo";
import NavBootstrap from "./components/NavBootstrap";
import RekapGajiShiftPerawat from "./pages/RekapGajiShiftPerawat";
import RekapGajiPeriodePerawat from "./pages/RekapGajiPeriodePerawat";

function App() {
  return (
    <div className="bg-gray-200 pb-10">
      <Router>
        <Navigation />
        {/* <NavBootstrap /> */}
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
          <Route path="/rekap-gaji-dokter" Component={RekapGajiDokter} />
          <Route
            path="/rekap-shift-perawat-gigi"
            Component={RekapGajiShiftPerawat}
          />
          <Route
            path="/rekap-periode-perawat-gigi"
            Component={RekapGajiPeriodePerawat}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
