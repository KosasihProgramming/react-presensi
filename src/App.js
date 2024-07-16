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
import RekapGajiShiftPerawat from "./pages/RekapGajiShiftPerawat";
import RekapGajiPeriodePerawat from "./pages/RekapGajiPeriodePerawat";
import RekapShiftPerawatUmum from "./pages/RekapShiftPerawatUmum";
import Login from "./pages/Login";
import RekapKehadiranDokter from "./pages/rekapKehadiran/DokterRekap";
import RekapKehadiranDokterGigi from "./pages/rekapKehadiran/RekapDokterGigi";
import RekapKehadiranPerawat from "./pages/rekapKehadiran/RekapPerawat";
import RekapKehadiranPerawatGigi from "./pages/rekapKehadiran/RekapPerawatGigi";
import RekapKehadiranFarmasi from "./pages/rekapKehadiran/RekapFarmasi";
import RekapKehadiranPegawai from "./pages/rekapKehadiran/RekapPegawaiKantor";

function App() {
  const isLoggedIn = sessionStorage.getItem("user");
  return (
    <div className="bg-gray-200 pb-10">
      <Router>
        <Navigation />
        <Routes>
          {isLoggedIn ? (
            <>
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
              <Route
                path="/rekap-kehadiran-dokter"
                Component={RekapKehadiranDokter}
              />
              <Route
                path="/rekap-kehadiran-dokter-gigi"
                Component={RekapKehadiranDokterGigi}
              />
              <Route
                path="/rekap-kehadiran-perawat"
                Component={RekapKehadiranPerawat}
              />
              <Route
                path="/rekap-kehadiran-perawat-gigi"
                Component={RekapKehadiranPerawatGigi}
              />
              <Route
                path="/rekap-kehadiran-farmasi"
                Component={RekapKehadiranFarmasi}
              />

              <Route
                path="/rekap-kehadiran-pegawai-kantor"
                Component={RekapKehadiranPegawai}
              />

              {/* Penggajian */}
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
              <Route
                path="/rekap-shift-perawat-umum"
                Component={RekapShiftPerawatUmum}
              />
              <Route path="/login" Component={Login} />
              <Route path="/kehadiran" Component={Kehadiran} />
              <Route path="/presensi" Component={Absen} />
              <Route path="/pulang/:id_kehadiran" Component={Pulang} />
            </>
          ) : (
            <>
              <Route path="/login" Component={Login} />
              <Route path="/kehadiran" Component={Kehadiran} />
              <Route path="/presensi" Component={Absen} />
              <Route path="/pulang/:id_kehadiran" Component={Pulang} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
